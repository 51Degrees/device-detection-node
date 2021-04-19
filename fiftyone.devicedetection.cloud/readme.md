![51Degrees](https://51degrees.com/img/logo.png?utm_source=github&utm_medium=repository&utm_content=readme_main&utm_campaign=node-open-source "Data rewards the curious") **Node Device Detection Cloud**

[Developer Documentation](https://51degrees.com/device-detection-node/index.html?utm_source=github&utm_medium=repository&utm_content=documentation&utm_campaign=node-open-source "developer documentation")

## Introduction
This project contains 51Degrees Device Detection engines that can be used with the [Pipeline API](https://github.com/51Degrees/pipeline-node).

The Pipeline is a generic web request intelligence and data processing solution with the ability to add a range of 51Degrees and/or custom plug ins (Engines) 

## This package - fiftyone.devicedetection.cloud

The device detection cloud engine makes use of the 51Degrees cloud API. As such there is no data file to maintain, processing will always be performed using the latest data available. This package includes a builder used to build a pipeline for Cloud Device Detection engine.

This package requires the following additional packages:

- **fiftyone.devicedetection.shared** - A Node.js module which contains shared functionality to build cloud and on-premise engines.

### Installation

Using NPM call:

`npm install fiftyone.devicedetection.cloud`

### Examples

- **configureFromFile.js** - This example shows how to configure a pipeline from a configuration file using the pipelinebuilder's buildFromConfigurationFile method.
- **failureToMatch.js** - This example shows how the hasValue function can help make sure that meaningful values are returned when checking properties returned from the device detection engine. It also illustrates how the "allowUnmatched" parameters can be used to alter these results.
- **gettingStarted.js** - Getting started example of using the 51Degrees device detection 'Hash' algorithm to determine whether a given User-Agent corresponds to a mobile device or not.
- **metaData.js** - This example shows how to get properties from a pipeline's processed flowData based on their metadata, the getProperties() method and also additional meta data properties on device detection data.
- **webIntegration.js** - This example demonstrates the evidence.addFromRequest() method and client side JavaScript overrides by creating a web server, serving JavaScript created by the device detection engine and bundled together by a special JavaScript bundler engine. This JavaScript is then used on the client side to save a cookie so that when the device detection engine next processes the request (using the addFromRequest() method) it has a more accurate reading for properties set on the client side.

## Tests

In this repository, there are tests for the examples. 
You will need to install jest to run them:

`npm install jest --global`

You will also need to install any required packages for the examples in the **Examples** section.

You need to obtain a 51Degrees cloud resource key from the [51Degrees Cloud Configurator](https://configure.51degrees.com/) and assign it to the environment variable `RESOURCE_KEY` in your test environment.

To run the tests, navigate to the module directory and execute:

`npm test`
