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