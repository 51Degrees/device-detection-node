export = DeviceDetectionCloudPipelineBuilder;
declare const DeviceDetectionCloudPipelineBuilder_base: typeof import("fiftyone.pipeline.core/types/pipelineBuilder");
declare class DeviceDetectionCloudPipelineBuilder extends DeviceDetectionCloudPipelineBuilder_base {
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
    constructor({ licenceKeys, shareUsage, resourceKey, cacheSize, cloudEndPoint }: {
        licenceKeys: string;
        shareUsage: boolean;
        resourceKey: string;
        cacheSize: number;
        cloudEndPoint: string;
    }, ...args: any[]);
}
