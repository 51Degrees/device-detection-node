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

let require51 = (requestedPackage) => {
    try {
        return require(__dirname + "/../" + requestedPackage)
    } catch (e) {
        return require(requestedPackage);
    }
}

const aspectData = require51("fiftyone.pipeline.engines").aspectData;
const aspectPropertyValue = require51("fiftyone.pipeline.engines/aspectPropertyValue");
const dataFileMissingPropertyService = require("./dataFileMissingPropertyService");

class swigData extends aspectData {

    /**
     * Extension of aspectData which stores the results created by the swig wrapper
     * @param {Object} options
     * @param {flowElement} options.flowElement
     * @param {flowData} options.flowData
    */
    constructor({
        flowElement, swigResults
    }) {

        super(...arguments);
        this.swigResults = swigResults;
        this.missingPropertyService = new dataFileMissingPropertyService();

    }

    /**
     * Retrieves elementData via the swigWrapper but also casts it to the correct type via a check of the engine's property list metadata
     * @param {String} key
    */
    getInternal(key) {

        // Start with special properties

        let result = new aspectPropertyValue();

        if (key === "deviceID") {
            
            result.value = this.swigResults.getDeviceId();
            
            return result;

        }

        if (key === "userAgents") {
            
            result.value = this.swigResults.getUserAgents();
            
            return result;

        }

        if (key === "difference") {
            
            result.value = this.swigResults.getDifference();
            
            return result;

        }

        if (key === "method") {
            
            result.value = this.swigResults.getMethod();
            
            return result;

        }

        if (key === "rank") {
            
            result.value = this.swigResults.getRank();
            
            return result;

        }

        if (key === "signaturesCompared") {
            
            result.value = this.swigResults.getSignaturesCompared();
            
            return result;

        }

        if (key === "matchedNodes") {
            
            result.value = this.swigResults.getMatchedNodes();
            
            return result;

        }


        if (key === "drift") {
            
            result.value = this.swigResults.getDrift();
            
            return result;

        }

        // End special properties

        let property = this.flowElement.properties[key];

        if (property) {

            let value;

            switch (property.type) {
                case "bool":
                    value = this.swigResults.getValueAsBool(property.name);
                    break;
                case "string":
                    value = this.swigResults.getValueAsString(property.name);
                    break;
                case "javascript":
                    value = this.swigResults.getValueAsString(property.name)
                    break;
                case "int":
                    value = this.swigResults.getValueAsInteger(property.name);
                    break;
                case "double":
                    value = this.swigResults.getValueAsDouble(property.name);
                    break;
                case "string[]":
                    value = [];
                    var list = this.swigResults.getValues(property.name);
                    for (var j = 0; j < list.size(); j++) {
                        value[j] = list.get(j);
                    }
                    break;
            }

            let result = new aspectPropertyValue();

            if (value.hasValue()) {
                result.value = value.getValue();
            }
            else {
                result.noValueMessage = value.getNoValueMessage();
            }

            return result;

        }

    }

}

module.exports = swigData;
