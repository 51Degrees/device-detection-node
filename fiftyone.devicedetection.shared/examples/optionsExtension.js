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

const CLOUD_REQUEST_ENGINE_NAME = 'cloudRequestEngine';

const ONPREMISE_DEVICE_ENGINE = 'deviceDetectionOnPremise';

class OptionsExtension {
  /**
   * Get element by name
   *
   * @param {object} options Options
   * @param {string} elementName Element name
   * @returns {object} Element
   */
  static getElement (options, elementName) {
    if (options.PipelineOptions) {
      if (options.PipelineOptions.Elements) {
        for (const e of options.PipelineOptions.Elements) {
          if (e.elementName &&
            e.elementName.endsWith(elementName)) {
            return e;
          }
        }
      }
    }
  }

  /**
   * Get Datafile path
   *
   * @param {object} options Options
   * @returns {string} Datafile path
   */
  static getDataFilePath (options) {
    const cloudRequestElement = this.getElement(options, ONPREMISE_DEVICE_ENGINE);
    if (cloudRequestElement &&
      cloudRequestElement.elementParameters &&
      cloudRequestElement.elementParameters.dataFilePath) {
      return cloudRequestElement.elementParameters.dataFilePath;
    }
  }

  /**
   * Set Datafile path
   *
   * @param {object} options Options
   * @param {string} newDataFilePath New Datafile path
   */
  static setDataFilePath (options, newDataFilePath) {
    const cloudRequestElement = this.getElement(options, ONPREMISE_DEVICE_ENGINE);
    if (cloudRequestElement) {
      if (!cloudRequestElement.elementParameters) {
        cloudRequestElement.elementParameters = { dataFilePath: newDataFilePath };
      } else {
        cloudRequestElement.elementParameters.dataFilePath = newDataFilePath;
      }
    }
  }

  /**
   * Update Element path
   *
   * @param {object} options Options
   * @param {string} appendDir New element path
   */
  static updateElementPath (options, appendDir) {
    if (options.PipelineOptions) {
      if (options.PipelineOptions.Elements) {
        for (const e of options.PipelineOptions.Elements) {
          if (e.elementName &&
            e.elementName.startsWith('.')) {
            e.elementName = appendDir + '/' + e.elementName;
          }
        }
      }
    }
  }

  /**
   * Get resource Key
   *
   * @param {object} options Options
   * @returns {string} Resource key
   */
  static getResourceKey (options) {
    const cloudRequestElement = this.getElement(options, CLOUD_REQUEST_ENGINE_NAME);
    if (cloudRequestElement &&
      cloudRequestElement.elementParameters &&
      cloudRequestElement.elementParameters.resourceKey) {
      return cloudRequestElement.elementParameters.resourceKey;
    }
  }

  /**
   * Set resource key
   *
   * @param {object} options Options
   * @param {string} resourceKey New resource key
   */
  static setResourceKey (options, resourceKey) {
    const cloudRequestElement = this.getElement(options, CLOUD_REQUEST_ENGINE_NAME);
    if (cloudRequestElement) {
      if (!cloudRequestElement.elementParameters) {
        cloudRequestElement.elementParameters = { resourceKey };
      } else {
        cloudRequestElement.elementParameters.resourceKey = resourceKey;
      }
    }
  }
}

module.exports = OptionsExtension;
