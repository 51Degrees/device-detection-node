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
@example onpremise/matchmetrics-console/matchMetrics.js

The example illustrates the various metrics that can be obtained about the device detection
process, for example, the degree of certainty about the result. Running the example outputs
those properties and values.

The example also illustrates controlling properties that are returned from the detection
process - reducing the number of components required to return the properties requested reduces
the overall time taken.

There is a [discussion](https://51degrees.com/documentation/_device_detection__hash.html#DeviceDetection_Hash_DataSetProduction_Performance)
of metrics and controlling performance on our web site. See also the
[performance options](https://51degrees.com/documentation/_device_detection__features__performance_options.html)
page.

This example is available in full on
[GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.onpremise/examples/onpremise/matchmetrics-console/matchMetrics.js).
 */

const path = require('path');
const fs = require('fs');

const DeviceDetectionOnPremisePipelineBuilder =
  require((process.env.directory || __dirname) +
    '/../../../deviceDetectionOnPremisePipelineBuilder');

const ExampleUtils = require(path.join(__dirname, '/../exampleUtils')).ExampleUtils;
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

// Here we make a function that gets a userAgent as evidence and
// uses the Device Detection Engine to detect if it is a mobile or not
const displayMatchMetrics = async function (pipeline, output, evidenceValues) {
  // Create a FlowData element
  // This is used to add evidence and process it through the FlowElements in the Pipeline.
  const flowData = pipeline.createFlowData();

  // Add the evidence to set the values for user-agent, sec-ch-* headers, etc.
  evidenceValues.forEach((value, key, map) => {
    flowData.evidence.add(key, value);
  });

  // Run process on the flowData (this returns a promise)
  await flowData.process();

  const device = flowData.device;

  // list the evidence
  output.write('--- Compare evidence with what was matched ---\n\n');
  output.write('Evidence\n');

  // output the evidence in reverse value length order
  const sortedEvidence = ExampleUtils.sortMap(
    evidenceValues,
    (a, b) => { return a[1].length - b[1].length; });
  sortedEvidence.forEach((value, key, map) => {
    output.write(`\t${key.padEnd(34)}: ${value}\n`);
  });

  // Obtain the matched User-Agents: the matched substrings in the
  // User-Agents are separated with underscores - output in forward length order.
  output.write('Matches\n');
  device.userAgents.value.sort((a, b) => { return b.length - a.length; })
    .forEach((u) => { output.write(`\t${'Matched Chars'.padEnd(34)}: ${u}\n`); });

  output.write('\n');

  output.write('--- Listing all available properties, by component, by property name ---\n');
  output.write(`For a discussion of what the match properties mean, see: 
https://51degrees.com/documentation/_device_detection__hash.html#DeviceDetection_Hash_DataSetProduction_Performance\n`);

  // Get the properties available from the DeviceDetection engine.
  const availableProperties = Object.entries(device.flowElement.properties);

  // create a Map keyed on the component name of the properties available
  // components being hardware, browser, OS and Crawler.
  // There is also a additional 'Metrics' component, which is added for the match metrics.
  const componentMap = groupBy(
    // We've already handled the matched user agents property above so exclude it here.
    availableProperties.filter(p => p !== null && p[0] !== 'userAgents'),
    // We want to group on component name.
    p => p[1] == null || p[1].component == null ? 'Unknown' : p[1].component.name);

  // iterate the map created above
  componentMap.forEach((properties, componentName, map) => {
    output.write(`${componentName}\n`);
    properties.forEach(property => {
      // while we get the available properties and their metadata
      // from the pipeline ...
      const propertyName = property[0];
      const propertyDesc = property[1].description;
      // ... we get the values for the last detection from flowData
      const value = device[propertyName];

      // Output property names, values and descriptions.
      const valueText = value.hasValue ? value.value : `unknown (${value.noValueMessage})`;
      output.write(`\t${propertyName.padEnd(24)}: ${valueText}\n`);
      output.write(`\t\t${propertyDesc}\n`);
    });

    output.write('\n');
  });
};

const groupBy = function (list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

const findDataFile = function (dataFile, output) {
  // No filename specified use the default
  if (dataFile === null) {
    dataFile = LITE_V_4_1_HASH;
    output.write(`No filename specified. Using default '${dataFile}'\n`);
  }

  // Work out where the data file is if we don't have an absolute path.
  if (path.isAbsolute(dataFile) === false) {
    dataFile = ExampleUtils.findFile(dataFile);
  }

  if (dataFile === null || typeof dataFile === 'undefined' || fs.existsSync(dataFile) === false) {
    output.write(`Failed to find a device detection data file. If using the default 'lite'
 data file, make sure that git lfs is installed and that the device-detection-data
 submodule has been updated by running 'git submodule update --recursive'.\n`);
    throw new Error(`Data file '${dataFile}' not found`);
  }

  return dataFile;
};

const run = async function (dataFile, output, evidenceList) {
  dataFile = findDataFile(dataFile, output);

  // In this example, we use the DeviceDetectionOnPremisePipelineBuilder
  // and configure it in code. For more information about
  // pipelines in general see the documentation at
  // https://51degrees.com/documentation/_concepts__configuration__builders__index.html
  const pipeline = new DeviceDetectionOnPremisePipelineBuilder({
    dataFile,
    // Prefer low memory profile where all data streamed from disk on-demand.
    performanceProfile: 'LowMemory',
    // Disable share usage for this example.
    shareUsage: false,
    // inhibit auto-update of the data file for this test
    autoUpdate: false,
    updateOnStart: false,
    fileSystemWatcher: false,
    // You can improve matching performance by specifying only those properties you wish to use.
    // If you don't specify any properties you will get all those available in the data file tier
    // that you have used. The free "Lite" tier contains fewer than 20. Since we are specifying
    // properties here, we will only see those properties, along with the match metric properties
    // in the output.
    //
    // If using the full on-premise data file the hardwarename property will be present in the
    // data file. See https://51degrees.com/pricing
    //
    // The 'ismobile' and 'hardwarename' properties are both part of the 'hardware' component.
    // The remaining properties are from match metrics.
    // Uncomment 'browsername' to include Browser component as well. This can be seen by looking
    // for the browser profile ID in the device ID value.
    restrictedProperties: ['ismobile', 'hardwarename', 'userAgents', 'deviceID', 'difference', 'method', 'matchedNodes', 'drift', 'iterations'], /* , 'browsername' */
    // Only use the predictive graph to better handle variances between the training data and the
    // target User-Agent string. For a more detailed description of the differences between
    // performance and predictive, see
    // https://51degrees.com/documentation/_device_detection__hash.html#DeviceDetection_Hash_DataSetProduction_Performance
    usePredictiveGraph: true,
    usePerformanceGraph: false,
    // We want to show the matching evidence characters as part of this example, so we have to set
    // this flag to true.
    updateMatchedUserAgent: true
  }).build();

  // To monitor the pipeline we can put in listeners for various log events.
  // Valid types are info, debug, warn, error
  pipeline.on('error', console.error);

  ExampleUtils.checkDataFile(pipeline, dataFile);

  // carry out some sample detections
  for (const evidenceValues of evidenceList) {
    await displayMatchMetrics(pipeline, output, evidenceValues);
  }
};

// Don't run the server if under TEST
if (process.env.JEST_WORKER_ID === undefined) {
  const args = process.argv.slice(2);
  // Use the data file location supplied on the command line. The logic within the run function
  // will handle null values and finding the file is a relative path is supplied.
  const dataFile = args.length > 0 ? args[0] : null;

  // Just take the third entry from the default evidence values.
  run(dataFile, process.stdout, exampleConstants.defaultEvidenceValues.slice(2, 3));
};

module.exports = {
  run
};
