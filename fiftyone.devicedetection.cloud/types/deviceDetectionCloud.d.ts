export = DeviceDetectionCloud;
/**
 * The deviceDetction cloud engine requires the 51Degrees
 * cloudRequestEngine to be placed in a pipeline before it.
 * It takes that raw JSON response and parses it to extract the
 * device part. It also uses this data to generate a list of properties
 **/
declare class DeviceDetectionCloud {
    /**
     * Constructor for DeviceDetectionCloud
     */
    constructor(...args: any[]);
    dataKey: string;
}
