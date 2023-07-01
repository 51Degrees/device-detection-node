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

const path = require('path');
const request = require('supertest');
// Test constants
const tc = require('fiftyone.devicedetection.shared').testConstants;

// Load the example module
const example = require(path.join(__dirname, '/userAgentClientHintsWeb.js'));

describe('Examples', () => {
  test.each([
    ['All available properties',
      {
        resourceKeyEnvVar: tc.envVars.superResourceKeyEnvVar,
        userAgents: [
          tc.userAgents.chromeUA,
          tc.userAgents.edgeUA
        ]
      },
      [{
        headerName: 'Accept-CH',
        headerValue: ['Sec-CH-UA-Model',
          'Sec-CH-UA-Platform',
          'Sec-CH-UA']
      }]
    ],
    ['SetHeaderPlatformAccept-CH',
      {
        resourceKeyEnvVar: tc.envVars.platformResourceKeyEnvVar,
        userAgents: [
          tc.userAgents.chromeUA,
          tc.userAgents.edgeUA
        ]
      },
      [{
        headerName: 'Accept-CH',
        headerValue: ['Sec-CH-UA-Platform']
      }]
    ],
    ['SetHeaderHardwareAccept-CH',
      {
        resourceKeyEnvVar: tc.envVars.hardwareResourceKeyEnvVar,
        userAgents: [
          tc.userAgents.chromeUA,
          tc.userAgents.edgeUA
        ]
      },
      [{
        headerName: 'Accept-CH',
        headerValue: ['Sec-CH-UA-Model']
      }]
    ],
    ['SetHeaderBrowserAccept-CH',
      {
        resourceKeyEnvVar: tc.envVars.browserResourceKeyEnvVar,
        userAgents: [
          tc.userAgents.chromeUA,
          tc.userAgents.edgeUA
        ]
      },
      [{
        headerName: 'Accept-CH',
        headerValue: ['Sec-CH-UA']
      }]
    ],
    // TODO: Falls with errors
    // ['No SetHeader properties',
    //   {
    //     resourceKeyEnvVar: tc.envVars.noSetHeaderResourceKeyEnvVar,
    //     userAgents: [
    //       tc.userAgents.chromeUA,
    //       tc.userAgents.edgeUA
    //     ]
    //   },
    //   [{
    //     headerName: 'Accept-CH',
    //     headerValue: null
    //   }]
    // ],
    ['No UACH supports',
      {
        resourceKeyEnvVar: tc.envVars.superResourceKeyEnvVar,
        userAgents: [
          tc.userAgents.firefoxUA,
          tc.userAgents.safariUA,
          tc.userAgents.curlUA
        ]
      },
      [{
        headerName: 'Accept-CH',
        headerValue: null
      }]
    ]
  ])('hash user agent client hints web - %s', async (name, testData, expectedResponses) => {
    // Loop through the test user agents
    for (const ua of testData.userAgents) {
      // Make sure required resource key is defined.
      const resourceKey = process.env[testData.resourceKeyEnvVar];
      expect(resourceKey).toBeDefined();

      // Set pipeline with required resource key
      example.setPipeline(resourceKey);
      const response = await request(example.server)
        .get('/')
        .set('User-Agent', ua);
      // Assess the returned headers
      expectedResponses.forEach(e => {
        // If responses do not match error out
        const resVal = response.headers[e.headerName.toLowerCase()];
        if (e.headerValue !== null && resVal !== undefined) {
          // Get the list of items in the header value
          const vals = resVal.split(',').map(function (i) {
            return i.trim();
          });

          // Verify the header value
          e.headerValue.forEach(v => {
            expect(vals.find(item => item === v)).toBeDefined();
          });
        } else if (!(e.headerValue === null && resVal === undefined)) {
          fail('Expected and actual values should be defined or null and undefined.');
        }
      });
    };
  }, 4000);
});
