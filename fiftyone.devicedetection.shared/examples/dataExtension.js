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

class DataExtension {
  /**
   * Format a property value for display.
   *
   * A property can be unavailable for three reasons, and each one reads
   * differently so the person running the example can tell them apart.
   * The property may have a value, it may have no value with the cloud
   * service giving a reason (most often that the resource key is not
   * entitled to it), or it may not be in the results at all.
   *
   * @param {object} elementData Element data
   * @param {string} propertyName Property name
   * @returns {string} The value, or a line saying why there is none
   * */
  static getValueHelper (elementData, propertyName) {
    let property;

    try {
      property = elementData === undefined || elementData === null
        ? undefined
        : elementData[propertyName];
    } catch (e) {
      property = undefined;
    }

    if (property === undefined || property === null) {
      return `Unknown (the property '${propertyName}' is not in the ` +
        'results, so the current resource key does not include it)';
    }

    if (property.hasValue) {
      try {
        return Array.isArray(property.value)
          ? property.value.join(', ')
          : property.value;
      } catch (e) {
        return `Unknown (${e})`;
      }
    }

    const reason = property.noValueMessage;

    if (reason === undefined || reason === null || reason === '') {
      return 'Unknown (the cloud service returned no value for ' +
        `'${propertyName}' and gave no reason)`;
    }

    return `Unknown (${reason})`;
  };

  /**
   * Read the list of hardware profiles from the 'hardware' element data.
   *
   * An empty list is returned when the resource key has no access to the
   * hardware aspect at all, because reading a property that is not there
   * can raise rather than return an empty list.
   *
   * @param {object} hardware The 'hardware' element data
   * @returns {Array} The profiles, or an empty array
   * */
  static getProfilesHelper (hardware) {
    let profiles;

    try {
      profiles = hardware === undefined || hardware === null
        ? undefined
        : hardware.profiles;
    } catch (e) {
      return [];
    }

    return Array.isArray(profiles) ? profiles : [];
  };

  /**
   * The line printed when a lookup returned no device profiles at all.
   *
   * @returns {string} The message to print
   * */
  static getNoProfilesMessage () {
    return '\tNo device profiles were returned. The current resource key ' +
      'does not include the hardware properties this example needs. See ' +
      'https://51degrees.com/pricing?utm_source=code&utm_medium=example&utm_campaign=device-detection-node&utm_content=fiftyone.devicedetection.shared-examples-dataextension.js&utm_term=no-profiles\n';
  };
}

module.exports = DataExtension;
