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
const DeviceDetectionPipelineBuilder = require(path.join(__dirname,
  '/../deviceDetectionPipelineBuilder'));
const myResourceKey = process.env.RESOURCE_KEY || '!!YOUR_RESOURCE_KEY!!';
const errorMessages = require('fiftyone.devicedetection.shared').errorMessages;

describe('deviceDetectionCloud', () => {
  // Check that if no evidence is provided for device
  // detection engine, accessing a valid property will
  // return HasValue=false and a correct error message
  //
  // TODO: Enable when cloud support this feature
  test.skip('No evidence error message', done => {
    if (myResourceKey === '!!YOUR_RESOURCE_KEY!!') {
      throw new Error('No resource key is present!');
    } else {
      const pipeline = new DeviceDetectionPipelineBuilder({
        resourceKey: myResourceKey
      }).build();
      const flowData = pipeline.createFlowData();

      flowData.process().then(function () {
        const ismobile = flowData.device.ismobile;
        expect(ismobile.hasValue).toBe(false);
        expect(ismobile.noValueMessage.indexOf(
          errorMessages.evidenceNotFound) !== -1).toBe(true);

        done();
      });
    }
  });
});
