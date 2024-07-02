export = HardwareProfileCloudEngine;
declare const HardwareProfileCloudEngine_base: typeof import("fiftyone.pipeline.cloudrequestengine/types/cloudEngine");
/**
 * This Cloud Aspect Engine enables the parsing of 'hardware profile'
 * responses from the 51Degrees cloud service.
 */
declare class HardwareProfileCloudEngine extends HardwareProfileCloudEngine_base {
}
declare namespace HardwareProfileCloudEngine {
    export { FlowData };
}
type FlowData = import("fiftyone.pipeline.core/types/flowData");
