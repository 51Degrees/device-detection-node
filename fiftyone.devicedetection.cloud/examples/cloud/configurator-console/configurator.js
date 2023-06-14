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
This example is displayed at the end of the [Configurator](https://configure.51degrees.com/)
process, which is used to create resource keys for use with the 51Degrees cloud service.

It shows how to call the cloud with the newly created key and how to access the values
of the selected properties.

See [Getting Started](https://51degrees.com/documentation/_examples__device_detection__getting_started__console__cloud.html)
for a fuller example.

Required npm Dependencies:
- fiftyone.devicedetection
*/
const path = require('path');

const DeviceDetectionCloudPipelineBuilder =
  require(path.join(__dirname, '/../../../deviceDetectionCloudPipelineBuilder'));
const ExampleUtils = require(path.join(__dirname, '/../exampleUtils'));

const run = async function (resourceKey, output) {
  // The pipeline should be managed as a singleton. Creating a pipeline instance for every request
  // will cause extreme resource problems.
  const pipeline = new DeviceDetectionCloudPipelineBuilder({
    resourceKey,
    // inhibit sharing usage for this test, usually this should be set 'true'.
    shareUsage: false
  }).build();

  // To monitor the pipeline we can put in listeners for various log events.
  // Valid types are info, debug, warn, error
  pipeline.on('error', console.error);

  // Get a flow data from the singleton pipeline for each detection
  const data = pipeline.createFlowData();

  // Add the evidence values to the flow data
  data.evidence.add(
    'header.user-agent',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/98.0.4758.102 Safari/537.36');
  data.evidence.add(
    'header.sec-ch-ua-mobile',
    '?0');
  data.evidence.add(
    'header.sec-ch-ua',
    '" Not A; Brand";v="99", "Chromium";v="98", ' +
    '"Google Chrome";v="98"');
  data.evidence.add(
    'header.sec-ch-ua-platform',
    '"Windows"');
  data.evidence.add(
    'header.sec-ch-ua-platform-version',
    '"14.0.0"');

  // Process the flow data.
  await data.process();

  // Get the results.
  const device = data.device;

  output.write(`device.ismobile: ${device.ismobile.value}\n`);
};

// Don't run the server if under TEST
if (process.env.JEST_WORKER_ID === undefined) {
  const args = process.argv.slice(2);
  // Use the supplied resource key or try to obtain one from the environment variable.
  const resourceKey = args.length > 0 ? args[0] : process.env[ExampleUtils.RESOURCE_KEY_ENV_VAR];

  // If we don't have a resource key then log an error
  if (!resourceKey) {
    console.log(
      'No resource key specified on the command line or in the environment variable ' +
      `'${ExampleUtils.RESOURCE_KEY_ENV_VAR}'. The 51Degrees cloud service is accessed ` +
      'using a \'ResourceKey\'. For more information see ' +
      'https://51degrees.com/documentation/_info__resource_keys.html. A resource key with the ' +
      'properties required by this example can be created for free at ' +
      'https://configure.51degrees.com/g3gMZdPY. Once complete, populate the config file or ' +
      'environment variable mentioned at the start of this message with the key.');
  } else {
    run(resourceKey, process.stdout);
  }
};

module.exports = {
  run
};
