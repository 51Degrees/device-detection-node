export = DataExtension;
declare class DataExtension {
    /**
     * Format a property value for display.
     *
     * A property can be unavailable for three reasons, and each one reads
     * differently so the person running the example can tell them apart.
     * The property may have a value, it may have no value with the cloud
     * service giving a reason (most often that the resource key is not
     * entitled to it), or it may not be in the results at all.
     *
     * @param {object} elementData Element data
     * @param {string} propertyName Property name
     * @returns {string} The value, or a line saying why there is none
     * */
    static getValueHelper(elementData: object, propertyName: string): string;
    /**
     * Read the list of hardware profiles from the 'hardware' element data.
     *
     * An empty list is returned when the resource key has no access to the
     * hardware aspect at all, because reading a property that is not there
     * can raise rather than return an empty list.
     *
     * @param {object} hardware The 'hardware' element data
     * @returns {Array} The profiles, or an empty array
     * */
    static getProfilesHelper(hardware: object): any[];
    /**
     * The line printed when a lookup returned no device profiles at all.
     *
     * @returns {string} The message to print
     * */
    static getNoProfilesMessage(): string;
}
