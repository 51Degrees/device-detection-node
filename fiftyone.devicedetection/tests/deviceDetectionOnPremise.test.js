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

const EngineBuilder = require(
  __dirname + '/../../fiftyone.devicedetection/deviceDetectionOnPremise'
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

    var fakePipeline = {
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

  // Check that the the license key is passed through correctly
  // if it is set.
  test('License key set', done => {
    const engine = new EngineBuilder({
      dataFilePath: DataFile,
      licenceKeys: 'ABC',
      autoUpdate: true,
      updateOnStart: true
    });

    var fakePipeline = {
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
});
