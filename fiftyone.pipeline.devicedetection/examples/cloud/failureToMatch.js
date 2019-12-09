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

// Create a new Device Detection pipeline and set the config.
// To access properties other than IsMobile, create your own recource key for free at https://configure.51degrees.com. 
// To access paid-for properties, you will also need to enter your license key.
let pipeline = new ddPipelineBuilder({
    resourceKey: "AQS5HKcyqliVnYhx10g",
    licenseKey: null
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