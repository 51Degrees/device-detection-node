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

const core = require51("fiftyone.pipeline.core");
const engines = require51("fiftyone.pipeline.engines");

const engine = engines.engine;
const DataFile = require("./deviceDetectionDataFile");
const swigData = require("./swigData");
const swigHelpers = require("./swigHelpers");
const os = require("os");
const path = require("path");
const evidenceKeyFilter = core.basicListEvidenceKeyFilter;

// Determine if Windows or linux and which node version

let nodeVersion = Number(process.version.match(/^v(\d+\.)/)[1]);

class deviceDetectionOnPremise extends engine {

    constructor({ dataFile, autoUpdate, cache, dataFileUpdateBaseUrl = "https://distributor.51degrees.com/api/v2/download", restrictedProperties, licenceKeys, download, performanceProfile = "LowMemory", reuseTempFile = false, updateMatchedUserAgent = false, maxMatchedUserAgentLength, drift, difference, concurrency = os.cpus().length, closestSignatures, userAgentCacheCapacity, allowUnmatched, fileSystemWatcher, createTempDataCopy, updateOnStart = false }) {

        let swigWrapper;
        let swigWrapperType;
        let dataFileType;

        // look at dataFile extension to detect type

        let ext = path.parse(dataFile).ext;

        if (ext === ".dat") {

            // Pattern

            swigWrapperType = "Pattern";
            swigWrapper = require("./build/FiftyOneDeviceDetectionPatternV4-" + os.platform() + "-" + nodeVersion + ".node");
            dataFileType = "BinaryV32";

        }

        if (ext === ".trie") {

            // Trie

            swigWrapperType = "Hash";
            swigWrapper = require("./build/FiftyOneDeviceDetectionHashV4-" + os.platform() + "-" + nodeVersion + ".node");
            dataFileType = "HashTrieV34";

        }

        if (!dataFile) {

            throw "Datafile is required";

        }

        // Create vector for restricted properties

        let propertiesList = new swigWrapper.VectorStringSwig();

        if (restrictedProperties) {

            restrictedProperties.forEach(function (property) {

                propertiesList.add(property);

            });

        }

        var requiredProperties = new swigWrapper.RequiredPropertiesConfigSwig(propertiesList);

        var config = new swigWrapper["Config" + swigWrapperType + "Swig"]();

        switch (performanceProfile) {

            case "LowMemory":
                config.setLowMemory();
                break;
            case "MaxPerformance":
                config.setMaxPerformance();
                break;
            case "Balanced":
                config.setBalanced();
                break;
            case "BalancedTemp":
                config.setBalancedTemp();
                break;
            case "HighPerformance":
                config.setHighPerformance();
                break;
            default:
                throw "The performance profile '" + performanceProfile + "' is not valid";
        }

        // If auto update is enabled then we must use a temporary copy of the file

        if (autoUpdate === true) {
            config.setUseTempFile(true);
        }

        if (createTempDataCopy === true) {
            config.setUseTempFile(true);
        }

        config.setReuseTempFile(reuseTempFile);
        config.setUpdateMatchedUserAgent(updateMatchedUserAgent);

        if (typeof allowUnmatched === "boolean") {
            config.setAllowUnmatched(allowUnmatched)
        };

        if (maxMatchedUserAgentLength) {
            config.setMaxMatchedUserAgentLength(maxMatchedUserAgentLength);
        }

        if (swigWrapperType === "Hash") {

            if (drift) {
                config.setDrift(drift);
            }

        }

        if (swigWrapperType === "Pattern") {

            if (closestSignatures) {

                config.setClosestSignatures(closestSignatures)

            }

            if (userAgentCacheCapacity) {

                config.setUserAgentCacheCapacity(userAgentCacheCapacity)

            }

        }

        if (difference) {
            config.setDifference(difference);
        }

        config.setConcurrency(concurrency);

        super(...arguments);

        this.dataKey = "device";

        let current = this;

        // Function for initialising the engine, wrapped like this so that an engine can be initialised once the datafile is retrieved if updateOnStart is set to true

        this.initEngine = function () {

            return new Promise(function (resolve, reject) {

                let engine = new swigWrapper["Engine" + swigWrapperType + "Swig"](dataFile, config, requiredProperties);

                // Get keys and add to evidenceKey filter

                let evidenceKeys = engine.getKeys();

                let evidenceKeyArray = [];

                for (let i = 0; i < evidenceKeys.size(); i += 1) {

                    evidenceKeyArray.push(evidenceKeys.get(i).toLowerCase());

                }

                current.evidenceKeyFilter = new evidenceKeyFilter(evidenceKeyArray);

                current.engine = engine;
                current.swigWrapper = swigWrapper;
                current.swigWrapperType = swigWrapperType;

                // Get properties list

                let propertiesInternal = engine.getMetaData().getProperties();

                let properties = {};

                for (var i = 0; i < propertiesInternal.getSize(); i++) {
                    var property = propertiesInternal.getByIndex(i);
                    if (property.getAvailable()) {

                        properties[property.getName().toLowerCase()] = {
                            name: property.getName(),
                            type: property.getType(),
                            dataFiles: swigHelpers.vectorToArray(property.getDataFilesWherePresent()),
                            category: property.getCategory(),
                            description: property.getDescription()
                        }
                    }
                };

                current.properties = properties;

                // Special properties

                current.properties["deviceID"] = {
                    name: "DeviceId",
                    type: "string",
                    category: "Device metrics",
                    description: "Consists of four components separated by a hyphen symbol: Hardware-Platform-Browser-IsCrawler where each Component represents an ID of the corresponding Profile."
                }

                current.properties["userAgents"] = {
                    name: "UserAgents",
                    type: "string",
                    category: "Device metrics",
                    description: "The matched User-Agents."
                }

                current.properties["difference"] = {
                    name: "Difference",
                    type: "int",
                    category: "Device metrics",
                    description: "Used when detection method is not Exact or None. This is an integer value and the larger the value the less confident the detector is in this result."
                }

                if (swigWrapperType === "Pattern") {

                    current.properties["method"] = {
                        name: "Method",
                        type: "string",
                        category: "Device metrics",
                        description: "Provides information about the algorithm that was used to perform detection for a particular User-Agent."
                    }

                    current.properties["rank"] = {
                        name: "Rank",
                        type: "int",
                        category: "Device metrics",
                        description: "An integer value that indicates how popular the device is. The lower the rank the more popular the signature."
                    }

                    current.properties["signaturesCompared"] = {
                        name: "SignaturesCompared",
                        type: "int",
                        category: "Device metrics",
                        description: "The number of device signatures that have been compared before finding a result."
                    }

                }

                if (swigWrapperType === "Hash") {

                    current.properties["matchedNodes"] = {
                        name: "MatchedNodes",
                        type: "int",
                        category: "Device metrics",
                        description: "Indicates the number of hash nodes matched within the evidence."
                    }

                    current.properties["drift"] = {
                        name: "Drift",
                        type: "int",
                        category: "Device metrics",
                        description: "Total difference in character positions where the substrings hashes were found away from where they were expected."
                    }

                }

            });

        }

        if (!updateOnStart) {

            // Not updating on start. Initialise the engine straight away

            this.initEngine();

        }

        // Construct datafile

        let dataFileSettings = { flowElement: this, verifyMD5: true, autoUpdate: autoUpdate, updateOnStart: updateOnStart, decompress: true, path: dataFile, download: download, fileSystemWatcher: fileSystemWatcher }

        dataFileSettings.getDatePublished = function () {

            if (current.engine) {

                return swigHelpers.swigDateToDate(current.engine.getPublishedTime());

            } else {

                return new Date();

            }

        }

        dataFileSettings.getNextUpdate = function () {

            if (current.engine) {

                return swigHelpers.swigDateToDate(current.engine.getUpdateAvailableTime());

            } else {

                return new Date();

            }


        }

        dataFileSettings.refresh = function () {

            if (current.engine) {

                return current.engine.refreshData();

            } else {

                current.initEngine().then(function () {

                    current.engine.refreshData();

                })

            }


        }


        let params = {
            Type: dataFileType + "UAT",
            Download: "True"
        }

        if (licenceKeys) {

            params.licenseKeys = licenceKeys;

        }

        params.baseURL = dataFileUpdateBaseUrl;

        dataFileSettings.updateURLParams = params;

        dataFileSettings.identifier = dataFileType;

        let ddDatafile = new DataFile(dataFileSettings);

        this.registerDataFile(ddDatafile);

    }

    processInternal(flowData) {

        let dd = this;

        let process = function () {

            // set evidence

            let evidence = new dd.swigWrapper.EvidenceDeviceDetectionSwig();

            Object.entries(flowData.evidence.getAll()).forEach(function ([key, value]) {

                evidence.set(key, value);

            });

            let result = dd.engine.process(evidence);

            let data = new swigData({ flowElement: dd, swigResults: result });

            flowData.setElementData(data);

        }

        // Check if engine is initialised already

        if (this.engine) {

            process();

        } else {

            // wait until initialised

            return new Promise(function (resolve) {

                let dataFileChecker = setInterval(function () {

                    if (dd.engine) {

                        process();

                        clearInterval(dataFileChecker);

                        resolve();

                    }

                }, 500);

            });

        }

    }

}

module.exports = deviceDetectionOnPremise;
