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
@example cloud/gettingstarted-console/gettingStarted.js
@include{doc} example-getting-started-cloud.txt
This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.cloud/examples/cloud/gettingstarted-console/gettingStarted.js).
@include{doc} example-require-resourcekey.txt

Required npm Dependencies:
- fiftyone.pipeline.cloudrequestengine
- fiftyone.pipeline.core
- fiftyone.pipeline.engines
- fiftyone.pipeline.engines.fiftyone
- fiftyone.devicedetection.cloud

## Configuration
@include 51d.json
*/

const path = require('path');
const fs = require('fs');

const { PipelineBuilder } = require('fiftyone.pipeline.core');

const ExampleUtils = require(path.join(__dirname, '/../exampleUtils'));
const exampleConstants = require('fiftyone.devicedetection.shared').exampleConstants;
const OptionsExtension = require('fiftyone.devicedetection.shared').optionsExtension;
const DataExtension = require('fiftyone.devicedetection.shared').dataExtension;

const outputValue = function (name, value) {
  // Individual result values have a wrapper called
  // `AspectPropertyValue`. This functions similarly to
  // a null-able type.
  // If the value has not been set then trying to access the
  // `value` property will throw an exception.
  // `AspectPropertyValue` also includes the `noValueMessage`
  // property, which describes why the value has not been set.
  return `\n\t${name}: ${value}`;
};

const analyse = async function (evidence, pipeline, output) {
  // FlowData is a data structure that is used to convey
  // information required for detection and the results of the
  // detection through the pipeline.
  // Information required for detection is called "evidence"
  // and usually consists of a number of HTTP Header field
  // values, in this case represented by a
  // Object of header name/value entries.

  // list the evidence
  let message = 'Input values:';
  for (const [key, value] of evidence) {
    message += `\n\t${key}: ${value}`;
  }
  output.write(message + '\n');

  const data = pipeline.createFlowData();

  // Add the evidence values to the flow data
  evidence.forEach((value, key, map) => {
    data.evidence.add(key, value);
  });

  await data.process();

  message = 'Results:';
  // Now that it's been processed, the flow data will have
  // been populated with the result. In this case, we want
  // information about the device, which we can get by
  // asking for the 'device' data.
  const device = data.device;

  // Display the results of the detection, which are called
  // device properties. See the property dictionary at
  // https://51degrees.com/developers/property-dictionary
  // for details of all available properties.
  message += outputValue('Mobile Device', DataExtension.getValueHelper(device, 'ismobile'));
  message += outputValue('Platform Name', DataExtension.getValueHelper(device, 'platformname'));
  message += outputValue('Platform Version', DataExtension.getValueHelper(device, 'platformversion'));
  message += outputValue('Browser Name', DataExtension.getValueHelper(device, 'browsername'));
  message += outputValue('Browser Version', DataExtension.getValueHelper(device, 'browserversion'));
  message += '\n\n';
  output.write(message);
};

const run = async function (options, output) {
  const resourceKey = OptionsExtension.getResourceKey(options);
  // If we don't have a resource key then log an error
  if (!resourceKey) {
    console.log(
      'No resource key specified in the configuration file ' +
      '\'51d.json\' or the environment variable ' +
      `'${ExampleUtils.RESOURCE_KEY_ENV_VAR}'. The 51Degrees cloud ` +
      'service is accessed using a \'ResourceKey\'. For more information ' +
      'see ' +
      'https://51degrees.com/documentation/_info__resource_keys.html. ' +
      'A resource key with the properties required by this example can be ' +
      'created for free at https://configure.51degrees.com/g3gMZdPY. ' +
      'Once complete, populate the config file or environment variable ' +
      'mentioned at the start of this message with the key.'
    );
    return;
  }

  const pipeline = new PipelineBuilder().buildFromConfiguration(options);

  // To monitor the pipeline we can put in listeners for various log events.
  // Valid types are info, debug, warn, error
  pipeline.on('error', console.error);

  // carry out some sample detections
  for (const values of exampleConstants.defaultEvidenceValues) {
    await analyse(values, pipeline, output);
  }
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
