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
@example gettingStarted.js

@include{doc} example-getting-started-cloud.txt

This shows how to use DeviceDetectionPipelineBuilder instead of specific
DeviceDetectionCloudPipelineBuilder.

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection/examples/gettingStarted.js).

@include{doc} example-require-resourcekey.txt

Expected output:

```
Is user agent 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114' a mobile?
true

Is user agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36' a mobile?
false
```

 */

const DeviceDetectionPipelineBuilder =
  require((process.env.directory || __dirname) +
    '/../deviceDetectionPipelineBuilder');

// Create the device detection pipeline with the desired settings.

// You need to create a resource key at https://configure.51degrees.com
// and paste it into the code, replacing !!YOUR_RESOURCE_KEY!! below.

const myResourceKey = process.env.RESOURCE_KEY || '!!YOUR_RESOURCE_KEY!!';

if (myResourceKey === '!!YOUR_RESOURCE_KEY!!') {
  console.log('You need to create a resource key at ' +
        'https://configure.51degrees.com and paste it into the code, ' +
        'replacing !!YOUR_RESOURCE_KEY!!');
  console.log('Make sure to include the ismobile property ' +
        'as it is used by this example.');
} else {
  // Construct the device detection pipeline using the
  // DeviceDetectionCloudPipelineBuilder, passing in your resourceKey.
  // The build method completes the pipeline
  const pipeline = new DeviceDetectionPipelineBuilder({
    resourceKey: myResourceKey
  }).build();

  // To monitor the pipeline we can put in listeners for various log events.
  // Valid types are info, debug, warn, error
  pipeline.on('error', console.error);

  // Here we make a function that gets a userAgent as evidence and uses the
  // Device Detection Engine to detect if it is a mobile or not
  const checkIfMobile = async function (userAgent) {
    // Create a FlowData element
    // This is used to add evidence and process it through the
    // FlowElements in the Pipeline.
    const flowData = pipeline.createFlowData();

    // Add the User-Agent as evidence
    flowData.evidence.add('header.user-agent', userAgent);

    // Run process on the flowData (this returns a promise)
    await flowData.process();

    // Check the ismobile property
    // this returns an AspectPropertyValue wrapper
    // letting you check if a value is set and if not why not
    const ismobile = flowData.device.ismobile;

    console.log(`Is user agent '${userAgent}' a mobile?`);

    // Check if the result has a meaningful value and output it
    if (ismobile.hasValue) {
      console.log(ismobile.value);
    } else {
      // Output why the value isn't meaningful
      console.log(ismobile.noValueMessage);
    }

    console.log(' ');
  };

  const desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36';

  const iPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114';

  checkIfMobile(desktopUA);
  checkIfMobile(iPhoneUA);
}
