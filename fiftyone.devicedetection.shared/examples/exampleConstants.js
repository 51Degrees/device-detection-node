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
  // This collection contains the various input values that will
  // be used when running the examples.
  defaultEvidenceValues: [
    // A User-Agent from a mobile device.
    new Map([
      ['header.user-agent', 'Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G960U) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'SamsungBrowser/10.1 Chrome/71.0.3578.99 Mobile ' +
        'Safari/537.36']
    ]),
    // A User-Agent from a desktop device.
    new Map([
      ['header.user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/78.0.3904.108 Safari/537.36']
    ]),
    // Evidence values from a windows 11 device using a browser
    // that supports User-Agent Client Hints.
    new Map([
      ['header.user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/98.0.4758.102 Safari/537.36'],
      ['header.sec-ch-ua-mobile', '?0'],
      ['header.sec-ch-ua', '" Not A; Brand";v="99", "Chromium";v="98", ' +
        '"Google Chrome";v="98"'],
      ['header.sec-ch-ua-platform', '"Windows"'],
      ['header.sec-ch-ua-platform-version', '"14.0.0"']
    ])
  ],
  fileNames: {
    enterpriseDataFileName: 'Enterprise-HashV41.hash',
    liteDataFileName: '51Degrees-LiteV4.1.hash',
    uaFileName: '20000 User Agents.csv',
    evidenceFileName: '20000 Evidence Records.yml'
  }
};
