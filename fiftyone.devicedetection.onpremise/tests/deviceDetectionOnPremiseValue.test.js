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
const require51 = (requestedPackage) => {
  try {
    return require(path.join(__dirname, '/../', requestedPackage));
  } catch (e) {
    return require(requestedPackage);
  }
};

const core = require51('fiftyone.pipeline.core');
const PipelineBuilder = core.PipelineBuilder;
const EngineBuilder = require(
  path.join(__dirname, '/../deviceDetectionOnPremise')
);
const constants = require(path.join(__dirname, '/../constants'));
const fs = require('fs');

const LiteDataFile = (process.env.directory || __dirname) + '/../device-detection-cxx/device-detection-data/51Degrees-LiteV4.1.hash';
const DataFile = (process.env.directory || __dirname) + '/51Degrees.hash';

const MobileUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1 like Mac OS X) ' +
  'AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile' +
  '/11D167 Safari/9537.53';

describe('deviceDetectionOnPremise', () => {
  beforeAll(() => {
    // Copy data file to test directory if one does not exist.
    try {
      if (!fs.existsSync(DataFile)) {
        fs.copyFile(LiteDataFile, DataFile, (err) => {
          if (err) throw err;
          console.log(`${LiteDataFile} was copied to ${DataFile}`);
        });
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Check that for a successful detection, all properties loaded by the engine
  // are accessible in the results.
  test('Available Properties', async () => {
    var engine = new EngineBuilder({
      dataFilePath: DataFile,
      autoUpdate: false,
      licenceKeys: ''
    });
    var pipeline = new PipelineBuilder()
      .add(engine)
      .build();

    const flowData = pipeline.createFlowData();

    flowData.evidence.add('header.user-agent', MobileUserAgent);

    await flowData.process();

    Object.keys(engine.properties).forEach(key => {
      var apv = flowData.device[key];
      expect(apv).not.toBeNull();
      expect(apv).toBeDefined();
      if (apv.hasValue === true) {
        if (apv.value !== null && apv.value !== undefined) {
          console.log(`${key}: ${apv.value}`);
        } else {
          throw new Error(`${key}.value should not be null`);
        }
      } else {
        if (apv.noValueMessage !== null && apv.noValueMessage !== undefined) {
          console.log(`${key}: ${apv.noValueMessage}`);
        } else {
          throw new Error(`${key}.noValueMessage should not be null`);
        }
      }
    });
  });

  // Validate the descriptions of match metrics properties.
  test('Match Metrics Description', async () => {
    var engine = new EngineBuilder({
      dataFilePath: DataFile,
      autoUpdate: false,
      licenceKeys: ''
    });
    var pipeline = new PipelineBuilder()
      .add(engine)
      .build();

    const flowData = pipeline.createFlowData();

    flowData.evidence.add('header.user-agent', MobileUserAgent);

    await flowData.process();

    expect(engine.properties.deviceID.description).toBeDefined();
    expect(engine.properties.deviceID.description).toEqual(constants.deviceIdDescription);
    expect(engine.properties.userAgents.description).toBeDefined();
    expect(engine.properties.userAgents.description).toEqual(constants.userAgentsDescription);
    expect(engine.properties.difference.description).toBeDefined();
    expect(engine.properties.difference.description).toEqual(constants.differenceDescription);
    expect(engine.properties.method.description).toBeDefined();
    expect(engine.properties.method.description).toEqual(constants.methodDescription);
    expect(engine.properties.matchedNodes.description).toBeDefined();
    expect(engine.properties.matchedNodes.description).toEqual(constants.matchedNodesDescription);
    expect(engine.properties.drift.description).toBeDefined();
    expect(engine.properties.drift.description).toEqual(constants.driftDescription);
    expect(engine.properties.iterations.description).toBeDefined();
    expect(engine.properties.iterations.description).toEqual(constants.iterationsDescription);
  });

  // Validate the the values for all properties returned are of the expected
  // type.
  test('Value Types', async () => {
    var engine = new EngineBuilder({
      dataFilePath: DataFile,
      autoUpdate: false,
      licenceKeys: ''
    });
    var pipeline = new PipelineBuilder()
      .add(engine)
      .build();

    const flowData = pipeline.createFlowData();

    flowData.evidence.add('header.user-agent', MobileUserAgent);

    await flowData.process();

    Object.keys(engine.properties).forEach(key => {
      var property = engine.properties[key];
      var expectedType = property.type;
      var apv = flowData.device[key];
      expect(apv).not.toBeNull();
      expect(apv).toBeDefined();

      expect(apv.value).toBe51DType(key, expectedType);
    });
  });

  // Validate the the device id is returned for a detection and that it is not
  // null.
  test('DeviceID', async () => {
    var engine = new EngineBuilder({
      dataFilePath: DataFile,
      autoUpdate: false,
      licenceKeys: ''
    });
    var pipeline = new PipelineBuilder()
      .add(engine)
      .build();

    const flowData = pipeline.createFlowData();

    flowData.evidence.add('header.user-agent', MobileUserAgent);

    await flowData.process();

    var deviceID = flowData.device.deviceID;

    expect(deviceID).not.toBeNull();
    expect(deviceID).toBeDefined();

    expect(deviceID.value).not.toBeNull();
    expect(deviceID.value).toBeDefined();
    expect(deviceID.value).not.toBe('');
  });

  // Validate that for a successful detection, the matched User Agents are
  // returned in the results.
  test('Matched User Agents', async () => {
    var engine = new EngineBuilder({
      dataFilePath: DataFile,
      autoUpdate: false,
      licenceKeys: ''
    });
    var pipeline = new PipelineBuilder()
      .add(engine)
      .build();

    const flowData = pipeline.createFlowData();

    flowData.evidence.add('header.user-agent', MobileUserAgent);

    await flowData.process();

    var userAgents = flowData.device.userAgents;

    expect(userAgents).not.toBeNull();
    expect(userAgents).toBeDefined();

    expect(userAgents.hasValue).toBeTruthy();
    expect(userAgents.value).not.toBeNull();
    expect(userAgents.value).toBeDefined();

    expect(userAgents.value.length).toBe(1);

    userAgents.value.forEach(matchedUa => {
      matchedUa.split(/[_{}]/g).forEach(substring => {
        expect(MobileUserAgent.includes(substring)).toBeTruthy();
        var index = matchedUa.indexOf(substring);
        var original = MobileUserAgent.substring(index, substring.length);
        expect(substring).toEqual(original);
      });
    });
  });
});

// Extend expect object.
expect.extend({
  // Method to validate a given value has the expected type.
  toBe51DType (received, name, fodType) {
    var valueType = typeof received;
    var valid = false;

    switch (fodType) {
      case 'bool':
        valid = valueType === 'boolean';
        break;
      case 'string':
        valid = valueType === 'string';
        break;
      case 'javascript':
        valid = valueType === 'string';
        break;
      case 'int':
        valid = valueType === 'number';
        break;
      case 'double':
        valid = valueType === 'number';
        break;
      case 'string[]':
        valid = valueType === 'object' && Array.isArray(received);
        break;
      default:
        valid = false;
        break;
    }

    if (valid) {
      return {
        message: () =>
          `${name}: expected node type '${valueType}' not to be equivalent to fodType '${fodType}' for value: '${received}'`,
        pass: true
      };
    } else {
      return {
        message: () =>
          `${name}: expected node type '${valueType}' to be equivalent to fodType '${fodType}' for value: '${received}'`,
        pass: false
      };
    }
  }
});
