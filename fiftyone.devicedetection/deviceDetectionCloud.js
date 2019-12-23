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

const engines = require51("fiftyone.pipeline.engines");
const engine = engines.engine;
const aspectDataDictionary = engines.aspectDataDictionary;
const aspectPropertyValue = engines.aspectPropertyValue;

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

            // Loop over cloudData.device properties to check if they have a value

            let result = {};

            Object.entries(cloudData.device).forEach(function([key,value]){

                result[key] = new aspectPropertyValue();

                if(cloudData.nullValueReasons["device." + key]){

                    result[key].noValueMessage = cloudData.nullValueReasons["device." + key];

                } else {

                    result[key].value = value;

                }

            });

            let data = new aspectDataDictionary(
                {
                    flowElement: engine,
                    contents: result
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
