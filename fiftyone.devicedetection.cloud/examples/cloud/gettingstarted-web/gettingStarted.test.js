/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2026 51 Degrees Mobile Experts Limited, Davidson House,
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
    return require(path.join(__dirname, '/../../../node_modules/', requestedPackage));
  } catch (e) {
    return require(path.join(__dirname, '/../../../../', requestedPackage));
  }
};

const request = require('supertest');

const fs = require('fs');

const OptionsExtension =
  require51('fiftyone.devicedetection.shared').optionsExtension;

// Test constants
const tc = require51('fiftyone.devicedetection.shared').testConstants;

const keyUtils = require51('fiftyone.devicedetection.shared').keyUtils;

// Load the example module
const example = require(path.join(__dirname, '/gettingStarted.js'));

describe('Examples', () => {
  test('cloud getting started web', async () => {
    // Load configuration options
    const options = JSON.parse(fs.readFileSync(path.join(__dirname, '/51d.json')));
    // Update element path with a full path
    OptionsExtension.updateElementPath(options, __dirname);
    const resourceKey = keyUtils.getResourceKey(
      tc.envVars.superResourceKeyEnvVar);

    if (!resourceKey) {
      // The message names the variable that was wanted, so whoever reads
      // the run knows what to set.
      throw new Error(keyUtils.missingResourceKeyMessage(
        tc.envVars.superResourceKeyEnvVar));
    }

    OptionsExtension.setResourceKey(options, resourceKey);

    example.setPipeline(options);
    const response = await request(example.server)
      .get('/')
      .set('User-Agent', 'abc');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('src="/51Degrees.core.js"');

    // The script referenced by the page must be served as JavaScript rather
    // than falling through to the page itself.
    const script = await request(example.server)
      .get('/51Degrees.core.js')
      .set('User-Agent', 'abc');
    expect(script.statusCode).toBe(200);
    expect(script.headers['content-type']).toContain('javascript');
    expect(script.text).toContain('fiftyoneDegreesManager');

    // A recognised User-Agent must produce a device id in the rendered page.
    // A device id of all zeros means nothing was matched.
    const detected = await request(example.server)
      .get('/')
      .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    expect(detected.statusCode).toBe(200);
    const deviceId = /Device Id:.*?c-eg-table__cell">([\d-]+)</s
      .exec(detected.text);
    expect(deviceId).not.toBeNull();
    expect(deviceId[1]).toMatch(/^\d+-\d+-\d+-\d+$/);
    expect(deviceId[1]).not.toBe('0-0-0-0');
  });
});
