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
     * @param {ResultsHashSwig} options.swigResults the results from the
     * swig engine
     */
    constructor({ flowElement, swigResults }: {
        flowElement: FlowElement;
        swigResults: any;
    }, ...args: any[]);
    swigResults: any;
}
declare namespace SwigData {
    export { FlowElement };
}
type FlowElement = import("fiftyone.pipeline.core/types/flowElement");
