export = DeviceDetectionOnPremise;
declare const DeviceDetectionOnPremise_base: typeof import("fiftyone.pipeline.engines/types/engine");
/**
 * On premise version of the 51Degrees Device Detection Engine
 * Uses a data file to process evidence in FlowData and create results
 * This datafile can automatically update when a new version is available
 **/
declare class DeviceDetectionOnPremise extends DeviceDetectionOnPremise_base {
    /**
     * Constructor for Device Detection On Premise engine
     *
     * @param {object} options options for the engine
     * @param {string} options.dataFilePath path to the datafile
     * @param {boolean} options.autoUpdate whether the datafile
     * should be registered with the data file update service
     * @param {number} options.pollingInterval How often to poll for
     * updates to the datafile (minutes)
     * @param {number} options.updateTimeMaximumRandomisation
     * Maximum randomisation offset in seconds to polling time interval
     * @param {DataKeyedCache} options.cache an instance of the Cache class from
     * Fiftyone.Pipeline.Engines. NOTE: This is no longer supported for
     * on-premise engine.
     * @param {string} options.dataFileUpdateBaseUrl base url for the datafile
     * update service
     * @param {Array} options.restrictedProperties list of properties the engine
     * will be restricted to
     * @param {string} options.licenceKeys license key(s) used by the
     * data file update service. A key can be obtained from the
     * 51Degrees website: https://51degrees.com/pricing.
     * If you do not wish to use a key then you can specify
     * an empty string, but this will cause automatic updates to
     * be disabled.
     * @param {boolean} options.download whether to download the datafile
     * or store it in memory
     * @param {string} options.performanceProfile options are:
     * LowMemory, MaxPerformance, Balanced, BalancedTemp, HighPerformance
     * @param {boolean} options.fileSystemWatcher whether to monitor the datafile
     * path for changes
     * @param {number} options.concurrency defaults to the number of cpus
     * in the machine
     * @param {boolean} options.reuseTempFile Indicates that an existing temp
     * file may be used. This should be selected if multiple instances wish to
     * use the same file to prevent high disk usage.
     * @param {boolean} options.updateMatchedUserAgent True if the detection
     * should record the matched characters from the target User-Agent
     * @param {object} options.maxMatchedUserAgentLength Number of characters to
     * consider in the matched User-Agent. Ignored if updateMatchedUserAgent
     * is false
     * @param {number} options.drift Set maximum drift in hash position to
     * allow when processing HTTP headers.
     * @param {number} options.difference Set the maximum difference to allow
     * when processing HTTP headers. The difference is the difference
     * in hash value between the hash that was found, and the hash
     * that is being searched for. By default this is 0.
     * @param {boolean} options.allowUnmatched True if there should be at least
     * one matched node in order for the results to be
     * considered valid. By default, this is false
     * @param {boolean} options.createTempDataCopy If true, the engine will
     * create a copy of the data file in a temporary location
     * rather than using the file provided directly. If not
     * loading all data into memory, this is required for
     * automatic data updates to occur.
     * @param {boolean} options.updateOnStart whether to download / update
     * the datafile on initialisation
     * @param {boolean} options.usePredictiveGraph If true, the engine will
     * use predictive optimized graph in detections.
     * @param {boolean} options.usePerformanceGraph If true, the engine will
     * use performance optimized graph in detections.
     */
    constructor({ dataFilePath, autoUpdate, cache, dataFileUpdateBaseUrl, restrictedProperties, licenceKeys, download, performanceProfile, reuseTempFile, updateMatchedUserAgent, maxMatchedUserAgentLength, drift, difference, concurrency, allowUnmatched, fileSystemWatcher, pollingInterval, updateTimeMaximumRandomisation, createTempDataCopy, updateOnStart, usePredictiveGraph, usePerformanceGraph }: {
        dataFilePath: string;
        autoUpdate: boolean;
        pollingInterval: number;
        updateTimeMaximumRandomisation: number;
        cache: DataKeyedCache;
        dataFileUpdateBaseUrl: string;
        restrictedProperties: any[];
        licenceKeys: string;
        download: boolean;
        performanceProfile: string;
        fileSystemWatcher: boolean;
        concurrency: number;
        reuseTempFile: boolean;
        updateMatchedUserAgent: boolean;
        maxMatchedUserAgentLength: object;
        drift: number;
        difference: number;
        allowUnmatched: boolean;
        createTempDataCopy: boolean;
        updateOnStart: boolean;
        usePredictiveGraph: boolean;
        usePerformanceGraph: boolean;
    }, ...args: any[]);
    initEngine: () => Promise<any>;
}
declare namespace DeviceDetectionOnPremise {
    export { DataKeyedCache };
}
type DataKeyedCache = import("fiftyone.pipeline.engines/types/dataKeyedCache");
