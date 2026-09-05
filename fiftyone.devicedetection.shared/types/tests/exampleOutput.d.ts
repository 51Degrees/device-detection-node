/**
 * A stand in for process.stdout that keeps what an example writes, so a
 * test can assert on it rather than only that the example did not throw.
 */
export class ExampleOutput {
    chunks: any[];
    /**
     * Called by the examples in place of process.stdout.write.
     *
     * @param {string} chunk Text the example wrote
     * @returns {boolean} Always true, matching the stream contract
     */
    write(chunk: string): boolean;
    /**
     * Everything the example wrote, as one string.
     *
     * @returns {string} The output
     */
    text(): string;
    /**
     * The output split into lines, with empty lines removed.
     *
     * @returns {Array<string>} The lines
     */
    lines(): Array<string>;
    /**
     * The fault markers present in the output, if any.
     *
     * @returns {Array<string>} The markers found
     */
    faults(): Array<string>;
}
export const FAULT_MARKERS: string[];
