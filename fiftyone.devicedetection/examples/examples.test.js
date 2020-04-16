/* *********************************************************************
 * This Original Work is copyright of 51 Degrees Mobile Experts Limited.
 * Copyright 2019 51 Degrees Mobile Experts Limited, 5 Charlotte Close,
 * Caversham, Reading, Berkshire, United Kingdom RG4 7BY.
 *
 * This Original Work is licensed under the European Union Public Licence (EUPL)
 * v.1.2 and is subject to its terms as set out below.
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

const fs = require('fs');
const path = require('path');

const testExample = function ({ file, portNumber }) {
  if (portNumber) {
    process.env.PORT = portNumber;
  }

  // Change the working directory of the example to be the example itself

  process.env.directory = path.dirname(file);

  let code = fs.readFileSync(file, 'utf8');

  // Add in closer of any apps

  const serverClose = `
    
    if(typeof server !== "undefined"){

        server.close();

    }

    `;

  code += serverClose;

  jest.fn(eval(code));
};

test('cloud web integration', (done) => {
  setTimeout(done, 1000);

  testExample({ file: (__dirname) + '/cloud/webIntegration.js' });
});

test('hash web integration', (done) => {
  setTimeout(done, 1000);

  testExample({ file: (__dirname) + '/hash/webIntegration.js' });
});

// Skip the rest of the examples when async is not available
let isAsync = true;

try {
  eval('async () => {}');
} catch (e) {
  isAsync = false;
}

if (isAsync) {
  test('cloud getting started', (done) => {
    setTimeout(done, 1000);

    testExample({ file: (__dirname) + '/cloud/gettingStarted.js' });
  });

  test('cloud failure to match', (done) => {
    setTimeout(done, 1000);

    testExample({ file: (__dirname) + '/cloud/failureToMatch.js' });
  });

  test('cloud metadata', (done) => {
    setTimeout(done, 1000);

    testExample({ file: (__dirname) + '/cloud/metaData.js' });
  });

  test('hash getting started', (done) => {
    setTimeout(done, 1000);

    testExample({ file: (__dirname) + '/hash/gettingStarted.js' });
  });

  test('hash failure to match', (done) => {
    setTimeout(done, 1000);

    testExample({ file: (__dirname) + '/hash/failureToMatch.js' });
  });

  test('hash metadata', (done) => {
    setTimeout(done, 1000);

    testExample({ file: (__dirname) + '/hash/metaData.js' });
  });
}
