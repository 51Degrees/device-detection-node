![51Degrees](https://51degrees.com/img/logo.png?utm_source=github&utm_medium=repository&utm_content=readme_main&utm_campaign=node-open-source "Data rewards the curious") **Node Device Detection On-Premise**

[Developer Documentation](https://51degrees.com/device-detection-node/index.html?utm_source=github&utm_medium=repository&utm_content=documentation&utm_campaign=node-open-source "developer documentation")

## Introduction
This project contains 51Degrees Device Detection engines that can be used with the [Pipeline API](https://github.com/51Degrees/pipeline-node).

The Pipeline is a generic web request intelligence and data processing solution with the ability to add a range of 51Degrees and/or custom plug ins (Engines) 

## This package - fiftyone.devicedetection.onpremise

This package provides a On-Premise implementation of Device Detection engine which makes use of a local data file. This includes a builder used to build a pipeline for On-Premise Device Detection engine.

This package requires the following additional packages:

- [**fiftyone.devicedetection.shared**](/fiftyone.devicedetection.shared#readme) - A Node.js module which contains shared functionality to build cloud and on-premise engines.

### Installation

Using NPM call:

```
npm install fiftyone.devicedetection.onpremise
```

### On-Premise
When running on-premise, a local Hash V4.1 data file is required.

[**Hash**](https://51degrees.com/documentation/_device_detection__hash.html): A large binary file populated with User-Agent signatures allowing very fast detection speeds.

51Degrees provides [multiple options](https://51degrees.com/Licencing-Pricing/On-Premise), some of which support automatic updates through the Pipeline API.

If the module is installed directly from Git then the binaries are also required. These binaries are native module which contains the core engine of device detection. Below are the steps to build these binaries:
#### Pre-requisites

- Install Node.js.
- Install node-gyp by running.
  - `npm install node-gyp --global`  
- Install C build tools:
  - Windows:
    - You will need either Visual Studio 2019 or the [C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) installed.
      - Minimum platform toolset version is `v142`
      - Minimum Windows SDK version is `10.0.18362.0`
  - Linux/MacOS:
    - `sudo apt-get install g++ make libatomic1`
- Pull git submodules:
  - `git submodule update --init --recursive`

#### Build Steps 

- Navigate to fiftyone.devicedetection.onpremise
- Rename the `binding.51d` to `binding.gyp`
- Run `npm install`
  - Alternatively this step can be replaced by the followings:
    - Create a folder named `build`.
    - Run `node-gyp configure`
    - Run `node-gyp build`
  - Platform specific:
    - Windows
      - By default this will look for Visual Studio 2019 and a minimum Windows SDK version `10.0.18362.0`.
      - This can be overwritten by include `--msvs_version=[VS version]` and `--msvs_target_platform_version=[Windows SDK Version]` as part of the `npm install` command.
        - **NOTE**: This is not recommended. Also, some time the latest SDK version is selected instead, as observed in environment with multiple SDK versions installed. Thus, only install the correct Visual Studio version and the minimum required Windows SDK version as recommended.
- This will build the `FiftyOneDeviceDetectionHashV4.node` under `build/Release` folder.
- Copy the `FiftyOneDeviceDetectionHashV4.node` to `build` directory (which is one level up) and rename it using the following convention.
  - Windows:
    - FiftyOneDeviceDetectionHashV4-win32-[ Node version ].node
      - e.g. FiftyOneDeviceDetectionHashV4-win32-10.node for Node 10.
  - Linux:
    - FiftyOneDeviceDetectionHashV4-linux-[ Node version ].node
      - e.g. FiftyOneDeviceDetectionHashV4-linux-10.node for Node 10.
  - MacOS:
    - FiftyOneDeviceDetectionHashV4-darwin-[ Node version ].node
      - e.g. FiftyOneDeviceDetectionHashV4-darwin-10.node for Node 10.
  - Please see the [tested versions page](https://51degrees.com/documentation/_info__tested_versions.html) for Node versions that we currently test against. The software may run fine against other versions, but extra caution should be applied.
  - You can optionally clear up by removing all the build files and folders except for the *.node file that's been created.
  - `WARNING`: `npm install` removes this copied file, so you will need to do the above steps again after running `npm install`


### Examples

For details of how to run the examples, please refer to [run examples](/run_examples.md).
The tables below describe the examples that are available.

| Example                                | Description |
|----------------------------------------|-------------|
| [automaticupdates/dataFileSystemWatcher.js](/fiftyone.devicedetection.onpremise/examples/onpremise/automaticupdates/dataFileSystemWatcher.js) | How to configure automatic updates using the file system watcher to monitor for changes to the data file. |
| [automaticupdates/updateOnStartUp.js](/fiftyone.devicedetection.onpremise/examples/onpremise/automaticupdates/updateOnStartUp.js)    | How to configure the Pipeline to automatically update the device detection data file on startup. |
| [automaticupdates/updatePollingInterval.js](/fiftyone.devicedetection.onpremise/examples/onpremise/automaticupdates/updatePollingInterval.js) | Ho to configure and verify the various automatic data file update settings. |
| [gettingstarted-console](/fiftyone.devicedetection.onpremise/examples/onpremise/gettingstarted-console)                | How to use the 51Degrees on-premise device detection API to determine details about a device based on its User-Agent and User-Agent Client Hints HTTP header values. |
| [gettingstarted-web](/fiftyone.devicedetection.onpremise/examples/onpremise/gettingstarted-web)                     | How to use the 51Degrees Cloud service to determine details about a device as part of a simple web server. |
| [matchmetrics-console](/fiftyone.devicedetection.onpremise/examples/onpremise/matchmetrics-console)                   | How to view metrics associated with the results of processing with a Device Detection engine. |
| [metadata-console](/fiftyone.devicedetection.onpremise/examples/onpremise/metadata-console)                       | How to access the meta-data that relates to the device detection algorithm. |
| [offlineprocessing-console](/fiftyone.devicedetection.onpremise/examples/onpremise/offlineprocessing-console)              | How to process data for later viewing using a Device Detection Hash data file. |
| [performance-console](/fiftyone.devicedetection.onpremise/examples/onpremise/performance-console)                    | How to configure the various performance options and run a simple performance test. |
| [updatedatafile-console](/fiftyone.devicedetection.onpremise/examples/onpremise/updatedatafile-console)                 | This example illustrates various parameters that can be adjusted when using the on-premise device detection engine, and controls when a new data file is sought and when it is loaded by the device detection software. |
| [useragentclienthints-web](/fiftyone.devicedetection.onpremise/examples/onpremise/useragentclienthints-web)               | This is now deprecated. Kept for testing purposes. Please see **gettingstarted-web** instead. |


## Tests

In this repository, there are tests for the examples. 
You will need to install jest to run them:

```
npm install jest --global
```

You will also need to install any required packages for the examples in the **Examples** section.

To run the tests, navigate to the module directory and execute:

```
npm test
```

## Native code updates

Process for rebuilding SWIG interfaces following an update to the device detection cxx code (This is only intended to be run by 51Degrees developers internally):

1. Ensure Swig is installed.
   1. At the time when this README was updated, the current stable version of Swig did not support new changes in Node 12 and above.
   2. The Swig version being used is built from the following branch.
      1. https://github.com/yegorich/swig/tree/pr/new-node-fixes.
      2. There had been an active Pull Request created to merge the changes to the main Swig master branch.
      3. Once the Pull Request is completed, the consequent Swig releases should be used.
2. Update the device-detection-cxx submodule to reference the relevant commit.
3. From terminal, navigate to fiftyone.pipeline.devicedetection and run:
    a) swig -c++ -javascript -node hash_node.i
4. Commit changes to repository.
5. Run the 'Build Device Detection Binaries for Node.js' Azure CI Pipeline.
6. Copy the produced artifacts into the fiftyone.pipeline.devicedetection/build directory.
7. Commit changes to repository.

