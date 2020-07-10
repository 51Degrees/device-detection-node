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

/**
@example hash/configureFromFile.js

@include{doc} example-configure-from-file-hash.txt

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection/examples/hash/configureFromFile.js).

@include{doc} example-require-datafile.txt

The configuration file used here is:

@include hash/51d.json

Expected output:

Is user agent Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36 a mobile? false

Is user agent Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114 a mobile? true

 */

// First we require the fiftyone.pipeline.core library's
// PipelineBuilder element. We use its buildFromConfigurationFile
// method to build a pipeline with the Engines and parameters
const PipelineBuilder = require('fiftyone.pipeline.core').PipelineBuilder;

// Create a new pipeline from the supplied config file.
const pipeline = new PipelineBuilder().buildFromConfigurationFile('51d.json');

// To monitor the pipeline we can put in listeners for various log events.
// Valid types are info, debug, warn, error
pipeline.on('error', console.error);

// Here we make a function that gets a userAgent as evidence
// and uses the Device Detection Engine to detect if it is a mobile or not
const checkIfMobile = async function (userAgent) {
  // Create a FlowData element
  // This is used to add evidence and process it through the
  // FlowElements in the Pipeline.
  const flowData = pipeline.createFlowData();

  // Add the User-Agent as evidence
  flowData.evidence.add('header.http_user-agent', userAgent);

  // Run process on the flowData (this returns a promise)
  await flowData.process();

  // Check the ismobile property
  // this returns an AspectPropertyValue wrapper
  // letting you check if a value is set and if not why not
  const ismobile = flowData.device.ismobile;

  if (ismobile.hasValue) {
    console.log(`Is user agent ${userAgent} a mobile? ${ismobile.value}`);
  } else {
    // Echo out why the value isn't meaningful
    console.log(ismobile.noValueMessage);
  }
};

const desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36';
const iPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114';

checkIfMobile(desktopUA);
checkIfMobile(iPhoneUA);
