/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2019 51 Degrees Mobile Experts Limited, 5 Charlotte Close,
 * Caversham, Reading, Berkshire, United Kingdom RG4 7BY.
 *
 * This Original Work is licensed under the European Union Public Licence (EUPL)
 * v.1.2 and is subject to its terms as set out below.
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

const fs = require('fs');

const liteDataFileName = '51Degrees-LiteV4.1.hash';
const enterpriseDataFileName = '51Degrees.hash';

// Data files to search for. Ordered based on priorities.
const datafiles = [enterpriseDataFileName, liteDataFileName];

// Directories to search for data files. Ordered based on priorities.
const fileDirs = [
  (process.env.directory || __dirname) + '/../tests/',
  (process.env.directory || __dirname) +
    '/../device-detection-cxx/device-detection-data/'];

var testDataFile;

/**
 * This looks into specific paths for the requested data file.
 * @returns data file full path for testing
 */
const getDataFilePath = function (fileName) {
  for (const fileDir of fileDirs) {
    const fullPath = fileDir + fileName;
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  return undefined;
};

/**
 * Search for potential data file to be used for testing.
 * Enterprise data file first before Lite.
 * @returns data file should be used for testing
 */
const getTestDataFile = function () {
  if (testDataFile === undefined) {
    for (const f of datafiles) {
      const fullPath = getDataFilePath(f);
      if (fullPath !== undefined) {
        testDataFile = fullPath;
        break;
      }
    };
  }
  return testDataFile;
};

module.exports = {
  liteDataFileName: liteDataFileName,
  enterpriseDataFileName: enterpriseDataFileName,
  dataFileDirectories: fileDirs,
  getDataFilePath: getDataFilePath,
  getTestDataFile: getTestDataFile
};
