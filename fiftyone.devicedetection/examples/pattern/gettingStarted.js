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
@example pattern/gettingStarted.js

Getting started example of using the 51Degrees device detection 'Pattern' algorithm to determine whether a given User-Agent corresponds to a mobile device or not.

Firstly require the fiftyone.pipeline.devicedetection modules which contain all of the pipeline specific classes we will be using in this example.

```

const FiftyOneDegreesDeviceDetection = require('fiftyone.pipeline.devicedetection')

```

We then load in a datafile (ending in .dat for the Pattern algorithm). Free data files can be acquired by pulling the submodule under datafile in this example

```

let datafile = (process.env.directory || __dirname) + "/../../device-detection-cxx/device-detection-data/51Degrees-LiteV3.2.dat";

```

Build the device detection pipeline using the builder that comes with the fiftyone.pipeline.devicedetection module and pass in the desired settings. Additional flowElements / engines can be added before the build() method is called if needed.

```

let pipeline = new FiftyOneDegreesDeviceDetection.deviceDetectionPipelineBuilder({
    performanceProfile: "MaxPerformance",
    dataFile: datafile,
    autoUpdate: false,
}).build();

```

Each pipeline has an event emitter attached you can listen to to catch messages. Valid log types are info, debug, warn and error.

```

pipeline.on("error", console.error);

```

A pipeline can create a flowData element which is where evidence is added (for example from a device web request). This evidence is then processed by the pipeline through the flowData's `process()` method (which returns a promise to work with both syncronous and asyncronous pipelines).

Here is an example of a function that checks if a user agent is a mobile device. In some cases the isMobile value is not meaningful so instead of returning a default, a .hasValue() check can be made. Please see the failureToMatch example for more information.

```

let checkIfMobile = async function (userAgent) {

    // Create a flow data element and process the desktop User-Agent.
    let flowData = pipeline.createFlowData();

    // Add the User-Agent as evidence
    flowData.evidence.add("header.user-agent", userAgent);

    await flowData.process();

    let ismobile = flowData.device.ismobile;

    if (ismobile.hasValue) {

        console.log(`Is user agent ${userAgent} a mobile? ${ismobile.value}`);

    } else {

        // Echo out why the value isn't meaningful
        console.log(ismobile.noValueMessage);

    }

}

let desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36';
let iPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114';

```

*/

const FiftyOneDegreesDeviceDetection = require((process.env.directory || __dirname) + "/../../");

// Load in a datafile

let datafile = (process.env.directory || __dirname) + "/../../device-detection-cxx/device-detection-data/51Degrees-LiteV3.2.dat";

// Check if datafiele exists

const fs = require("fs");
if (!fs.existsSync(datafile)) {
    console.error("The datafile required by this example is not present. Please ensure that the 'device-detection-data' submodule has been fetched.");
    throw ("No data file at '" + datafile + "'");
}

let pipeline = new FiftyOneDegreesDeviceDetection.deviceDetectionPipelineBuilder({
    performanceProfile: "MaxPerformance",
    dataFile: datafile,
    autoUpdate: false,
}).build();

// Logging of errors and other messages. Valid logs types are info, debug, warn, error
pipeline.on("error", console.error);

let checkIfMobile = async function (userAgent) {

    // Create a flow data element and process the desktop User-Agent.
    let flowData = pipeline.createFlowData();

    // Add the User-Agent as evidence
    flowData.evidence.add("header.user-agent", userAgent);

    await flowData.process();

    let ismobile = flowData.device.ismobile;

    if (ismobile.hasValue) {

        console.log(`Is user agent ${userAgent} a mobile? ${ismobile.value}`);

    } else {

        // Echo out why the value isn't meaningful
        console.log(ismobile.noValueMessage);

    }

}

let desktopUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36';
let iPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114';

checkIfMobile(desktopUA);
checkIfMobile(iPhoneUA);
