/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2023 51 Degrees Mobile Experts Limited, Davidson House,
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

/**
 * Helpers to obtain keys from the environment
 */
module.exports = {
  /**
   * Obtain a key either from environment variable or from a property.
   * Try resource key as env var, then as upper case env var, the system property
   */
  getNamedKey: function (keyName) {
    let value = process.env[keyName];
    if (!value) {
      value = process.env[keyName.toUpperCase()];
    }
    return value;
  },

  /**
   * Evaluate whether a key might be valid
   * @param keyValue value to test
   * @return boolean
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
