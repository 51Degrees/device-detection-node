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

const testConstants = require('./testConstants');

// Placeholder written into example configuration files, which stands for
// 'no key has been set here'.
const PLACEHOLDER = '!!YOUR_RESOURCE_KEY!!';

/**
 * The environment variable names to try for a resource key, aligned name
 * first and the name it replaced second.
 *
 * @param {string} envVarName One of testConstants.envVars
 * @returns {Array<string>} The names to try, in order
 */
const resourceKeyNames = function (envVarName) {
  const names = [envVarName];
  const legacy = testConstants.legacyEnvVars[envVarName];

  if (legacy) {
    names.push(legacy);
  }

  return names;
};

/**
 * Helpers to obtain keys from the environment
 */
module.exports = {
  /**
   * Obtain a key either from environment variable or from a property.
   * Try resource key as env var, then as upper case env var, the system property
   *
   * @param {string} keyName Name of the key
   * @returns {string} Key value
   */
  getNamedKey: function (keyName) {
    let value = process.env[keyName];
    if (!value) {
      value = process.env[keyName.toUpperCase()];
    }
    return value;
  },

  /**
   * Obtain a resource key from the environment.
   *
   * The aligned '_51DEGREES_RESOURCE_KEY...' name is tried first, then the
   * name this repository used before the convention was adopted, so an
   * existing setup keeps working.
   *
   * @param {string} envVarName One of testConstants.envVars
   * @returns {string} The key, or undefined when neither name is set
   */
  getResourceKey: function (envVarName) {
    const names = resourceKeyNames(envVarName);

    for (const name of names) {
      const value = process.env[name];

      if (value && value !== PLACEHOLDER) {
        return value;
      }
    }

    return undefined;
  },

  /**
   * The message to show when a resource key is missing, naming the
   * variable that was wanted rather than leaving the reader to guess.
   *
   * @param {string} envVarName One of testConstants.envVars
   * @returns {string} The message
   */
  missingResourceKeyMessage: function (envVarName) {
    const names = resourceKeyNames(envVarName);
    let message = 'No resource key found. Set the environment variable ' +
      `'${names[0]}'`;

    if (names.length > 1) {
      message += ` (the older name '${names[1]}' is still read)`;
    }

    return message + '. Create a resource key for free at ' +
      'https://configure.51degrees.com?utm_source=code&utm_medium=example&utm_campaign=device-detection-node&utm_content=fiftyone.devicedetection.shared-tests-keyutils.js&utm_term=resource-key-required';
  },

  /**
   * Evaluate whether a key might be valid
   *
   * @param {string} keyValue Value to test
   * @returns {boolean} Is invalid key
   */
  isInvalidKey: function (keyValue) {
    try {
      const buff = Buffer.from(keyValue, 'base64');
      const decoded = buff.toString('ascii');
      return !keyValue ||
        keyValue.trim().length < 19 ||
        decoded.length < 14;
    } catch (e) {
      return true;
    }
  }
};
