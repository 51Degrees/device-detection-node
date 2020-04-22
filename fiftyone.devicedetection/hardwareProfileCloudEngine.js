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

const require51 = (requestedPackage) => {
  try {
    return require(__dirname + '/../' + requestedPackage);
  } catch (e) {
    return require(requestedPackage);
  }
};

const engines = require51('fiftyone.pipeline.engines');
const core = require51('fiftyone.pipeline.core');
const Engine = engines.Engine;
const AspectDataDictionary = engines.AspectDataDictionary;
const AspectPropertyValue = core.AspectPropertyValue;

class HardwareProfileCloudEngine extends Engine {
  constructor () {
    super(...arguments);

    this.dataKey = 'hardware';
  }

  /**
     * The hardware profile cloud engine requires the 51Degrees cloudRequestEngine
     * to be placed in a pipeline before it. It simply takes that raw JSON
     * response and parses it to extract the relevant data
     * @param {FlowData} flowData
    */
  processInternal (flowData) {
    const engine = this;

    this.checkProperties(flowData).then(function (params) {
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
    });
  }

  checkProperties (flowData) {
    const engine = this;

    return new Promise(function (resolve, reject) {
      // Check if properties set, if not set them

      if (!Object.keys(engine.properties).length) {
        const cloudProperties = flowData.get('cloud').get('properties');

        const hardwareProfileProperties = cloudProperties.hardware;

        engine.properties = hardwareProfileProperties;

        engine.updateProperties().then(resolve);
      } else {
        resolve();
      }
    });
  }
}

module.exports = HardwareProfileCloudEngine;
