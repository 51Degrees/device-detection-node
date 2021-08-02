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

const core = require('fiftyone.pipeline.core');
const DeviceDetectionOnPremise = require('fiftyone.devicedetection.onpremise').DeviceDetectionOnPremise;
const DeviceDetectionCloud = require('fiftyone.devicedetection.cloud').DeviceDetectionCloud;
const CloudRequestEngine = require('fiftyone.pipeline.cloudrequestengine').CloudRequestEngine;
const PipelineBuilder = core.PipelineBuilder;
const engines = require('fiftyone.pipeline.engines');
const LruCache = engines.LruCache;
const ShareUsageElement = require('fiftyone.pipeline.engines.fiftyone').ShareUsage;
const errorMessages = require('fiftyone.devicedetection.shared').errorMessages;

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
   * 51Degrees website: https://51degrees.com/pricing.
   * This parameter MUST be set when using a data file.
   * If you do not wish to use a key then you can specify
   * an empty string, but this will cause automatic updates
   * to be disabled.
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
   * (includes cache if set). NOTE: This is not supported for on-premise
   * engine.
   * @param {Array} options.restrictedProperties This setting only affects
   * on-premise engines, not cloud.
   * list of properties the engine will be restricted to
   * @param {string} options.performanceProfile used to control the tradeoff
   * between performance and system memory usage (Only applies to on-premise,
   * not cloud) options are: LowMemory, MaxPerformance, Balanced,
   * BalancedTemp, HighPerformance
   * @param {boolean} options.updateMatchedUserAgent This setting only affects
   * on-premise engines, not cloud.
   * True if the detection should record the matched characters from the
   * target User-Agent
   * @param {number} options.maxMatchedUserAgentLength This setting only affects
   * on-premise engines, not cloud.
   * Number of characters to consider in the matched User-Agent. Ignored
   * if updateMatchedUserAgent is false
   * @param {number} options.drift This setting only affects on-premise engines,
   * not cloud.
   * Set maximum drift in hash position to allow when processing HTTP headers.
   * @param {number} options.difference This setting only affects on-premise
   * engines, not cloud.
   * Set the maximum difference to allow when processing HTTP headers.
   * The difference is the difference in hash value between the hash that
   * was found, and the hash that is being searched for. By default this is 0.
   * @param {string} options.allowUnmatched This setting only affects
   * on-premise engines, not cloud.
   * If set to false, a non-matching User-Agent will result in properties
   * without set values.
   * If set to true, a non-matching User-Agent will cause the 'default profiles'
   * to be returned.
   * This means that properties will always have values
   * (i.e. no need to check .HasValue) but some may be inaccurate.
   * By default, this is false.
   * @param {boolean} options.usePredictiveGraph This setting on affects
   * on-premise engines, not cloud.
   * True, the engine will use the predictive optimized graph to in detections.
   * @param {boolean} options.usePerformanceGraph This setting on affects
   * on-premise engines, not cloud.
   * True, the engine will use the performance optimized graph to in detections.
   * @param {string} options.cloudEndPoint This setting only affects
   * cloud engine, not on-premise.
   * Choose a non default endpoint for the cloud request engine
   * @param {string} options.cloudRequestOrigin This setting only affects
   * cloud engine, not on-premise.
   * Set the value to use for the Origin header when making requests to the
   * cloud service.
   *
   */
  constructor (
    {
      licenceKeys = null,
      dataFile = null,
      autoUpdate = true,
      fileSystemWatcher = true,
      pollingInterval = 30,
      updateTimeMaximumRandomisation = 10,
      shareUsage = true,
      resourceKey = null,
      cacheSize = null,
      restrictedProperties,
      performanceProfile = 'LowMemory',
      updateMatchedUserAgent = false,
      maxMatchedUserAgentLength,
      drift,
      difference,
      allowUnmatched = false,
      usePredictiveGraph = true,
      usePerformanceGraph = false,
      updateOnStart = false,
      cloudEndPoint = null,
      cloudRequestOrigin = null
    }) {
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
      // Cache is not supported for on-premise engine.
      if (cacheSize) {
        throw errorMessages.cacheNotSupport;
      }

      this.flowElements.push(new DeviceDetectionOnPremise(
        {
          dataFilePath: dataFile,
          autoUpdate,
          fileSystemWatcher,
          pollingInterval,
          updateTimeMaximumRandomisation,
          licenceKeys,
          restrictedProperties,
          performanceProfile,
          updateMatchedUserAgent,
          maxMatchedUserAgentLength,
          drift,
          difference,
          allowUnmatched,
          updateOnStart,
          usePredictiveGraph,
          usePerformanceGraph
        }));
    } else {
      // First we need the cloudRequestEngine

      this.flowElements.push(new CloudRequestEngine(
        {
          resourceKey: resourceKey,
          licenseKey: licenceKeys,
          baseURL: cloudEndPoint,
          cloudRequestOrigin: cloudRequestOrigin,
          cache
        }));

      // Then add the cloud device detection engine

      this.flowElements.push(new DeviceDetectionCloud());
    }
  }
}

module.exports = DeviceDetectionPipelineBuilder;
