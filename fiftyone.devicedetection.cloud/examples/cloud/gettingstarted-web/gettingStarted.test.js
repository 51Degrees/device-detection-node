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
const request = require('supertest');

const fs = require('fs');

const OptionsExtension =
  require('fiftyone.devicedetection.shared').optionsExtension;

// Test constants
const tc = require('fiftyone.devicedetection.shared').testConstants;

// Load the example module
const example = require(path.join(__dirname, '/gettingStarted.js'));

describe('Examples', () => {
  test('cloud getting started web', async () => {
    // Load configuration options
    const options = JSON.parse(fs.readFileSync(path.join(__dirname, '/51d.json')));

    console.log(OptionsExtension);
    console.log(options);

    // Update element path with a full path
    OptionsExtension.updateElementPath(options, __dirname);
    OptionsExtension.setResourceKey(
      options, process.env[tc.envVars.superResourceKeyEnvVar]);

    example.setPipeline(options);
    const response = await request(example.server)
      .get('/')
      .set('User-Agent', 'abc');
    expect(response.statusCode).toBe(200);
  });
});
