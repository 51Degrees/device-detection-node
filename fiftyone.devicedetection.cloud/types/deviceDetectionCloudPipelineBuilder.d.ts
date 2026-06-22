export = DeviceDetectionCloudPipelineBuilder;
declare const DeviceDetectionCloudPipelineBuilder_base: typeof import("fiftyone.pipeline.core/types/pipelineBuilder");
/**
 * Extension of pipelineBuilder class that allows for the quick
 * generation of a device detection cloud pipeline. Adds share usage,
 * caching.
 */
declare class DeviceDetectionCloudPipelineBuilder extends DeviceDetectionCloudPipelineBuilder_base {
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
     * @param {boolean} [options.suppressProcessExceptions] If false (the
     * default) the first error thrown while processing is re-thrown from
     * flowData.process(); if true, errors are stored on flowData.errors and
     * emitted via the pipeline 'error' event instead, and process() resolves
     * normally. Recommended true for web apps so a device-detection failure
     * degrades gracefully instead of failing the request.
     */
    constructor({ licenceKeys, resourceKey, cacheSize, cloudEndPoint, cloudRequestOrigin }: {
        licenceKeys: string;
        resourceKey: string;
        cacheSize: number;
        cloudEndPoint: string;
        cloudRequestOrigin: string;
        suppressProcessExceptions?: boolean;
    }, ...args: any[]);
}
