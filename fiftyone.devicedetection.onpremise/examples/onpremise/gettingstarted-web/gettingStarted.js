/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2023 51 Degrees Mobile Experts Limited, Davidson House,
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
 * @example onpremise/gettingstarted-web/gettingStarted.js
 *
 * This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.onpremise/examples/onpremise/gettingstarted-web/gettingStarted.js).
 *
 * Required npm Dependencies:
 * - fiftyone.pipeline.core
 * - fiftyone.pipeline.engines
 * - fiftyone.pipeline.engines.fiftyone
 * - fiftyone.devicedetection.onpremise
 *
 * ## Overview
 *
 * The `flowData.evidence.addFromRequest(request)` is used to extract required
 * evidence from a Http request. The `Helpers.setResponseHeaders(response, flowData)`
 * from fiftyone.pipeline.core package is used to add extra headers to a Http
 * response to request further evidence from the client.
 * ```
 * flowData.evidence.addFromRequest(request);
 *
 * core.Helpers.setResponseHeaders(response, flowData);
 * ```
 *
 * The results of detection can be accessed by querying the `device` property of
 * a FlowData object. This can then be used to interrogate the data.
 * ```
 * var flowData = pipeline.createFlowData();
 * var deviceData = pipeline.device;
 * var hardwareVendor = deviceData.hardwarevendor;
 * ```
 *
 * Results can also be accessed in client-side code by using the `fod` object. See the
 * [JavaScriptBuilderElement](https://51degrees.com/pipeline-node/class_java_script_builder_element.html)
 * for details on available settings such as changing the `fod` name.
 * ```
 * window.onload = function () {
 *     fod.complete(function(data) {
 *         var hardwareName = data.device.hardwarename;
 *         alert(hardwareName.join(", "));
 *     }
 * }
 * ```
 *
 */

const path = require('path');
const require51 = (requestedPackage) => {
  try {
    return require(path.join(__dirname, '/../../../node_modules/', requestedPackage));
  } catch (e) {
    return require(path.join(__dirname, '/../../../../', requestedPackage));
  }
};

const fs = require('fs');
const http = require('http');
const pug = require('pug');

const compiledFunction =
  pug.compileFile(path.join(__dirname, '/index.pug'));

const core = require51('fiftyone.pipeline.core');

const optionsExtension =
  require51('fiftyone.devicedetection.shared').optionsExtension;

const dataExtension =
  require51('fiftyone.devicedetection.shared').dataExtension;

const { DATA_FILE_AGE_WARNING, ExampleUtils } =
  require(path.join(__dirname, '/../exampleUtils'));

// Pipeline variable to be used
let pipeline;

const setPipeline = (options) => {
  const dataFilePath = optionsExtension.getDataFilePath(options);
  if (!dataFilePath) {
    throw 'A data file must be specified in the 51d.json file.';
  }

  if (!fs.existsSync(dataFilePath)) {
    const newDataFilePath = ExampleUtils.findFile(path.basename(dataFilePath));
    if (newDataFilePath !== undefined) {
      optionsExtension.setDataFilePath(options, newDataFilePath);
      console.warn('Failed to find a device detection data file at ' +
        `at the specified path '${dataFilePath}'. Use '${newDataFilePath}' ` +
        'instead.');
    } else {
      throw 'Failed to find a device detection data file at ' +
        `'${dataFilePath}'. If using the lite file, then make sure the ` +
        'device-detection-data submodule has been updated by running ' +
        '\'git submodule update --recursive\'. Otherwise, ensure that the ' +
        'filename is correct in 51d.json.';
    }
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

  // Handle report from client side separately
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
        pipeline.getElement('device').evidenceKeyFilter.filterEvidence(
          allEvidence);

      // Compile a response
      res.end(compiledFunction(
        {
          dataFilePublishedTime: new Date().getTime(),
          dataFileAgeWarning: DATA_FILE_AGE_WARNING,
          responseHeaders: res.getHeaders(),
          evidenceUsed: evidences,
          allEvidence,
          dataSourceTier: ExampleUtils.getDataTier(pipeline),
          fiftyOneJs: flowData.javascriptbuilder.javascript,
          hardwareVendor: dataExtension.getValueHelper(flowData.device, 'hardwarevendor'),
          hardwareName: dataExtension.getValueHelper(flowData.device, 'hardwarename'),
          deviceType: dataExtension.getValueHelper(flowData.device, 'devicetype'),
          platformVendor: dataExtension.getValueHelper(flowData.device, 'platformvendor'),
          platformName: dataExtension.getValueHelper(flowData.device, 'platformname'),
          platformVersion: dataExtension.getValueHelper(flowData.device, 'platformversion'),
          browserVendor: dataExtension.getValueHelper(flowData.device, 'browservendor'),
          browserName: dataExtension.getValueHelper(flowData.device, 'browsername'),
          browserVersion: dataExtension.getValueHelper(flowData.device, 'browserversion'),
          screenWidth: dataExtension.getValueHelper(flowData.device, 'screenpixelswidth'),
          screenHeight: dataExtension.getValueHelper(flowData.device, 'screenpixelsheight')
        })
      );
    });
  }
});

// Don't run the server if under TEST
if (process.env.JEST_WORKER_ID === undefined) {
  // Load the configuration options from config file.
  const options = JSON.parse(fs.readFileSync(path.join(__dirname, '/51d.json')));

  setPipeline(options);
  const port = 3001;
  const hostname = 'localhost';
  server.listen(port, hostname);
  console.log(`Server listening on: http://${hostname}:${port}`);
};

// Export server object and set pipeline.
module.exports = {
  server,
  setPipeline
};
