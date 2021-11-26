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
@example hash/automaticupdates/updateOnStartUp.js

@include{doc} example-automatic-updates-on-startup-hash.txt

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.onpremise/examples/hash/gettingStarted.js).

@include{doc} example-require-datafile.txt
@include{doc} example-require-licensekey.txt

 */

const DeviceDetectionOnPremisePipelineBuilder =
  require((process.env.directory || __dirname) +
  '/../../../deviceDetectionOnPremisePipelineBuilder');

// Load in a datafile

const datafile = (process.env.directory || __dirname) + '/../../../device-detection-cxx/device-detection-data/51Degrees-LiteV4.1.hash';

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
    console.error("The datafile required by this example is not present. Please ensure that the 'device-detection-data' submodule has been fetched.");
    throw ("No data file at '" + datafile + "'");
  }

  // Create the device detection pipeline with the following options
  // to configure updates on startup. There is no console output
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
    // Enable update on startup, the auto update system
    // will be used to check for an update before the
    // device detection engine is created.
    updateOnStart: true
  }).build();

  // To monitor the pipeline we can put in listeners for various log events.
  // Valid types are info, debug, warn, error
  pipeline.on('error', console.error);
}
