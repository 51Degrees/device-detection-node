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

        let property = this.flowElement.properties[key];

        if (property) {

            let value;

            switch (property.meta.type) {
                case "bool":                
                    value = this.swigResults.getValueAsBool(property.meta.name);
                    break;
                case "string":
                    value = this.swigResults.getValueAsString(property.meta.name);
                    break;
                case "javascript":
                    value = this.swigResults.getValueAsString(property.meta.name)
                    break;
                case "int":
                    value = this.swigResults.getValueAsInteger(property.meta.name);
                    break;
                case "double":
                    value = this.swigResults.getValueAsDouble(property.meta.name);
                    break;
                case "string[]":
                    value = [];
                    var list = this.swigResults.getValues(property.meta.name);
                    for (var j = 0; j < list.size(); j++) {
                        value[j] = list.get(j);
                    }
                    break;
            }

            let result = new aspectPropertyValue();
            if (value.hasValue())
            {
                result.value = value.getValue();
            }
            else
            {
                result.noValueMessage = value.getNoValueMessage();
            }

            return result;
        }

    }

}

module.exports = swigData;
