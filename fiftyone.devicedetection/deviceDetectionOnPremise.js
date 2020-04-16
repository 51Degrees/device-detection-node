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
const engines = require51('fiftyone.pipeline.engines');

const Engine = engines.Engine;
const DataFile = require('./deviceDetectionDataFile');
const SwigData = require('./swigData');
const swigHelpers = require('./swigHelpers');
const os = require('os');
const path = require('path');
const EvidenceKeyFilter = core.BasicListEvidenceKeyFilter;

// Determine if Windows or linux and which node version

const nodeVersion = Number(process.version.match(/^v(\d+\.)/)[1]);

class DeviceDetectionOnPremise extends Engine {
  constructor ({ dataFile, autoUpdate, cache, dataFileUpdateBaseUrl = 'https://distributor.51degrees.com/api/v2/download', restrictedProperties, licenceKeys, download, performanceProfile = 'LowMemory', reuseTempFile = false, updateMatchedUserAgent = false, maxMatchedUserAgentLength, drift, difference, concurrency = os.cpus().length, allowUnmatched, fileSystemWatcher, createTempDataCopy, updateOnStart = false }) {
    let swigWrapper;
    let swigWrapperType;
    let dataFileType;

    // look at dataFile extension to detect type

    const ext = path.parse(dataFile).ext;

    if (ext === '.hash') {
      // Hash

      swigWrapperType = 'Hash';
      swigWrapper = require('./build/FiftyOneDeviceDetectionHashV4-' + os.platform() + '-' + nodeVersion + '.node');
      dataFileType = 'HashV41';
    }

    if (!dataFile) {
      throw 'Datafile is required';
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

    super(...arguments);

    this.dataKey = 'device';

    const current = this;

    // Function for initialising the engine, wrapped like this so that an engine can be initialised once the datafile is retrieved if updateOnStart is set to true

    this.initEngine = function () {
      return new Promise(function (resolve, reject) {
        const engine = new swigWrapper['Engine' + swigWrapperType + 'Swig'](dataFile, config, requiredProperties);

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
              dataFiles: swigHelpers.vectorToArray(property.getDataFilesWherePresent()),
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
          type: 'string',
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

    // Construct datafile

    const dataFileSettings = { flowElement: this, verifyMD5: true, autoUpdate: autoUpdate, updateOnStart: updateOnStart, decompress: true, path: dataFile, download: download, fileSystemWatcher: fileSystemWatcher };

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
      Type: dataFileType + 'UAT',
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
