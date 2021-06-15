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
@example cloud/metadata.js

@include{doc} example-metadata-cloud.txt

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.cloud/examples/cloud/metaData.js).

@include{doc} example-require-resourcekey.txt

Expected output

```
[List of properties with names and categories]

Does user agent Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114 support svg? :
true
Does user agent Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114 support video? :
true
Does user agent Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114 support supportstls/ssl? :
true
Does user agent Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114 support supportswebgl? :
true
```

 */

const DeviceDetectionCloudPipelineBuilder =
  require((process.env.directory || __dirname) +
    '/../../deviceDetectionCloudPipelineBuilder');

// Create the device detection pipeline with the desired settings.

// You need to create a resource key at https://configure.51degrees.com and 
// paste it into the code, replacing !!YOUR_RESOURCE_KEY!! below.
const myResourceKey = process.env.RESOURCE_KEY || "!!YOUR_RESOURCE_KEY!!";

if (myResourceKey == "!!YOUR_RESOURCE_KEY!!") {
  console.log('You need to create a resource key at ' +
        'https://configure.51degrees.com and paste it into the code, ' +
        'replacing !!YOUR_RESOURCE_KEY!!');
  console.log('Make sure to include the supported media properties ' +
        'used by this example.');
} else {

  // Construct the device detection pipeline using the
  // DeviceDetectionPipelineBuilder, passing in your resourceKey.
  // The build method completes the pipeline
  const pipeline = new DeviceDetectionCloudPipelineBuilder({
    resourceKey: myResourceKey
  }).build();

  // Logging of errors and other messages.
  // Valid logs types are info, debug, warn, error
  pipeline.on('error', console.error);

  // The following function uses "flowData.getWhere()" to fetch all of the
  // data related to "supported media" on a device by querying the category.
  const getAllSupportedMedia = async function (userAgent) {
    // Create a flow data element and process the desktop User-Agent.
    const flowData = pipeline.createFlowData();

    // Add the User-Agent as evidence
    flowData.evidence.add('header.user-agent', userAgent);

    await flowData.process();

    // Get list of properties for the deviceDetectionEngine
    // (including metadata like category, description, type and
    // which datafiles they appear in)
    const properties = pipeline.getElement('device').getProperties();

    for (let property in properties) {
      property = properties[property];
      console.log(`Property ${property.name} of category ${property.category}`);
    }

    // Get all supported media types (html5 video, svg...)
    // and loop over them to get the support results
    // The second parameter can also be a boolean function that checks the
    // value of that meta type (category in this case)
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
}
