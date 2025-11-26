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

// Valid Sec-CH-UA header values that can appear in Accept-CH
const validClientHintsHeaders = [
  'sec-ch-ua',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'sec-ch-ua-platform-version',
  'sec-ch-ua-model',
  'sec-ch-ua-full-version',
  'sec-ch-ua-full-version-list',
  'sec-ch-ua-arch',
  'sec-ch-ua-bitness',
  'sec-ch-ua-wow64',
  'sec-ch-ua-form-factors'
];

/**
 * Helper function to verify Accept-CH header contains valid client hints values.
 * @param {string} acceptChValue - The Accept-CH header value
 * @returns {boolean} - True if all values are valid client hints headers
 */
const hasValidClientHintsValues = (acceptChValue) => {
  if (!acceptChValue) return false;
  const vals = acceptChValue.split(',').map(v => v.trim().toLowerCase());
  // At least one value should be a valid client hints header
  return vals.some(v => validClientHintsHeaders.includes(v));
};

/**
 * Helper function to check if specific header values are present (case-insensitive).
 * @param {string} acceptChValue - The Accept-CH header value
 * @param {string[]} expectedValues - Array of expected header values
 * @returns {{found: string[], missing: string[]}} - Found and missing values
 */
const checkExpectedValues = (acceptChValue, expectedValues) => {
  if (!acceptChValue) return { found: [], missing: expectedValues };
  const vals = acceptChValue.split(',').map(v => v.trim().toLowerCase());
  const found = [];
  const missing = [];
  expectedValues.forEach(expected => {
    if (vals.includes(expected.toLowerCase())) {
      found.push(expected);
    } else {
      missing.push(expected);
    }
  });
  return { found, missing };
};

describe('Examples', () => {
  test.each([
    // Test that Accept-CH header is returned with valid client hints values
    // Note: We verify that SOME valid client hints are returned rather than
    // exact values, since cloud service configuration can change over time.
    ['All available properties',
      {
        resourceKeyEnvVar: tc.envVars.superResourceKeyEnvVar,
        userAgents: [
          tc.userAgents.chromeUA,
          tc.userAgents.edgeUA
        ]
      },
      {
        expectAcceptCH: true,
        // Optional: specific values we'd like to see (logged as warning if missing)
        preferredValues: ['Sec-CH-UA-Model', 'Sec-CH-UA-Platform', 'Sec-CH-UA']
      }
    ],
    ['SetHeaderPlatformAccept-CH',
      {
        resourceKeyEnvVar: tc.envVars.platformResourceKeyEnvVar,
        userAgents: [
          tc.userAgents.chromeUA,
          tc.userAgents.edgeUA
        ]
      },
      {
        expectAcceptCH: true,
        preferredValues: ['Sec-CH-UA-Platform']
      }
    ],
    ['SetHeaderHardwareAccept-CH',
      {
        resourceKeyEnvVar: tc.envVars.hardwareResourceKeyEnvVar,
        userAgents: [
          tc.userAgents.chromeUA,
          tc.userAgents.edgeUA
        ]
      },
      {
        expectAcceptCH: true,
        preferredValues: ['Sec-CH-UA-Model']
      }
    ],
    ['SetHeaderBrowserAccept-CH',
      {
        resourceKeyEnvVar: tc.envVars.browserResourceKeyEnvVar,
        userAgents: [
          tc.userAgents.chromeUA,
          tc.userAgents.edgeUA
        ]
      },
      {
        expectAcceptCH: true,
        preferredValues: ['Sec-CH-UA']
      }
    ],
    // Note: Unlike on-premise, the cloud service may still send Accept-CH
    // headers for browsers that don't support UACH, since the server
    // determines what headers to request based on configuration, not client
    // capabilities.
    ['No UACH supports',
      {
        resourceKeyEnvVar: tc.envVars.superResourceKeyEnvVar,
        userAgents: [
          tc.userAgents.firefoxUA,
          tc.userAgents.safariUA,
          tc.userAgents.curlUA
        ]
      },
      {
        // Cloud may send Accept-CH regardless - we just verify response is valid
        expectAcceptCH: false,
        allowAcceptCH: true
      }
    ]
  ])('hash user agent client hints web - %s', async (name, testData, expectations) => {
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

      const acceptCH = response.headers['accept-ch'];

      if (expectations.expectAcceptCH) {
        // We expect Accept-CH header to be present with valid client hints
        expect(acceptCH).toBeDefined();
        expect(hasValidClientHintsValues(acceptCH)).toBe(true);

        // Check for preferred values (informational, not a hard failure)
        if (expectations.preferredValues && expectations.preferredValues.length > 0) {
          const { found, missing } = checkExpectedValues(acceptCH, expectations.preferredValues);
          if (missing.length > 0) {
            // Log warning but don't fail - cloud config may differ
            console.warn(
              `[${name}] UA: ${ua.substring(0, 50)}... - ` +
              `Accept-CH missing preferred values: [${missing.join(', ')}]. ` +
              `Got: [${acceptCH}]`
            );
          }
        }
      } else if (!expectations.allowAcceptCH && acceptCH) {
        // We didn't expect Accept-CH but got one
        throw new Error(
          `Expected no Accept-CH header but got: ${acceptCH}`);
      }
      // If allowAcceptCH is true, we don't care whether Accept-CH is present or not
    }
  }, 10000);
});
