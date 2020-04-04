![51Degrees](https://51degrees.com/DesktopModules/FiftyOne/Distributor/Logo.ashx?utm_source=github&utm_medium=repository&utm_content=readme_main&utm_campaign=node-open-source "THE Fastest and Most Accurate Device Detection") **v4 Device Detection**

[Pipeline Documentation](https://docs.51degrees.com?utm_source=github&utm_medium=repository&utm_content=documentation&utm_campaign=node-open-source "advanced developer documentation") | [Available Properties](https://51degrees.com/resources/property-dictionary?utm_source=github&utm_medium=repository&utm_content=property_dictionary&utm_campaign=node-open-source "View all available properties and values")

## Introduction
This project contains 51Degrees Device Detection engines that can be used with the [Pipeline API](https://github.com/51Degrees/pipeline-node).

The Pipeline is a generic web request intelligence and data processing solution with the ability to add a range of 51Degrees and/or custom plug ins (Engines) 

## Device detection

Device detection can be performed 'on-premise' using a local data file or via the 51Degrees cloud service. 

These options all use the same evidence and property names so can be swapped out as needed.

### Installation

Using NPM call:

`npm install fiftyone.devicedetection`

Or to install from this repository run:

`npm install fiftyone.devicedetection/`

This will build also build the native modules.

### On-Premise
When running on-premise, a local Hash V4.1 data file is required.

[**Hash**](https://docs.51degrees.com/documentation/4.1/_device_detection__hash.html): A large binary file populated with User-Agent signatures allowing very fast detection speeds.

51Degrees provides [multiple options](https://51degrees.com/Licencing-Pricing/On-Premise), some of which support automatic updates through the Pipeline API.

### Cloud

The device detection cloud engine makes use of the 51Degrees cloud API. As such there is no data file to maintain, processing will always be performed using the latest data available.

### Examples

Usage examples are available for cloud and hash in ``fiftyone.devicedetection/examples``

- **configureFromFile.js** - This example shows how to configure a pipeline from a configuration file using the pipelinebuilder's buildFromConfigurationFile method.
- **failureToMatch.js** - This example shows how the hasValue function can help make sure that meaningful values are returned when checking properties returned from the device detection engine. It also illustrates how the "allowUnmatched" parameters can be used to alter these results.
- **gettingStarted.js** - Getting started example of using the 51Degrees device detection 'Hash' algorithm to determine whether a given User-Agent corresponds to a mobile device or not.
- **metaData.js** - This example shows how to get properties from a pipeline's processed flowData based on their metadata, the getProperties() method and also additional meta data properties on device detection data.
- **webIntegration.js** - This example demonstrates the evidence.addFromRequest() method and client side JavaScript overrides by creating a web server, serving JavaScript created by the device detection engine and bundled together by a special JavaScript bundler engine. This JavaScript is then used on the client side to save a cookie so that when the device detection engine next processes the request (using the addFromRequest() method) it has a more accurate reading for properties set on the clientside.

## Tests

In this repository, there are tests for the examples. 
You will need to install jest to run them:

`npm install jest --global`

To run the tests, navigate to the package directory:

`cd fiftyone.devicedetection/`

Then call:

`jest`

## Native code updates

Process for rebuilding SWIG interfaces following an update to the device detection cxx code (This is only intended to be run by 51Degrees developers internally):

1. Ensure Swig is installed.
2. Update the device-detection-cxx submodule to reference the relevant commit.
3. From terminal, navigate to fiftyone.pipeline.devicedetection and run:
    a) swig -c++ -javascript -node hash_node.i
4. Commit changes to repository.
5. Run the 'Build Device Detection Binaries' Azure CI Pipeline.
6. Copy the produced artifacts into the fiftyone.pipeline.devicedetection/build directory.
7. Commit changes to repository.