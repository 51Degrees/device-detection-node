![51Degrees](https://51degrees.com/DesktopModules/FiftyOne/Distributor/Logo.ashx?utm_source=github&utm_medium=repository&utm_content=readme_main&utm_campaign=node-open-source "THE Fastest and Most Accurate Device Detection") **v4 Node Pipeline**

[Developer Documentation](https://docs.51degrees.com?utm_source=github&utm_medium=repository&utm_content=documentation&utm_campaign=node-open-source "advanced developer documentation") | [Available Properties](https://51degrees.com/resources/property-dictionary?utm_source=github&utm_medium=repository&utm_content=property_dictionary&utm_campaign=node-open-source "View all available properties and values")

## Introduction
This project is an early access repository for the 51Degrees Device Detection engines that can be used with the Pipeline API.

The Pipeline is a generic web request intelligence and data processing solution with the ability to add a range of 51Degrees and/or custom plug ins (Engines) 

### Device detection

Device detection can be performed 'on-premise' using a local data file or via the 51Degrees cloud service. 

When running on-premise, two detection methods are supported.

**Pattern:**  Searches for device signatures in a User-Agent returning metrics about the validity of the results. Does NOT use regular expressions.

**Hash:** A large binary file populated with User-Agent signatures allowing very fast detection speeds.

All methods use an external data file which can easily be updated.

Usage examples are available in both ``fiftyone.pipeline.devicedetection`` and ``fiftyone.pipeline.core``

### Native code updates

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