export = OptionsExtension;
declare class OptionsExtension {
    /**
     * Get element by name
     *
     * @param {object} options Options
     * @param {string} elementName Element name
     * @returns {object} Element
     */
    static getElement(options: object, elementName: string): object;
    /**
     * Get Datafile path
     *
     * @param {object} options Options
     * @returns {string} Datafile path
     */
    static getDataFilePath(options: object): string;
    /**
     * Set Datafile path
     *
     * @param {object} options Options
     * @param {string} newDataFilePath New Datafile path
     */
    static setDataFilePath(options: object, newDataFilePath: string): void;
    /**
     * Update Element path
     *
     * @param {object} options Options
     * @param {string} appendDir New element path
     */
    static updateElementPath(options: object, appendDir: string): void;
    /**
     * Get resource Key
     *
     * @param {object} options Options
     * @returns {string} Resource key
     */
    static getResourceKey(options: object): string;
    /**
     * Set resource key
     *
     * @param {object} options Options
     * @param {string} resourceKey New resource key
     */
    static setResourceKey(options: object, resourceKey: string): void;
}
