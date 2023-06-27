/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2022 51 Degrees Mobile Experts Limited, Davidson House,
 * Forbury Square, Reading, Berkshire, United Kingdom RG1 3EU.
 *
 * This Original Work is licensed under the European Union Public Licence
 * (EUPL) v.1.2 and is subject to its terms as set out below.
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
@example cloud/gettingstarted-web/gettingStarted.js

@include{doc} example-getting-started-cloud.txt

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.cloud/examples/cloud/gettingstarted-web/gettingStarted.js).

@include{doc} example-require-resourcekey.txt

Required npm Dependencies:
- fiftyone.pipeline.cloudrequestengine
- fiftyone.pipeline.core
- fiftyone.pipeline.engines
- fiftyone.pipeline.engines.fiftyone
- fiftyone.devicedetection.cloud

## Overview

The `flowData.evidence.addFromRequest(request)` is used to extract required
evidence from a Http request. The `Helpers.setResponseHeaders(response, flowData)`
from fiftyone.pipeline.core package is used to add extra headers to a Http
response to request further evidence from the client.
```
flowData.evidence.addFromRequest(request);

core.Helpers.setResponseHeaders(response, flowData);
```

The results of detection can be accessed by querying the `device` property of
a FlowData object. This can then be used to interrogate the data.
```
var flowData = pipeline.createFlowData();
var deviceData = pipeline.device;
var hardwareVendor = deviceData.hardwarevendor;
```

Results can also be accessed in client-side code by using the `fod` object. See the
[JavaScriptBuilderElement](https://51degrees.com/pipeline-node/class_java_script_builder_element.html)
for details on available settings such as changing the `fod` name.
```
window.onload = function () {
    fod.complete(function(data) {
        var hardwareName = data.device.hardwarename;
        alert(hardwareName.join(", "));
    }
}
```

## Configuration
@include 51d.json
*/

const require51 = (requestedPackage) => {
  try {
    return require('/../' + requestedPackage);
  } catch (e) {
    return require(requestedPackage);
  }
};

const path = require('path');
const fs = require('fs');
const http = require('http');
const pug = require('pug');

const compiledFunction = pug.compileFile(path.join(__dirname, '/index.pug'));

const core = require51('fiftyone.pipeline.core');

const OptionsExtension =
  require('fiftyone.devicedetection.shared').optionsExtension;

const DataExtension =
  require('fiftyone.devicedetection.shared').dataExtension;

const ExampleUtils = require(path.join(__dirname, '/../exampleUtils'));

// Pipeline variable to be used
let pipeline;

const setPipeline = (options) => {
  const resourceKey = OptionsExtension.getResourceKey(options);
  // If we don't have a resource key then log an error
  if (!resourceKey) {
    throw 'No resource key specified in the configuration file ' +
      '\'51d.json\' or the environment variable ' +
      `'${ExampleUtils.RESOURCE_KEY_ENV_VAR}'. The 51Degrees cloud ` +
      'service is accessed using a \'ResourceKey\'. For more information ' +
      'see ' +
      'https://51degrees.com/documentation/_info__resource_keys.html. ' +
      'A resource key with the properties required by this example can be ' +
      'created for free at https://configure.51degrees.com/1QWJwHxl. ' +
      'Once complete, populate the config file or environment variable ' +
      'mentioned at the start of this message with the key.';
  }

  pipeline = new core.PipelineBuilder({
    // Enable custom javascript builder
    addJavaScriptBuilder: true,
    // Settings for javascript builder
    javascriptBuilderSettings: {
      // Custom endpoint to report client-side evidence
      endPoint: '/json'
    }
  }).buildFromConfiguration(options);

  // Logging of errors and other messages.
  // Valid logs types are info, debug, warn, error
  pipeline.on('error', console.error);
};

const server = http.createServer((req, res) => {
  // FlowData is a data structure that is used to convey
  // information required for detection and the results of the
  // detection through the pipeline.
  // Information required for detection is called "evidence"
  // and usually consists of a number of HTTP Header field
  // values, in this case represented by a
  // Object of header name/value entries.
  const flowData = pipeline.createFlowData();

  // Extract required evidence from the Http request.
  flowData.evidence.addFromRequest(req);

  if (req.url.startsWith('/json')) {
    flowData.process().then(function () {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');

      res.end(JSON.stringify(flowData.jsonbundler.json));
    });
  } else {
    flowData.process().then(function () {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');

      // Some browsers require that extra HTTP headers are explicitly
      // requested. So set whatever headers are required by the browser in
      // order to return the evidence needed by the pipeline.
      // More info on this can be found at
      // https://51degrees.com/blog/user-agent-client-hints
      core.Helpers.setResponseHeaders(res, flowData);

      // Obtain all used evidence
      const allEvidence = flowData.evidence.getAll();
      const evidences =
        pipeline.getElement('cloud').evidenceKeyFilter.filterEvidence(
          allEvidence);

      const device = flowData.device;

      // Compile a response
      res.end(compiledFunction(
        {
          responseHeaders: res.getHeaders(),
          evidenceUsed: evidences,
          allEvidence,
          fiftyOneJs: flowData.javascriptbuilder.javascript,
          hardwareVendor: DataExtension.getValueHelper(device, 'hardwarevendor'),
          hardwareName: DataExtension.getValueHelper(device, 'hardwarename'),
          deviceType: DataExtension.getValueHelper(device, 'devicetype'),
          platformVendor: DataExtension.getValueHelper(device, 'platformvendor'),
          platformName: DataExtension.getValueHelper(device, 'platformname'),
          platformVersion: DataExtension.getValueHelper(device, 'platformversion'),
          browserVendor: DataExtension.getValueHelper(device, 'browservendor'),
          browserName: DataExtension.getValueHelper(device, 'browsername'),
          browserVersion: DataExtension.getValueHelper(device, 'browserversion'),
          screenWidth: DataExtension.getValueHelper(device, 'screenpixelswidth'),
          screenHeight: DataExtension.getValueHelper(device, 'screenpixelsheight')
        })
      );
    });
  }
});

// Don't run the server if under TEST
if (process.env.JEST_WORKER_ID === undefined) {
  const args = process.argv.slice(2);
  // Use the supplied resource key or try to obtain one
  // from the environment variable.
  const resourceKey =
    args.length > 0 ? args[0] : process.env[ExampleUtils.RESOURCE_KEY_ENV_VAR];

  // Load the configuration options from
  const options = JSON.parse(fs.readFileSync(path.join(__dirname, '/51d.json')));

  // If resource key is not set in the config file, set one from console input
  // or from environment variable.
  const resourceKeyFromConfig = OptionsExtension.getResourceKey(options);
  if (!resourceKeyFromConfig || resourceKeyFromConfig.startsWith('!!')) {
    OptionsExtension.setResourceKey(options, resourceKey);
  }

  setPipeline(options);
  const port = 3001;
  server.listen(port);
  console.log('Server listening on port: ' + port);
};

// Export server object and set pipeline.
module.exports = {
  server,
  setPipeline
};
