/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2023 51 Degrees Mobile Experts Limited, Davidson House,
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
 * @example onpremise/performance-console/performance.js
 *
 * This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.onpremise/examples/onpremise/performance-console/performance.js).
 *
 * This example require module 'n-readlines' to operate. Please install the module
 * before running the example, by using the following command:
 *
 * ```
 * npm install n-readlines
 * ```
 *
 * Expected output:
 *
 * ```
 * Processing [...] User-Agents from [...]/20000 User Agents.csv
 * Processing
 * Average [...] detections per second.
 * Average [...] ms per User-Agent.
 * ismobile = true : [...]
 * ismobile = false : [...]
 * ismobile = unknown : [...]
 *
 * ```
 *
 */

const events = require('events');
const path = require('path');
const require51 = (requestedPackage) => {
  try {
    return require(path.join(__dirname, '/../../../node_modules/', requestedPackage));
  } catch (e) {
    return require(path.join(__dirname, '/../../../../', requestedPackage));
  }
};

const LineReader = require('n-readlines');

const DeviceDetectionOnPremisePipelineBuilder =
  require51('fiftyone.devicedetection.onpremise').DeviceDetectionOnPremisePipelineBuilder;

const ExampleUtils = require(path.join(__dirname, '/../exampleUtils')).ExampleUtils;

// Package for script standard which describes script args
// https://www.npmjs.com/package/argparse
const { ArgumentParser } = require('argparse');

const parser = new ArgumentParser({
  description: 'Argparse example'
});

parser.add_argument('-df', '--datafile', { help: 'Datafile file name' });
parser.add_argument('-e', '--evidence', { help: 'Evidence file name' });
parser.add_argument('-jo', '--jsonoutput', { help: 'JSON output file name' });

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

const args = parser.parse_args();
const datafile = args.datafile !== undefined ? args.datafile : ExampleUtils.findFile(LITE_V_4_1_HASH);
const uafile = args.evidence !== undefined ? args.evidence : ExampleUtils.findFile(UA_CSV);
const jsonoutput = args.jsonoutput;

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

let userAgentsProcessed = 0;
let isMobileTrue = 0;
let isMobileFalse = 0;
let isMobileUnknown = 0;
let userAgentsCount = 0;
let startExecutionTime;

// Define an event listener for the 'FinishProcessing' event.
// This listener is triggered once the processing of User-Agents is completed.
// It calculates and displays benchmark results and, if specified, writes them to a JSON file.
const eventEmitter = new events.EventEmitter();
eventEmitter.on('FinishProcessing', () => {
  const endExecutionTime = process.hrtime(startExecutionTime);

  const executionTimeInSeconds = (endExecutionTime[0] + endExecutionTime[1] / 1e9);
  const executionTimeInMilliseconds = (endExecutionTime[0] * 1e9 + endExecutionTime[1]) / 1e6;

  // Display benchmarks
  console.log(
    'Average ' +
    `${userAgentsCount / executionTimeInSeconds} ` +
    'detections per second per thread.');
  console.log(
    'Average ' +
    `${executionTimeInMilliseconds / userAgentsCount} ` +
    'ms per User-Agent.');
  console.log(`ismobile = true : ${isMobileTrue}`);
  console.log(`ismobile = false : ${isMobileFalse}`);
  console.log(`ismobile = unknown : ${isMobileUnknown}`);

  if (jsonoutput) {
    fs.writeFileSync(jsonoutput, JSON.stringify({
      HigherIsBetter: {
        // Detections: userAgentsCount,
        DetectionsPerSecond: userAgentsCount / executionTimeInSeconds
      },
      LowerIsBetter: {
        // RuntimeSeconds: executionTimeInSeconds,
        AvgMillisecsPerDetection: executionTimeInMilliseconds / userAgentsCount
      }
    }, null, 4));
  }
});
eventEmitter.on('WarmupFinished', () => {
  console.log('Warmup finished');
  console.log('-----------------------------------------');
  console.log('Processing started');
  run(function (userAgent) {
    processUA(userAgent, false);
  });
});

// Create the device detection pipeline with the desired settings.
const pipeline = new DeviceDetectionOnPremisePipelineBuilder({
  performanceProfile: 'MaxPerformance',
  dataFile: datafile,
  restrictedProperties: ['ismobile'],
  autoUpdate: false,
  shareUsage: false,
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
const processUA = async function (userAgent, warmup) {
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

  if (warmup) {
    reportProgress(++userAgentsProcessed);
    if (userAgentsProcessed === userAgentsCount) {
      eventEmitter.emit('WarmupFinished');
    }
  } else {
    // Increment the number of User-Agent processed and
    // signal if the required number has been reached
    reportProgress(++userAgentsProcessed);
    if (userAgentsProcessed === userAgentsCount) {
      eventEmitter.emit('FinishProcessing');
    }
  }
};

// Loop through the User-Agents in the file
// and execute callback on each User-Agent
const run = function (callback) {
  const liner = new LineReader(uafile);
  let line;

  // Reset User-Agents processed count and start time
  userAgentsProcessed = 0;
  isMobileTrue = isMobileFalse = isMobileUnknown = 0;
  startExecutionTime = process.hrtime();
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

// Run warmup for pipeline
console.log('Warmup');
run(function (userAgent) {
  processUA(userAgent, true);
});
