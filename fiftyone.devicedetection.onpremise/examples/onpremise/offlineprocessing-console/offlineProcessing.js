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
 * @example onpremise/offlineprocessing-console/offlineProcessing.js
 *
 * Provides an example of processing a YAML file containing evidence for device detection.
 * There are 20,000 examples in the supplied file of evidence representing HTTP Headers.
 * For example:
 *
 * ```
 * header.user - agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36'
 * header.sec - ch - ua: '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"'
 * header.sec - ch - ua - full - version: '"98.0.4758.87"'
 * header.sec - ch - ua - mobile: '?0'
 * header.sec - ch - ua - platform: '"Android"'
 * ```
 *
 * We create a device detection pipeline to read the data and find out about the associated device,
 * we write this data to a YAML formatted output stream.
 *
 * As well as explaining the basic operation of off line processing using the defaults, for
 * advanced operation this example can be used to experiment with tuning device detection for
 * performance and predictive power using Performance Profile, Graph and Difference and Drift
 * settings.
 *
 * This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.onpremise/examples/onpremise/offlineprocessing-console/offlineProcessing.js).
 *
 * Required npm Dependencies:
 * - fiftyone.pipeline.core
 * - fiftyone.pipeline.engines
 * - fiftyone.pipeline.engines.fiftyone
 * - fiftyone.devicedetection.onpremise
 */

const LineReader = require('n-readlines');
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

const DataExtension = require51('fiftyone.devicedetection.shared').dataExtension;

// In this example, by default, the 51degrees "Lite" file needs to be somewhere in the
// project space, or you may specify another file as a command line parameter.
//
// Note that the Lite data file is only used for illustration, and has limited accuracy
// and capabilities. Find out about the Enterprise data file on our pricing page:
// https://51degrees.com/pricing
const LITE_V_4_1_HASH = '51Degrees-LiteV4.1.hash';
// This file contains the 20,000 most commonly seen combinations of header values
// that are relevant to device detection. For example, User-Agent and UA-CH headers.
const EVIDENCE = '20000 Evidence Records.yml';

// Check if files exists
const fs = require('fs');
const yaml = require('js-yaml');

const analyzeEvidence = async function (evidence, pipeline, outputFile, outputFunc) {
  // FlowData is a data structure that is used to convey
  // information required for detection and the results of the
  // detection through the pipeline.
  // Information required for detection is called "evidence"
  // and usually consists of a number of HTTP Header field
  // values, in this case represented by a
  // Object of header name/value entries.
  const data = pipeline.createFlowData();
  const document = {};

  // Add the evidence values to the output and add it to output object
  // at the same time
  for (const [key, value] of Object.entries(evidence)) {
    data.evidence.add(key, value.toString());
    document[key] = value;
  }

  await data.process();

  // Now add the values that we want to store against the record.
  const device = data.device;
  document['device.ismobile'] = DataExtension.getValueHelper(device, 'ismobile');
  document['device.platformname'] = DataExtension.getValueHelper(device, 'platformname');
  document['device.platformversion'] = DataExtension.getValueHelper(device, 'platformversion');
  document['device.browsername'] = DataExtension.getValueHelper(device, 'browsername');
  document['device.browserversion'] = DataExtension.getValueHelper(device, 'browserversion');
  // DeviceId is a unique identifier for the combination of hardware, operating
  // system, browser and crawler that has been detected.
  // Our device detection solution uses machine learning to find the optimal
  // way to identify devices based on the real-world evidence values that we
  // observe each day.
  // As this changes over time, the result of detection can potentially change
  // as well. By storing the device id, we can use this as a lookup in future
  // rather than performing detection with the original evidence again.
  // Do this by passing an evidence entry with:
  // key = query.51D_ProfileIds
  // value = [the device id]
  // This is much faster and avoids the potential for getting a different
  // result.
  document['device.deviceID'] = DataExtension.getValueHelper(device, 'deviceID');
  outputFunc(outputFile, yaml.dump(document));
};

const run = async function (dataFile, evidenceFile, outputFile, outputFunc) {
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
    //  Inhibit sharing usage for this example.
    // In general, off line processing usage should NOT be shared back to 51Degrees.
    // This is because it will not contain the full set of information that is
    // required by our data processing back-end and will be discarded.
    // If you specifically want to share data that is being processed off line
    // in order to help us improve detection of new devices/browsers/etc, then
    // this additional data will need to be collected and included as evidence
    // to the Pipeline. See
    // https://51degrees.com/documentation/_features__usage_sharing.html#Low_Level_Usage_Sharing
    // for more details on this.
    shareUsage: false,
    // inhibit auto-update of the data file for this test
    autoUpdate: false,
    updateOnStart: false,
    fileSystemWatcher: false
  }).build();

  // Create lines reader for the evidence file
  const liner = new LineReader(evidenceFile);
  let buffer, utf8Line, evidence;
  let records = 0;

  // Start reading evidence from file
  let document = '';
  while ((buffer = liner.next())) {
    utf8Line = buffer.toString('utf8').trim();
    if ((utf8Line.match(/^---/) || utf8Line.match(/^\.\.\./)) && document) {
      // Output progress
      records++;
      if (records % 1000 === 0) {
        console.log(`Processed ${records} records`);
      }

      // Write the yaml document separator
      outputFunc(outputFile, '---\n');

      // Load a yaml document
      evidence = yaml.load(document);
      await analyzeEvidence(evidence, pipeline, outputFile, outputFunc);

      // Stop processing if reach end of file
      if (utf8Line.match(/^\.\.\./)) {
        break;
      }

      // Move the document separator to the string buffer
      document = `${utf8Line}\n`;
    } else {
      document += `${utf8Line}\n`;
    }
  }
  // Write the yaml document end marker
  outputFunc(outputFile, '...\n');

  ExampleUtils.checkDataFile(pipeline, dataFile);

  console.log(`Processing complete. See results in: '${outputFile}'`);
};

// Don't run the server if under TEST
if (process.env.JEST_WORKER_ID === undefined) {
  const args = process.argv.slice(2);
  // Use the supplied path for the data file or find the lite
  // file that is included in the repository.
  const dataFile = args.length > 0 ? args[0] : ExampleUtils.findFile(LITE_V_4_1_HASH);
  // Do the same for the yaml evidence file
  const evidenceFile = args.length > 1 ? args[1] : ExampleUtils.findFile(EVIDENCE);
  // Finally, get the location for the output file. Use the same location as the
  // evidence if a path is not supplied on the command line.
  const outputFile = args.length > 2
    ? args[2]
    : path.join(path.dirname(path.resolve(evidenceFile)), 'offline-processing-output.yml');

  if (dataFile !== undefined) {
    // Create output file or overwrite the existing one
    fs.writeFileSync(outputFile, '');
    run(
      dataFile,
      evidenceFile,
      outputFile,
      (output, content) => { fs.appendFileSync(output, content); });
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
