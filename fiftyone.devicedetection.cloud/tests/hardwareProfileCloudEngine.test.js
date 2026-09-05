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

const path = require('path');
const require51 = (requestedPackage) => {
  try {
    return require(path.join(__dirname, '/../node_modules/', requestedPackage));
  } catch (e) {
    return require(path.join(__dirname, '/../../', requestedPackage));
  }
};

const HardwareProfileCloudEngine =
  require(path.join(__dirname, '/../hardwareProfileCloudEngine.js'));

const DataExtension =
  require51('fiftyone.devicedetection.shared').dataExtension;

// A response of the shape the cloud service returns for a TAC lookup when
// the resource key has the hardware aspect but is not entitled to the
// hardware properties. The values are null at the aspect level and each one
// is paired with a reason. The profiles carry only the properties the key
// is entitled to.
const notEntitledResponse = JSON.stringify({
  hardware: {
    profiles: [
      { devicetype: 'SmartPhone', ismobile: true }
    ],
    hardwarevendor: null,
    hardwarevendornullreason:
      'HardwareVendor is a paid feature. You need a licence key to retrieve data.',
    hardwarename: null,
    hardwarenamenullreason:
      'HardwareName is a paid feature. You need a licence key to retrieve data.',
    hardwaremodel: null,
    hardwaremodelnullreason:
      'HardwareModel is a paid feature. You need a licence key to retrieve data.'
  }
});

// A response from a fully entitled resource key.
const entitledResponse = JSON.stringify({
  hardware: {
    profiles: [
      {
        hardwarevendor: 'Apple',
        hardwarename: ['iPhone 6'],
        hardwaremodel: 'A1586'
      }
    ]
  }
});

// A response where the hardware aspect is absent altogether, which is what
// a resource key without the hardware aspect returns.
const noHardwareResponse = JSON.stringify({ device: { ismobile: true } });

// Runs a fixed cloud response through the engine, standing in for the cloud
// request engine so the test needs no resource key and no network.
const process = function (response) {
  const engine = new HardwareProfileCloudEngine();
  let elementData;

  const flowData = {
    get: () => ({ get: () => response }),
    setElementData: (data) => { elementData = data; }
  };

  engine.processInternal(flowData);

  return elementData;
};

describe('hardwareProfileCloudEngine', () => {
  test('carries the reason for a missing value into each profile', () => {
    const hardware = process(notEntitledResponse);

    expect(hardware.contents.profiles).toHaveLength(1);

    const profile = hardware.contents.profiles[0];

    ['hardwarevendor', 'hardwarename', 'hardwaremodel'].forEach(name => {
      expect(profile[name]).toBeDefined();
      expect(profile[name].hasValue).toBe(false);
      expect(profile[name].noValueMessage).toContain('paid feature');
    });
  });

  test('the example helper reports the reason', () => {
    const hardware = process(notEntitledResponse);
    const profile = hardware.contents.profiles[0];

    expect(DataExtension.getValueHelper(profile, 'hardwarevendor'))
      .toBe('Unknown (HardwareVendor is a paid feature. You need a ' +
        'licence key to retrieve data.)');
  });

  test('an entitled value is reported as a value', () => {
    const hardware = process(entitledResponse);
    const profile = hardware.contents.profiles[0];

    expect(DataExtension.getValueHelper(profile, 'hardwarevendor'))
      .toBe('Apple');
    // A list value is joined for display.
    expect(DataExtension.getValueHelper(profile, 'hardwarename'))
      .toBe('iPhone 6');
    expect(DataExtension.getValueHelper(profile, 'hardwaremodel'))
      .toBe('A1586');
  });

  test('an absent hardware aspect gives no profiles rather than an error', () => {
    const hardware = process(noHardwareResponse);

    expect(DataExtension.getProfilesHelper(hardware.contents))
      .toHaveLength(0);
  });

  test('a property that is not in the results is named in the message', () => {
    const hardware = process(entitledResponse);
    const profile = hardware.contents.profiles[0];

    const message = DataExtension.getValueHelper(profile, 'screenpixelswidth');

    expect(message).toContain('screenpixelswidth');
    expect(message.startsWith('Unknown (')).toBe(true);
  });
});
