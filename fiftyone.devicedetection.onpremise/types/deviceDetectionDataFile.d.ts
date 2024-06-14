export = DeviceDetectionDataFile;
declare const DeviceDetectionDataFile_base: typeof import("fiftyone.pipeline.engines/types/dataFile");
/**
 * Instance of DataFile class for the Device Detection Engine
 * Extends datafile by providing a formatter for the DataFileUpdateService
 * update url which contains the product, type and licensekeys.
 * These paramaters are passed in to the datafile constructor's
 * updateURLParams parameter
 **/
declare class DeviceDetectionDataFile extends DeviceDetectionDataFile_base {
    /**
     * Constructor for Device Detection DataFile
     *
     * @param {object} options options for the datafile
     * @param {string} options.useUrlFormatter whether to append default URL params for Data File download
     **/
    constructor({ useUrlFormatter, ...rest }: {
        useUrlFormatter: string;
    });
    useUrlFormatter: string;
}
