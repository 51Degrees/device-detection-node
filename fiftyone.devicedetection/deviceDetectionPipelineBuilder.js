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

const require51 = (requestedPackage) => {
  try {
    return require(__dirname + '/../' + requestedPackage);
  } catch (e) {
    return require(requestedPackage);
  }
};

const core = require51('fiftyone.pipeline.core');
const DeviceDetectionOnPremise = require('./deviceDetectionOnPremise');
const DeviceDetectionCloud = require('./deviceDetectionCloud');
const CloudRequestEngine = require51('fiftyone.pipeline.cloudrequestengine').CloudRequestEngine;
const PipelineBuilder = core.PipelineBuilder;
const engines = require51('fiftyone.pipeline.engines');
const LruCache = engines.LruCache;
const ShareUsageElement = require51('fiftyone.pipeline.engines.fiftyone').ShareUsage;

class DeviceDetectionPipelineBuilder extends PipelineBuilder {
  /**
   * Extension of pipelineBuilder class that allows for the quick
   * generation of a device detection pipeline. Adds share usage,
   * caching and toggles between on premise and cloud with
   * simple paramater changes
   *
   * @param {object} options the options for the pipeline builder
   * @param {string} options.licenceKeys license key(s) used by the
   * data file update service. A key can be obtained from the
   * 51Degrees website: https://www.51degrees.com/pricing. 
   * This parameter MUST be set when using a data file. 
   * If you do not wish to use a key then you can specify 
   * an empty string, but this will cause automatic updates 
   * to be disabled.
   * @param {boolean} options.download whether to download the datafile
   * @param {string} options.resourceKey resourceKey, if using the
   * cloud engine
   * @param {string} options.dataFile dataFile path for the on premise engine
   * @param {boolean} options.autoUpdate whether to autoUpdate the dataFile
   * @param {number} options.pollingInterval How often to poll for
   * updates to the datafile (minutes)
   * @param {number} options.updateTimeMaximumRandomisation
   * Maximum randomisation offset in seconds to polling time interval
   * @param {boolean} options.fileSystemWatcher whether to monitor the datafile
   * path for changes
   * @param {boolean} options.updateOnStart whether to download / update a
   * dataFile to the path specified in options.dataFile on start
   * @param {boolean} options.shareUsage whether to include the share
   * usage element
   * @param {number} options.cacheSize size of the default cache
   * (includes cache if set)
   * @param {string} options.performanceProfile used to control the tradeoff
   * between performance and system memory usage (Only applies to on-premise,
   * not cloud) options are: LowMemory, MaxPerformance, Balanced,
   * BalancedTemp, HighPerformance
   * @param {string} options.allowUnmatched This setting only affects
   * on-premise engines, not cloud.
   * If set to false, a non-matching User-Agent will result in properties
   * without set values.
   * If set to true, a non-matching User-Agent will cause the 'default profiles'
   * to be returned.
   * This means that properties will always have values
   * (i.e. no need to check .HasValue) but some may be inaccurate.
   * By default, this is false.
   * @param {string} options.cloudEndPoint This setting only affects
   * cloud engine, not on-premise.
   * Choose a non default endpoint for the cloud request engine
   *
   */
  constructor ({ licenceKeys = null, dataFile = null, autoUpdate = true, fileSystemWatcher = true, pollingInterval = 30, updateTimeMaximumRandomisation = 10, shareUsage = true, resourceKey = null, cacheSize = null, performanceProfile = 'LowMemory', allowUnmatched = false, updateOnStart = false, cloudEndPoint = 'https://cloud.51degrees.com/api/v4/' }) {

    super(...arguments);

    // Check if share usage enabled and add it to the pipeline if so

    if (shareUsage) {
      this.flowElements.push(new ShareUsageElement());
    }

    let cache;

    if (cacheSize) {
      cache = new LruCache({ size: cacheSize });
    }

    if (dataFile) {
      this.flowElements.push(new DeviceDetectionOnPremise({ dataFilePath: dataFile, autoUpdate, fileSystemWatcher, pollingInterval, updateTimeMaximumRandomisation, licenceKeys, cache, performanceProfile, allowUnmatched, updateOnStart }));
    } else {
      // First we need the cloudRequestEngine

      this.flowElements.push(new CloudRequestEngine({ resourceKey: resourceKey, licenseKey: licenceKeys, baseURL: cloudEndPoint, cache }));

      // Then add the cloud device detection engine

      this.flowElements.push(new DeviceDetectionCloud());
    }
  }
}

module.exports = DeviceDetectionPipelineBuilder;
