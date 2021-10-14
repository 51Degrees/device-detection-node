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
@example cloud/configureFromFile.js

@include{doc} example-configure-from-file-cloud.txt

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection/examples/cloud/configureFromFile.js).

@include{doc} example-require-resourcekey.txt

Make sure to include the IsMobile property as it is used by this example.

The configuration file used here is:

@include cloud/51d.json

Expected output:

```
Is user agent Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 a mobile? false

Is user agent Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114 a mobile? true
```

 */

const PipelineBuilder = require('fiftyone.pipeline.core').PipelineBuilder;

const fs = require('fs');

const configFile = fs.readFileSync((process.env.directory || __dirname) + '/51d.json');

const config = JSON.parse(configFile);
let resourceKeySet = true;

// Check if a resource key has been set in the config file.
if (config.PipelineOptions.Elements[0].elementParameters.resourceKey.startsWith('!!')) {
  // If not, check the resource key environment variable.
  const myResourceKey = process.env.RESOURCE_KEY;

  if (myResourceKey) {
    // If there is a resource key in the environment variable then use it.
    config.PipelineOptions.Elements[0].elementParameters.resourceKey = myResourceKey;
  } else {
    // If not, display a message to the user and don't execute the
    // rest of the example.
    resourceKeySet = false;
    console.log('You need to create a resource key at ' +
        'https://configure.51degrees.com and paste it into the 51d.json ' +
        'config file, replacing !!YOUR_RESOURCE_KEY!!.');
    console.log('Make sure to include the ismobile property ' +
        'when creating the resource key, as it is used by this example.');
  }
}

if (resourceKeySet) {
  // Create a new pipeline from the supplied config file.
  const pipeline = new PipelineBuilder().buildFromConfigurationFile((process.env.directory || __dirname) + '/51d.json');

  // Logging of errors and other messages. Valid logs types are info, debug, warn, error
  pipeline.on('error', console.error);

  const checkIfMobile = async function (userAgent) {
    // Create a flow data element and process the desktop User-Agent.
    const flowData = pipeline.createFlowData();

    // Add the User-Agent as evidence
    flowData.evidence.add('header.user-agent', userAgent);

    await flowData.process();

    const ismobile = flowData.device.ismobile;

    if (ismobile.hasValue) {
      console.log(`Is user agent ${userAgent} a mobile? ${ismobile.value}`);
    } else {
      // Echo out why the value isn't meaningful
      console.log(ismobile.noValueMessage);
    }
  };

  const desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36';
  const iPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114';

  checkIfMobile(desktopUA);
  checkIfMobile(iPhoneUA);
}
