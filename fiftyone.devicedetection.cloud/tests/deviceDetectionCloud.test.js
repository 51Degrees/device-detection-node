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

const cloudRequestEngine = require51('fiftyone.pipeline.cloudrequestengine');
const RequestEngineBuilder = cloudRequestEngine.CloudRequestEngine;

const EngineBuilder = require(
  path.join(__dirname, '/../deviceDetectionCloud')
);
const DeviceDetectionCloudPipelineBuilder = require(
  path.join(__dirname, '/../deviceDetectionCloudPipelineBuilder'));
const errorMessages = require('fiftyone.devicedetection.shared').errorMessages;

const fs = require('fs');
const each = require('jest-each').default;

const CSVDataFile = (process.env.directory || __dirname) + '/51Degrees.csv';
const MobileUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1 like Mac OS X) ' +
  'AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile' +
  '/11D167 Safari/9537.53';

const myResourceKey = process.env.RESOURCE_KEY || '!!YOUR_RESOURCE_KEY!!';

describe('deviceDetectionCloud', () => {
  beforeAll(() => {
    expect(fs.existsSync(CSVDataFile)).toBe(true);
  });

  // Check that if no evidence is provided for device
  // detection engine, accessing a valid property will
  // return HasValue=false and a correct error message
  //
  // TODO: Enable when supported.
  test.skip('No evidence error message', done => {
    if (myResourceKey === '!!YOUR_RESOURCE_KEY!!') {
      throw new Error('No resource key is present!');
    } else {
      const pipeline = new DeviceDetectionCloudPipelineBuilder({
        resourceKey: myResourceKey
      }).build();
      const flowData = pipeline.createFlowData();

      flowData.process().then(function () {
        const ismobile = flowData.device.ismobile;
        expect(ismobile.hasValue).toBe(false);
        console.log(ismobile.noValueMessage);
        expect(ismobile.noValueMessage.indexOf(
          errorMessages.evidenceNotFound) !== -1).toBe(true);

        done();
      });
    }
  });

  // Check that for a successful detection, all properties loaded by the engine
  // are accessible in the results.
  test('Available Properties', async () => {
    const line = await readFirstLine(CSVDataFile).catch(e => {});

    const properties = line
      .replace(/["\r]/g, '')
      .split(',');

    const requestEngine = new RequestEngineBuilder({
      resourceKey: myResourceKey
    });
    const engine = new EngineBuilder();

    const pipeline = new PipelineBuilder()
      .add(requestEngine)
      .add(engine)
      .build();

    const flowData = pipeline.createFlowData();

    flowData.evidence.add('header.user-agent', MobileUserAgent);

    await flowData.process();

    properties.forEach(key => {
    // TODO: Once 'setheader' properties are supported, remove this check.
      if (!key.toLowerCase().startsWith('setheader')) {
        const apv = flowData.device[key.toLowerCase()];
        if (apv === undefined) {
          throw new Error(`Aspect property value for ${key} should not be undefined.`);
        }
        expect(apv).not.toBeNull();
        if (apv.hasValue === true) {
          if (apv.value === null || apv.value === undefined) {
            throw new Error(`${key}.value should not be null`);
          }
        } else {
          if (apv.noValueMessage === null || apv.noValueMessage === undefined) {
            throw new Error(`${key}.noValueMessage should not be null`);
          }
        }
      }
    });
  });

  test('Value Types', async () => {
    const line = await readFirstLine(CSVDataFile).catch(e => {});

    const properties = line
      .replace(/["\r]/g, '')
      .split(',');

    const requestEngine = new RequestEngineBuilder({
      resourceKey: myResourceKey
    });
    const engine = new EngineBuilder();

    const pipeline = new PipelineBuilder()
      .add(requestEngine)
      .add(engine)
      .build();

    const flowData = pipeline.createFlowData();

    flowData.evidence.add('header.user-agent', MobileUserAgent);

    await flowData.process();

    properties.forEach(key => {
    // TODO: Remove this check once 'setheader' properties are supported in Cloud.
      if (!key.toLowerCase().startsWith('setheader')) {
        const property = engine.properties[key.toLowerCase()];
        if (property === undefined) {
          throw new Error(`No property metadata defined for ${key.toLowerCase()}`);
        }
        const expectedType = property.type;
        const apv = flowData.device[key.toLowerCase()];
        expect(apv).not.toBe(null);
        expect(apv).toBeDefined();
        expect(apv.value).toBe51DType(key, expectedType);
      }
    });
  });
});

function readFirstLine (filePath) {
  const rs = fs.createReadStream(path.resolve(filePath));
  let line = '';
  let pos = 0;
  let index;
  return new Promise((resolve, reject) => {
    rs
      .on('data', function (chunk) {
        index = chunk.indexOf('\n');
        line += chunk;
        index !== -1 ? rs.close() : pos += chunk.length;
      })
      .on('close', function () {
        resolve(line.slice(0, pos + index));
      })
      .on('error', function (err) {
        reject(err);
      });
  });
}

expect.extend({
  // Method to validate a given value has the expected type.
  toBe51DType (received, name, fodType) {
    const valueType = typeof received;
    let valid = false;

    switch (fodType) {
      case 'Boolean':
        valid = valueType === 'boolean';
        break;
      case 'String':
        valid = valueType === 'string';
        break;
      case 'JavaScript':
        valid = valueType === 'string';
        break;
      case 'Int32':
        valid = valueType === 'number';
        break;
      case 'Double':
        valid = valueType === 'number';
        break;
      case 'Array':
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

// Verify that making requests using a resource key that
// is limited to particular origins will fail or succeed
// in the expected scenarios.
// This is an integration test that uses the live cloud service
// so any problems with that service could affect the result
// of this test.
describe('Origin Header', () => {
  each([
    ['', true],
    ['test.com', true],
    ['51degrees.com', false]
  ]).test('origin header set to "%s"', async (origin, expectError) => {
    let error = false;
    let message = '';
    const expectErrorMessage = `This Resource Key is not authorized for use with this domain: '${origin}'`;

    const pipeline = new DeviceDetectionCloudPipelineBuilder({
      // Resource key configured with '51degrees.com' as allowed domains.
      resourceKey: 'AQS5HKcyVj6B8wNG2Ug',
      cloudRequestOrigin: origin
    }).build();

    // We want to monitor for the expected error message
    pipeline.on('error', (err) => {
      error = true;
      message = err;
    });

    const flowData = pipeline.createFlowData();
    // Catch error so test does not fail on expected error.
    await flowData.process().catch(e => {
      expect(e.length).toBe(1);
      expect(e[0].message).toContain(expectErrorMessage);
    });

    expect(error).toBe(expectError);
    if (error) {
      expect(message).toContain(expectErrorMessage);
    }
  });
});
