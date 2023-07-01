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

module.exports = {
  // Environment variables name for testing
  envVars: {
    superResourceKeyEnvVar: 'TEST_SUPER_RESOURCE_KEY',
    platformResourceKeyEnvVar: 'TEST_PLATFORM_RESOURCE_KEY',
    hardwareResourceKeyEnvVar: 'TEST_HARDWARE_RESOURCE_KEY',
    browserResourceKeyEnvVar: 'TEST_BROWSER_RESOURCE_KEY',
    noSetHeaderResourceKeyEnvVar: 'TEST_NO_SETHEADER_RESOURCE_KEY',
    licenseKeyEnvVar: 'TEST_LICENSE_KEY'
  },
  // User-Agent string for testing
  userAgents: {
    chromeUA: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 ' +
      'Safari/537.36',
    edgeUA: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 ' +
      'Safari/537.36 Edg/95.0.1020.44',
    firefoxUA: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) ' +
      'Gecko/20100101 Firefox/94.0',
    safariUA: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) ' +
      'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 ' +
      'Mobile/15E148 Safari/604.1',
    curlUA: 'curl/7.80.0'
  }
};
