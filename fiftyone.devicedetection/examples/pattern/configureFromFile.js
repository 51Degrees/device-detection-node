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
@example pattern/configureFromFile.js

This examples shows how to configure a pipeline from a configuration file using the pipelinebuilder's buildFromConfigurationFile method.

The configuration file used here is:

```{json}

{
    "PipelineOptions": {
        "Elements": [
        {
            "elementName": "../../deviceDetectionOnPremise",
            "elementParameters": {
                "performanceProfile": "MaxPerformance",
                "dataFile": "../device-detection-cxx/device-detection-data/51Degrees-LiteV3.2.dat",
                "autoUpdate": false
            }
        }
        ]
    }
}

```

*/

const pipelineBuilder = require("fiftyone.pipeline.core").pipelineBuilder;

// Create a new pipeline from the supplied config file.
let pipeline = new pipelineBuilder().buildFromConfigurationFile("51d.json");

// Logging of errors and other messages. Valid logs types are info, debug, warn, error
pipeline.on("error", console.error);

let checkIfMobile = async function (userAgent) {

    // Create a flow data element and process the desktop User-Agent.
    let flowData = pipeline.createFlowData();

    // Add the User-Agent as evidence
    flowData.evidence.add("header.http_user-agent", userAgent);

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
