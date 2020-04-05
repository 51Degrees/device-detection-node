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
@example cloud/failureToMatch.js

This example shows how the hasValue function can help make sure that meaningful values are returned when checking properties returned from the device detection engine. It also illustrates how the "allowUnmatched" parameters can be used to alter these results.

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/release/v4.1.0/fiftyone.devicedetection/examples/cloud/failureToMatch.js). 
(During the beta period, this repository will be private. 
[Contact us](mailto:support.51degrees.com) to request access) 

To run this example, you will need to create a **resource key**. 
The resource key is used as short-hand to store the particular set of 
properties you are interested in as well as any associated license keys 
that entitle you to increased request limits and/or paid-for properties.

In this example a resource key has been provided for testing purposes but you can create your own resource key using the 51Degrees [Configurator](https://configure.51degrees.com).

*/

const FiftyOneDegreesDeviceDetection = require((process.env.directory || __dirname) + "/../../");

// Create the device detection pipeline with the desired settings.

//  You need to create a resource key at https://configure.51degrees.com and paste it into the code.
let pipeline = new FiftyOneDegreesDeviceDetection.deviceDetectionPipelineBuilder({
    "resourceKey": ""
}).build();

pipeline.on("error", console.error);

let checkIfMobile = async function (userAgent) {

    // Create a flow data element and process the desktop User-Agent.
    let flowData = pipeline.createFlowData();

    // Add the User-Agent as evidence
    flowData.evidence.add("header.user-agent", userAgent);

    await flowData.process();

    let ismobile = flowData.device.ismobile;

    console.log(`Is user agent ${userAgent} a mobile?`);

    if (ismobile.hasValue) {

        console.log(ismobile.value);

    } else {

        // Echo out why the value isn't meaningful
        console.log(ismobile.noValueMessage);

    }

    console.log(" ");

}

let iPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114';
checkIfMobile(iPhoneUA)
// This User-Agent is from an iPhone. It should match correctly and be identified as a mobile device

let modifiediPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 99_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114';
checkIfMobile(modifiediPhoneUA)
//This User-Agent is from an iPhone but has been modified so it doesn't match exactly.

let corruptedUA = 'This is not a User-Agent';
checkIfMobile(corruptedUA);
//This User-Agent is fake and will not be matched.
