/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2022 51 Degrees Mobile Experts Limited, Davidson House,
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
const fs = require('fs');
const os = require('os');
const path = require('path');

const errorMessages = require('fiftyone.devicedetection.shared').errorMessages;

const FiftyOneDegreesDeviceDetectionOnPremise = require(path.join(__dirname,
  '/../../fiftyone.devicedetection.onpremise'));
const DataFile = (process.env.directory || __dirname) + '/../device-detection-cxx/device-detection-data/51Degrees-LiteV4.1.hash';
const BadVersionDataFile = (process.env.directory || __dirname) + '/BadVersionDataFile.hash';
const BadHeaderDataFile = (process.env.directory || __dirname) + '/BadHeaderDataFile.hash';
const SmallDataFile = (process.env.directory || __dirname) + '/SmallDataFile.hash';

const badVersion = [1, 2, 3, 4];
const goodVersion = [4, 1, 0, 0];
const fileSize = fs.statSync(DataFile).size;

function writeInt (buf, offset, val) {
  if (os.endianness() === 'LE') {
    buf.writeInt32LE(val, offset);
  } else {
    buf.writeInt32BE(val, offset);
  }
}

function createBadVersionDataFile () {
  const buffer = Buffer.alloc(fileSize);
  for (let i = 0; i < badVersion.length; i++) {
    writeInt(buffer, i * 4, badVersion[i]);
  }
  fs.writeFileSync(BadVersionDataFile, buffer);
}

function createBadHeaderDataFile () {
  const buffer = Buffer.alloc(fileSize);
  for (let i = 0; i < goodVersion.length; i++) {
    writeInt(buffer, i * 4, goodVersion[i]);
  }
  fs.writeFileSync(BadHeaderDataFile, buffer);
}

function createSmallDataFile () {
  const buffer = Buffer.alloc(1).fill(1);
  fs.writeFileSync(SmallDataFile, buffer);
}

beforeAll(() => {
  createBadVersionDataFile();
  createBadHeaderDataFile();
  createSmallDataFile();
});

afterAll(() => {
  fs.unlinkSync(BadVersionDataFile);
  fs.unlinkSync(BadHeaderDataFile);
  fs.unlinkSync(SmallDataFile);
});

describe('Bad data file error messages', () => {
  // Check that an error with appropriate message is
  // thrown when the data file contains bad version
  // number
  test('Bad version number', done => {
    const engine = new FiftyOneDegreesDeviceDetectionOnPremise
      .DeviceDetectionOnPremise({
        performanceProfile: 'MaxPerformance',
        dataFilePath: BadVersionDataFile,
        autoUpdate: false,
        updateOnStart: true,
        licenceKeys: null
      });

    engine.initEngine().catch(function (e) {
      console.log(e.message);
      expect(
        e.message.indexOf(errorMessages.badDataUnsupportedVersion) !== -1)
        .toBe(true);

      done();
    });
  });
  // Check that an error with appropriate message is
  // thrown when the data file contains correct version
  // number but bad data
  test('Bad header', done => {
    const engine = new FiftyOneDegreesDeviceDetectionOnPremise
      .DeviceDetectionOnPremise({
        performanceProfile: 'MaxPerformance',
        dataFilePath: BadHeaderDataFile,
        autoUpdate: false,
        updateOnStart: true,
        licenceKeys: null
      });

    engine.initEngine().catch(function (e) {
      console.log(e.message);
      expect(
        e.message.indexOf(errorMessages.badDataIncorrectFormat) !== -1)
        .toBe(true);

      done();
    });
  });
  // Check that an error with appropriate message is
  // thrown when the data file contains almost truncated
  // data.
  test('Small data file', done => {
    const engine = new FiftyOneDegreesDeviceDetectionOnPremise
      .DeviceDetectionOnPremise({
        performanceProfile: 'MaxPerformance',
        dataFilePath: SmallDataFile,
        autoUpdate: false,
        updateOnStart: true,
        licenceKeys: null
      });

    engine.initEngine().catch(function (e) {
      console.log(e.message);
      expect(
        e.message.indexOf(errorMessages.badDataIncorrectFormat) !== -1)
        .toBe(true);

      done();
    });
  });
});
