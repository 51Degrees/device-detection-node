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
const PipelineBuilder = core.PipelineBuilder;
const EngineBuilder = require(
  __dirname + '/../deviceDetectionOnPremise'
);
const fs = require('fs');
const path = require('path');

const LiteDataFile = (process.env.directory || __dirname) + '/../device-detection-cxx/device-detection-data/51Degrees-LiteV4.1.hash';
const DataFile = (process.env.directory || __dirname) + '/51Degrees.hash';

const MobileUserAgent =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 7_1 like Mac OS X) " +
  "AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile" +
  "/11D167 Safari/9537.53";

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
      console.error(err)
    }
  });

  // Check that for a successful detection, all properties loaded by the engine 
  // are accessible in the results.
  test('Available Properties', async done => {
    var engine = new EngineBuilder({
      dataFilePath: DataFile,
      autoUpdate: false,
      licenceKeys: ""
    });
    var pipeline = new PipelineBuilder()
      .add(engine)
      .build();

    const flowData = pipeline.createFlowData();

    flowData.evidence.add('header.user-agent', MobileUserAgent);

    await flowData.process();

    Object.keys(engine.properties).forEach(key => {
      try {
        var apv = flowData.device[key];
        expect(apv).not.toBeNull();
        expect(apv).toBeDefined();
        if (apv.hasValue == true) {
          if (apv.value != null && apv.value != undefined) {
            // console.log(`${key}: ${apv.value}`)
            _ = apv.value;
          } else {
            done.fail(new Error(`${key}.value should not be null`))
          }
        } else {
          if (apv.noValueMessage != null && apv.noValueMessage != undefined) {
            // console.log(`${key}: ${apv.noValueMessage}`)
            _ = apv.noValueMessage;
          } else {
            done.fail(new Error(`${key}.noValueMessage should not be null`))
          }
        }
      } catch (err) {
        done.fail(err);
      }
    });
    done();
  });


  // Validate the the values for all properties returned are of the expected 
  // type.
  test('Value Types', async done => {
    var engine = new EngineBuilder({
      dataFilePath: DataFile,
      autoUpdate: false,
      licenceKeys: ""
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
    
    done();
  });

  // Validate the the device id is returned for a detection and that it is not
  // null. 
  test('DeviceID', async done => {
    var engine = new EngineBuilder({
      dataFilePath: DataFile,
      autoUpdate: false,
      licenceKeys: ""
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
    expect(deviceID.value).not.toBe("");

    done();
  });
  
  // Validate that for a successful detection, the matched User Agents are
  // returned in the results.
  test('Matched User Agents', async done => {

    var engine = new EngineBuilder({
      dataFilePath: DataFile,
      autoUpdate: false,
      licenceKeys: ""
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
        expect(substring).toEqual(original)
      });
    });

    done();
  });
});

// Extend expect object.
expect.extend({
  // Method to validate a given value has the expected type.
  toBe51DType(received, name, fodType) {
    var valueType = typeof received;
    var valid = false;
  
    switch (fodType) {
      case 'bool':
        valid = 'boolean' == valueType;
        break;
      case 'string':
        valid = 'string' == valueType;
        break;
      case 'javascript':
        valid = 'string' == valueType;
        break;
      case 'int':
        valid = 'number' == valueType;
        break;
      case 'double':
        valid = 'number' == valueType;
        break;
      case 'string[]':
        valid = 'object' == valueType && Array.isArray(received);
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
      }
    } else {
      return {
        message: () => 
          `${name}: expected node type '${valueType}' to be equivalent to fodType '${fodType}' for value: '${received}'`,
        pass: false
      }
    }
  }
});
