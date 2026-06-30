/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2026 51 Degrees Mobile Experts Limited, Davidson House,
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
 * @example cloud/useragentclienthints-web/userAgentClientHintsWeb.js
 *
 * This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.cloud/examples/cloud/useragentclienthints-web/userAgentClientHintsWeb.js).
 *
 * Make sure to include all the required properties used by this example.
 *
 * Expected output:
 *
 * User Agent Client Hints Example
 *
 * ```
 * Hardware Vendor: [...]
 * Hardware Name: [...]
 * Device Type: [...]
 *  ...
 *
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
const pug = require('pug');

const compiledFunction = pug.compileFile(path.join(__dirname, '/index.pug'));

// Directory holding the shared pattern-library web-example assets
// (examples-main.min.css and examples.min.js). These are served as static
// files so the page can reference them with /css and /js URLs, in the same way
// express.static or an ASP.NET wwwroot folder would expose them.
const publicDir = path.join(__dirname, '/public');

// Map of file extensions to the content types used when serving static assets.
const staticContentTypes = {
  '.css': 'text/css',
  '.js': 'text/javascript'
};

// Serve a file from the public directory. Returns true if the request was a
// static asset request (whether or not the file was found) so the caller can
// stop processing it as a detection request.
const tryServeStatic = (req, res) => {
  const urlPath = req.url.split('?')[0];
  if (!urlPath.startsWith('/css/') && !urlPath.startsWith('/js/')) {
    return false;
  }

  // Resolve the requested path within the public directory and make sure it
  // cannot escape it.
  const filePath = path.join(publicDir, urlPath);
  if (!filePath.startsWith(publicDir)) {
    res.statusCode = 403;
    res.end();
    return true;
  }

  fs.readFile(filePath, function (err, content) {
    if (err) {
      res.statusCode = 404;
      res.end();
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type',
      staticContentTypes[path.extname(filePath)] || 'application/octet-stream');
    res.end(content);
  });
  return true;
};

const core = require51('fiftyone.pipeline.core');

const DeviceDetectionCloudPipelineBuilder = require51('fiftyone.devicedetection.cloud').DeviceDetectionCloudPipelineBuilder;

const ExampleUtils = require(path.join(__dirname, '/../exampleUtils'));

// Helper function to read property values from flowData
const getValueHelper = (flowData, propertyKey) => {
  const device = flowData.device;
  try {
    const property = device[propertyKey];
    if (property.hasValue && property) {
      return property.value;
    } else {
      return property.noValueMessage;
    }
  } catch (error) {
    return 'Not found in cloud';
  }
};

// The aligned '_51DEGREES_RESOURCE_KEY' environment variable is checked
// first, followed by the legacy 'RESOURCE_KEY' variable.
const myResourceKey = ExampleUtils.getResourceKeyFromEnv() || '!!YOUR_RESOURCE_KEY!!';

// We need 'server' to be defined here so that, when this example
// is executed as part of a unit test, the server can be closed
// once the test is complete.
let server;

// Pipeline variable to be used
let pipeline;
const setPipeline = (resourceKey) => {
  // Create a new Device Detection pipeline and set the config.
  // You need to create a resource key at
  // https://configure.51degrees.com/hYzn3TV3?utm_source=code&utm_medium=example&utm_campaign=device-detection-node&utm_content=fiftyone.devicedetection.cloud-examples-cloud-useragentclienthints-web-useragentclienthintsweb.js&utm_term=setpipeline
  // and paste it into the code. This example displays paid properties, so a
  // paid subscription is needed to populate them all.
  pipeline = new DeviceDetectionCloudPipelineBuilder({
    resourceKey,
    // Set to `true` so that if the underlying cloud service fails during request
    // processing the device-detection pipeline degrades gracefully instead of
    // returning a 500. Use `false` while developing to surface mistakes loudly.
    // Errors are still logged via the pipeline 'error' handler below.
    suppressProcessExceptions: true
  }).build();

  // Logging of errors and other messages.
  // Valid logs types are info, debug, warn, error
  pipeline.on('error', console.error);
};

if (myResourceKey === '!!YOUR_RESOURCE_KEY!!' &&
  process.env.JEST_WORKER_ID === undefined) {
  console.log('You need to create a resource key at ' +
        'https://configure.51degrees.com/hYzn3TV3?utm_source=code&utm_medium=example&utm_campaign=device-detection-node&utm_content=fiftyone.devicedetection.cloud-examples-cloud-useragentclienthints-web-useragentclienthintsweb.js&utm_term=resource-key-required and paste it into the ' +
        'code, replacing !!YOUR_RESOURCE_KEY!!. This example displays ' +
        'paid properties, so a paid subscription is needed to populate ' +
        'them all. See https://51degrees.com/pricing?utm_source=code&utm_medium=example&utm_campaign=device-detection-node&utm_content=fiftyone.devicedetection.cloud-examples-cloud-useragentclienthints-web-useragentclienthintsweb.js&utm_term=resource-key-required to get a paid ' +
        'subscription with more properties.');
} else {
  const http = require('http');

  server = http.createServer((req, res) => {
    // Serve the shared CSS/JS assets from the public directory. If this was a
    // static asset request then there is nothing more to do.
    if (tryServeStatic(req, res)) {
      return;
    }

    const flowData = pipeline.createFlowData();

    // Add any information from the request
    // (headers, cookies and additional client side provided information)
    flowData.evidence.addFromRequest(req);

    flowData.process().then(function () {
      res.statusCode = 200;

      // Some browsers require that extra HTTP headers are explicitly
      // requested. So set whatever headers are required by the browser in
      // order to return the evidence needed by the pipeline.
      // More info on this can be found at
      // https://51degrees.com/blog/user-agent-client-hints?utm_source=code&utm_medium=example&utm_campaign=device-detection-node&utm_content=fiftyone.devicedetection.cloud-examples-cloud-useragentclienthints-web-useragentclienthintsweb.js&utm_term=server
      core.Helpers.setResponseHeaders(res, flowData);

      res.setHeader('Content-Type', 'text/html');

      // Obtain the client-hint evidence (user-agent and sec-ch headers) that
      // was used for detection so it can be shown in the page.
      const evidences =
        pipeline.getElement('cloud').evidenceKeyFilter.filterEvidence(
          flowData.evidence.getAll());
      const evidenceUsed = {};
      for (const key in evidences) {
        if (key.includes('header.user-agent') ||
            key.includes('header.sec-ch')) {
          evidenceUsed[key] = evidences[key];
        }
      }

      // Compile a response
      res.end(compiledFunction(
        {
          evidenceUsed,
          hardwareVendor: getValueHelper(flowData, 'hardwarevendor'),
          hardwareName: getValueHelper(flowData, 'hardwarename'),
          deviceType: getValueHelper(flowData, 'devicetype'),
          platformVendor: getValueHelper(flowData, 'platformvendor'),
          platformName: getValueHelper(flowData, 'platformname'),
          platformVersion: getValueHelper(flowData, 'platformversion'),
          browserVendor: getValueHelper(flowData, 'browservendor'),
          browserName: getValueHelper(flowData, 'browsername'),
          browserVersion: getValueHelper(flowData, 'browserversion')
        })
      );
    });
  });

  // Don't run the server if under TEST
  if (process.env.JEST_WORKER_ID === undefined) {
    setPipeline(myResourceKey);
    const port = 3000;
    const hostname = 'localhost';
    server.listen(port, hostname);
    console.log(`Server listening on: http://${hostname}:${port}`);
  };
}

module.exports = {
  server,
  setPipeline
};
