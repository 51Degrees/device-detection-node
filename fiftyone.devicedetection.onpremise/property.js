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
  constructor (
    metadata,
    engineMetadata) {
    this.metadata = metadata;
    this.engineMetadata = engineMetadata;
    this.name = metadata.getName();
    this.type = metadata.getType();
    this.dataFiles = swigHelpers.vectorToArray(metadata.getDataFilesWherePresent());
    this.category = metadata.getCategory();
    this.description = metadata.getDescription();

    const Component = require('./component');
    this.component = new Component(
      engineMetadata.getComponentForProperty(metadata), engineMetadata);
    this.values = engineMetadata.getValuesForProperty(metadata);
  }

  * getValues () {
    for (let i = 0; i < this.values.getSize(); i++) {
      yield this.values.getByIndex(i);
    }
  }

  getNumberOfValues () {
    return this.values.getSize();
  }
}

module.exports = Property;
