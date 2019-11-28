const deviceDetectionPipelineBuilder = require("../deviceDetectionPipelineBuilder");

// Create a new Pipeline. This will default to Cloud when no datafile 
// argument is supplied.
let pipeline = new deviceDetectionPipelineBuilder(
    {
        resourceKey: "AQS5HKcy0uPi3zrv1kg",
        cacheSize: 100,
        //dataFile: __dirname + "/../datafile/51Degrees-LiteV3.2.dat",
        licenceKeys: "YOUR_LICENSE_KEY"
    }
).build();

pipeline.on("error", function (message) {

    console.log(message);

});

const http = require('http');
const port = 3000;

// Create a localhost server to return IsMobile responses when
// a user connects.
const server = http.createServer((req, res) => {
    // Create the flow data element.
    let flowData = pipeline.createFlowData();
    // Add the evidence from the request headers
    flowData.evidence.addFromRequest(req);
    // Process the evidence and output the result.
    flowData.process().then(function () {
        let response = "";
        response += "<script>" + flowData.get("javascript").get("javascript") + "</script>";
        response += flowData.get("device").get("ismobile").toString();
        res.end(response);
    });
});

server.listen(port);
console.log("Server listening on port: " + port); 
