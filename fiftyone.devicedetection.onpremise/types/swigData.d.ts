export = SwigData;
declare const SwigData_base: typeof import("fiftyone.pipeline.engines/types/aspectData");
/**
 * @typedef {import('fiftyone.pipeline.core').FlowElement} FlowElement
 */
/**
 * Extension of aspectData which stores the results created by the SWIG wrapper
 */
declare class SwigData extends SwigData_base {
    /**
     * Constructor for SwigData
     *
     * @param {object} options options object
     * @param {FlowElement} options.flowElement the FlowElement the
     * data is part of
     * @param {object} options.swigResults the results from the
     * swig engine
     */
    constructor({ flowElement, swigResults }: {
        flowElement: FlowElement;
        swigResults: object;
    }, ...args: any[]);
    swigResults: object;
    /**
     * Retrieves elementData via the swigWrapper but also casts it to the
     * correct type via a check of the engine's property list metadata
     *
     * @param {string} key the property key to retrieve
     * @returns {AspectPropertyValue} value property value
     */
    getInternal(key: string): typeof import("fiftyone.pipeline.core/types/aspectPropertyValue");
}
declare namespace SwigData {
    export { FlowElement };
}
type FlowElement = import("fiftyone.pipeline.core/types/flowElement");
