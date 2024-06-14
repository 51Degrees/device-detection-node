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

/**
 * @typedef {import('fiftyone.pipeline.core').FlowData} FlowData
 */

const CloudEngine = require('fiftyone.pipeline.cloudrequestengine').CloudEngine;

const AspectPropertyValue = require('fiftyone.pipeline.core').AspectPropertyValue;
const AspectDataDictionary = require('fiftyone.pipeline.engines').AspectDataDictionary;

/**
 * This Cloud Aspect Engine enables the parsing of 'hardware profile'
 * responses from the 51Degrees cloud service.
 */
class HardwareProfileCloudEngine extends CloudEngine {
  /**
   * Constructor for HardwareProfileCloudEngine
   */
  constructor () {
    super(...arguments);
    this.dataKey = 'hardware';
  }

  /**
   * Process internal FlowData cloud data for devices,
   * set them as FlowData elements
   *
   * @param {FlowData} flowData The FlowData object
   */
  processInternal (flowData) {
    const engine = this;

    let cloudData = flowData.get('cloud').get('cloud');

    cloudData = JSON.parse(cloudData);

    // Loop over cloudData.devices properties to check if they have a value

    const devices = [];

    Object.entries(cloudData.hardware.profiles).forEach(function ([i, deviceValues]) {
      const device = {};

      Object.entries(deviceValues).forEach(function ([propertyKey, propertyValue]) {
        device[propertyKey] = new AspectPropertyValue();

        device[propertyKey].value = propertyValue;
      });

      devices.push(device);
    });

    const result = { profiles: devices };

    const data = new AspectDataDictionary(
      {
        flowElement: engine,
        contents: result
      });

    flowData.setElementData(data);
  }
}

module.exports = HardwareProfileCloudEngine;
