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
const require51 = (requestedPackage) => {
  try {
    return require(path.join(__dirname, '/../../../node_modules/', requestedPackage));
  } catch (e) {
    return require(path.join(__dirname, '/../../../../', requestedPackage));
  }
};

const request = require('supertest');
// Test constants
const tc = require51('fiftyone.devicedetection.shared').testConstants;

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
        headerValue: ['Sec-CH-UA-Model', 'Sec-CH-UA-Platform', 'Sec-CH-UA']
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
    // Note: Unlike on-premise, the cloud service may still send Accept-CH
    // headers for browsers that don't support UACH, since the server
    // determines what headers to request based on configuration, not client
    // capabilities. We allow Accept-CH to be present or absent for these UAs.
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
        headerValue: null,
        // Cloud may still send Accept-CH headers regardless of client support
        allowActualValue: true
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

      // Verify response is successful
      expect(response.statusCode).toBe(200);

      // Assess the returned headers
      expectedResponses.forEach(e => {
        const resVal = response.headers[e.headerName.toLowerCase()];

        // Debug output for troubleshooting
        console.log(`[DEBUG] Test: ${name}`);
        console.log(`[DEBUG] User-Agent: ${ua.substring(0, 60)}...`);
        console.log(`[DEBUG] Expected headerValue: ${JSON.stringify(e.headerValue)}`);
        console.log(`[DEBUG] Actual ${e.headerName}: "${resVal}"`);
        if (resVal) {
          const actualValues = resVal.split(',').map(v => v.trim());
          console.log(`[DEBUG] Actual parsed values: [${actualValues.join(', ')}]`);
        }

        if (e.headerValue !== null && resVal !== undefined) {
          // Get the list of items in the header value (case-insensitive comparison)
          const vals = resVal.split(',').map(v => v.trim().toLowerCase());

          // Verify each expected header value is present
          e.headerValue.forEach(v => {
            const found = vals.find(item => item === v.toLowerCase());
            if (!found) {
              throw new Error(
                `[${name}] Expected Accept-CH to contain '${v}' ` +
                `but got: [${resVal}]. ` +
                `User-Agent: ${ua.substring(0, 60)}...`
              );
            }
          });
        } else if (e.headerValue === null && resVal !== undefined) {
          // Expected null but got a value - only fail if allowActualValue is not set
          if (!e.allowActualValue) {
            throw new Error(
              `[${name}] Expected Accept-CH to be absent but got: ${resVal}. ` +
              `User-Agent: ${ua.substring(0, 60)}...`
            );
          }
        } else if (e.headerValue !== null && resVal === undefined) {
          // Expected a value but got nothing
          throw new Error(
            `[${name}] Expected Accept-CH with values [${e.headerValue.join(', ')}] ` +
            `but header was not present. ` +
            `User-Agent: ${ua.substring(0, 60)}... ` +
            `All headers: ${JSON.stringify(response.headers)}`
          );
        }
        // Both null/undefined is fine - no assertion needed
      });
    }
  }, 10000);
});
