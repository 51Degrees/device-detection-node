let require51 = (requestedPackage) => {
    try {
        return require(__dirname + "/../" + requestedPackage)
    } catch (e) {
        return require(requestedPackage);
    }
}

const engines = require51("fiftyone.pipeline.engines");
const engine = engines.engine;
const aspectDataDictionary = engines.aspectDataDictionary;

class deviceDetectionCloud extends engine {

    constructor() {

        super(...arguments);

        this.dataKey = "device";

    }

    /**
     * The deviceDetction cloud engine requires the 51Degrees cloudRequestEngine to be placed in a pipeline before it. It simply takes that raw JSON response and parses it to extract the device part
     * @param {flowData} flowData
    */
    processInternal(flowData) {

        let engine = this;

        this.checkProperties(flowData).then(function (params) {

            let cloudData = flowData.get("cloud").get("cloud");

            cloudData = JSON.parse(cloudData);

            let data = new aspectDataDictionary(
                {
                    flowElement: engine,
                    contents: cloudData.device
                });

            flowData.setElementData(data);

        });

    }

    checkProperties(flowData) {

        let engine = this;

        return new Promise(function (resolve, reject) {

            // Check if properties set, if not set them

            if (!Object.keys(engine.properties).length) {

                let cloudProperties = flowData.get("cloud").get("properties");

                let deviceProperties = cloudProperties.device;

                engine.properties = deviceProperties;

                engine.updateProperties().then(resolve);

            } else {

                resolve();

            }

        });

    }

}

module.exports = deviceDetectionCloud;
