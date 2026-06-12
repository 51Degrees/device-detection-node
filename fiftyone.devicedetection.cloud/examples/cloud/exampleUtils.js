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

// The default environment variable used to get the resource key
// to use when running examples. This aligned name is checked first,
// before the legacy variable name.
const RESOURCE_KEY_ENV_VAR = '51DEGREES_RESOURCE_KEY';

// The legacy environment variable used to get the resource key
// to use when running examples. Retained for backwards compatibility
// and checked when RESOURCE_KEY_ENV_VAR is not set.
const LEGACY_RESOURCE_KEY_ENV_VAR = 'RESOURCE_KEY';

// Get the resource key from the environment. The aligned
// '51DEGREES_RESOURCE_KEY' variable is checked first, followed by
// the legacy 'RESOURCE_KEY' variable.
const getResourceKeyFromEnv = function () {
  return process.env[RESOURCE_KEY_ENV_VAR] ||
    process.env[LEGACY_RESOURCE_KEY_ENV_VAR];
};

module.exports = {
  RESOURCE_KEY_ENV_VAR,
  LEGACY_RESOURCE_KEY_ENV_VAR,
  getResourceKeyFromEnv
};
