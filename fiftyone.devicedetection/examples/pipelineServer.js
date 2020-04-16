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

const DeviceDetectionPipelineBuilder = require('../deviceDetectionPipelineBuilder');

// Create a new Pipeline. This will default to Cloud when no datafile
// argument is supplied.
const pipeline = new DeviceDetectionPipelineBuilder(
  {
    resourceKey: 'AQS5HKcy0uPi3zrv1kg',
    cacheSize: 100,
    // dataFile: (process.env.directory || __dirname) + "/../device-detection-cxx/device-detection-data/51Degrees-LiteV4.1.hash",
    licenceKeys: 'YOUR_LICENSE_KEY'
  }
).build();

pipeline.on('error', function (message) {
  console.log(message);
});

const http = require('http');
const port = 3003;

// Create a localhost server to return IsMobile responses when
// a user connects.
const server = http.createServer((req, res) => {
  // Create the flow data element.
  const flowData = pipeline.createFlowData();
  // Add the evidence from the request headers
  flowData.evidence.addFromRequest(req);
  // Process the evidence and output the result.
  flowData.process().then(function () {
    let response = '';
    response += '<script>' + flowData.get('javascript').get('javascript') + '</script>';
    response += flowData.get('device').get('ismobile').toString();
    res.end(response);
  });
});

server.listen(port);
console.log('Server listening on port: ' + port);
