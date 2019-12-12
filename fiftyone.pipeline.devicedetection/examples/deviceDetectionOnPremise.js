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

const ddPipelineBuilder = require("../deviceDetectionPipelineBuilder");
const fs = require("fs");

// Create a new Device Detection pipeline and set the config.
// Not supplying a dataFile will default the implementation to use our Cloud service. 
let pipeline = new ddPipelineBuilder({    
    performanceProfile: "MaxPerformance",
    dataFile: "../device-detection-cxx/device-detection-data/51Degrees-LiteV3.2.dat",
    autoUpdate: false
}).build();

pipeline.on("error", console.error);

// Read from a list of 20000 User Agents.
let userAgents = fs.readFileSync("../device-detection-cxx/device-detection-data/20000 User Agents.csv", "utf8");

userAgents = userAgents.split("\n");

let test = function (userAgent) {

    return new Promise(function (resolve) {

        // Create the flow data element
        let flowData = pipeline.createFlowData();

        flowData.process().then(function (flowData) {
            // Add User-Agent header evidence for processing
            flowData.evidence.add("header.user-agent", userAgent);
            // Retrieve IsMobile device information from the pipeline
            resolve(flowData.device.ismobile);
        });
    });
}

let tests = [];

userAgents.forEach(function (userAgent) {

    tests.push(test(userAgent));

});

// return the time it took to match all User-Agents
console.time("performance");

Promise.all(tests).then(function (params) {

    console.timeEnd("performance");

})
