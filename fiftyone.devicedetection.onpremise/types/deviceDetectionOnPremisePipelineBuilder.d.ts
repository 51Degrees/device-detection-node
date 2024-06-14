export = DeviceDetectionOnPremisePipelineBuilder;
declare const DeviceDetectionOnPremisePipelineBuilder_base: typeof import("fiftyone.pipeline.core/types/pipelineBuilder");
/**
 * @typedef {import('fiftyone.pipeline.engines').DataFileUpdateService} DataFileUpdateService
 */
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
     * @param {boolean} options.dataUpdateVerifyMd5 whether to check MD5 of datafile
     * @param {boolean} options.dataUpdateUseUrlFormatter whether to append default URL params for Data File download
     * @param {boolean} options.autoUpdate whether to autoUpdate the dataFile
     * @param {string} options.dataUpdateUrl base url for the datafile
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
     * @param {Array<string>} options.restrictedProperties list of properties the engine
     * will be restricted to
     * @param {string} options.performanceProfile used to control the tradeoff
     * between performance and system memory usage (Only applies to on-premise,
     * not cloud) options are: LowMemory, MaxPerformance, Balanced,
     * BalancedTemp, HighPerformance
     * @param {number} options.concurrency defaults to the number of cpus
     * in the machine
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
     * @param {boolean} options.createTempDataCopy If true, the engine will
     * create a copy of the data file in a temporary location
     * rather than using the file provided directly. If not
     * loading all data into memory, this is required for
     * automatic data updates to occur.
     * @param {string} options.tempDataDir The directory to use for the
     * temporary data copy if 'createTempDataCopy' is set to true.
     * @param {DataFileUpdateService} options.dataFileUpdateService Set
     * DataFileUpdateService so the datafiles can receive
     * automatic updates
     */
    constructor({ dataFileUpdateService, licenceKeys, dataFile, dataUpdateVerifyMd5, dataUpdateUseUrlFormatter, autoUpdate, dataUpdateUrl, pollingInterval, updateTimeMaximumRandomisation, shareUsage, fileSystemWatcher, updateOnStart, cacheSize, restrictedProperties, performanceProfile, concurrency, updateMatchedUserAgent, maxMatchedUserAgentLength, drift, difference, allowUnmatched, createTempDataCopy, tempDataDir }: {
        licenceKeys: string;
        dataFile: string;
        dataUpdateVerifyMd5: boolean;
        dataUpdateUseUrlFormatter: boolean;
        autoUpdate: boolean;
        dataUpdateUrl: string;
        pollingInterval: number;
        updateTimeMaximumRandomisation: number;
        shareUsage: boolean;
        fileSystemWatcher: boolean;
        updateOnStart: boolean;
        cacheSize: number;
        restrictedProperties: Array<string>;
        performanceProfile: string;
        concurrency: number;
        updateMatchedUserAgent: boolean;
        maxMatchedUserAgentLength: number;
        drift: number;
        difference: number;
        allowUnmatched: string;
        createTempDataCopy: boolean;
        tempDataDir: string;
        dataFileUpdateService: DataFileUpdateService;
    }, ...args: any[]);
}
declare namespace DeviceDetectionOnPremisePipelineBuilder {
    export { DataFileUpdateService };
}
type DataFileUpdateService = import("fiftyone.pipeline.engines/types/dataFileUpdateService");
