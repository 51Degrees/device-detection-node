/* ********************************************************************
 * Copyright (C) 2019  51Degrees Mobile Experts Limited.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * ******************************************************************** */

/*
@example pattern/gettingStarted.js

Getting started example of using the 51Degrees device detection 'Pattern' algorithm to determine whether a given User-Agent corresponds to a mobile device or not.

Firstly require the fiftyone.pipeline.devicedetection modules which contain all of the pipeline specific classes we will be using in this example.

```{js}

const FiftyOneDegreesDeviceDetection = require('fiftyone.pipeline.devicedetection')

```

We then load in a datafile (ending in .dat for the Pattern algorithm). Free data files can be acquired by pulling the submodule under datafile in this example

```{js}

let datafile = __dirname + "/../../device-detection-cxx/device-detection-data/51Degrees-LiteV3.2.dat";

```

Build the device detection pipeline using the builder that comes with the fiftyone.pipeline.devicedetection module and pass in the desired settings. Additional flowElements / engines can be added before the build() method is called if needed.

```{js}

let pipeline = new FiftyOneDegreesDeviceDetection.deviceDetectionPipelineBuilder({
    performanceProfile: "MaxPerformance",
    dataFile: datafile,
    autoUpdate: false,
}).build();

```

Each pipeline has an event emitter attached you can listen to to catch messages. Valid log types are info, debug, warn and error.

```{js}

pipeline.on("error", console.error);

```

A pipeline can create a flowData element which is where evidence is added (for example from a device web request). This evidence is then processed by the pipeline through the flowData's `process()` method (which returns a promise to work with both syncronous and asyncronous pipelines).

Here is an example of a function that checks if a user agent is a mobile device. In some cases the isMobile value is not meaningful so instead of returning a default, a .hasValue() check can be made. Please see the failureToMatch example for more information.

```{js}

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

const FiftyOneDegreesDeviceDetection = require('../../');

// Load in a datafile

let datafile = __dirname + "/../../device-detection-cxx/device-detection-data/51Degrees-LiteV3.2.dat";

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
