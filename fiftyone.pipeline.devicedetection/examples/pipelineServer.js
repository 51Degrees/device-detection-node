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

const deviceDetectionPipelineBuilder = require("../deviceDetectionPipelineBuilder");

// Create a new Pipeline. This will default to Cloud when no datafile 
// argument is supplied.
let pipeline = new deviceDetectionPipelineBuilder(
    {
        resourceKey: "AQS5HKcy0uPi3zrv1kg",
        cacheSize: 100,
        //dataFile: __dirname + "/../device-detection-cxx/device-detection-data/51Degrees-LiteV3.2.dat",
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
