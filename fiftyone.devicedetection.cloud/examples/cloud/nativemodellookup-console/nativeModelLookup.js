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
@example cloud/nativemodellookup-console/nativeModelLookup.js

This example shows how to use the 51Degrees Cloud service to lookup the details of a device
based on a given 'native model name'. Native model name is a string of characters that are
returned from a query to the device's OS.
There are different mechanisms to get native model names for
[Android devices](https://developer.android.com/reference/android/os/Build#MODEL) and
[iOS devices](https://gist.github.com/soapyigu/c99e1f45553070726f14c1bb0a54053b#file-machinename-swift)

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.cloud/examples/cloud/nativemodellookup-console/nativeModelLookup.js).

@include{doc} example-require-resourcekey.txt

Required npm Dependencies:
- fiftyone.pipeline.cloudrequestengine
- fiftyone.pipeline.core
- fiftyone.pipeline.engines
- fiftyone.pipeline.engines.fiftyone
- fiftyone.devicedetection.cloud

*/

const path = require('path');
// Require the core Pipeline and Cloud Request Engine
const pipelineCore = require('fiftyone.pipeline.core');
const CloudRequestEngine = require('fiftyone.pipeline.cloudrequestengine');
// Note that this example is designed to be run from within the
// device detection code base. If this code has been copied to run
// standalone then you'll need to replace the require below with the
// commented out version below it.
const HardwareProfileCloudEngine = require((process.env.directory || __dirname) +
  '/../../../hardwareProfileCloudEngine');

const ExampleUtils = require(path.join(__dirname, '/../exampleUtils'));

const constants = require(path.join(__dirname, '/../../../constants.js'));

const DataExtension = require('fiftyone.devicedetection.shared').dataExtension;

const analyseNativeModel = async function (nativemodel, pipeline, output) {
  // Create a flow data instance.
  const flowData = pipeline.createFlowData();

  // After creating a flowdata instance, add the native model name as evidence.
  flowData.evidence.add(constants.EVIDENCE_QUERY_NATIVE_MODEL_KEY, nativemodel);

  await flowData.process();
  output.write('Which devices are associated with the native model name ' +
  `'${nativemodel}'?\n`);

  // The result is an array containing the details of any devices that match
  // the specified native model name.
  // The code in this example iterates through this array, outputting the
  // vendor and model of each matching device.
  flowData.hardware.profiles.forEach(profile => {
    const hardwareVendor = DataExtension.getValueHelper(profile, 'hardwarevendor');
    const hardwareName = DataExtension.getValueHelper(profile, 'hardwarename');
    const hardwareModel = DataExtension.getValueHelper(profile, 'hardwaremodel');

    output.write(`\t${hardwareVendor} ${hardwareName} (${hardwareModel})\n`);
  });
};

const run = async function (resourceKey, output) {
  output.write('This example finds the details of devices from the ' +
    '\'native model name\'.\n');
  output.write('The native model name can be retrieved by code running ' +
    'on the device (For example, a mobile app).\n');
  output.write('For Android devices, see ' +
    'https://developer.android.com/reference/android/os/Build#MODEL\n');
  output.write('For iOS devices, see ' +
    'https://gist.github.com/soapyigu/c99e1f45553070726f14c1bb0a54053b#file-machinename-swift\n');
  output.write('----------------------------------------\n');

  // This example creates the pipeline and engines in code. For a demonstration
  // of how to do this using a configuration file instead, see the TacLookup example.
  // For more information about builders in general see the documentation at
  // https://51degrees.com/documentation/_concepts__configuration__builders__index.html
  const requestEngineInstance = new CloudRequestEngine.CloudRequestEngine({
    resourceKey
  });

  // Create the hardware profile engine to process the response from the
  // request engine.
  const hardwareProfileCloudEngineInstance = new HardwareProfileCloudEngine();

  // Create the pipeline using the engines.
  const PipelineBuilder = pipelineCore.PipelineBuilder;
  const pipeline = new PipelineBuilder()
    .add(requestEngineInstance)
    .add(hardwareProfileCloudEngineInstance)
    .build();

  // Logging of errors and other messages. Valid logs types are info, debug,
  // warn, error
  pipeline.on('error', console.error);

  const nativeModelAndroid = 'SC-03L';
  const nativeModeliOS = 'iPhone11,8';

  await analyseNativeModel(nativeModelAndroid, pipeline, output);
  await analyseNativeModel(nativeModeliOS, pipeline, output);
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
    'https://configure.51degrees.com/QKyYH5XT. You can now populate the ' +
    'environment variable mentioned at the start of this message with the ' +
    'resource key or pass it as the first argument on the command line.');
  }
};

module.exports = {
  run
};
