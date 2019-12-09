/*
@example hash/gettingStarted.js
Getting started example of using the 51Degrees device detection 'Hash' algorithm to determine whether a given User-Agent corresponds to a mobile device or not.

The example shows how to:
1. Specify name of the data file the engine should be initialized with.

       let  datafile  =  "../../datafile/51Degrees-LiteV3.4.trie";

2. Create a new Pipeline using the deviceDetectionPipelineBuilder.

       let  pipeline  =  new  ddPipelineBuilder({
           performanceProfile:  "MaxPerformance",
           dataFile:  "../../datafile/51Degrees-LiteV3.4.trie",
           autoUpdate:  false
       }).build();
       
3. Create a new flowData instance from the Pipeline.
       
       let  flowData  =  pipeline.createFlowData();
4. Add a User-Agent to the flowData as evidence.
       
       flowData.evidence.add("header.user-agent", desktopUA);
5. Process the flowData and output the result.

       flowData.process().then(function () {
           let  ismobile  =  flowData.device.ismobile;
           let  isMobileString  = (ismobile.hasValue  ?  ismobile.value  : ("NO MATCH - "  +  ismobile.noValueMessage));
           console.info("Is mobile = " + isMobileString);
       });
*/


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

let datafile = "../../datafile/51Degrees-LiteV3.4.trie";

if(fs.existsSync(datafile) == false) {
    console.error("The datafile required by this example is not present. Please ensure that the 'device-detection-data' submodule has been fetched.");
    throw ("No data file at '" + __dirname + datafile + "'");
}

// Create a new Device Detection pipeline and set the config.
// Free data files can be acquired by pulling the submodule 'device-detection-data' under 'device-detection-cxx' 
// Alternatively, use the cloud example for an immediate result.
let pipeline = new ddPipelineBuilder({    
    performanceProfile: "MaxPerformance",
    dataFile: "../../datafile/51Degrees-LiteV3.4.trie",
    autoUpdate: false
}).build();

pipeline.on("error", console.error);

let desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36';
let iPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114';

// Create a flow data element and process the desktop User-Agent.
let flowData = pipeline.createFlowData();
// Add the User-Agent as evidence
flowData.evidence.add("header.user-agent", desktopUA);
// Process the flow data
flowData.process().then(function () {
    // Get the 'ismobile' property 
    let ismobile = flowData.device.ismobile;
    // Format a message and write it to console
    let isMobileString = (ismobile.hasValue ? ismobile.value : ("NO MATCH - " + ismobile.noValueMessage));
    let message = 
        "------------------------------------------------------------\n" +
        "This User-Agent is from a desktop computer. It should match correctly and not be identified as a mobile device:\n" +
        "\tUser-Agent = " + desktopUA + "\n" +
        "\tIsMobile = " + isMobileString;
    console.info(message);
});

// Create a flow data element and process the iPhone User-Agent.
let flowData2 = pipeline.createFlowData();
// Add the User-Agent as evidence
flowData2.evidence.add("header.user-agent", iPhoneUA);
// Process the flow data
flowData2.process().then(function () {
    // Get the 'ismobile' property 
    let ismobile = flowData2.device.ismobile;
    // Format a message and write it to console
    let isMobileString = (ismobile.hasValue ? ismobile.value : ("NO MATCH - " + ismobile.noValueMessage));
    let message = 
        "------------------------------------------------------------\n" +
        "This User-Agent is from an iPhone. It should match correctly and be identified as a mobile device:\n" +
        "\tUser-Agent = " + iPhoneUA + "\n" +
        "\tIsMobile = " + isMobileString;
    console.info(message);
});