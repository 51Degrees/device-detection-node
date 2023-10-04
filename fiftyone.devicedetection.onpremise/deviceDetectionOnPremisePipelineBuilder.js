/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2023 51 Degrees Mobile Experts Limited, Davidson House,
 * Forbury Square, Reading, Berkshire, United Kingdom RG1 3EU.
 *
 * This Original Work is licensed under the European Union Public Licence
 * (EUPL) v.1.2 and is subject to its terms as set out below.
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

const os = require('os');
const core = require('fiftyone.pipeline.core');
const DeviceDetectionOnPremise = require('./deviceDetectionOnPremise');
const constants = require('./constants');
const PipelineBuilder = core.PipelineBuilder;
const ShareUsageElement = require('fiftyone.pipeline.engines.fiftyone').ShareUsage;
const errorMessages = require('fiftyone.devicedetection.shared').errorMessages;

class DeviceDetectionOnPremisePipelineBuilder extends PipelineBuilder {
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
   * @param {string} options.dataFile dataFile path for the on premise engine
   * @param {boolean} options.autoUpdate whether to autoUpdate the dataFile
   * @param {string} options.dataFileUpdateBaseUrl base url for the datafile
   * @param {number} options.pollingInterval How often to poll for
   * updates to the datafile (minutes)
   * @param {number} options.updateTimeMaximumRandomisation
   * Maximum randomisation offset in seconds to polling time interval
   * @param {boolean} options.shareUsage whether to include the share
   * usage element
   * @param {boolean} options.fileSystemWatcher whether to monitor the datafile
   * path for changes
   * @param {boolean} options.updateOnStart whether to download / update a
   * dataFile to the path specified in options.dataFile on start
   * @param {number} options.cacheSize size of the default cache
   * (includes cache if set). NOTE: This is not supported for on-premise
   * engine.
   * @param {Array} options.restrictedProperties list of properties the engine
   * will be restricted to
   * @param {string} options.performanceProfile used to control the tradeoff
   * between performance and system memory usage (Only applies to on-premise,
   * not cloud) options are: LowMemory, MaxPerformance, Balanced,
   * BalancedTemp, HighPerformance
   * @param {number} options.concurrency defaults to the number of cpus
   * in the machine
   * @param {boolean} options.updateMatchedUserAgent True if the detection
   * should record the matched characters from the target User-Agent
   * @param {number} options.maxMatchedUserAgentLength Number of characters to
   * consider in the matched User-Agent. Ignored if updateMatchedUserAgent is
   * false
   * @param {number} options.drift Set maximum drift in hash position to allow
   * when processing HTTP headers.
   * @param {number} options.difference Set the maximum difference to allow
   * when processing HTTP headers. The difference is the difference in hash
   * value between the hash that was found, and the hash that is being searched
   * for. By default this is 0.
   * @param {string} options.allowUnmatched If set to false, a non-matching
   * User-Agent will result in properties without set values.
   * If set to true, a non-matching User-Agent will cause the 'default profiles'
   * to be returned.
   * This means that properties will always have values
   * (i.e. no need to check .HasValue) but some may be inaccurate.
   * By default, this is false.
   * @param {boolean} options.createTempDataCopy If true, the engine will
   * create a copy of the data file in a temporary location
   * rather than using the file provided directly. If not
   * loading all data into memory, this is required for
   * automatic data updates to occur.
   * @param {string} options.tempDataDir The directory to use for the
   * temporary data copy if 'createTempDataCopy' is set to true.
   * @param {boolean} options.usePredictiveGraph True, the engine will use
   * the predictive optimized graph to in detections.
   * @param {boolean} options.usePerformanceGraph True, the engine will use
   * the performance optimized graph to in detections.
   *
   */
  constructor (
    {
      dataFileUpdateService = null,
      licenceKeys = null,
      dataFile = null,
      autoUpdate = true,
      dataFileUpdateBaseUrl = constants.dataFileUpdateBaseUrl,
      pollingInterval = 30,
      updateTimeMaximumRandomisation = 10,
      shareUsage = true,
      fileSystemWatcher = true,
      updateOnStart = false,
      cacheSize = null,
      restrictedProperties,
      performanceProfile = 'LowMemory',
      concurrency = os.cpus().length,
      updateMatchedUserAgent = false,
      maxMatchedUserAgentLength,
      drift,
      difference,
      allowUnmatched = false,
      createTempDataCopy,
      tempDataDir,
      usePredictiveGraph = true,
      usePerformanceGraph = false
    }) {
    super(...arguments);

    // Check if share usage enabled and add it to the pipeline if so

    if (shareUsage) {
      this.flowElements.push(new ShareUsageElement());
    }

    if (dataFileUpdateBaseUrl == null) {
      dataFileUpdateBaseUrl = constants.dataFileUpdateBaseUrl;
    }

    if (cacheSize) {
      throw errorMessages.cacheNotSupport;
    }
    this.flowElements.push(new DeviceDetectionOnPremise(
      {
        dataFilePath: dataFile,
        autoUpdate,
        dataFileUpdateBaseUrl,
        fileSystemWatcher,
        pollingInterval,
        updateTimeMaximumRandomisation,
        licenceKeys,
        restrictedProperties,
        performanceProfile,
        concurrency,
        updateMatchedUserAgent,
        maxMatchedUserAgentLength,
        drift,
        difference,
        allowUnmatched,
        updateOnStart,
        createTempDataCopy,
        tempDataDir,
        usePredictiveGraph,
        usePerformanceGraph
      }));
  }
}

module.exports = DeviceDetectionOnPremisePipelineBuilder;
