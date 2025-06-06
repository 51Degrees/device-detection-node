/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2025 51 Degrees Mobile Experts Limited, Davidson House,
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

const querystring = require('querystring');
const engines = require('fiftyone.pipeline.engines');

const DataFile = engines.DataFile;

/**
 * Instance of DataFile class for the Device Detection Engine
 * Extends datafile by providing a formatter for the DataFileUpdateService
 * update url which contains the product, type and licensekeys.
 * These paramaters are passed in to the datafile constructor's
 * updateURLParams parameter
 **/
class DeviceDetectionDataFile extends DataFile {
  /**
   * Constructor for Device Detection DataFile
   *
   * @param {object} options options for the datafile
   * @param {string} options.useUrlFormatter whether to append default URL params for Data File download
   **/
  constructor ({ useUrlFormatter = true, ...rest }) {
    super({ ...rest });
    this.useUrlFormatter = useUrlFormatter;
  }

  /**
   * Uses the product, type and licensekey parameters the datafile
   * was constructed with to generate a querystring used in the datafile
   * update service.
   *
   * @returns {string} url
   */
  urlFormatter () {
    const queryParams = {
      Product: this.updateURLParams.product,
      Type: this.updateURLParams.Type
    };

    let URL = this.updateURLParams.baseURL;

    if (this.updateURLParams.licenseKeys) {
      queryParams.licenseKeys = this.updateURLParams.licenseKeys;
    }

    if (this.useUrlFormatter) {
      URL += '?' + querystring.stringify(queryParams);
    }

    return URL;
  }
}

module.exports = DeviceDetectionDataFile;
