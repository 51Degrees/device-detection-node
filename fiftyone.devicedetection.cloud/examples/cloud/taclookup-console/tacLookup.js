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
 * @example cloud/taclookup-console/tacLookup.js
 *
 * This example shows how to use the 51Degrees Cloud service to lookup the details of a device
 * based on a given 'TAC'. More background information on TACs can be found through various online
 * sources such as <a href="https://en.wikipedia.org/wiki/Type_Allocation_Code">Wikipedia</a>.
 *
 * This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.cloud/examples/cloud/taclookup-console/tacLookup.js).
 *
 * Required npm Dependencies:
 * - fiftyone.pipeline.cloudrequestengine
 * - fiftyone.pipeline.core
 * - fiftyone.pipeline.engines
 * - fiftyone.pipeline.engines.fiftyone
 * - fiftyone.devicedetection.cloud
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

const { PipelineBuilder } = require('fiftyone.pipeline.core');

const ExampleUtils = require(path.join(__dirname, '/../exampleUtils'));

const OptionsExtension =
  require51('fiftyone.devicedetection.shared').optionsExtension;

const DataExtension =
  require51('fiftyone.devicedetection.shared').dataExtension;

const constants = require(path.join(__dirname, '/../../../constants.js'));

const analyseTac = async function (tac, pipeline, output) {
  // Create a flowdata instance.
  const flowData = pipeline.createFlowData();

  // After creating a flowdata instance, add the TAC as evidence.
  flowData.evidence.add(constants.EVIDENCE_QUERY_TAC_KEY, tac);

  await flowData.process();

  output.write(`Which devices are associated with the TAC '${tac}'?\n`);
  // The result is an array containing the details of any devices that match
  // the specified TAC.
  // The code in this example iterates through this array, outputting the
  // vendor and model name of each matching device.
  flowData.hardware.profiles.forEach(profile => {
    const hardwareVendor = DataExtension.getValueHelper(profile, 'hardwarevendor');
    const hardwareName = DataExtension.getValueHelper(profile, 'hardwarename');
    const hardwareModel = DataExtension.getValueHelper(profile, 'hardwaremodel');

    output.write(`\t${hardwareVendor} ${hardwareName} (${hardwareModel})\n`);
  });
};

const run = async function (options, output) {
  const resourceKey = OptionsExtension.getResourceKey(options);
  // If we don't have a resource key then log an error
  if (!resourceKey) {
    console.error(
      'No resource key specified in the configuration file ' +
      '\'51d.json\' or the environment variable ' +
      `'${ExampleUtils.RESOURCE_KEY_ENV_VAR}'. The 51Degrees cloud ` +
      'service is accessed using a \'ResourceKey\'. For more information ' +
      'see ' +
      'https://51degrees.com/documentation/_info__resource_keys.html. ' +
      'TAC lookup is not available as a free service. This means that ' +
      'you will first need a license key, which can be purchased from our ' +
      'pricing page: https://51degrees.com/pricing. Once this is done, a resource ' +
      'key with the properties required by this example can be created at ' +
      'https://configure.51degrees.com/QKyYH5XT. You can now populate the ' +
      'environment variable mentioned at the start of this message with the ' +
      'resource key or pass it as the first argument on the command line.'
    );
    return;
  }

  output.write('This example shows the details of devices ' +
    'associated with a given \'Type Allocation Code\' or \'TAC\'.\n');
  output.write('More background information on TACs can be ' +
    'found through various online sources such as Wikipedia: ' +
    'https://en.wikipedia.org/wiki/Type_Allocation_Code\n');
  output.write('----------------------------------------\n');

  // In this example, we use the FiftyOnePipelineBuilder and configure it from a file.
  // For a demonstration of how to do this in code instead, see the
  // NativeModelLookup example.
  // For more information about builders in general see the documentation at
  // https://51degrees.com/documentation/_concepts__configuration__builders__index.html
  const pipeline = new PipelineBuilder().buildFromConfiguration(options);

  // To monitor the pipeline we can put in listeners for various log events.
  // Valid types are info, debug, warn, error
  pipeline.on('error', console.error);

  const tac1 = '35925406';
  const tac2 = '86386802';

  analyseTac(tac1, pipeline, output);
  analyseTac(tac2, pipeline, output);
};

// Don't run the server if under TEST
if (process.env.JEST_WORKER_ID === undefined) {
  const args = process.argv.slice(2);
  // Use the supplied resource key or try to obtain one
  // from the environment variable.
  const resourceKey = args.length > 0 ? args[0] : process.env[ExampleUtils.RESOURCE_KEY_ENV_VAR];

  // Load the configuration from a config file to a JSON object.
  const options = JSON.parse(fs.readFileSync('51d.json'), 'utf8');

  const resourceKeyFromConfig = OptionsExtension.getResourceKey(options);
  if (!resourceKeyFromConfig || resourceKeyFromConfig.startsWith('!!')) {
    OptionsExtension.setResourceKey(options, resourceKey);
  }

  run(options, process.stdout);
};

module.exports = {
  run
};
