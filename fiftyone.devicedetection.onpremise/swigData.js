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

const AspectData = require('fiftyone.pipeline.engines').AspectData;
const AspectPropertyValue = require('fiftyone.pipeline.core').AspectPropertyValue;

const swigHelpers = require('./swigHelpers');

const DataFileMissingPropertyService = require('./dataFileMissingPropertyService');

const constants = require('./constants');

/**
 * @typedef {import('fiftyone.pipeline.core').FlowElement} FlowElement
 */

/**
 * Extension of aspectData which stores the results created by the SWIG wrapper
 */
class SwigData extends AspectData {
  /**
   * Constructor for SwigData
   *
   * @param {object} options options object
   * @param {FlowElement} options.flowElement the FlowElement the
   * data is part of
   * @param {object} options.swigResults the results from the
   * swig engine
   */
  constructor ({
    flowElement, swigResults
  }) {
    super(...arguments);
    this.swigResults = swigResults;
    this.missingPropertyService = new DataFileMissingPropertyService();
  }

  /**
   * Retrieves elementData via the swigWrapper but also casts it to the
   * correct type via a check of the engine's property list metadata
   *
   * @param {string} key the property key to retrieve
   * @returns {AspectPropertyValue} value property value
   */
  getInternal (key) {
    // Start with special properties

    const result = new AspectPropertyValue();

    if (key === 'deviceID') {
      result.value = this.swigResults.getDeviceId();

      return result;
    }

    if (key === 'userAgents') {
      result.value = [];

      let i, userAgent;
      for (i = 0; i < this.swigResults.getUserAgents(); i++) {
        userAgent = this.swigResults.getUserAgent(i);
        if (!result.value.includes(userAgent)) {
          result.value.push(userAgent);
        }
      }

      return result;
    }

    if (key === 'matchedNodes') {
      result.value = this.swigResults.getMatchedNodes();

      return result;
    }

    if (key === 'difference') {
      result.value = this.swigResults.getDifference();

      return result;
    }

    if (key === 'method') {
      const method = this.swigResults.getMethod();
      switch (method) {
        case 1:
          result.value = constants.performance;
          break;
        case 2:
          result.value = constants.combined;
          break;
        case 3:
          result.value = constants.predictive;
          break;
        default:
          result.value = constants.none;
          break;
      }

      return result;
    }

    if (key === 'drift') {
      result.value = this.swigResults.getDrift();

      return result;
    }

    if (key === 'iterations') {
      result.value = this.swigResults.getIterations();

      return result;
    }

    // End special properties

    const property = this.flowElement.properties[key];

    if (property) {
      let value;

      switch (property.type) {
        case 'bool':
          value = this.swigResults.getValueAsBool(property.name);
          break;
        case 'string':
          value = this.swigResults.getValueAsString(property.name);
          break;
        case 'javascript':
          value = this.swigResults.getValueAsString(property.name);
          break;
        case 'int':
          value = this.swigResults.getValueAsInteger(property.name);
          break;
        case 'double':
          value = this.swigResults.getValueAsDouble(property.name);
          break;
        case 'string[]':
          value = this.swigResults.getValues(property.name);
          break;
      }

      const result = new AspectPropertyValue();

      if (value.hasValue()) {
        result.value = value.getValue();

        if (property.type === 'string[]') {
          result.value = swigHelpers.vectorToArray(result.value);
        }
      } else {
        result.noValueMessage = value.getNoValueMessage();
      }

      return result;
    }
  }
}

module.exports = SwigData;
