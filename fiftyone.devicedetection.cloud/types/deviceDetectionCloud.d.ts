export = DeviceDetectionCloud;
declare const DeviceDetectionCloud_base: typeof import("fiftyone.pipeline.cloudrequestengine/types/cloudEngine");
/**
 * The deviceDetction cloud engine requires the 51Degrees
 * cloudRequestEngine to be placed in a pipeline before it.
 * It takes that raw JSON response and parses it to extract the
 * device part. It also uses this data to generate a list of properties
 **/
declare class DeviceDetectionCloud extends DeviceDetectionCloud_base {
}
