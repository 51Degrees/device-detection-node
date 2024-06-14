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

const swigHelpers = require('./swigHelpers');

class Property {
  /**
   *  Constructor for Property
   *
   * @param {object} metadata Metadata
   * @param {object} engineMetadata Engine metadata
   */
  constructor (
    metadata,
    engineMetadata) {
    this.metadata = metadata;
    this.engineMetadata = engineMetadata;
    /**
     * @type {string}
     */
    this.name = metadata.getName();
    /**
     * @type {string}
     */
    this.type = metadata.getType();
    /**
     * @type {Array<string>}
     */
    this.dataFiles = swigHelpers.vectorToArray(metadata.getDataFilesWherePresent());
    /**
     * @type {string}
     */
    this.category = metadata.getCategory();
    /**
     * @type {string}
     */
    this.description = metadata.getDescription();

    const Component = require('./component');
    /**
     * @type {Component}
     */
    this.component = new Component(
      engineMetadata.getComponentForProperty(metadata), engineMetadata);
    /**
     * @type {object}
     */
    this.values = engineMetadata.getValuesForProperty(metadata);
  }

  /**
   * Yield property values
   *
   * @generator
   * @yields {object}
   * @returns {void}
   */
  * getValues () {
    for (let i = 0; i < this.values.getSize(); i++) {
      yield this.values.getByIndex(i);
    }
  }

  /**
   * Get number of values in the property
   *
   * @returns {number} uint32
   */
  getNumberOfValues () {
    return this.values.getSize();
  }
}

module.exports = Property;
