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

const core = require('fiftyone.pipeline.core');
const DeviceDetectionCloud = require('./deviceDetectionCloud');
const CloudRequestEngine = require('fiftyone.pipeline.cloudrequestengine').CloudRequestEngine;
const PipelineBuilder = core.PipelineBuilder;
const LruCache = require('fiftyone.pipeline.engines').LruCache;

/**
 * Extension of pipelineBuilder class that allows for the quick
 * generation of a device detection cloud pipeline. Adds share usage,
 * caching.
 */
class DeviceDetectionCloudPipelineBuilder extends PipelineBuilder {
  /**
   * Constructor for DeviceDetectionCloudPipelineBuilder
   *
   * @param {object} options the options for the pipeline builder
   * @param {string} options.licenceKeys license key(s) used by the
   * data file update service. A key can be obtained from the
   * 51Degrees website: https://51degrees.com/pricing.
   * This parameter MUST be set when using a data file.
   * If you do not wish to use a key then you can specify
   * an empty string, but this will cause automatic updates
   * to be disabled.
   * @param {string} options.resourceKey resourceKey
   * @param {number} options.cacheSize size of the default cache
   * (includes cache if set).
   * @param {string} options.cloudEndPoint Choose a non default endpoint
   * for the cloud request engine
   * @param {string} options.cloudRequestOrigin The value to set the
   * Origin header to when making requests to the cloud service
   */
  constructor (
    {
      licenceKeys = null,
      resourceKey = null,
      cacheSize = null,
      cloudEndPoint = null,
      cloudRequestOrigin = null
    }) {
    super(...arguments);

    let cache;

    if (cacheSize) {
      cache = new LruCache({ size: cacheSize });
    }

    // First we need the cloudRequestEngine

    this.flowElements.push(new CloudRequestEngine(
      {
        resourceKey,
        licenseKey: licenceKeys,
        baseURL: cloudEndPoint,
        cloudRequestOrigin,
        cache
      }));

    // Then add the cloud device detection engine

    this.flowElements.push(new DeviceDetectionCloud());
  }
}

module.exports = DeviceDetectionCloudPipelineBuilder;
