export = Component;
declare class Component {
    /**
     *  Constructor for Component
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
     * @type {object}
     */
    properties: object;
    /**
     * Yield component properties
     *
     * @generator
     * @yields {Property}
     * @returns {void}
     */
    getProperties(): void;
}
