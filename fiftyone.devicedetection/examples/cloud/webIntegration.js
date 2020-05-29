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
@example cloud/webIntegration.js

This example demonstrates the evidence.addFromRequest() method and client side JavaScript overrides by creating a web server, serving JavaScript created by the device detection engine and bundled together by a special JavaScript bundler engine.. This JavaScript is then used on the client side to get a more accurate reading for properties by fetching the json response using the overrides as evidence.

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection/examples/cloud/webIntegration.js).

To run this example, you will need to create a **resource key**.
The resource key is used as short-hand to store the particular set of
properties you are interested in as well as any associated license keys
that entitle you to increased request limits and/or paid-for properties.

You can create a resource key using the 51Degrees [Configurator](https://configure.51degrees.com).
 */

const FiftyOneDegreesDeviceDetection = require((process.env.directory || __dirname) + '/../../');

const myResourceKey = global.resourceKey;

if (!myResourceKey) {
  console.log('You need to create a resource key at ' +
        'https://configure.51degrees.com and paste it into the code, ' +
        'replacing global.resourceKey');
  process.exit();
}

// Create a new Device Detection pipeline and set the config.
//  You need to create a resource key at https://configure.51degrees.com
// and paste it into the code.
// The JavaScriptBuilderSettings allow you to provide an endpoint
// which will be requested by the client side JavaScript.
// This should return the contents of the JSONBundler element which
// is automatically added to the Pipeline.
const pipeline = new FiftyOneDegreesDeviceDetection.DeviceDetectionPipelineBuilder({
  resourceKey: myResourceKey,
  javascriptBuilderSettings: {
    _endPoint: '/json'
  }
}).build();

// Logging of errors and other messages.
// Valid logs types are info, debug, warn, error
pipeline.on('error', console.error);

const http = require('http');

const server = http.createServer((req, res) => {
  const flowData = pipeline.createFlowData();

  // Add any information from the request
  // (headers, cookies and additional client side provided information)
  flowData.evidence.addFromRequest(req);

  flowData.process().then(function () {
    res.statusCode = 200;

    if (req.url.startsWith('/json')) {
      // Return the json to the client.
      res.setHeader('Content-Type', 'application/json');

      res.end(JSON.stringify(flowData.jsonbundler.json));
    } else {
      // To get a more acurate list of hardware names,
      // we need to run some client side javascript code.
      // At first this will populate a large list which will get smaller
      // following new client side evidence.
      res.setHeader('Content-Type', 'text/html');

      let output = '';

      if (flowData.device.hardwarename && flowData.device.hardwarename.hasValue) {
        console.log("Client's updated hardware name is " + flowData.device.hardwarename.value);
      }

      // If the screen pixel width has been set from the client side, output it
      if (flowData.device.screenpixelswidth.hasValue && flowData.device.screenpixelswidth.value) {
        console.log("Client's screen pixel width is " + flowData.device.screenpixelswidth.value);
      }

      // Print results of client side processing to the page.
      output += `
            <p id=hardwarename></p>
            <p id=screenpixelwidth></p>
            <script>
            window.onload = function(){
              fod.complete(function (data) {
                    if(data.device["hardwarename"]){
                    document.getElementById('hardwarename').innerHTML = "<strong>Updated Hardware Name from client-side evidence:</strong> " + data.device["hardwarename"];
                    }
                    document.getElementById('screenpixelwidth').innerHTML = "<strong>Pixel width: " + data.device.screenpixelswidth + "</strong>"
                  });
            }
            </script>
            `;

      // Get JavaScript to put inside the page to gather extra evidence
      const js = `<script>${flowData.javascriptbuilder.javascript}</script>`;

      res.end(js + output);
    }
  });
});

const port = 3000;
server.listen(port);
console.log('Server listening on port: ' + port);
