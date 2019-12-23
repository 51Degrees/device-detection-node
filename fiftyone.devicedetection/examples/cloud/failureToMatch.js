/* ********************************************************************
 * Copyright (C) 2019  51Degrees Mobile Experts Limited.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * ******************************************************************** */

/*
@example pattern/failureToMatch.js

This examples shows how the hasValue function can help make sure that meaningful values are returned when checking properties returned from the device detection engine. It also illustrates how the "allowUnmatched" parameters can be used to alter these results.

*/

const FiftyOneDegreesDeviceDetection = require("../../");

// Load in a datafile

let datafile = __dirname + "/../../device-detection-cxx/device-detection-data/51Degrees-LiteV3.2.dat";

// Check if datafiele exists

const fs = require("fs");
if (!fs.existsSync(datafile)) {
    console.error("The datafile required by this example is not present. Please ensure that the 'device-detection-data' submodule has been fetched.");
    throw ("No data file at '" + datafile + "'");
}

// Create the device detection pipeline with the desired settings.

let pipeline = new FiftyOneDegreesDeviceDetection.deviceDetectionPipelineBuilder({
    "resourceKey": "AQS5HKcyHJbECm6E10g"
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
