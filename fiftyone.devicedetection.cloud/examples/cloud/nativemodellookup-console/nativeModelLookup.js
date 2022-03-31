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
@example cloud/nativemodellookup-console/nativeModelLookup.js

@include{doc} example-native-model-lookup-cloud.txt

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.cloud/examples/cloud/nativemodellookup-console/nativeModelLookup.js).

@include{doc} example-require-resourcekey.txt

@include{doc} example-require-licensekey.txt

Make sure to include the Profiles, HardwareVendor, HardwareModel and HardwareName
properties as they are used by this example.

Example output:

```
This example finds the details of devices from the 'native model name'.
The native model name can be retrieved by code running on the device (For example, a mobile app).
For Android devices, see https://developer.android.com/reference/android/os/Build#MODEL
For iOS devices, see https://gist.github.com/soapyigu/c99e1f45553070726f14c1bb0a54053b#file-machinename-swift
----------------------------------------
Which devices are associated with the native model name 'SC-03L'?
        Samsung Galaxy S10 (SC-03L)
Which devices are associated with the native model name 'iPhone11,8'?
        Apple iPhone XR (iPhone XR)
        Apple iPhone XR (A1984)
        Apple iPhone XR (A2105)
        Apple iPhone XR (A2106)
        Apple iPhone XR (A2107)
        Apple iPhone XR (A2108)
```

*/

// Require the core Pipeline and Cloud Request Engine
const pipelineCore = require('fiftyone.pipeline.core');
const CloudRequestEngine = require('fiftyone.pipeline.cloudrequestengine');
// Note that this example is designed to be run from within the
// device detection code base. If this code has been copied to run
// standalone then you'll need to replace the require below with the
// commented out version below it.
const HardwareProfileCloudEngine = require((process.env.directory || __dirname) +
  '/../../../hardwareProfileCloudEngine');
// let hardwareProfileCloudEngine = require("fiftyone.devicedetection");

const myResourceKey = process.env.RESOURCE_KEY || '!!YOUR_RESOURCE_KEY!!';

// You need a license key and paste it into the code,
// replacing !!YOUR_LICENSE_KEY!!.
const myLicenseKey = '!!YOUR_LICENSE_KEY!!';

if (myResourceKey === '!!YOUR_RESOURCE_KEY!!' ||
  myLicenseKey === '!!YOUR_LICENSE_KEY!!') {
  console.log('You need to create a resource key at ' +
        'https://configure.51degrees.com and paste it into the code, ' +
        'replacing !!YOUR_RESOURCE_KEY!!');
  console.log('You also need a subscription which can be acquired ' +
        'from https://51degrees.com/pricing. Paste the license key into the ' +
        'code, replacing !!YOUR_LICENSE_KEY!!.');
  console.log('Make sure to include the Profiles, HardwareVendor, ' +
    'HardwareModel and HardwareName properties as they are used by this ' +
    'example.');
} else {
  console.log(`This example finds the details of devices from the 'native model name'.
  The native model name can be retrieved by code running on the device (For example, a mobile app).
  For Android devices, see https://developer.android.com/reference/android/os/Build#MODEL
  For iOS devices, see https://gist.github.com/soapyigu/c99e1f45553070726f14c1bb0a54053b#file-machinename-swift
  ----------------------------------------`);

  // Create request engine that will make requests to the cloud service.
  // You need to create a resource key at https://configure.51degrees.com
  // and paste it into the code.

  const requestEngineInstance = new CloudRequestEngine.CloudRequestEngine({
    resourceKey: myResourceKey,
    licenseKey: myLicenseKey
  });

  // Create the property-keyed engine that will organise the results
  // from the cloud request engine.
  const hardwareProfileCloudEngineInstance = new HardwareProfileCloudEngine();

  const PipelineBuilder = pipelineCore.PipelineBuilder;
  // Build a pipeline with engines that we've created
  const pipeline = new PipelineBuilder()
    .add(requestEngineInstance)
    .add(hardwareProfileCloudEngineInstance)
    .build(); // build it when complete

  // Logging of errors and other messages. Valid logs types are info, debug,
  // warn, error
  pipeline.on('error', console.error);

  const outputDetails = async function (nativemodel) {
    let message = 'Which devices are associated with the native model name ' +
      `'${nativemodel}'?`;

    // Create a flow data instance.
    const flowData = pipeline.createFlowData();

    // After creating a flowdata instance, add the native model name as evidence.
    flowData.evidence.add('query.nativemodel', nativemodel);

    await flowData.process();

    if (!flowData.hardware) {
      console.log('Make sure to include the HardwareVendor, HardwareModel ' +
        'and HardwareName properties as they are used by this example.');

      return;
    }

    // The result is an array containing the details of any devices that match
    // the specified native model name.
    // The code in this example iterates through this array, outputting the
    // vendor and model of each matching device.
    flowData.hardware.profiles.forEach(profile => {
      const hardwareVendor = profile.hardwarevendor;
      const hardwareName = profile.hardwarename;
      const hardwareModel = profile.hardwaremodel;

      if (hardwareVendor.hasValue &&
              hardwareName.hasValue &&
              hardwareModel.hasValue) {
        message += `\r\n\t${hardwareVendor.value} ` +
          `${hardwareName.value.join(',')} (${hardwareModel.value})`;
      } else {
        // If we don't have an answer then output the reason for that.
        message += `\r\n\t${hardwareVendor.noValueMessage}`;
      }
    });

    console.log(message);
  };

  const nativeModeliOS = 'iPhone11,8';
  const nativeModelAndroid = 'SC-03L';

  outputDetails(nativeModeliOS);
  outputDetails(nativeModelAndroid);
}
