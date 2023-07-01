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

const argv = process.argv.slice(2);
const perfProfile = argv[0] || 'MaxPerformance';

const pipeline = new DeviceDetectionOnPremisePipelineBuilder({
  performanceProfile: perfProfile,
  dataFile: datafile,
  autoUpdate: false,
  shareUsage: false
}).build();

// Logging of errors and other messages.
// Valid logs types are info, debug, warn, error
pipeline.on('error', console.error);

const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/calibrate')) {
    res.end('calibrate');
  } else {
    const flowData = pipeline.createFlowData();

    // Add any information from the request
    // (headers, cookies and additional client side provided information)
    flowData.evidence.addFromRequest(req);

    flowData.process().then(function () {
      res.statusCode = 200;

      // To get a more acurate list of hardware names,
      // we need to run some client side javascript code.
      // At first this will populate a large list which will
      // get smaller following new client side evidence.
      res.setHeader('Content-Type', 'text/html');

      const output = `
            <p id=ismobile></p>
            <script>
            window.onload = function(){
              fod.complete(function (data) {
                    document.getElementById('ismobile').innerHTML = "<strong>Pixel width: " + data.device.ismobile + "</strong>"
                  });
            }
            </script>
            `;

      res.end(output);
    });
  }
});

const port = 3000;
server.listen(port);
console.log('Server listening on port: ' + port);
