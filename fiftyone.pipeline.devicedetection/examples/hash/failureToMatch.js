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

// Checks if the package required is available locally and if unsuccessful 
// return as a module reference.
let require51 = (requestedPackage) => {
    try {
        return require(__dirname + "/../../" + requestedPackage)
    } catch (e) {
        return require(requestedPackage);
    }
}

const ddPipelineBuilder = require51("deviceDetectionPipelineBuilder");
const fs = require("fs");

let datafile = "../../device-detection-cxx/device-detection-data/51Degrees-LiteV3.4.trie";

if(fs.existsSync(datafile) == false) {
    console.error("The datafile required by this example is not present. Please ensure that the 'device-detection-data' submodule has been fetched.");
    throw ("No data file at '" + __dirname + datafile + "'");
}

// Create a new Device Detection pipeline and set the config.
// Free data files can be acquired by pulling the submodule 'device-detection-data' under 'device-detection-cxx'
// Alternatively, use the cloud example for an immediate result.
let pipeline = new ddPipelineBuilder({    
    performanceProfile: "MaxPerformance",
    dataFile: "../../device-detection-cxx/device-detection-data/51Degrees-LiteV3.4.trie",
    autoUpdate: false
}).build();

pipeline.on("error", console.error);

let iPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114';
let modifiediPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 99_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114';
let corruptedUA = 'This is not a User-Agent';

// Create a flow data element and process the iPhone User-Agent.
let flowData = pipeline.createFlowData();
// Add the User-Agent as evidence
flowData.evidence.add("header.user-agent", iPhoneUA);
// Process the flow data
flowData.process().then(function () {
    // Get the 'ismobile' property 
    let ismobile = flowData.device.ismobile;
    // Format a message and write it to console
    let isMobileString = (ismobile.hasValue ? ismobile.value : ("NO MATCH - " + ismobile.noValueMessage));
    let message = 
        "------------------------------------------------------------\n" +
        "This User-Agent is from an iPhone. It should match correctly and be identified as a mobile device:\n" +
        "\tUser-Agent = " + iPhoneUA + "\n" +
        "\tIsMobile = " + isMobileString;
    console.info(message);
});

// Create a flow data element and process the iPhone User-Agent.
let flowData2 = pipeline.createFlowData();
// Add the User-Agent as evidence
flowData2.evidence.add("header.user-agent", modifiediPhoneUA);
// Process the flow data
flowData2.process().then(function () {
    // Get the 'ismobile' property 
    let ismobile = flowData2.device.ismobile;
    // Format a message and write it to console
    let isMobileString = (ismobile.hasValue ? ismobile.value : ("NO MATCH - " + ismobile.noValueMessage));
    let message = 
        "------------------------------------------------------------\n" +
        "This User-Agent is from an iPhone but has been modified so it doesn't match exactly.\n" + 
        "By default the API will not match this but can be configured to do so by changing the 'difference' parameter when building the engine.\n" +
        "\tUser-Agent = " + modifiediPhoneUA + "\n" +
        "\tIsMobile = " + isMobileString;
    console.info(message);
});

// Create a flow data element and process the corrupted User-Agent.
let flowData3 = pipeline.createFlowData();
// Add the User-Agent as evidence
flowData3.evidence.add("header.user-agent", corruptedUA);
// Process the flow data
flowData3.process().then(function () {
    // Get the 'ismobile' property 
    let ismobile = flowData3.device.ismobile;
    // Format a message and write it to console
    let isMobileString = (ismobile.hasValue ? ismobile.value : ("NO MATCH - " + ismobile.noValueMessage));
    let message = 
        "------------------------------------------------------------\n" +
        "This User-Agent is fake and will not be matched.\n" + 
        "If you still want a match returned in this case then you can set the 'unmatched' parameter flag when building the engine.\n" +
        "This will cause the 'default' profiles to be returned.\n" +
        "\tUser-Agent = " + corruptedUA + "\n" +
        "\tIsMobile = " + isMobileString;
    console.info(message);
});