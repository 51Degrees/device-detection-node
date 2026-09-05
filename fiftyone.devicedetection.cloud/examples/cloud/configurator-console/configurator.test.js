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
    return require(requestedPackage);
  } catch (e) {
    return require(path.join(__dirname, '/../../../../', requestedPackage));
  }
};

const example = require(path.join(__dirname, '/configurator.js'));

const shared = require51('fiftyone.devicedetection.shared');
const tc = shared.testConstants;
const keyUtils = shared.keyUtils;
const ExampleOutput = shared.exampleOutput.ExampleOutput;

describe('Examples', () => {
  test('cloud configurator', async () => {
    const resourceKey = keyUtils.getResourceKey(
      tc.envVars.superResourceKeyEnvVar);

    if (!resourceKey) {
      // The message names the variable that was wanted, so whoever reads
      // the run knows what to set.
      throw new Error(keyUtils.missingResourceKeyMessage(
        tc.envVars.superResourceKeyEnvVar));
    }

    const output = new ExampleOutput();

    await example.run(resourceKey, output);

    // The example prints one line, which either carries the value or says
    // why the resource key does not include it.
    expect(output.text()).toContain('device.ismobile: ');
    expect(output.faults()).toEqual([]);
    expect(output.text().trim()).not.toBe('device.ismobile:');
  });
});
