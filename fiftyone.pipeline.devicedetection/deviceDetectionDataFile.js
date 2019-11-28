const require51 = (requestedPackage) => {
    try {
        return require(__dirname + "/../" + requestedPackage)
    } catch (e) {
        return require(requestedPackage);
    }
}

const querystring = require("querystring");
const engines = require51("fiftyone.pipeline.engines");

const dataFile = engines.dataFile;

class deviceDetectionDataFile extends dataFile {

    urlFormatter() {

        let queryParams = {
            Product: this.updateURLParams.product,
            Type: this.updateURLParams.Type

        }

        if (this.updateURLParams.licenseKeys) {

            queryParams.licenseKeys = this.updateURLParams.licenseKeys;

        }

        return this.updateURLParams.baseURL + "?" + querystring.stringify(queryParams);

    }

}

module.exports = deviceDetectionDataFile;