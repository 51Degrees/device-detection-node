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
@example hash/webIntegration.js

@include{doc} example-web-integration.txt

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection/examples/hash/webIntegration.js).

@include{doc} example-require-datafile.txt

Expected output:

```
Browser name: [...]

Pixel width: [...]
```

 */

const require51 = (requestedPackage) => {
  try {
    return require('/../' + requestedPackage);
  } catch (e) {
    return require(requestedPackage);
  }
};
const core = require51('fiftyone.pipeline.core');

const DeviceDetectionOnPremisePipelineBuilder =
  require((process.env.directory || __dirname) +
  '/../../deviceDetectionOnPremisePipelineBuilder');

const fs = require('fs');

// Load in a datafile

const datafile = (process.env.directory || __dirname) + '/../../device-detection-cxx/device-detection-data/51Degrees-LiteV4.1.hash';

if (!fs.existsSync(datafile)) {
  console.error("The datafile required by this example is not present. Please ensure that the 'device-detection-data' submodule has been fetched.");
  throw ("No data file at '" + datafile + "'");
}

// Create a new Device Detection pipeline and set the config.
// The JavaScriptBuilderSettings allow you to provide an endpoint
// which will be requested by the client side JavaScript. This should return
// the contents of the JSONBundler element which is automatically
// added to the Pipeline.
const pipeline = new DeviceDetectionOnPremisePipelineBuilder({
  performanceProfile: 'MaxPerformance',
  dataFile: datafile,
  autoUpdate: false,
  javascriptBuilderSettings: {
    endPoint: '/json'
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
      // Some browsers require that extra HTTP headers are explicitly
      // requested. So set whatever headers are required by the browser in
      // order to return the evidence needed by the pipeline.
      // More info on this can be found at
      // https://51degrees.com/blog/user-agent-client-hints
      core.Helpers.setResponseHeaders(res, flowData);

      // To get a more acurate list of hardware names,
      // we need to run some client side javascript code.
      // At first this will populate a large list which will
      // get smaller following new client side evidence.
      res.setHeader('Content-Type', 'text/html');

      let output = '';

      if (flowData.device.browsername && flowData.device.browsername.hasValue) {
        console.log("Client's browser name is " + flowData.device.browsername.value);
      }

      // If the screen pixel width has been set from the client side, output it
      if (flowData.device.screenpixelswidth.hasValue && flowData.device.screenpixelswidth.value) {
        console.log("Client's screen pixel width is " + flowData.device.screenpixelswidth.value);
      }

      // Print results of client side processing to the page.
      output += `
            <p id=browsername></p>
            <p id=screenpixelwidth></p>
            <script>
            window.onload = function(){
              fod.complete(function (data) {
                    document.getElementById('browsername').innerHTML = "<strong>Browser name: " + data.device["browsername"] + "</strong>";
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

const port = 3001;
server.listen(port);
console.log('Server listening on port: ' + port);
