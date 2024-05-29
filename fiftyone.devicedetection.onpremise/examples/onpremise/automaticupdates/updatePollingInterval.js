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
 * @example onpremise/automaticupdates/updatePollingInterval.js
 *
 * This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.onpremise/examples/onpremise/automaticupdates/updatePollingInterval.js).
 *
 */

const path = require('path');
const require51 = (requestedPackage) => {
  try {
    return require(path.join(__dirname, '/../../../node_modules/', requestedPackage));
  } catch (e) {
    return require(path.join(__dirname, '/../../../../', requestedPackage));
  }
};

const DeviceDetectionOnPremisePipelineBuilder =
  require51('fiftyone.devicedetection.onpremise').DeviceDetectionOnPremisePipelineBuilder;

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

// Load in a datafile
const args = process.argv.slice(2);
// Use the supplied path for the data file or find the lite
// file that is included in the repository.
const datafile = args.length > 0 ? args[0] : ExampleUtils.findFile(LITE_V_4_1_HASH);

// Set your license key, if you don't have a license key already you can
// obtain one by subscribing to a 51Degrees bundle: https://51degrees.com/pricing

const myLicenseKey = process.env.LICENSE_KEY || '!!YOUR_LICENSE_KEY!!';

if (myLicenseKey === '!!YOUR_LICENSE_KEY!!') {
  console.log("You need a license key to run this example, if you don't have one already " +
  'you can obtain one by subscribing to a 51Degrees bundle: https://51degrees.com/pricing');
} else {
  // Check if datafile exists

  const fs = require('fs');
  if (!fs.existsSync(datafile)) {
    console.error('Failed to find a device detection ' +
      'data file. Make sure the device-detection-data ' +
      'submodule has been updated by running ' +
      '`git submodule update --recursive`.');
    throw ("No data file at '" + datafile + "'");
  }

  // Create the device detection pipeline with the following options
  // to configure the update polling interval. There is no console output
  // when the update is complete but you can check the modified date
  // of the data file to confirm the update has occurred.
  const pipeline = new DeviceDetectionOnPremisePipelineBuilder({
    // Path to your data file
    dataFile: datafile,
    // For automatic updates to work you will need to provide a license key.
    // A license key can be obtained with a subscription from https://51degrees.com/pricing
    licenceKeys: myLicenseKey,
    // Enable automatic updates.
    autoUpdate: true,
    // Set the frequency in minutes that the pipeline should
    // check for updates to data files. A recommended
    // polling interval in a production environment is
    // around 30 minutes.
    pollingInterval: 1,
    // Set the max ammount of time in seconds that should be
    // added to the polling interval. This is useful in datacenter
    // applications where mulitple instances may be polling for
    // updates at the same time. A recommended ammount in production
    // environments is 600 seconds.
    updateTimeMaximumRandomisation: 10
  }).build();

  // To monitor the pipeline we can put in listeners for various log events.
  // Valid types are info, debug, warn, error
  pipeline.on('error', console.error);

  // Exit auto update process
  setTimeout(() => {
    console.log('Exiting auto update process');
    process.exit(1);
  }, 3000);
}
