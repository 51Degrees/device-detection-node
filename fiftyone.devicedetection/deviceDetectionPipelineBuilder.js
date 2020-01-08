/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2019 51 Degrees Mobile Experts Limited, 5 Charlotte Close,
 * Caversham, Reading, Berkshire, United Kingdom RG4 7BY.
 *
 * This Original Work is licensed under the European Union Public Licence (EUPL) 
 * v.1.2 and is subject to its terms as set out below.
 *
 * If a copy of the EUPL was not distributed with this file, You can obtain
 * one at https://opensource.org/licenses/EUPL-1.2.
 *
 * The 'Compatible Licences' set out in the Appendix to the EUPL (as may be
 * amended by the European Commission) shall be deemed incompatible for
 * the purposes of the Work and the provisions of the compatibility
 * clause in Article 5 of the EUPL shall not apply.
 * 
 * If using the Work as, or as part of, a network application, by 
 * including the attribution notice(s) required under Article 5 of the EUPL
 * in the end user terms of the application under an appropriate heading, 
 * such notice(s) shall fulfill the requirements of that article.
 * ********************************************************************* */

let require51 = (requestedPackage) => {
    try {
        return require(__dirname + "/../" + requestedPackage)
    } catch (e) {
        return require(requestedPackage);
    }
}

const deviceDetectionOnPremise = require("./deviceDetectionOnPremise");
const deviceDetectionCloud = require("./deviceDetectionCloud");
const cloudRequestEngine = require51("fiftyone.pipeline.cloudrequestengine");
const javaScriptBundler = require51("fiftyone.pipeline.javascriptbundler").javascriptBundler;
const pipelineBuilder = require51("fiftyone.pipeline.core").pipelineBuilder;
const engines = require51("fiftyone.pipeline.engines");
const lruCache = engines.lruCache;
const shareUsageElement = require51("fiftyone.pipeline.engines.fiftyone").shareUsage;

class deviceDetectionPipelineBuilder extends pipelineBuilder {

    /**
     * Extension of pipelineBuilder class that allows for the quick generation of a device detection pipeline. Adds share usage, caching and toggles between on premise and cloud with simple paramater changes 
     * @param {Object} options
     * @param {String} options.licenceKeys
     * @param {String} options.dataFile // dataFile path
     * @param {Boolean} options.autoUpdate // whether to autoUpdate the dataFile
     * @param {Boolean} options.updateOnStart // whether to download / update a dataFile to the path specified in options.dataFile on start
     * @param {Boolean} options.shareUsage // include share usage element?
     * @param {String} options.resourceKey // resourceKey for cloud
     * @param {Number} options.cacheSize // size of the default cache (includes cache if set)
     * @param {String} options.performanceProfile // used to control the tradeoff between performance and system memory usage (Only applies to on-premise, not cloud)
     * @param {String} options.allowUnmatched // This setting only affects on-premise engines, not cloud. 
     * If set to false, a non-matching User-Agent will result in properties without set values. 
     * If set to true, a non-matching User-Agent will cause the 'default profiles' to be returned. 
     * This means that properties will always have values (i.e. no need to check .HasValue) but some may be inaccurate. By default, this is false.
     * 
    */
    constructor({ licenceKeys = null, dataFile = null, autoUpdate = true, shareUsage = true, resourceKey = null, cacheSize = null, performanceProfile = "LowMemory", allowUnmatched = false, updateOnStart = false }) {

        // if dataFile is set, check the file extension to work out which type of datafile it is

        super(...arguments);

        // Check if share usage enabled and add it to the pipeline if so

        if (shareUsage) {

            this.flowElements.push(new shareUsageElement());

        }

        let cache;

        if (cacheSize) {

            cache = new lruCache({ size: cacheSize });

        }

        if (dataFile) {

            this.flowElements.push(new deviceDetectionOnPremise({ dataFile, autoUpdate, licenceKeys, cache, performanceProfile, allowUnmatched, updateOnStart}));

        } else {

            // First we need the cloudRequestEngine

            this.flowElements.push(new cloudRequestEngine({ resourceKey: resourceKey, licenseKey: licenceKeys, cache }));

            // Then add the cloud device detection engine

            this.flowElements.push(new deviceDetectionCloud());

        }

        // Add a JavaScript Bundler flowElement

        this.flowElements.push(new javaScriptBundler());

    }

}

module.exports = deviceDetectionPipelineBuilder;
