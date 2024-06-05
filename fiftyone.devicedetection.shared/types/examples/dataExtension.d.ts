export = DataExtension;
declare class DataExtension {
    /**
     * Helper function to read property values from flowData
     *
     * @param {object} elementData Element data
     * @param {string} propertyName Property name
     * @returns {string} result string, either property value or error
     * */
    static getValueHelper(elementData: object, propertyName: string): string;
}
