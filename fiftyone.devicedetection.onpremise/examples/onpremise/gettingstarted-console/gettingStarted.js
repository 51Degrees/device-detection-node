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
@example onpremise/gettingstarted-console/gettingStarted.js

@include{doc} example-getting-started-onpremise.txt

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.onpremise/examples/onpremise/gettingstarted-console/gettingStarted.js).

@include{doc} example-require-datafile.txt

Required npm Dependencies:
- fiftyone.pipeline.core
- fiftyone.pipeline.engines
- fiftyone.pipeline.engines.fiftyone
- fiftyone.devicedetection.onpremise
*/

const path = require('path');
const DeviceDetectionOnPremisePipelineBuilder =
  require(path.join(__dirname, '/../../../deviceDetectionOnPremisePipelineBuilder'));

const ExampleUtils = require(path.join(__dirname, '/../exampleUtils')).ExampleUtils;
const DataExtension = require('fiftyone.devicedetection.shared').dataExtension;
const exampleConstants = require('fiftyone.devicedetection.shared').exampleConstants;

// In this example, by default, the 51degrees "Lite" file needs to be in the
// fiftyone.devicedetection.onpremise/device-detection-cxx/device-detection-data,
// or you may specify another file as a command line parameter.
//
// Note that the Lite data file is only used for illustration, and has
// limited accuracy and capabilities.
// Find out about the Enterprise data file on our pricing page:
// https://51degrees.com/pricing
const LITE_V_4_1_HASH = '51Degrees-LiteV4.1.hash';

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

const run = async function (dataFile, output) {
  // In this example, we use the DeviceDetectionOnPremisePipelineBuilder
  // and configure it in code. For more information about
  // pipelines in general see the documentation at
  // https://51degrees.com/documentation/_concepts__configuration__builders__index.html
  const pipeline = new DeviceDetectionOnPremisePipelineBuilder({
    dataFile,
    // We use the low memory profile as its performance is
    // sufficient for this example. See the documentation for
    // more detail on this and other configuration options:
    // https://51degrees.com/documentation/_device_detection__features__performance_options.html
    // https://51degrees.com/documentation/_features__automatic_datafile_updates.html
    // https://51degrees.com/documentation/_features__usage_sharing.html
    performanceProfile: 'LowMemory',
    // inhibit sharing usage for this test, usually this
    // should be set 'true'
    shareUsage: false,
    // inhibit auto-update of the data file for this test
    autoUpdate: false,
    updateOnStart: false,
    fileSystemWatcher: false
  }).build();

  // carry out some sample detections
  for (const values of exampleConstants.defaultEvidenceValues) {
    await analyse(values, pipeline, output);
  }

  ExampleUtils.checkDataFile(pipeline, dataFile);
};

// Don't run the server if under TEST
if (process.env.JEST_WORKER_ID === undefined) {
  const args = process.argv.slice(2);
  // Use the supplied path for the data file or find the lite
  // file that is included in the repository.
  const dataFile = args.length > 0 ? args[0] : ExampleUtils.findFile(LITE_V_4_1_HASH);

  if (dataFile !== undefined) {
    run(dataFile, process.stdout);
  } else {
    console.error('Failed to find a device detection ' +
      'data file. Make sure the device-detection-data ' +
      'submodule has been updated by running ' +
      '`git submodule update --recursive`.');
  }
};

module.exports = {
  run
};
