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
@example hash/gettingStarted.js

@include{doc} example-getting-started-hash.txt

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.onpremise/examples/hash/gettingStarted.js).

@include{doc} example-require-datafile.txt

Expected output:

Evidence used:
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36
Is a mobile? false

Evidence used:
user-agent: Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114
Is a mobile? true

Evidence used:
sec-ch-ua-platform: Windows
sec-ch-ua-platform-version: 14.0.0
PlatformName? Windows
PlatformVersion? 11.0

 */

const DeviceDetectionOnPremisePipelineBuilder =
  require((process.env.directory || __dirname) +
  '/../../deviceDetectionOnPremisePipelineBuilder');

// Load in a datafile

const datafile = (process.env.directory || __dirname) + '/../../device-detection-cxx/device-detection-data/51Degrees-LiteV4.1.hash';

// Check if datafiele exists

const fs = require('fs');
if (!fs.existsSync(datafile)) {
  console.error("The datafile required by this example is not present. Please ensure that the 'device-detection-data' submodule has been fetched.");
  throw ("No data file at '" + datafile + "'");
}

// Create the device detection pipeline with the desired settings.

const pipeline = new DeviceDetectionOnPremisePipelineBuilder({
  performanceProfile: 'MaxPerformance',
  dataFile: datafile,
  autoUpdate: false
}).build();

// To monitor the pipeline we can put in listeners for various log events.
// Valid types are info, debug, warn, error
pipeline.on('error', console.error);

const checkIfMobile = async function (evidence) {
  // Create a FlowData element
  // This is used to add evidence and process it through the
  // FlowElements in the Pipeline.
  const flowData = pipeline.createFlowData();

  // Added evidence
  evidence.forEach((value, key, map) => {
    flowData.evidence.add(`header.${key}`, value);
  });

  // Run process on the flowData (this returns a promise)
  await flowData.process();

  // Print out list of evidence used.
  console.log('\nEvidence used:');
  evidence.forEach((value, key, map) => {
    console.log(`${key}: ${value}`);
  });

  // Check that we use more than one evidence.
  if (evidence.size > 1) {
    // Check platform properties
    const platformname = flowData.device.platformname;
    if (platformname.hasValue) {
      console.log(`PlatformName? ${platformname.value}`);
    } else {
      console.log(platformname.noValueMessage);
    }

    // Check platform version properties
    const platformversion = flowData.device.platformversion;
    if (platformversion.hasValue) {
      console.log(`PlatformVersion? ${platformversion.value}`);
    } else {
      console.log(platformversion.noValueMessage);
    }
  } else {
    // Check the ismobile property
    // this returns an AspectPropertyValue wrapper
    // letting you check if a value is set and if not why not
    const ismobile = flowData.device.ismobile;

    if (ismobile.hasValue) {
      console.log(`Is a mobile? ${ismobile.value}`);
    } else {
      // Echo out why the value isn't meaningful
      console.log(ismobile.noValueMessage);
    }
  }
};

const desktopUA = new Map([['user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36']]);
const iPhoneUA = new Map([['user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114']]);
const uach = new Map([['sec-ch-ua-platform', 'Windows'], ['sec-ch-ua-platform-version', '14.0.0']]);

checkIfMobile(desktopUA);
checkIfMobile(iPhoneUA);
checkIfMobile(uach);
