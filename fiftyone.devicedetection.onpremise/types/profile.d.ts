export = Profile;
declare class Profile {
    /**
     *  Constructor for Profile
     *
     * @param {object} metadata Metadata
     * @param {object} engineMetadata Engine metadata
     */
    constructor(metadata: object, engineMetadata: object);
    metadata: object;
    engineMetadata: object;
    /**
     * @type {Component}
     */
    component: import("./component");
    /**
     * @type {number} uint32
     */
    profileId: number;
}
