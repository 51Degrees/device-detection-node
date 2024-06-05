export = DeviceDetectionMissingPropertyService;
declare const DeviceDetectionMissingPropertyService_base: typeof import("fiftyone.pipeline.engines/types/missingPropertyService");
/**
 * @typedef {import('fiftyone.pipeline.core').FlowElement} FlowElement
 */
/**
 * Instance of the MissingPropertyService class that checks if a
 * property is available in the current dataFile
 */
declare class DeviceDetectionMissingPropertyService extends DeviceDetectionMissingPropertyService_base {
    /**
     * Constructor for Missing Property Service that receives a requested property
     * key that is missing in the data. If it is missing because the data does not
     * exist in the data file that was chosen, it returns an error which
     * states which data file the property can be found in.
     *
     * @param {string} key missing property key
     * @param {FlowElement} flowElement the FlowElement the key was missing from
     * @returns {void}
     */
    check(key: string, flowElement: FlowElement): void;
}
declare namespace DeviceDetectionMissingPropertyService {
    export { FlowElement };
}
type FlowElement = import("fiftyone.pipeline.core/types/flowElement");
