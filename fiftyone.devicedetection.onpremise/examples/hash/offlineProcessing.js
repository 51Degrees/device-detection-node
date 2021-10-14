/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2019 51 Degrees Mobile Experts Limited, 5 Charlotte Close,
 * Caversham, Reading, Berkshire, United Kingdom RG4 7BY.
 *
 * This Original Work is licensed under the European Union Public Licence (EUPL)
 * v.1.2 and is subject to its terms as set out below.
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
@example hash/offlineProcessing.js

@include{doc} example-offline-processing-hash.txt

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.hash/examples/hash/offlineProcessing.js).

@include{doc} example-require-datafile.txt

This example require module 'n-readlines' to operate. Please install the module
before running the example, by using the following command:

```
npm install n-readlines
```

Expected output:

```
Output written to [...]/batch-processing-example-results.csv

```

 */

const events = require('events');

const LineReader = require('n-readlines');

const DeviceDetectionOnPremisePipelineBuilder =
  require((process.env.directory || __dirname) +
  '/../../deviceDetectionOnPremisePipelineBuilder');

// Load in a datafile
const datafile = (process.env.directory || __dirname) +
  '/../../device-detection-cxx/device-detection-data/51Degrees-LiteV4.1.hash';

// Load in a user-agents file
const uafile = (process.env.directory || __dirname) +
  '/../../device-detection-cxx/device-detection-data/20000 User Agents.csv';

// Construct output file path
const outputFile = (process.env.directory || __dirname) +
  '/batch-processing-example-results.csv';

// Check if files exists
const fs = require('fs');
if (!fs.existsSync(datafile)) {
  console.error('The datafile required by this example is not present. ' +
    'Please ensure that the \'device-detection-data\' submodule has been ' +
    'fetched.');
  throw ("No data file at '" + datafile + "'");
}

if (!fs.existsSync(uafile)) {
  console.error('The User-Agents file required by this example is not ' +
    'present. Please ensure that the \'device-detection-data\' submodule ' +
    'has been fetched.');
  throw ("No User-Agents file at '" + datafile + "'");
}

// Maximum number of User-Agents to be processed
const maxUserAgents = 20;

// Create a writeStream for output file
const writeStream = fs.createWriteStream(outputFile);

// Create an event listener for when User-Agents
// have been processed
const eventEmitter = new events.EventEmitter();
eventEmitter.on('FinishProcessing', () => {
  if (typeof deleteOutputFile !== 'undefined') {
    if (fs.existsSync(outputFile)) {
      fs.unlink(outputFile, function (err) {
        if (err) throw err;
        console.log('Delete output file ' + outputFile);
      });
    }
  }
  console.log('Output written to ' + outputFile);
});

let userAgentsProcessed = 0;

// Create the device detection pipeline with the desired settings.
const pipeline = new DeviceDetectionOnPremisePipelineBuilder({
  performanceProfile: 'MaxPerformance',
  dataFile: datafile,
  autoUpdate: false
}).build();

// To monitor the pipeline we can put in listeners for various log events.
// Valid types are info, debug, warn, error
pipeline.on('error', console.error);

// Here we make a function that gets a userAgent as evidence and
// uses the Device Detection Engine to obtain the properties of the
// device and output it to file.
const processUA = async function (userAgent) {
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
  const platformname = flowData.device.platformname;
  const platformversion = flowData.device.platformversion;

  const outputLine = userAgent +
    ', ' + (ismobile.hasValue ? ismobile.value : '') +
    ', ' + (platformname.hasValue ? platformname.value : '') +
    ', ' + (platformversion.hasValue ? platformversion.value : '') +
    '\n';
  writeStream.write(outputLine);

  // Increment the number of User-Agent processed and
  // signal if the required number has been reached
  if (++userAgentsProcessed === maxUserAgents) {
    eventEmitter.emit('FinishProcessing');
  }
};

// Create lines reader for the User-Agents file
const liner = new LineReader(uafile);
let line;
let linesCounter = 0;

// Start reading User-Agents from file
while ((line = liner.next()) && linesCounter++ < maxUserAgents) {
  processUA(line.toString('utf8').replace(/\r?\n|\r/g, ''));
}

// Close the line reader
liner.close();
