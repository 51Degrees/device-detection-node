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
const engines = require('fiftyone.pipeline.engines');

const Engine = engines.Engine;
const DataFile = require('./deviceDetectionDataFile');
const SwigData = require('./swigData');
const swigHelpers = require('./swigHelpers');
const errorMessages = require('fiftyone.devicedetection.shared').errorMessages;
const os = require('os');
const path = require('path');
const EvidenceKeyFilter = core.BasicListEvidenceKeyFilter;
const fs = require('fs');
const util = require('util');

/**
 * @typedef {import('fiftyone.pipeline.engines').DataKeyedCache} DataKeyedCache
 */

// Determine if Windows or linux and which node version

const nodeVersion = Number(process.version.match(/^v(\d+\.)/)[1]);

/**
 * On premise version of the 51Degrees Device Detection Engine
 * Uses a data file to process evidence in FlowData and create results
 * This datafile can automatically update when a new version is available
 **/
class DeviceDetectionOnPremise extends Engine {
  /**
   * Constructor for Device Detection On Premise engine
   *
   * @param {object} options options for the engine
   * @param {string} options.dataFilePath path to the datafile
   * @param {boolean} options.autoUpdate whether the datafile
   * should be registered with the data file update service
   * @param {number} options.pollingInterval How often to poll for
   * updates to the datafile (minutes)
   * @param {number} options.updateTimeMaximumRandomisation
   * Maximum randomisation offset in seconds to polling time interval
   * @param {DataKeyedCache} options.cache an instance of the Cache class from
   * Fiftyone.Pipeline.Engines. NOTE: This is no longer supported for
   * on-premise engine.
   * @param {string} options.dataFileUpdateBaseUrl base url for the datafile
   * update service
   * @param {Array} options.restrictedProperties list of properties the engine
   * will be restricted to
   * @param {string} options.licenceKeys license key(s) used by the
   * data file update service. A key can be obtained from the
   * 51Degrees website: https://51degrees.com/pricing.
   * If you do not wish to use a key then you can specify
   * an empty string, but this will cause automatic updates to
   * be disabled.
   * @param {boolean} options.download whether to download the datafile
   * or store it in memory
   * @param {string} options.performanceProfile options are:
   * LowMemory, MaxPerformance, Balanced, BalancedTemp, HighPerformance
   * @param {boolean} options.fileSystemWatcher whether to monitor the datafile
   * path for changes
   * @param {number} options.concurrency defaults to the number of cpus
   * in the machine
   * @param {boolean} options.reuseTempFile Indicates that an existing temp
   * file may be used. This should be selected if multiple instances wish to
   * use the same file to prevent high disk usage.
   * @param {boolean} options.updateMatchedUserAgent True if the detection
   * should record the matched characters from the target User-Agent
   * @param {object} options.maxMatchedUserAgentLength Number of characters to
   * consider in the matched User-Agent. Ignored if updateMatchedUserAgent
   * is false
   * @param {number} options.drift Set maximum drift in hash position to
   * allow when processing HTTP headers.
   * @param {number} options.difference Set the maximum difference to allow
   * when processing HTTP headers. The difference is the difference
   * in hash value between the hash that was found, and the hash
   * that is being searched for. By default this is 0.
   * @param {boolean} options.allowUnmatched True if there should be at least
   * one matched node in order for the results to be
   * considered valid. By default, this is false
   * @param {boolean} options.createTempDataCopy If true, the engine will
   * create a copy of the data file in a temporary location
   * rather than using the file provided directly. If not
   * loading all data into memory, this is required for
   * automatic data updates to occur.
   * @param {boolean} options.updateOnStart whether to download / update
   * the datafile on initialisation
   * @param {boolean} options.usePredictiveGraph If true, the engine will
   * use predictive optimized graph in detections.
   * @param {boolean} options.usePerformanceGraph If true, the engine will
   * use performance optimized graph in detections.
   */
  constructor (
    {
      dataFilePath,
      autoUpdate,
      cache,
      dataFileUpdateBaseUrl = 'https://distributor.51degrees.com/api/v2/download',
      restrictedProperties,
      licenceKeys,
      download,
      performanceProfile = 'LowMemory',
      reuseTempFile = false,
      updateMatchedUserAgent = false,
      maxMatchedUserAgentLength,
      drift,
      difference,
      concurrency = os.cpus().length,
      allowUnmatched,
      fileSystemWatcher,
      pollingInterval,
      updateTimeMaximumRandomisation,
      createTempDataCopy,
      updateOnStart = false,
      usePredictiveGraph = true,
      usePerformanceGraph = false
    }) {
    let swigWrapper;
    let swigWrapperType;
    let dataFileType;

    if (typeof cache !== 'undefined') {
      throw errorMessages.cacheNotSupport;
    }

    if (typeof dataFilePath === 'undefined') {
      throw errorMessages.dataFilePathRequired;
    }
    if (fs.existsSync(dataFilePath) === false) {
      throw util.format(errorMessages.fileNotFound, dataFilePath);
    }
    // look at dataFile extension to detect type
    const ext = path.parse(dataFilePath).ext;

    if (ext === '.hash') {
      // Hash
      swigWrapperType = 'Hash';
      const moduleDir = path.join(__dirname, 'build');
      const moduleName = path.join(moduleDir, 'FiftyOneDeviceDetectionHashV4-' + os.platform() + '-' + nodeVersion + '.node');

      // Check if the directory containing the native modules exists.
      if (fs.existsSync(moduleDir) === false) {
        throw util.format(errorMessages.moduleDirNotFound, moduleDir, moduleName);
      } else {
        // Try to load the native module for the current platform
        // and node version.
        try {
          swigWrapper = require(moduleName);
        } catch (err) {
          // Couldn't load the native module so we need to give the
          // user some information.
          var modules = {};
          // Go through all the available modules to build a list of
          // supported platform/Node version combinations.
          fs.readdirSync(moduleDir).forEach(file => {
            const parts = file.split(/-|\./);
            const plat = parts[1] === 'win32' ? 'windows' : parts[1];
            if (modules.hasOwnProperty(plat)) {
              modules[plat].push(parts[2]);
            } else {
              modules[plat] = [parts[2]];
            }
          });

          let availableModules = '';
          for (var platform in modules) {
            if (availableModules.length > 0) {
              availableModules = availableModules.concat(', ');
            }
            availableModules = availableModules.concat(platform +
              ' with Node versions: [' + modules[platform].sort().join(', ') + ']');
          }

          // Let the user know what's gone wrong.
          throw util.format(
            errorMessages.nativeModuleNotFound,
            moduleName,
            availableModules);
        }
      }
      dataFileType = 'HashV41';
    } else {
      throw errorMessages.invalidFileExtension;
    }

    if (typeof licenceKeys === 'undefined') {
      throw errorMessages.licenseKeyRequired;
    }

    // Create vector for restricted properties
    const propertiesList = new swigWrapper.VectorStringSwig();

    if (restrictedProperties) {
      restrictedProperties.forEach(function (property) {
        propertiesList.add(property);
      });
    }

    var requiredProperties = new swigWrapper.RequiredPropertiesConfigSwig(propertiesList);

    var config = new swigWrapper['Config' + swigWrapperType + 'Swig']();

    switch (performanceProfile) {
      case 'LowMemory':
        config.setLowMemory();
        break;
      case 'MaxPerformance':
        config.setMaxPerformance();
        break;
      case 'Balanced':
        config.setBalanced();
        break;
      case 'BalancedTemp':
        config.setBalancedTemp();
        break;
      case 'HighPerformance':
        config.setHighPerformance();
        break;
      default:
        throw util.format(
          errorMessages.invalidPerformanceProfile,
          performanceProfile);
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

    if (typeof allowUnmatched === 'boolean') {
      config.setAllowUnmatched(allowUnmatched);
    };

    if (maxMatchedUserAgentLength) {
      config.setMaxMatchedUserAgentLength(maxMatchedUserAgentLength);
    }

    if (swigWrapperType === 'Hash') {
      if (drift) {
        config.setDrift(drift);
      }
    }

    if (difference) {
      config.setDifference(difference);
    }

    config.setConcurrency(concurrency);

    config.setUsePredictiveGraph(usePredictiveGraph);

    config.setUsePerformanceGraph(usePerformanceGraph);

    // This should always be set to 'false' for on-premise
    config.setUseUpperPrefixHeaders(false);

    super(...arguments);

    this.dataKey = 'device';

    const current = this;

    // Function for initialising the engine, wrapped like this so
    // that an engine can be initialised once the datafile is
    // retrieved if updateOnStart is set to true

    this.initEngine = function () {
      return new Promise(function (resolve, reject) {
        const engine = new swigWrapper['Engine' + swigWrapperType + 'Swig'](dataFilePath, config, requiredProperties);

        // Get keys and add to evidenceKey filter

        const evidenceKeys = engine.getKeys();

        const evidenceKeyArray = [];

        for (let i = 0; i < evidenceKeys.size(); i += 1) {
          evidenceKeyArray.push(evidenceKeys.get(i).toLowerCase());
        }

        current.evidenceKeyFilter = new EvidenceKeyFilter(evidenceKeyArray);

        current.engine = engine;
        current.swigWrapper = swigWrapper;
        current.swigWrapperType = swigWrapperType;

        // Get properties list

        const propertiesInternal = engine.getMetaData().getProperties();

        const properties = {};

        for (var i = 0; i < propertiesInternal.getSize(); i++) {
          var property = propertiesInternal.getByIndex(i);
          if (property.getAvailable()) {
            properties[property.getName().toLowerCase()] = {
              name: property.getName(),
              type: property.getType(),
              datafiles: swigHelpers.vectorToArray(property.getDataFilesWherePresent()),
              category: property.getCategory(),
              description: property.getDescription()
            };
          }
        };

        current.properties = properties;

        // Special properties

        current.properties.deviceID = {
          name: 'DeviceId',
          type: 'string',
          category: 'Device metrics',
          description: 'Consists of four components separated by a hyphen symbol: Hardware-Platform-Browser-IsCrawler where each Component represents an ID of the corresponding Profile.'
        };

        current.properties.userAgents = {
          name: 'UserAgents',
          type: 'string[]',
          category: 'Device metrics',
          description: 'The matched User-Agents.'
        };

        current.properties.difference = {
          name: 'Difference',
          type: 'int',
          category: 'Device metrics',
          description: 'Used when detection method is not Exact or None. This is an integer value and the larger the value the less confident the detector is in this result.'
        };

        if (swigWrapperType === 'Hash') {
          current.properties.matchedNodes = {
            name: 'MatchedNodes',
            type: 'int',
            category: 'Device metrics',
            description: 'Indicates the number of hash nodes matched within the evidence.'
          };

          current.properties.drift = {
            name: 'Drift',
            type: 'int',
            category: 'Device metrics',
            description: 'Total difference in character positions where the substrings hashes were found away from where they were expected.'
          };
        }
      });
    };

    if (!updateOnStart) {
      // Not updating on start. Initialise the engine straight away

      this.initEngine();
    }

    // Disable features that require a license key if one was
    // not supplied.
    if (licenceKeys) {
      autoUpdate = autoUpdate && licenceKeys.length > 0;
      updateOnStart = updateOnStart && licenceKeys.length > 0;
    } else {
      autoUpdate = false;
      updateOnStart = false;
    }

    // Construct datafile
    const dataFileSettings = {
      flowElement: this,
      verifyMD5: true,
      autoUpdate: autoUpdate,
      updateOnStart: updateOnStart,
      decompress: true,
      path: dataFilePath,
      download: download,
      fileSystemWatcher: fileSystemWatcher,
      pollingInterval: pollingInterval,
      updateTimeMaximumRandomisation: updateTimeMaximumRandomisation
    };

    dataFileSettings.getDatePublished = function () {
      if (current.engine) {
        return swigHelpers.swigDateToDate(current.engine.getPublishedTime());
      } else {
        return new Date();
      }
    };

    dataFileSettings.getNextUpdate = function () {
      if (current.engine) {
        return swigHelpers.swigDateToDate(current.engine.getUpdateAvailableTime());
      } else {
        return new Date();
      }
    };

    dataFileSettings.refresh = function () {
      if (current.engine) {
        return current.engine.refreshData();
      } else {
        current.initEngine().then(function () {
          current.engine.refreshData();
        });
      }
    };

    const params = {
      Type: dataFileType,
      Download: 'True'
    };

    if (licenceKeys) {
      params.licenseKeys = licenceKeys;
    }

    params.baseURL = dataFileUpdateBaseUrl;

    dataFileSettings.updateURLParams = params;

    dataFileSettings.identifier = dataFileType;

    const ddDatafile = new DataFile(dataFileSettings);

    this.registerDataFile(ddDatafile);
  }

  /**
   * Internal process method for Device Detection On Premise engine
   * Fetches the results from the SWIG wrapper into an instance of
   * the SwigData class which can be used to retrieve results from
   * the FlowData.
   *
   * @param {FlowData} flowData FlowData to process
   * @returns {Promise} the result of processing
   **/
  processInternal (flowData) {
    const dd = this;

    const process = function () {
      // set evidence

      const evidence = new dd.swigWrapper.EvidenceDeviceDetectionSwig();

      Object.entries(flowData.evidence.getAll()).forEach(function ([key, value]) {
        evidence.set(key, value);
      });

      const result = dd.engine.process(evidence);

      const data = new SwigData({ flowElement: dd, swigResults: result });

      flowData.setElementData(data);
    };

    // Check if engine is initialised already

    if (this.engine) {
      process();
    } else {
      // wait until initialised

      return new Promise(function (resolve) {
        const dataFileChecker = setInterval(function () {
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

module.exports = DeviceDetectionOnPremise;
