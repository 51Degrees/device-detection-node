![51Degrees](https://51degrees.com/img/logo.png?utm_source=github&utm_medium=repository&utm_content=readme_main&utm_campaign=node-open-source "Data rewards the curious") **Node Device Detection**

[Developer Documentation](https://51degrees.com/device-detection-node/index.html?utm_source=github&utm_medium=repository&utm_content=documentation&utm_campaign=node-open-source "developer documentation")

## Introduction
This project contains 51Degrees Device Detection engines that can be used with the [Pipeline API](https://github.com/51Degrees/pipeline-node).

The Pipeline is a generic web request intelligence and data processing solution with the ability to add a range of 51Degrees and/or custom plug ins (Engines) 

## This package - fiftyone.devicedetection

This package provides a generic `DeviceDetectionPipelineBuilder` which check the input arguments to determine the type of Device Detection engine to be used in the resulting pipeline. The engine can be either Cloud or On-Premise.

This package requires the following additional packages:

- **fiftyone.devicedetection.cloud** - A Node.js engine which retrieves engine results by consuming data from the 51Degrees cloud service. A cloud builder is also included to build a pipeline for device detection cloud engine.
- **fiftyone.devicedetection.onpremise** - A Node.js engine which retrieves engine results by consuming data from the 51Degrees data file. A on-premise builder is also included to build a pipeline for device detection on-premise engine.
- **fiftyone.devicedetection.shared** - A Node.js module which contains shared functionality to build cloud and on-premise engines.

### Installation

Using NPM call:

`npm install fiftyone.devicedetection`

### Examples

- **gettingStarted.js** - Getting started example of using the 51Degrees device detection 'Hash' algorithm to determine whether a given User-Agent corresponds to a mobile device or not.

## Tests

In this repository, there are tests for the examples. 
You will need to install jest to run them:

`npm install jest --global`

You will also need to install any required packages for the examples in the **Examples** section.

You need to obtain a 51Degrees cloud resource key from the [51Degrees Cloud Configurator](https://configure.51degrees.com/) and assign it to the environment variable `RESOURCE_KEY` in your test environment.

To run the tests, navigate to the module directory and execute:

`npm test`
