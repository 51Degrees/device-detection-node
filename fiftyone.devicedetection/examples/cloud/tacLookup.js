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
@example cloud/tacLookup.js

Example of using the 51Degrees cloud service to lookup details of a device based on it's TAC.

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection/examples/cloud/tacLookup.js).

To run this example, you will need to create a **resource key**.
The resource key is used as short-hand to store the particular set of
properties you are interested in as well as any associated license keys
that entitle you to increased request limits and/or paid-for properties.

You can create a resource key using the 51Degrees [Configurator](https://configure.51degrees.com).
Make sure to include the HardwareVendor and HardwareModel properties
as they are used by this example.

Create a cloud request engine. This will make the HTTP calls to the
51Degrees cloud service.
Add your resource key here.

```

let cloudRequestEngine = new pipelineCre.cloudRequestEngine({
    "resourceKey": ""
});

```

Create the 'property-keyed' cloud engine.
This will expose the response from recieved by the cloud request engine
in a more user-friendly format.

```

const FiftyOneDegreesDeviceDetection = require((process.env.directory || __dirname) + "/../../");
let hardwareProfileCloudEngine = new FiftyOneDegreesDeviceDetection.hardwareProfileCloudEngine();

```

Build a pipeline with engines that we've created

```

// Create the pipeline, adding our engines.
let pipeline = new pipelineBuilder()
    .add(cloudRequentEngine)
    .add(hardwareProfileCloudEngine)
    .build();

```

After creating a flowdata instance, add the TAC as evidence.

```

flowData.evidence.add("query.tac", tac);

```

The result is an array containing the details of any devices that match
the specified TAC.
The code in this example iterates through this array, outputting the
vendor and model name of each matching device.

```

flowData.devices.devices.forEach(device => {
    let hardwareVendor = device.HardwareVendor;
    let hardwareName = device.HardwareName;
    let hardwareModel = device.HardwareModel;

    if (hardwareVendor.hasValue &&
        hardwareName.hasValue &&
        hardwareModel.hasValue) {

        message += `\r\n\t${hardwareVendor.value} ${hardwareName.value.join(",")} (${hardwareModel.value})`;

    } else {

        // If we don't have an answer then output the reason for that.
        message += `\r\n\t${hardwareVendor.noValueMessage}`;

    }
});

```

Example output:

```
This example shows the details of devices associated with a given 'Type Allocation Code' or 'TAC'.
More background information on TACs can be found through various online sources such as Wikipedia: https://en.wikipedia.org/wiki/Type_Allocation_Code
----------------------------------------
Which devices are associated with the TAC '86386802'?
        Coolpad 5217 (5217)
        Coolpad 5200 (5200)
        Coolpad 5310 (5310)
        Coolpad 5311 (5311)
        Coolpad 5315 (5315)
        Coolpad CoolPad Unknown (CoolPad Unknown)
Which devices are associated with the TAC '35925406'?
        Apple iPhone 6 (A1586)
```

 */

const pipelineCore = require('fiftyone.pipeline.core');
const CloudRequestEngine = require('fiftyone.pipeline.cloudrequestengine').CloudRequestEngine;
const HardwareProfileCloudEngine = require((process.env.directory || __dirname) + '/../../hardwareProfileCloudEngine');

// You need to create a resource key at https://configure.51degrees.com and
// paste it into the code, replacing !!YOUR_RESOURCE_KEY!!.
let localResourceKey = process.env.RESOURCE_KEY || "!!YOUR_RESOURCE_KEY!!";

if (localResourceKey == "!!YOUR_RESOURCE_KEY!!") {
  console.log('You need to create a resource key at ' +
        'https://configure.51degrees.com and paste it into the code, ' +
        'replacing !!YOUR_RESOURCE_KEY!!.');
  console.log('Make sure to include the HardwareVendor, HardwareName ' +
        'and HardwareModel properties as they are used by this example.');
} else {
  console.log(`This example shows the details of devices associated with a given 'Type Allocation Code' or 'TAC'.
    More background information on TACs can be found through various online sources such as Wikipedia: https://en.wikipedia.org/wiki/Type_Allocation_Code
    ----------------------------------------`);

  // Create request engine that will make requests to the cloud service.
  //  You need to create a resource key at https://configure.51degrees.com and paste it into the code.

  const requestEngineInstance = new CloudRequestEngine({
    resourceKey: localResourceKey
  });

  // Create the property-keyed engine that will organise the results
  // from the cloud request engine.
  const hardwareProfileCloudEngineInstance = new HardwareProfileCloudEngine();

  const pipelineBuilder = pipelineCore.PipelineBuilder;
  // Create the pipeline, adding our engines.
  const pipeline = new pipelineBuilder()
    .add(requestEngineInstance)
    .add(hardwareProfileCloudEngineInstance)
    .build();

  // Logging of errors and other messages. Valid logs types are info, debug, warn, error
  pipeline.on('error', console.error);

  const outputDetails = async function (tac) {
    let message = `Which devices are associated with the TAC '${tac}'?`;

    // Create a flow data instance.
    const flowData = pipeline.createFlowData();

    // Add the TAC as evidence
    flowData.evidence.add('query.tac', tac);

    await flowData.process();

    // Iterate through the matching profiles,
    // outputting vendor and model name.
    flowData.hardware.profiles.forEach(profile => {
      const hardwareVendor = profile.HardwareVendor;
      const hardwareName = profile.HardwareName;
      const hardwareModel = profile.HardwareModel;

      if (hardwareVendor.hasValue &&
                hardwareName.hasValue &&
                hardwareModel.hasValue) {
        message += `\r\n\t${hardwareVendor.value} ${hardwareName.value.join(',')} (${hardwareModel.value})`;
      } else {
        // If we don't have an answer then output the reason for that.
        message += `\r\n\t${hardwareVendor.noValueMessage}`;
      }
    });

    console.log(message);
  };

  const tac1 = '35925406';
  const tac2 = '86386802';

  outputDetails(tac1);
  outputDetails(tac2);
}
