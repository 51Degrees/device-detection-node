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
  cacheNotSupport: 'A results cache cannot be configured in the ' +
    'on-premise Hash engine. The overhead of having to manage native object ' +
    'lifetimes when a cache is enabled outweighs the benefit of the cache.',
  evidenceNotFound: 'The evidence required to determine this property was ' +
    'not supplied. The most common evidence passed to this engine is ' +
    '\'header.user-agent\'.',
  dataFilePathRequired: 'dataFilePath is required',
  fileNotFound: 'There is no file at \'%s\'',
  moduleDirNotFound: 'There is no directory at \'%s\'. This is ' +
    'expected to contain the native modules for the hash engine.' +
    ' For example, %s',
  nativeModuleNotFound: 'Native module \'%s\' not found. This is probably ' +
    'because a module for this platform and Node version has not been ' +
    'included with this distribution. Try changing to a platform and Node ' +
    'version from the list of available modules: %s. If the platform/version ' +
    'you want is not listed then please contact us directly for assistance: ' +
    'https://51degrees.com/contact-us',
  invalidFileExtension: 'dataFilePath must point to a file with a ".hash" ' +
    'extension',
  licenseKeyRequired: 'license key is required. A key can be obtained from ' +
    'the 51Degrees website: https://51degrees.com/pricing. If you do not ' +
    'wish to use a key then you can specify an empty string, but this will ' +
    'cause automatic updates to be disabled.',
  invalidPerformanceProfile: 'The performance profile \'%s\' is not valid',
  propertyKeyDataFiles: 'Property %s can be found in the following datafiles ' +
    '%s not %s',
  propertyNotFound: 'Property %s not found in %s',
  badDataUnsupportedVersion: 'The data is an unsupported version. Check ' +
    'you have the latest data and API.',
  badDataIncorrectFormat: 'The data was not in the correct format. ' +
    'Check the data file is uncompressed.'
};
