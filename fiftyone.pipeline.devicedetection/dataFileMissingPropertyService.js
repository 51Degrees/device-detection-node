let require51 = (requestedPackage) => {
    try {
        return require(__dirname + "/../" + requestedPackage)
    } catch (e) {
        return require(requestedPackage);
    }
}

const missingPropertyService = require51("fiftyone.pipeline.engines").missingPropertyService;

class deviceDetectionMissingPropertyService extends missingPropertyService {

    /**
     * Missing property service extension that checks if a property is available in the current dataFile via the swig layer
     * @param {String} key
     * @param {flowElement} flowElement
    */
    check(key, flowElement) {

        if (flowElement.properties[key]) {

            let currentDataFile = flowElement.engine.getProduct();
            let dataFiles = flowElement.properties[key].meta.dataFiles;

            throw "Property " + key + " can be found in the following datafiles " + dataFiles.join(" ") + " not " + currentDataFile;

        } else {

            throw "Property " + key + " not found in " + flowElement.dataKey;

        }
    }

}

module.exports = deviceDetectionMissingPropertyService;
