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
    dataFile: "../datafile/51Degrees-LiteV3.2.dat",
    autoUpdate: false
}).build();

pipeline.on("error", console.error);

// Read from a list of 20000 User Agents.
let userAgents = fs.readFileSync("../datafile/20000 User Agents.csv", "utf8");

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
