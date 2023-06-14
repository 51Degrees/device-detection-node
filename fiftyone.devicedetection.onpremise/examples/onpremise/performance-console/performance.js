/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2022 51 Degrees Mobile Experts Limited, Davidson House,
 * Forbury Square, Reading, Berkshire, United Kingdom RG1 3EU.
 *
 * This Original Work is licensed under the European Union Public Licence
 * (EUPL) v.1.2 and is subject to its terms as set out below.
 *
 * If a copy of the EUPL was not distributed with this file, You can obtain
 * one at https://opensource.org/licenses/EUPL-1.2.
 *
 * The 'Compatible Licences' set out in the Appendix to the EUPL (as may be
 * amended by the European Commission) shall be deemed incompatible for
 * the purposes of the Work and the provisions of the compatibility
 * clause in Article 5 of the EUPL shall not apply.
 *
 * If using the Work as, or as part of, a network application, by
 * including the attribution notice(s) required under Article 5 of the EUPL
 * in the end user terms of the application under an appropriate heading,
 * such notice(s) shall fulfill the requirements of that article.
 * ********************************************************************* */

/**
@example onpremise/performance-console/performance.js

@include{doc} example-performance-hash.txt

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.onpremise/examples/onpremise/performance-console/performance.js).

@include{doc} example-require-datafile.txt

This example require module 'n-readlines' to operate. Please install the module
before running the example, by using the following command:

```
npm install n-readlines
```

Expected output:

```
Processing [...] User-Agents from [...]/20000 User Agents.csv
Calibrating
Processing
Average [...] detections per second.
Average [...] ms per User-Agent.
ismobile = true : [...]
ismobile = false : [...]
ismobile = unknown : [...]

```

 */

const events = require('events');
const path = require('path');

const LineReader = require('n-readlines');

const DeviceDetectionOnPremisePipelineBuilder =
  require((process.env.directory || __dirname) +
  '/../../../deviceDetectionOnPremisePipelineBuilder');

const ExampleUtils = require(path.join(__dirname, '/../exampleUtils')).ExampleUtils;

// In this example, by default, the 51degrees "Lite" file needs to be in the
// fiftyone.devicedetection.onpremise/device-detection-cxx/device-detection-data,
// or you may specify another file as a command line parameter.
//
// Note that the Lite data file is only used for illustration, and has
// limited accuracy and capabilities.
// Find out about the Enterprise data file on our pricing page:
// https://51degrees.com/pricing
const LITE_V_4_1_HASH = '51Degrees-LiteV4.1.hash';
const UA_CSV = '20000 User Agents.csv';

// Load in a datafile
const sliceLen = process.env.JEST_WORKER_ID === undefined ? 2 : process.argv.length;
const args = process.argv.slice(sliceLen);
// Use the supplied path for the data file or find the lite
// file that is included in the repository.
const datafile = args.length > 0 ? args[0] : ExampleUtils.findFile(LITE_V_4_1_HASH);

// Load in a user-agents file
const uafile = args.length > 1 ? args[1] : ExampleUtils.findFile(UA_CSV);

// Check if files exists
const fs = require('fs');
if (!fs.existsSync(datafile)) {
  console.error('Failed to find a device detection ' +
      'data file. Make sure the device-detection-data ' +
      'submodule has been updated by running ' +
      '`git submodule update --recursive`.');
  throw ("No data file at '" + datafile + "'");
}

if (!fs.existsSync(uafile)) {
  console.error('Failed to find a User-Agents ' +
      'file. Make sure the device-detection-data ' +
      'submodule has been updated by running ' +
      '`git submodule update --recursive`.');
  throw ("No User-Agents file at '" + datafile + "'");
}

const secToNanoSec = 1e9;
const msecToNanoSec = 1e6;

let userAgentsProcessed = 0;
let isMobileTrue = 0;
let isMobileFalse = 0;
let isMobileUnknown = 0;
let userAgentsCount = 0;
let startTime, diffTime, calibrationTime, actualTime;

// Create an event listener for when User-Agents
// have been processed.
// This event listener is used in two stages.
// The first stage is when the calibration has finished
// and the actual processing will be kicked off.
// The second stage is when the actual processing has
// finished and the final report is displayed.
const eventEmitter = new events.EventEmitter();
eventEmitter.on('FinishProcessing', (calibration) => {
  diffTime = process.hrtime(startTime);

  if (calibration) {
    // Record the calibration time
    calibrationTime = diffTime[0] * secToNanoSec + diffTime[1];

    // Run without calibration
    console.log('Processing');
    run(function (userAgent) {
      processUA(userAgent, false);
    });
  } else {
    // Record the actual time
    actualTime = diffTime[0] * secToNanoSec + diffTime[1];

    // Display benchmarks
    console.log(
      'Average ' +
      `${(userAgentsCount / (actualTime - calibrationTime)) * secToNanoSec} ` +
      'detections per second per thread.');
    console.log(
      'Average ' +
      `${((actualTime - calibrationTime) / msecToNanoSec) / userAgentsCount} ` +
      'ms per User-Agent.');
    console.log(`ismobile = true : ${isMobileTrue}`);
    console.log(`ismobile = false : ${isMobileFalse}`);
    console.log(`ismobile = unknown : ${isMobileUnknown}`);

    timeMsec = (actualTime - calibrationTime) / msecToNanoSec;
    timeSec = (actualTime - calibrationTime) / secToNanoSec;
    fs.writeFileSync('performance_test_summary.json', JSON.stringify({
      HigherIsBetter: {
        Detections: userAgentsCount,
        DetectionsPerSecond: userAgentsCount / timeSec
      },
      LowerIsBetter: {
        RuntimeSeconds: timeSec,
        AvgMillisecsPerDetection: timeMsec / userAgentsCount
      }
    }, null, 4));
  }
});

// Create the device detection pipeline with the desired settings.
const pipeline = new DeviceDetectionOnPremisePipelineBuilder({
  performanceProfile: 'MaxPerformance',
  dataFile: datafile,
  restrictedProperties: ['ismobile'],
  autoUpdate: false,
  shareUsage: false,
  usePredictiveGraph: false,
  usePerformanceGraph: true,
  addJavaScriptBuilder: false
}).build();

// To monitor the pipeline we can put in listeners for various log events.
// Valid types are info, debug, warn, error
pipeline.on('error', console.error);

// Print out the progress report
const progressBar = '========================================';
const reportProgress = function (uaProcessed) {
  const bars = Math.round((uaProcessed / userAgentsCount) * progressBar.length);
  process.stdout.write(progressBar.substring(0, bars) +
    (uaProcessed === userAgentsCount ? '\n' : '\r'));
};

// Here we make a function that gets a userAgent as evidence and
// uses the Device Detection Engine to obtain the properties of the
// device and output it to file.
const processUA = async function (userAgent, calibration) {
  if (calibration) {
    isMobileFalse++;
  } else {
    // Create a FlowData element
    // This is used to add evidence and process it through the
    // FlowElements in the Pipeline.
    const flowData = pipeline.createFlowData();

    // Add the User-Agent as evidence
    flowData.evidence.add('header.user-agent', userAgent);

    // Run process on the flowData (this returns a promise)
    await flowData.process();

    // Construct the output line
    const ismobile = flowData.device.ismobile;

    if (ismobile.hasValue) {
      if (ismobile.value) {
        isMobileTrue++;
      } else {
        isMobileFalse++;
      }
    } else {
      isMobileUnknown++;
    }
  }

  // Increment the number of User-Agent processed and
  // signal if the required number has been reached
  reportProgress(++userAgentsProcessed);
  if (userAgentsProcessed === userAgentsCount) {
    eventEmitter.emit('FinishProcessing', calibration);
  }
};

// Loop through the User-Agents in the file
// and execute callback on each User-Agent
const run = function (callback) {
  const liner = new LineReader(uafile);
  let line;

  // Reset User-Agents processed count and start time
  userAgentsProcessed = 0;
  startTime = process.hrtime();
  line = liner.next();
  while (line) {
    callback(line.toString('utf8').replace(/\r?\n|\r/g, ''));
    line = liner.next();
  }
};

// Get the number of User-Agents
run(function () {
  userAgentsCount++;
});
console.log('Processing ' + userAgentsCount + ' User-Agents from ' + uafile);

// Run with calibration
console.log('Calibrating');
run(function (userAgent) {
  processUA(userAgent, true);
});
