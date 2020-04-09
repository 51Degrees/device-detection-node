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
@example cloud/metadata.js

This example shows how to get properties from a pipeline's processed flowData based on their metadata, the getProperties() method and also additional meta data properties on device detection data.

This example is available in full on [GitHub](https://github.com/51Degrees/device-detection-node/blob/master/fiftyone.devicedetection/examples/cloud/metaData.js). 
(During the beta period, this repository will be private. 
[Contact us](mailto:support.51degrees.com) to request access) 

To run this example, you will need to create a **resource key**. 
The resource key is used as short-hand to store the particular set of 
properties you are interested in as well as any associated license keys 
that entitle you to increased request limits and/or paid-for properties.

You can create a resource key using the 51Degrees [Configurator](https://configure.51degrees.com).

*/

const FiftyOneDegreesDeviceDetection = require((process.env.directory || __dirname) + "/../../");

const fs = require("fs");

// You need to create a resource key at https://configure.51degrees.com and 
// paste it into the code, replacing !!YOUR_RESOURCE_KEY!!.
let localResourceKey = "!!YOUR_RESOURCE_KEY!!";
// Check if there is a resource key in the global variable and use
// it if there is one. (This is used by automated tests to pass in a key)
try {
    localResourceKey = resourceKey;
} catch (e) {
    if (e instanceof ReferenceError) {}
}

if(localResourceKey.substr(0, 2) == "!!") {
    console.log("You need to create a resource key at " +
        "https://configure.51degrees.com and paste it into the code, " +
        "replacing !!YOUR_RESOURCE_KEY!!.");
    console.log("Make sure to include the properties in the " +
        "'device metrics' category as they are used by this example.");
}
else {   
    // Create a new Device Detection pipeline and set the config.
    //  You need to create a resource key at https://configure.51degrees.com and paste it into the code.
    let pipeline = new FiftyOneDegreesDeviceDetection.deviceDetectionPipelineBuilder({
        "resourceKey": localResourceKey
    }).build();

    // Logging of errors and other messages. Valid logs types are info, debug, warn, error
    pipeline.on("error", console.error);

    // Get list of properties for the deviceDetectionEngine (including metadata like category, description, type and which datafiles they appear in)
    let properties = pipeline.getElement("device").getProperties();

    // The following function uses "flowData.getWhere()" to fetch all of the data related to "supported media" on a device by querying the category.
    let getAllSupportedMedia = async function (userAgent) {

        // Create a flow data element and process the desktop User-Agent.
        let flowData = pipeline.createFlowData();

        // Add the User-Agent as evidence
        flowData.evidence.add("header.user-agent", userAgent);

        await flowData.process();

        // Get all supported media types (html5 video, svg...) and loop over them to get the support results
        // The second parameter can also be a boolean function that checks the value of that meta type (category in this case)
        let supported = flowData.getWhere("category", "Supported Media");

        Object.entries(supported).forEach(([key, result]) => {

            console.log(`Does user agent ${userAgent} support ${key}? : `);

            if (result.hasValue) {

                console.log(result.value);

            } else {

                // Echo out why the value isn't meaningful
                console.log(result.noValueMessage);

            }

        });

    }

    let iPhoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C114';

    getAllSupportedMedia(iPhoneUA);

    // The device detection engine comes with additional metadata about each match

    let getMatchMetaData = async function (userAgent) {

        // Create a flow data element and process the desktop User-Agent.
        let flowData = pipeline.createFlowData();

        // Add the User-Agent as evidence
        flowData.evidence.add("header.user-agent", userAgent);

        await flowData.process();

        // This is all stored under the "device metrics" category

        let meta = flowData.getWhere("category", "Device Metrics");
    
        flowData.device.deviceID;
        // Consists of four components separated by a hyphen symbol: Hardware-Platform-Browser-IsCrawler where each Component represents an ID of the corresponding Profile.

        flowData.device.userAgents;
        // The matched useragents

        flowData.device.difference;
        // Used when detection method is not Exact or None. This is an integer value and the larger the value the less confident the detector is in this result.

        flowData.device.method;
        // Provides information about the algorithm that was used to perform detection for a particular User-Agent.

        flowData.device.rank;
        // An integer value that indicates how popular the device is. The lower the rank the more popular the signature.

        flowData.device.signaturesCompared;
        // The number of device signatures that have been compared before finding a result.

        Object.entries(meta).forEach(([key, result]) => {

            // Show information about this meta property
            console.log(key + ": ");
            console.log(" ");
            console.log(pipeline.getElement("device").getProperties()[key].description);
            console.log(" ");

            if (result.hasValue) {

                console.log(result.value);

            } else {

                // Echo out why the value isn't meaningful
                console.log(result.noValueMessage);

            }

        });

    }

    getMatchMetaData(iPhoneUA);
}