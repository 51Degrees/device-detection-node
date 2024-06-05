export = HardwareProfileCloudEngine;
/**
 * This Cloud Aspect Engine enables the parsing of 'hardware profile'
 * responses from the 51Degrees cloud service.
 */
declare class HardwareProfileCloudEngine {
    /**
     * Constructor for HardwareProfileCloudEngine
     */
    constructor(...args: any[]);
    dataKey: string;
    /**
     * Process internal FlowData cloud data for devices,
     * set them as FlowData elements
     *
     * @param {FlowData} flowData The FlowData object
     */
    processInternal(flowData: FlowData): void;
}
declare namespace HardwareProfileCloudEngine {
    export { FlowData };
}
type FlowData = import("fiftyone.pipeline.core/types/flowData");
