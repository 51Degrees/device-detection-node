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
