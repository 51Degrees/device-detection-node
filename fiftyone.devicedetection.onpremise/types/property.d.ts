export = Property;
declare class Property {
    /**
     *  Constructor for Property
     *
     * @param {object} metadata Metadata
     * @param {object} engineMetadata Engine metadata
     */
    constructor(metadata: object, engineMetadata: object);
    metadata: object;
    engineMetadata: object;
    /**
     * @type {string}
     */
    name: string;
    /**
     * @type {string}
     */
    type: string;
    /**
     * @type {Array<string>}
     */
    dataFiles: Array<string>;
    /**
     * @type {string}
     */
    category: string;
    /**
     * @type {string}
     */
    description: string;
    /**
     * @type {Component}
     */
    component: import("./component");
    /**
     * @type {object}
     */
    values: object;
    /**
     * Yield property values
     *
     * @generator
     * @yields {object}
     * @returns {void}
     */
    getValues(): void;
    /**
     * Get number of values in the property
     *
     * @returns {number} uint32
     */
    getNumberOfValues(): number;
}
