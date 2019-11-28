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

    constructor({ dataFile, cache, dataFileUpdateBaseUrl = "https://distributor.51degrees.com/api/v2/download", restrictedProperties, licenceKeys, download, performanceProfile = "LowMemory", reuseTempFile = false, updateMatchedUserAgent = false, maxMatchedUserAgentLength, drift, difference, concurrency = os.cpus().length, closestSignatures, userAgentCacheCapacity }) {

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

        // Use temp file - TODO: Check other options
        config.setUseTempFile(true);

        config.setReuseTempFile(reuseTempFile);
        config.setUpdateMatchedUserAgent(updateMatchedUserAgent);

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

        var engine = new swigWrapper["Engine" + swigWrapperType + "Swig"](dataFile, config, requiredProperties);

        super(...arguments);

        this.dataKey = "device";

        // Get keys and add to evidenceKey filter

        let evidenceKeys = engine.getKeys();

        let evidenceKeyArray = [];

        for (let i = 0; i < evidenceKeys.size(); i += 1) {

            evidenceKeyArray.push(evidenceKeys.get(i));

        }

        this.evidenceKeyFilter = new evidenceKeyFilter(evidenceKeyArray);

        // Construct datafile

        let dataFileSettings = { flowElement: this, verifyMD5: true, autoUpdate: true, decompress: true, path: dataFile, download: download, fileSystemWatcher: true }

        dataFileSettings.getDatePublished = function () {

            return swigHelpers.swigDateToDate(engine.getPublishedTime());

        }

        dataFileSettings.getNextUpdate = function () {

            return swigHelpers.swigDateToDate(engine.getUpdateAvailableTime());

        }

        dataFileSettings.refresh = function () {

            return engine.refreshData();

        }


        let params = {
            product: engine.getProduct().toLowerCase(),
            Type: dataFileType
        }

        if (licenceKeys) {

            params.licenseKeys = licenceKeys;

        }

        params.baseURL = dataFileUpdateBaseUrl;

        dataFileSettings.updateURLParams = params;

        this.engine = engine;
        this.swigWrapper = swigWrapper;
        this.swigWrapperType = swigWrapperType;

        // Get properties list

        let propertiesInternal = engine.getMetaData().getProperties();

        let properties = {};

        for (var i = 0; i < propertiesInternal.getSize(); i++) {
            var property = propertiesInternal.getByIndex(i);
            if (property.getAvailable()) {

                properties[property.getName().toLowerCase()] = {
                    meta: {
                        name: property.getName(),
                        type: property.getType(),
                        dataFiles: swigHelpers.vectorToArray(property.getDataFilesWherePresent()),
                        category: property.getCategory()
                    }
                }
            }
        };

        this.properties = properties;

        dataFileSettings.identifier = dataFileType;

        let ddDatafile = new DataFile(dataFileSettings);

        this.registerDataFile(ddDatafile);

    }

    processInternal(flowData) {

        // set evidence

        let evidence = new this.swigWrapper.EvidenceDeviceDetectionSwig();

        Object.entries(flowData.evidence.getAll()).forEach(function ([key, value]) {

            evidence.set(key, value);

        });

        let result = this.engine.process(evidence);

        let data = new swigData({ flowElement: this, swigResults: result });

        flowData.setElementData(data);

    }

}

module.exports = deviceDetectionOnPremise;
