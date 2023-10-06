/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2023 51 Degrees Mobile Experts Limited, Davidson House,
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

module.exports = {
  /* Default params */
  dataFileUpdateBaseUrl: 'https://distributor.51degrees.com/api/v2/download',

  /* Match metrics description */
  deviceIdDescription: 'Consists of four components separated by a ' +
    'hyphen symbol: Hardware-Platform-Browser-IsCrawler where each ' +
    'Component represents an ID of the corresponding Profile.',
  userAgentsDescription: 'The matched User-Agents.',
  differenceDescription: 'Used when detection method is not Exact or ' +
     'None. This is an integer value and the larger the value the less ' +
     'confident the detector is in this result.',
  methodDescription: 'The method used to determine the match result.',
  matchedNodesDescription: 'Indicates the number of hash nodes matched ' +
     'within the evidence.',
  driftDescription: 'Total difference in character positions where the ' +
     'substrings hashes were found away from where they were expected.',
  iterationsDescription: 'The number of iterations carried out in order ' +
     'to find a match. This is the number of nodes in the graph which ' +
     'have been visited.',

  /* Match methods */
  none: 'NONE',
  performance: 'PERFORMANCE',
  combined: 'COMBINED',
  predictive: 'PREDICTIVE'
};
