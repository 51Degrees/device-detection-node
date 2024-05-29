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
 * @example onpremise/useragentclienthints-web/userAgentClientHintsWeb.js
 *
 * This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.onpremise/examples/onpremise/useragentclienthints-web/userAgentClientHintsWeb.js).
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

const core = require51('fiftyone.pipeline.core');

const DeviceDetectionOnPremisePipelineBuilder =
  require51('fiftyone.devicedetection.onpremise').DeviceDetectionOnPremisePipelineBuilder;

const fs = require('fs');

// Load in a datafile

const datafile = (process.env.directory || __dirname) + '/../../../device-detection-cxx/device-detection-data/51Degrees-LiteV4.1.hash';

if (!fs.existsSync(datafile)) {
  console.error("The datafile required by this example is not present. Please ensure that the 'device-detection-data' submodule has been fetched.");
  throw ("No data file at '" + datafile + "'");
}

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
    return 'Not found in datafile';
  }
};

// Pipeline variable to be used
let pipeline;

const setPipeline = (properties) => {
  pipeline = new DeviceDetectionOnPremisePipelineBuilder({
    performanceProfile: 'MaxPerformance',
    dataFile: datafile,
    autoUpdate: false,
    restrictedProperties: properties
  }).build();

  // Logging of errors and other messages.
  // Valid logs types are info, debug, warn, error
  pipeline.on('error', console.error);
};

const http = require('http');

const server = http.createServer((req, res) => {
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
    // https://51degrees.com/blog/user-agent-client-hints
    core.Helpers.setResponseHeaders(res, flowData);

    res.setHeader('Content-Type', 'text/html');

    let output = '';

    // Generate the HTML

    output = '<h2>User Agent Client Hints Example</h2>';

    output += `

        <p>
        By default, the user-agent, sec-ch-ua and sec-ch-ua-mobile HTTP headers
        are sent.
        <br />
        This means that on the first request, the server can determine the
        browser from sec-ch-ua while other details must be derived from the
        user-agent.
        <br />
        If the server determines that the browser supports client hints, then
        it may request additional client hints headers by setting the
        Accept-CH header in the response.
        <br />
        Select the <strong>Make second request</strong> button below,
        to use send another request to the server. This time, any
        additional client hints headers that have been requested
        will be included.
        </p>
    
        <button type="button" onclick="redirect()">Make second request</button>

        <script>
    
            // This script will run when button will be clicked and device detection request will again 
            // be sent to the server with all additional client hints that was requested in the previous
            // response by the server.
            // Following sequence will be followed.
            // 1. User will send the first request to the web server for detection.
            // 2. Web Server will return the properties in response based on the headers sent in the request. Along 
            // with the properties, it will also send a new header field Accept-CH in response indicating the additional
            // evidence it needs. It builds the new response header using SetHeader[Component name]Accept-CH properties 
            // where Component Name is the name of the component for which properties are required.
            // 3. When "Make second request" button will be clicked, device detection request will again 
            // be sent to the server with all additional client hints that was requested in the previous
            // response by the server.
            // 4. Web Server will return the properties based on the new User Agent Client Hint headers 
            // being used as evidence.
    
            function redirect() {
                sessionStorage.reloadAfterPageLoad = true;
                window.location.reload(true);
                }
    
            window.onload = function () { 
                if ( sessionStorage.reloadAfterPageLoad ) {
                document.getElementById('description').innerHTML = "<p>The information shown below is determined using <strong>User Agent Client Hints</strong> that was sent in the request to obtain additional evidence. If no additional information appears then it may indicate an external problem such as <strong>User Agent Client Hints</strong> being disabled in your browser.</p>";
                sessionStorage.reloadAfterPageLoad = false;
                }
                else{
                document.getElementById('description').innerHTML = "<p>The following values are determined by sever-side device detection on the first request.</p>";
                }
            }

        </script>

            <div id="evidence">
              <strong></br>Evidence values used: </strong>
              <table>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
    
        `;
    const evidences = pipeline.getElement('device').evidenceKeyFilter.filterEvidence(flowData.evidence.getAll());

    for (const key in evidences) {
      output += '<tr>';
      output += '<td>' + key + '</td>';
      output += '<td>' + evidences[key] + '</td>';
      output += '</>';
    }
    output += '</table>';
    output += '</div>';

    output += '<div id=description></div>';
    output += '<div id="content">';
    output += '<p>';
    output += '<strong>Detection results:</strong></br></br>';
    output += '<b>Hardware Vendor:</b> ' + getValueHelper(flowData, 'hardwarevendor');
    output += '<br />';
    output += '<b>Hardware Name:</b> ' + getValueHelper(flowData, 'hardwarename');
    output += '<br />';
    output += '<b>Device Type:</b> ' + getValueHelper(flowData, 'devicetype');
    output += '<br />';
    output += '<b>Platform Vendor:</b> ' + getValueHelper(flowData, 'platformvendor');
    output += '<br />';
    output += '<b>Platform Name:</b> ' + getValueHelper(flowData, 'platformname');
    output += '<br />';
    output += '<b>Platform Version:</b> ' + getValueHelper(flowData, 'platformversion');
    output += '<br />';
    output += '<b>Browser Vendor:</b> ' + getValueHelper(flowData, 'browservendor');
    output += '<br />';
    output += '<b>Browser Name:</b> ' + getValueHelper(flowData, 'browsername');
    output += '<br />';
    output += '<b>Browser Version:</b> ' + getValueHelper(flowData, 'browserversion');
    output += '<br /></div>';

    res.end(output);
  });
});

// Don't run the server if under TEST
if (process.env.JEST_WORKER_ID === undefined) {
  setPipeline(null);
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
