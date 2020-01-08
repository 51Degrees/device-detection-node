![51Degrees](https://51degrees.com/DesktopModules/FiftyOne/Distributor/Logo.ashx?utm_source=github&utm_medium=repository&utm_content=readme_main&utm_campaign=node-open-source "THE Fastest and Most Accurate Device Detection") **v4 Device Detection**

[Pipeline Documentation](https://docs.51degrees.com?utm_source=github&utm_medium=repository&utm_content=documentation&utm_campaign=node-open-source "advanced developer documentation") | [Available Properties](https://51degrees.com/resources/property-dictionary?utm_source=github&utm_medium=repository&utm_content=property_dictionary&utm_campaign=node-open-source "View all available properties and values")

## Introduction
This project contains 51Degrees Device Detection engines that can be used with the [Pipeline API](https://github.com/51Degrees/pipeline-node).

The Pipeline is a generic web request intelligence and data processing solution with the ability to add a range of 51Degrees and/or custom plug ins (Engines) 

## Device detection

Device detection can be performed 'on-premise' using a local data file or via the 51Degrees cloud service. 

These options all use the same evidence and property names so can be swapped out as needed.

### On-Premise
When running on-premise, two detection methods are supported.

[**Pattern**](https://docs.51degrees.com/documentation/4.1/_device_detection__pattern.html): Searches for device signatures in a User-Agent returning metrics about the validity of the results. Does NOT use regular expressions.

[**Hash**](https://docs.51degrees.com/documentation/4.1/_device_detection__hash.html): A large binary file populated with User-Agent signatures allowing very fast detection speeds.

In both cases, a local data file is required.
51Degrees provides [multiple options](https://51degrees.com/Licencing-Pricing/On-Premise), some of which support automatic updates through the Pipeline API.

### Cloud

The device detection cloud engine makes use of the 51Degrees cloud API. As such there is no data file to maintain, processing will always be performed using the latest data available.

### Examples

Usage examples are available for cloud, hash and pattern in ``fiftyone.devicedetection/examples``

## Native code updates

Process for rebuilding SWIG interfaces following an update to the device detection cxx code (This is only intended to be run by 51Degrees developers internally):

1. Esnure Swig is installed.
2. Update the device-detection-cxx submodule to reference the relevant commit.
3. From terminal, navigate to fiftyone.pipeline.devicedetection and run:
    a) swig -c++ -javascript -node hash_node.i
    b) swig -c++ -javascript -node pattern_node.i
4. Commit changes to repository.
5. Run the 'Build Device Detection Binaries' Azure CI Pipeline.
6. Copy the produced artifacts into the fiftyone.pipeline.devicedetection/build directory.
7. Commit changes to repository.