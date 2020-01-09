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
@example pattern/failureToMatch.js

This example shows how the hasValue function can help make sure that meaningful values are returned when checking properties returned from the device detection engine. It also illustrates how the "allowUnmatched" parameters can be used to alter these results.

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/release/v4.1.0/fiftyone.devicedetection/examples/pattern/failureToMatch.js). 
(During the beta period, this repository will be private. 
[Contact us](mailto:support.51degrees.com) to request access)

This example requires a local data file. Free data files can be acquired by 
pulling the submodules under this repository or from the 
[device-detection-data](https://github.com/51Degrees/device-detection-data) 
GitHub repository.

*/

const FiftyOneDegreesDeviceDetection = require((process.env.directory || __dirname) + "/../../");

// Load in a datafile

let datafile = (process.env.directory || __dirname) + "/../../device-detection-cxx/device-detection-data/51Degrees-LiteV3.2.dat";

// Check if datafiele exists

const fs = require("fs");
if (!fs.existsSync(datafile)) {
    console.error("The datafile required by this example is not present. Please ensure that the 'device-detection-data' submodule has been fetched.");
    throw ("No data file at '" + datafile + "'");
}

// Create the device detection pipeline with the desired settings. Note the commented out allowUnmatched setting which will be referenced later in the example.

let pipeline = new FiftyOneDegreesDeviceDetection.deviceDetectionPipelineBuilder({
    performanceProfile: "MaxPerformance",
    dataFile: datafile,
    autoUpdate: false,
    // allowUnmatched: true 
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
// By default the API will not match this but can be configured to do so by changing the 'difference' parameter when building the engine.

let corruptedUA = 'This is not a User-Agent';
checkIfMobile(corruptedUA);
//This User-Agent is fake and will not be matched. If you still want a match returned in this case then you can set the 'unmatched' parameter flag when building the engine. This will cause the 'default' profiles to be returned.
