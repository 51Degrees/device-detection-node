/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2022 51 Degrees Mobile Experts Limited, Davidson House,
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

const path = require('path');
const FiftyOneDegreesDeviceDetectionOnPremise = require(path.join(__dirname,
  '/../../fiftyone.devicedetection.onpremise'));
const EngineBuilder = require(
  path.join(__dirname, '/../deviceDetectionOnPremise')
);
const DataFile = (process.env.directory || __dirname) + '/../device-detection-cxx/device-detection-data/51Degrees-LiteV4.1.hash';

describe('deviceDetectionOnPremise', () => {
  // Check that an exception is thrown if license key is not
  // specified when creating an on-premise engine.
  test('License key required', () => {
    const test = () => {
      EngineBuilder({
        dataFilePath: DataFile
      });
    };
    expect(test).toThrow();
  });

  // Check that an empty license key can be specified.
  // Also verify that this will cause auto update and
  // update on startup to be disabled.
  test('License key can be empty', done => {
    const engine = new EngineBuilder({
      dataFilePath: DataFile,
      licenceKeys: ''
    });

    const fakePipeline = {
      dataFileUpdateService: {
        registerDataFile: function (dataFileConfig) {
          // No license key so auto update and update on startup
          // should be disabled.
          expect(dataFileConfig.autoUpdate).toBe(false);
          expect(dataFileConfig.updateOnStart).toBe(false);
        }
      }
    };
    engine.registrationCallbacks[0](fakePipeline);

    done();
  });

  // Check that the license key is passed through correctly
  // if it is set.
  test('License key set', done => {
    const engine = new EngineBuilder({
      dataFilePath: DataFile,
      licenceKeys: 'ABC',
      autoUpdate: true,
      updateOnStart: true
    });

    const fakePipeline = {
      dataFileUpdateService: {
        registerDataFile: function (dataFileConfig) {
          expect(dataFileConfig.autoUpdate).toBe(true);
          expect(dataFileConfig.updateOnStart).toBe(true);
          expect(dataFileConfig.updateURLParams.licenseKeys).toBe('ABC');
        }
      }
    };
    engine.registrationCallbacks[0](fakePipeline);

    done();
  });

  // Check that if no evidence is provided for device
  // detection engine, accessing a valid property will
  // return HasValue=false and a correct error message
  test('No evidence error message', done => {
    const pipeline = new FiftyOneDegreesDeviceDetectionOnPremise
      .DeviceDetectionOnPremisePipelineBuilder({
        performanceProfile: 'MaxPerformance',
        dataFile: DataFile,
        autoUpdate: false
      }).build();
    const flowData = pipeline.createFlowData();

    flowData.process().then(function () {
      const ismobile = flowData.device.ismobile;
      expect(ismobile.hasValue).toBe(false);
      expect(ismobile.noValueMessage.indexOf('The evidence required to ' +
        'determine this property was not supplied. The most common evidence ' +
        'passed to this engine is \'header.user-agent\'.') !== -1).toBe(true);

      done();
    });
  });

  // Check that setting cache for on-premise engine will
  // throw exception
  test('No cache support for on-premise engine builder', done => {
    try {
      const engine = new EngineBuilder({
        dataFilePath: DataFile,
        cache: 100
      });
      console.log(engine);
    } catch (err) {
      expect(err.indexOf('cache cannot be configured') !== -1).toBe(true);

      done();
    }
  });

  // Check that setting cache for on-premise engine builder will
  // throw exception
  test('No cache support for on-premise engine', done => {
    try {
      new FiftyOneDegreesDeviceDetectionOnPremise
        .DeviceDetectionOnPremisePipelineBuilder({
          dataFile: DataFile,
          cacheSize: 100
        }).build();
    } catch (err) {
      expect(err.indexOf('cache cannot be configured') !== -1).toBe(true);

      done();
    }
  });

  // Check if components are set correctly
  test('Components for on-premise engine', done => {
    const pipeline = new FiftyOneDegreesDeviceDetectionOnPremise
      .DeviceDetectionOnPremisePipelineBuilder({
        dataFile: DataFile
      }).build();
    const device = pipeline.getElement('device');
    expect(Object.entries(device.components).length).toBe(5);
    let metricsComponent = false;
    for (const component of Object.values(device.components)) {
      const properties = component.getProperties();
      for (const property of properties) {
        if (property.name.toLowerCase() !== 'deviceid') {
          expect(property.component.name).toBe(component.name);
        }
      }

      if (component.name.toLowerCase() === 'metrics') {
        metricsComponent = true;
      }
    }
    expect(metricsComponent).toBe(true);
    done();
  });

  // Check if properties are set correctly
  test('Properties for on-premise engine', done => {
    const pipeline = new FiftyOneDegreesDeviceDetectionOnPremise
      .DeviceDetectionOnPremisePipelineBuilder({
        dataFile: DataFile
      }).build();
    const device = pipeline.getElement('device');
    expect(Object.entries(device.properties).length).toBeGreaterThan(0);
    done();
  });

  // Check that setting cache for on-premise engine builder will
  // throw exception
  test('profiles for on-premise engine', done => {
    const pipeline = new FiftyOneDegreesDeviceDetectionOnPremise
      .DeviceDetectionOnPremisePipelineBuilder({
        dataFile: DataFile
      }).build();
    const device = pipeline.getElement('device');
    const profiles = device.profiles();
    let count = 0;
    while (profiles.next() !== undefined && count < 20) {
      count++;
    }

    expect(count).toBe(20);
    done();
  });
});
