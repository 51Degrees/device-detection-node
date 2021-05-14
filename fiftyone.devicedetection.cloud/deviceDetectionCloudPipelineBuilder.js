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

const core = require51('fiftyone.pipeline.core');
const DeviceDetectionCloud = require('./deviceDetectionCloud');
const CloudRequestEngine = require51('fiftyone.pipeline.cloudrequestengine').CloudRequestEngine;
const PipelineBuilder = core.PipelineBuilder;
const LruCache = require51('fiftyone.pipeline.engines').LruCache;
const ShareUsageElement = require51('fiftyone.pipeline.engines.fiftyone').ShareUsage;

class DeviceDetectionCloudPipelineBuilder extends PipelineBuilder {
  /**
   * Extension of pipelineBuilder class that allows for the quick
   * generation of a device detection cloud pipeline. Adds share usage,
   * caching.
   *
   * @param {object} options the options for the pipeline builder
   * @param {string} options.licenceKeys license key(s) used by the
   * data file update service. A key can be obtained from the
   * 51Degrees website: https://51degrees.com/pricing.
   * This parameter MUST be set when using a data file.
   * If you do not wish to use a key then you can specify
   * an empty string, but this will cause automatic updates
   * to be disabled.
   * @param {boolean} options.shareUsage whether to include the share
   * usage element
   * @param {string} options.resourceKey resourceKey
   * @param {number} options.cacheSize size of the default cache
   * (includes cache if set).
   * @param {string} options.cloudEndPoint Choose a non default endpoint
   * for the cloud request engine
   *
   */
  constructor (
    {
      licenceKeys = null,
      shareUsage = true,
      resourceKey = null,
      cacheSize = null,
      cloudEndPoint = null
    }) {
    super(...arguments);

    // Check if share usage enabled and add it to the pipeline if so

    if (shareUsage) {
      this.flowElements.push(new ShareUsageElement());
    }

    let cache;

    if (cacheSize) {
      cache = new LruCache({ size: cacheSize });
    }

    // First we need the cloudRequestEngine

    this.flowElements.push(new CloudRequestEngine(
      {
        resourceKey: resourceKey,
        licenseKey: licenceKeys,
        baseURL: cloudEndPoint,
        cache
      }));

    // Then add the cloud device detection engine

    this.flowElements.push(new DeviceDetectionCloud());
  }
}

module.exports = DeviceDetectionCloudPipelineBuilder;
