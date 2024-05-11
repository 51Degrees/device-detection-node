export = DeviceDetectionOnPremisePipelineBuilder;
declare const DeviceDetectionOnPremisePipelineBuilder_base: typeof import("fiftyone.pipeline.core/types/pipelineBuilder");
declare class DeviceDetectionOnPremisePipelineBuilder extends DeviceDetectionOnPremisePipelineBuilder_base {
    /**
     * Extension of pipelineBuilder class that allows for the quick
     * generation of a device detection pipeline. Adds share usage,
     * caching and toggles between on premise and cloud with
     * simple paramater changes
     *
     * @param {object} options the options for the pipeline builder
     * @param {string} options.licenceKeys license key(s) used by the
     * data file update service. A key can be obtained from the
     * 51Degrees website: https://51degrees.com/pricing.
     * This parameter MUST be set when using a data file.
     * If you do not wish to use a key then you can specify
     * an empty string, but this will cause automatic updates
     * to be disabled.
     * @param {string} options.dataFile dataFile path for the on premise engine
     * @param {boolean} options.autoUpdate whether to autoUpdate the dataFile
     * @param {number} options.pollingInterval How often to poll for
     * updates to the datafile (minutes)
     * @param {number} options.updateTimeMaximumRandomisation
     * Maximum randomisation offset in seconds to polling time interval
     * @param {boolean} options.shareUsage whether to include the share
     * usage element
     * @param {boolean} options.fileSystemWatcher whether to monitor the datafile
     * path for changes
     * @param {boolean} options.updateOnStart whether to download / update a
     * dataFile to the path specified in options.dataFile on start
     * @param {number} options.cacheSize size of the default cache
     * (includes cache if set). NOTE: This is not supported for on-premise
     * engine.
     * @param {Array} options.restrictedProperties list of properties the engine
     * will be restricted to
     * @param {string} options.performanceProfile used to control the tradeoff
     * between performance and system memory usage (Only applies to on-premise,
     * not cloud) options are: LowMemory, MaxPerformance, Balanced,
     * BalancedTemp, HighPerformance
     * @param {boolean} options.updateMatchedUserAgent True if the detection
     * should record the matched characters from the target User-Agent
     * @param {number} options.maxMatchedUserAgentLength Number of characters to
     * consider in the matched User-Agent. Ignored if updateMatchedUserAgent is
     * false
     * @param {number} options.drift Set maximum drift in hash position to allow
     * when processing HTTP headers.
     * @param {number} options.difference Set the maximum difference to allow
     * when processing HTTP headers. The difference is the difference in hash
     * value between the hash that was found, and the hash that is being searched
     * for. By default this is 0.
     * @param {string} options.allowUnmatched If set to false, a non-matching
     * User-Agent will result in properties without set values.
     * If set to true, a non-matching User-Agent will cause the 'default profiles'
     * to be returned.
     * This means that properties will always have values
     * (i.e. no need to check .HasValue) but some may be inaccurate.
     * By default, this is false.
     * @param {boolean} options.usePredictiveGraph [deprecated] True, the engine will use
     * the predictive optimized graph to in detections.
     * @param {boolean} options.usePerformanceGraph [deprecated] True, the engine will use
     * the performance optimized graph to in detections.
     *
     */
    constructor({ licenceKeys, dataFile, autoUpdate, pollingInterval, updateTimeMaximumRandomisation, shareUsage, fileSystemWatcher, updateOnStart, cacheSize, restrictedProperties, performanceProfile, updateMatchedUserAgent, maxMatchedUserAgentLength, drift, difference, allowUnmatched }: {
        licenceKeys: string;
        dataFile: string;
        autoUpdate: boolean;
        pollingInterval: number;
        updateTimeMaximumRandomisation: number;
        shareUsage: boolean;
        fileSystemWatcher: boolean;
        updateOnStart: boolean;
        cacheSize: number;
        restrictedProperties: any[];
        performanceProfile: string;
        updateMatchedUserAgent: boolean;
        maxMatchedUserAgentLength: number;
        drift: number;
        difference: number;
        allowUnmatched: string;
    }, ...args: any[]);
}
