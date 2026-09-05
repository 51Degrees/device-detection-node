/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2026 51 Degrees Mobile Experts Limited, Davidson House,
 * Forbury Square, Reading, Berkshire, United Kingdom RG1 3EU.
 *
 * This Original Work is licensed under the European Union Public Licence
 * (EUPL) v.1.2 and is subject to its terms as set out below.
 *
 * If a copy of the EUPL was not distributed with this file, You can obtain
 * one at https://opensource.org/licenses/EUPL-1.2.
 *
 * The 'Compatible Licences' set out in the Appendix to the EUPL (as may be
 * amended by the European Commission) shall be deemed incompatible for
 * the purposes of the Work and the provisions of the compatibility
 * clause in Article 5 of the EUPL shall not apply.
 *
 * If using the Work as, or as part of, a network application, by
 * including the attribution notice(s) required under Article 5 of the EUPL
 * in the end user terms of the application under an appropriate heading,
 * such notice(s) shall fulfill the requirements of that article.
 * ********************************************************************* */

// Text that shows an example printed a programming fault rather than a
// result. An example that reaches any of these is broken, however little
// of the data the resource key is entitled to.
const FAULT_MARKERS = [
  'TypeError',
  'ReferenceError',
  'SyntaxError',
  'RangeError',
  '[object Object]',
  'Unknown ()',
  'Unknown (undefined)',
  'Unknown (null)'
];

/**
 * A stand in for process.stdout that keeps what an example writes, so a
 * test can assert on it rather than only that the example did not throw.
 */
class ExampleOutput {
  constructor () {
    this.chunks = [];
  }

  /**
   * Called by the examples in place of process.stdout.write.
   *
   * @param {string} chunk Text the example wrote
   * @returns {boolean} Always true, matching the stream contract
   */
  write (chunk) {
    this.chunks.push(String(chunk));
    return true;
  }

  /**
   * Everything the example wrote, as one string.
   *
   * @returns {string} The output
   */
  text () {
    return this.chunks.join('');
  }

  /**
   * The output split into lines, with empty lines removed.
   *
   * @returns {Array<string>} The lines
   */
  lines () {
    return this.text().split('\n').filter(line => line.trim().length > 0);
  }

  /**
   * The fault markers present in the output, if any.
   *
   * @returns {Array<string>} The markers found
   */
  faults () {
    const text = this.text();

    return FAULT_MARKERS.filter(marker => text.indexOf(marker) !== -1);
  }
}

module.exports = {
  ExampleOutput,
  FAULT_MARKERS
};
