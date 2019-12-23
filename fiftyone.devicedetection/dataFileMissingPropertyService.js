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
            let dataFiles = flowElement.properties[key].dataFiles;

            throw "Property " + key + " can be found in the following datafiles " + dataFiles.join(" ") + " not " + currentDataFile;

        } else {

            throw "Property " + key + " not found in " + flowElement.dataKey;

        }
    }

}

module.exports = deviceDetectionMissingPropertyService;
