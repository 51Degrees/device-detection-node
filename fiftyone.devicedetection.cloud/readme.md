![51Degrees](https://51degrees.com/img/logo.png?utm_source=github&utm_medium=repository&utm_content=readme_main&utm_campaign=node-open-source "Data rewards the curious") **Node Device Detection Cloud**

[Developer Documentation](https://51degrees.com/device-detection-node/index.html?utm_source=github&utm_medium=repository&utm_content=documentation&utm_campaign=node-open-source "developer documentation")

## Introduction
This project contains 51Degrees Device Detection engines that can be used with the [Pipeline API](https://github.com/51Degrees/pipeline-node).

The Pipeline is a generic web request intelligence and data processing solution with the ability to add a range of 51Degrees and/or custom plug ins (Engines) 

## This package - fiftyone.devicedetection.cloud

The device detection cloud engine makes use of the 51Degrees cloud API. As such there is no data file to maintain, processing will always be performed using the latest data available. This package includes a builder used to build a pipeline for Cloud Device Detection engine.

This package requires the following additional packages:

- [**fiftyone.devicedetection.shared**](/fiftyone.devicedetection.shared#readme) - A Node.js module which contains shared functionality to build cloud and on-premise engines.

### Installation

Using NPM call:

```
npm install fiftyone.devicedetection.cloud
```

### Examples

For details of how to run the examples, please refer to [run examples](/run_examples.md).
The tables below describe the examples that are available.

| Example                                | Description |
|----------------------------------------|-------------|
| [configurator-console](/fiftyone.devicedetection.cloud/examples/cloud/configurator-console)                   | Shows how to call the cloud with the created key and how to access the values of the selected properties.|
| [gettingstarted-console](/fiftyone.devicedetection.cloud/examples/cloud/gettingstarted-console)                 | How to use the 51Degrees Cloud service to determine details about a device based on its User-Agent and User-Agent Client Hints HTTP header values. |
| [gettingstarted-web](/fiftyone.devicedetection.cloud/examples/cloud/gettingstarted-web)                     | How to use the 51Degrees Cloud service to determine details about a device as part of a simple web server. |
| [metadata-console](/fiftyone.devicedetection.cloud/examples/cloud/metadata-console)                       | How to access the meta-data that relates to the device detection algorithm. |
| [nativemodellookup-console](/fiftyone.devicedetection.cloud/examples/cloud/nativemodellookup-console)              | How to get device details based on a given 'native model name' using the 51Degrees cloud service. |
| [taclookup-console](/fiftyone.devicedetection.cloud/examples/cloud/taclookup-console)                      | How to get device details based on a given TAC (Type Allocation Code) using the 51Degrees cloud service. |
| [useragentclienthints-web](/fiftyone.devicedetection.cloud/examples/cloud/useragentclienthints-web)               | This is now deprecated. Kept for testing purposes. Please see **gettingstarted-web** instead.


## Tests

In this repository, there are tests for the examples. 
You will need to install jest to run them:

```
npm install jest --global
```

You will also need to install any required packages for the examples in the **Examples** section.

Add a 51Degrees cloud resource key in the fiftyone.devicedetection/package.json file for cloud tests. You can obtain a resource key from the [51Degrees Cloud Configurator](https://configure.51degrees.com/) and assign it to the environment variable `RESOURCE_KEY` in your test environment.

There are other environment variables that you will also need to set in your test environment before running all tests:
- `TEST_SUPER_RESOURCE_KEY`: This key contains all `SetHeader*` properties.
- `TEST_PLATFORM_RESOURCE_KEY`: This key contains only the `SetHeaderPlatform*` property but no other `SetHeader` properties.
- `TEST_HARDWARE_RESOURCE_KEY`: This key contains only the `SetHeaderHardware*` property but no other `SetHeader` properties.
- `TEST_BROWSER_RESOURCE_KEY`: This key contains only the `SetHeaderBrowser*` property but no other `SetHeader` properties.
- `TEST_NO_SETHEADER_RESOURCE_KEY`: This key contains no `SetHeader` properties.

To run the tests, execute the following command in the root directory or a sub-module directory:

```
npm test
```
