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
@example pattern/webIntegration.js

This example demonstrates the evidence.addFromRequest() method and client side JavaScript overrides by creating a web server, serving JavaScript created by the device detection engine and bundled together by a special JavaScript bundler engine.. This JavaScript is then used on the client side to save a cookie so that when the device detection engine next processes the request (using the addFromRequest() method) it has a more accurate reading for properties set on the clientside.

*/

const FiftyOneDegreesDeviceDetection = require('../../');

const fs = require("fs");

// Load in a datafile

let datafile = __dirname + "/../../device-detection-cxx/device-detection-data/51Degrees-LiteV3.4.trie";

if (!fs.existsSync(datafile)) {
    console.error("The datafile required by this example is not present. Please ensure that the 'device-detection-data' submodule has been fetched.");
    throw ("No data file at '" + datafile + "'");
}

// Create a new Device Detection pipeline and set the config.
let pipeline = new FiftyOneDegreesDeviceDetection.deviceDetectionPipelineBuilder({
    performanceProfile: "MaxPerformance",
    dataFile: datafile,
    autoUpdate: false,
}).build();

// Logging of errors and other messages. Valid logs types are info, debug, warn, error
pipeline.on("error", console.error);

const http = require('http');

const server = http.createServer((req, res) => {

    let flowData = pipeline.createFlowData();

    // Add any information from the request (headers, cookies and additional client side provided information)
    flowData.evidence.addFromRequest(req);

    flowData.process().then(function () {

        // A property like screenpixelswidth needs to be measured on the clientside for full accuracy

        if (flowData.device.screenpixelswidth.hasValue) {

            console.log(`screenpixelwidth = ${flowData.device.screenpixelswidth.value}`);

        }

        // Get JavaScript to put inside the page so that the second request gets extra information in cookies

        let js = `<script>${flowData.javascript.javascript}</script>`;

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(js);

    });

});

server.listen(3000);
