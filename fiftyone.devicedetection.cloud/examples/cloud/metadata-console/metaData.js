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
@example cloud/metadata-console/metaData.js

The cloud service exposes meta data that can provide additional information about the various
properties that might be returned.
This example shows how to access this data and display the values available.

A list of the properties will be displayed, along with some additional information about each
property. Note that this is the list of properties used by the supplied resource key, rather
than all properties that can be returned by the cloud service.

In addition, the evidence keys that are accepted by the service are listed. These are the
keys that, when added to the evidence collection in flow data, could have some impact on the
result that is returned.

Bear in mind that this is a list of ALL evidence keys accepted by all products offered by the
cloud. If you are only using a single product (for example - device detection) then not all
of these keys will be relevant.

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.cloud/examples/cloud/metadata-console/metaData.js).

@include{doc} example-require-resourcekey.txt

Required npm Dependencies:
- fiftyone.pipeline.cloudrequestengine
- fiftyone.pipeline.core
- fiftyone.pipeline.engines
- fiftyone.pipeline.engines.fiftyone
- fiftyone.devicedetection.cloud

 */

const path = require('path');
const ExampleUtils = require(path.join(__dirname, '/../exampleUtils'));

const DeviceDetectionCloudPipelineBuilder =
  require((process.env.directory || __dirname) +
    '/../../../deviceDetectionCloudPipelineBuilder');

const outputProperties = function (engine, output) {
  for (let property in engine.properties) {
    property = engine.properties[property];
    output.write(`Property - ${property.name}`);
    output.write(`[Category: ${property.category}] (${property.type})\n`);
  }
};

const outputEvidenceKeyDetails = function (engine, output) {
  output.write('\n');
  output.write('Accepted evidence keys:\n');
  for (const evidence of engine.evidenceKeyFilter.list) {
    output.write(`\t${evidence}\n`);
  }
};

const run = async function (resourceKey, output) {
  const pipeline = new DeviceDetectionCloudPipelineBuilder({
    resourceKey
  }).build();

  const device = pipeline.getElement('device');
  device.ready().then(function () {
    outputProperties(device, output);
    // We use the CloudRequestEngine to get evidence key details, rather than the
    // DeviceDetectionCloud.
    // This is because the DeviceDetectionCloud doesn't actually make use
    // of any evidence values. It simply processes the JSON that is returned
    // by the call to the cloud service that is made by the CloudRequestEngine.
    // The CloudRequestEngine is actually taking the evidence values and passing
    // them to the cloud, so that's the engine we want the keys from.
    outputEvidenceKeyDetails(pipeline.getElement('cloud'), output);
  }).catch(function (error) {
    throw error;
  });
};

// Don't run the server if under TEST
if (process.env.JEST_WORKER_ID === undefined) {
  const args = process.argv.slice(2);
  // Use the supplied resource key or try to obtain one
  // from the environment variable.
  const resourceKey = args.length > 0 ? args[0] : process.env[ExampleUtils.RESOURCE_KEY_ENV_VAR];

  if (resourceKey) {
    run(resourceKey, process.stdout);
  } else {
    console.error('No resource key specified on the command line or in the ' +
    `the environment variable '${ExampleUtils.RESOURCE_KEY_ENV_VAR}'. ` +
    'The 51Degrees cloud service is accessed using a \'ResourceKey\'. ' +
    'For more information ' +
    'see https://51degrees.com/documentation/_info__resource_keys.html. ' +
    'Native model lookup is not available as a free service. This means that ' +
    'you will first need a license key, which can be purchased from our ' +
    'pricing page: https://51degrees.com/pricing. Once this is done, a resource ' +
    'key with the properties required by this example can be created at ' +
    'https://configure.51degrees.com/1QWJwHxl. You can now populate the ' +
    'environment variable mentioned at the start of this message with the ' +
    'resource key or pass it as the first argument on the command line.');
  }
};

module.exports = {
  run
};
