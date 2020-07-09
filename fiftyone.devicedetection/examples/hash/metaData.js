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
@example hash/metadata.js

@include{doc} example-metadata-hash.txt

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection/examples/hash/metaData.js).

@include{doc} example-require-datafile.txt

Expected output:

[list of properties with descriptions, categories and types]

Does user agent Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114 support svg? :
true

Does user agent Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114 support video? :
true

Does user agent Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114 support supportswebgl? :
true

Does user agent Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114 support webp? :
False

[List of metrics about the match]

 */

const FiftyOneDegreesDeviceDetection = require((process.env.directory || __dirname) + '/../../');

const fs = require('fs');

// Load in a datafile

const datafile = (process.env.directory || __dirname) + '/../../device-detection-cxx/device-detection-data/51Degrees-LiteV4.1.hash';

if (!fs.existsSync(datafile)) {
  console.error("The datafile required by this example is not present. Please ensure that the 'device-detection-data' submodule has been fetched.");
  throw ("No data file at '" + datafile + "'");
}

// Create a new Device Detection pipeline and set the config.
const pipeline = new FiftyOneDegreesDeviceDetection.DeviceDetectionPipelineBuilder({
  performanceProfile: 'MaxPerformance',
  dataFile: datafile,
  autoUpdate: false
}).build();

// Logging of errors and other messages.
// Valid logs types are info, debug, warn, error
pipeline.on('error', console.error);

// Get list of properties for the deviceDetectionEngine
// (including metadata like category, description, type and
// which datafiles they appear in)
const properties = pipeline.getElement('device').getProperties();

for (let property in properties) {
  property = properties[property];
  console.log(`Property ${property.name}, ${property.description}, of type ${property.type}`);
}

// The following function uses "flowData.getWhere()"
// to fetch all of the data related to "supported media"
// on a device by querying the category.
const getAllSupportedMedia = async function (userAgent) {
  // Create a flow data element and process the desktop User-Agent.
  const flowData = pipeline.createFlowData();

  // Add the User-Agent as evidence
  flowData.evidence.add('header.user-agent', userAgent);

  await flowData.process();

  // Get all supported media types (html5 video, svg...)
  // and loop over them to get the support results
  // The second parameter can also be a boolean function
  // that checks the value of that meta type (category in this case)
  const supported = flowData.getWhere('category', 'Supported Media');

  Object.entries(supported).forEach(([key, result]) => {
    console.log(`Does user agent ${userAgent} support ${key}? : `);

    if (result.hasValue) {
      console.log(result.value);
    } else {
      // Echo out why the value isn't meaningful
      console.log(result.noValueMessage);
    }
  });
};

const iPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114';

getAllSupportedMedia(iPhoneUA);

// The device detection engine comes with additional metadata about each match

const getMatchMetaData = async function (userAgent) {
  // Create a flow data element and process the desktop User-Agent.
  const flowData = pipeline.createFlowData();

  // Add the User-Agent as evidence
  flowData.evidence.add('header.user-agent', userAgent);

  await flowData.process();

  // This is all stored under the "device metrics" category

  if (flowData.device.deviceid && flowData.device.deviceid.hasValue) {
    console.log('Device ID: ' + flowData.device.deviceID.value);
  // Consists of four components separated by a hyphen symbol:
  // Hardware-Platform-Browser-IsCrawler where each Component
  // represents an ID of the corresponding Profile.
  }

  if (flowData.device.useragents && flowData.device.useragents.hasValue) {
    console.log('Matched useragents' + flowData.device.useragents.value);
  // The matched useragents
  }

  if (flowData.device.difference && flowData.device.difference.hasValue) {
    console.log('Difference' + flowData.device.difference.value);
  // Used when detection method is not Exact or None.
  // This is an integer value and the larger the value
  // the less confident the detector is in this result.
  }

  if (flowData.device.method && flowData.device.method.hasValue) {
    console.log('Method ' + flowData.device.method.value);
  // Provides information about the algorithm that was used to
  // perform detection for a particular User-Agent.
  }

  if (flowData.device.matchednodes && flowData.device.matchednodes.hasValue) {
    console.log('Matched nodes' + flowData.device.MatchedNodes.value);
  // The number of hash nodes that have been matched before finding a result.
  }
};

getMatchMetaData(iPhoneUA);
