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

const DDPipelineBuilder = require('../deviceDetectionPipelineBuilder');
const fs = require('fs');

// Create a new Device Detection pipeline and set the config.
// Not supplying a dataFile will default the implementation to use our Cloud service.
const pipeline = new DDPipelineBuilder({
  performanceProfile: 'MaxPerformance',
  dataFile: '../device-detection-cxx/device-detection-data/51Degrees-LiteV4.1.hash',
  autoUpdate: false
}).build();

pipeline.on('error', console.error);

// Read from a list of 20000 User Agents.
let userAgents = fs.readFileSync('../device-detection-cxx/device-detection-data/20000 User Agents.csv', 'utf8');

userAgents = userAgents.split('\n');

const test = function (userAgent) {
  return new Promise(function (resolve) {
    // Create the flow data element
    const flowData = pipeline.createFlowData();

    flowData.process().then(function (flowData) {
      // Add User-Agent header evidence for processing
      flowData.evidence.add('header.user-agent', userAgent);
      // Retrieve IsMobile device information from the pipeline
      resolve(flowData.device.ismobile);
    });
  });
};

const tests = [];

userAgents.forEach(function (userAgent) {
  tests.push(test(userAgent));
});

// return the time it took to match all User-Agents
console.time('performance');

Promise.all(tests).then(function (params) {
  console.timeEnd('performance');
});
