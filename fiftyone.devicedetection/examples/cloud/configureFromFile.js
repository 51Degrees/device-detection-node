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
@example cloud/configureFromFile.js

This example shows how to configure a pipeline from a configuration file using the pipelinebuilder's buildFromConfigurationFile method.

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection/examples/cloud/configureFromFile.js). 

To run this example, you will need to create a **resource key**. 
The resource key is used as short-hand to store the particular set of 
properties you are interested in as well as any associated license keys 
that entitle you to increased request limits and/or paid-for properties.

You can create a resource key using the 51Degrees [Configurator](https://configure.51degrees.com).

The configuration file used here is:

```

{
    "PipelineOptions": {
        "Elements": [
        {
            "elementName": "../../deviceDetectionOnPremise",
            "elementParameters": {
                "resourceKey": ""

            }
        }
        ]
    }
}

```

*/

const PipelineBuilder = require("fiftyone.pipeline.core").PipelineBuilder;

// Create a new pipeline from the supplied config file.
let pipeline = new PipelineBuilder().buildFromConfigurationFile((process.env.directory || __dirname) + "/51d.json");

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
