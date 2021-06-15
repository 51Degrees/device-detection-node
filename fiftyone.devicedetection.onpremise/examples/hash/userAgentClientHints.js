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
@example hash/userAgentClientHints.js

@include{doc} example-user-agent-client-hints.txt

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection.hash/examples/hash/userAgentClientHints.js).

@include{doc} example-require-datafile.txt

Expected output:

```
---------------------------------------
This example demonstrates detection using user-agent client hints.
The sec-ch-ua value can be used to determine the browser of the connecting device, but not other components such as the hardware.
We show this by first performing detection with sec-ch-ua only.
We then repeat with the user-agent header set as well. Note that the client hint takes priority over the user-agent.
Finally, we use both sec-ch-ua and user-agent.Note that sec-ch-ua takes priority over the user-agent for detection of the browser.
---------------------------------------

Sec-CH-UA = '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"'
User-Agent = 'NOT_SET'
        Browser = Chrome 89
        IsMobile = No matching profiles could be found for the supplied evidence.A 'best guess' can be returned by configuring more lenient matching rules.See https://51degrees.com/documentation/_device_detection__features__false_positive_control.html

Sec-CH-UA = 'NOT_SET'
User-Agent = 'Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36'
        Browser = Samsung Browser 10.1
        IsMobile = true

Sec-CH-UA = '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"'
User-Agent = 'Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36'
        Browser = Chrome 89
        IsMobile = true
```

 */

const DeviceDetectionOnPremisePipelineBuilder =
  require((process.env.directory || __dirname) +
  '/../../deviceDetectionOnPremisePipelineBuilder');

// Load in a datafile

const datafile = (process.env.directory || __dirname) + '/../../device-detection-cxx/device-detection-data/51Degrees-LiteV4.1.hash';

// Check if datafiele exists

const fs = require('fs');
if (!fs.existsSync(datafile)) {
  console.error("The datafile required by this example is not present. Please ensure that the 'device-detection-data' submodule has been fetched.");
  throw ("No data file at '" + datafile + "'");
}

console.log(`---------------------------------------`);
console.log('This example demonstrates detection using user-agent client hints.');
console.log('The sec-ch-ua value can be used to determine the browser of the connecting device, but not other components such as the hardware.');
console.log('We show this by first performing detection with sec-ch-ua only.');
console.log('We then repeat with the user-agent header set as well. Note that the client hint takes priority over the user-agent.');
console.log('Finally, we use both sec-ch-ua and user-agent. Note that sec-ch-ua takes priority over the user-agent for detection of the browser.');
console.log(`---------------------------------------\n`);

// Create the device detection pipeline with the desired settings.

const pipeline = new DeviceDetectionOnPremisePipelineBuilder({
  performanceProfile: 'MaxPerformance',
  dataFile: datafile,
  autoUpdate: false
}).build();

// To monitor the pipeline we can put in listeners for various log events.
// Valid types are info, debug, warn, error
pipeline.on('error', console.error);

// Define function to analyze user-agent/client hints
const analyzeClientHints = async function (pipeline, setUserAgent, setSecChUa) {

  const mobileUa = "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile Safari/537.36";
						
  const secchuaValue = "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"";	
  
  // Create a FlowData element
  // This is used to add evidence and process it through the
  // FlowElements in the Pipeline.
  const flowData = pipeline.createFlowData();

  // Add a value for the user-agent client hints header
  // sec-ch-ua as evidence.
  if(setSecChUa) {
      flowData.evidence.add("query.sec-ch-ua", secchuaValue);
  }
  // Also add a standard user-agent if requested 
  if (setUserAgent) {
      flowData.evidence.add("query.user-agent", mobileUa);
  }
  
  // Run process on the flowData (this returns a promise)
  await flowData.process();
  
  const device = flowData.device;
  
  const browserName = device.browsername;
  const browserVersion = device.browserversion;
  const ismobile = device.ismobile;
  
  // Output evidence
  var secchua = "NOT_SET";
  if (setSecChUa){
        secchua = secchuaValue;
  }
  console.log(`Sec-CH-UA = ${secchua}`);

  var ua = "NOT_SET";
  if (setUserAgent){
        ua = mobileUa;
  }
  console.log(`User-Agent = ${ua}`);

  // Output the Browser
  if (browserName.hasValue && browserVersion.hasValue){
      console.log(`\tBrowser = ${browserName.value} ${browserVersion.value}`);
  }
  else if (browserName.hasValue){
	  console.log(`\tBrowser = ${browserName.value} (version unknown)`);
  }
  else{
	  console.log(`\tBrowser = ${browserName.noValueMessage}`);
  }
  
  // Output the value of the 'IsMobile' property.
  if (ismobile.hasValue){
        console.log(`\tIsMobile = ${ismobile.value}\n`);
  }
  else{
        console.log(`\tIsMobile = ${ismobile.noValueMessage}\n`);
  }
};

// first try with just sec-ch-ua.
analyzeClientHints(pipeline, false, true);

// Now with just user-agent.
analyzeClientHints(pipeline, true, false);

// Finally, perform detection with both.
analyzeClientHints(pipeline, true, true);