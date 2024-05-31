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
 * @example onpremise/metadata-console/metaData.js
 *
 * The device detection data file contains meta data that can provide additional information
 * about the various records in the data model.
 * This example shows how to access this data and display the values available.
 *
 * To help navigate the data, it's useful to have an understanding of the types of records that
 * are present:
 * - Component - A record relating to a major aspect of the entity making a web request. There are currently 4 components: Hardware, Software Platform (OS), Browser and Crawler.
 * - Profile - A record containing the details for a specific instance of a component. An example of a hardware profile would be the profile for the iPhone 13. An example of a platform profile would be Android 12.1.0.
 * - Property - Each property will have a specific value (or values) for each profile. An example of a hardware property is 'IsMobile'. An example of a browser property is 'BrowserName'.
 *
 * The example will output each component in turn, with a list of the properties associated with
 * each component. Some of the possible values for each property are also displayed.
 * There are too many profiles to display, so we just list the number of profiles for each
 * component.
 *
 * Finally, the evidence keys that are accepted by device detection are listed. These are the
 * keys that, when added to the evidence collection in flow data, could have some impact on the
 * result returned by device detection.
 *
 * This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.onpremise/examples/onpremise/metadata-console/metaData.js).
 *
 * Required npm Dependencies:
 * - fiftyone.pipeline.core
 * - fiftyone.pipeline.engines
 * - fiftyone.pipeline.engines.fiftyone
 * - fiftyone.devicedetection.onpremise
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

const DeviceDetectionOnPremisePipelineBuilder =
  require51('fiftyone.devicedetection.onpremise').DeviceDetectionOnPremisePipelineBuilder;

const ExampleUtils = require(path.join(__dirname, '/../exampleUtils')).ExampleUtils;

// In this example, by default, the 51degrees "Lite" file needs to be in the
// fiftyone.devicedetection.onpremise/device-detection-cxx/device-detection-data,
// or you may specify another file as a command line parameter.
//
// Note that the Lite data file is only used for illustration, and has
// limited accuracy and capabilities.
// Find out about the Enterprise data file on our pricing page:
// https://51degrees.com/pricing
const LITE_V_4_1_HASH = '51Degrees-LiteV4.1.hash';

const truncateToNl = function (string) {
  const lines = string.split('\n');
  let result = '';
  let i = 0;
  for (; i < lines.length; i++) {
    if (lines[i]) {
      result = lines[i];
      break;
    }
  }

  if (i < lines.length) {
    result += ' ...';
  }
  return result;
};

const outputProperties = function (component, output) {
  const properties = component.getProperties();
  for (const property of properties) {
    output.write(`\x1b[31mProperty - ${property.name}\x1b[89m\x1b[0m\n`);
    output.write(
      `[Category: ${property.category}](${property.type} - ${property.description})\n`);

    if (property.category.toLowerCase() !== 'device metrics') {
      let valuesStr = 'Possible values: ';
      const values = property.getValues();
      let count = 0;
      for (const value of values) {
        // add value
        valuesStr += truncateToNl(value.getName());
        // add description if exists
        const description = value.getDescription();
        if (description) {
          valuesStr += `(${description})`;
        }
        valuesStr += ',';
        if (++count >= 20) {
          break;
        }
      }
      if (property.getNumberOfValues() > 20) {
        valuesStr += ` + ${property.getNumberOfValues() - 20} more ...`;
      }
      output.write(valuesStr);
      output.write('\n');
    }
  }
};

const outputComponents = function (engine, output) {
  const components = engine.components;
  for (const value of Object.values(components)) {
    output.write(`\x1b[34mComponent - ${value.name}\x1b[89m\x1b[0m\n`);
    outputProperties(value, output);
    output.write('\n');
  }
};

const outputProfileDetails = async function (engine, output) {
  const groups = {};
  let count = 0;

  output.write('\n');
  const profiles = engine.profiles();
  for (const profile of profiles) {
    if (!groups[profile.component.name]) {
      groups[profile.component.name] = 1;
    } else {
      groups[profile.component.name]++;
    }
    if (++count % 1000 === 0) {
      output.write(`Load ${count} profiles\r`);
    }
  }
  output.write(`Load completed: ${count} profiles\n`);
  output.write('Profile count:\n');
  for (const [key, value] of Object.entries(groups)) {
    output.write(`${key} Profiles: ${value}\n`);
  }
};

const outputEvidenceKeyDetails = async function (engine, output) {
  output.write('\n');
  output.write('Accepted evidence keys:\n');
  for (const evidence of engine.evidenceKeyFilter.list) {
    output.write(`\t${evidence}\n`);
  }
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

  const device = pipeline.getElement('device');
  await outputComponents(device, output);
  await outputProfileDetails(device, output);
  await outputEvidenceKeyDetails(device, output);

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
      '`git submodule update --recursive`. By default, the \'lite\' file ' +
      'included with this code will be used. A different file can be ' +
      'specified by supplying the full path as a command line argument');
  }
};

module.exports = {
  run
};
