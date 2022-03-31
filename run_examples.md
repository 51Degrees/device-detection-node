![51Degrees](https://51degrees.com/img/logo.png?utm_source=github&utm_medium=repository&utm_content=readme_main&utm_campaign=node-open-source "Data rewards the curious") **Node Device Detection**

[Developer Documentation](https://51degrees.com/device-detection-node/index.html?utm_source=github&utm_medium=repository&utm_content=documentation&utm_campaign=node-open-source "developer documentation")

# Running examples

The examples can be run either with modules included in the GitHub repository or with the **Device Detection** packages from `npm` repository.

Usage examples are available for Cloud and OnPremise in ``fiftyone.devicedetection/examples``, ``fiftyone.devicedetection.cloud/examples`` and ``fiftyone.devicedetection.onpremise/examples``.

## Run with modules in GitHub repository

First of all, you need to build the binaries for the on-premise examples to work as described in the **On-Premise** section of the [readme](readme.md). **Skip** this part if you just want to run the cloud examples.

Then navigate to the root folder that contains the examples that you want to run. This folder can be either `fiftyone.devicedetection`, `fiftyone.devicedetection.cloud` or `fiftyone.devicedetection.onpremise`.

Install the required packages:

```
npm install
```

Navigate to the sub folder `examples\[cloud|onpremise]` and run the example:

e.g.

```
node gettingStarted.js
```

## Run with npm packages

These examples can also be run with `npm` packages ``fiftyone.devicedetection.*`` modules.

First of all, create a folder outside of the checkout directory (`npm` does not allow package to be installed under the same package name) and copy the example that you want to run to that folder. For examples where there is an associated `JSON` `51d.json`, you will also need to copy the file.

Create a `package.json` file and make sure to include the package that you wish to use in the `dependencies` section. For examples:

```
  "dependencies": {
      "fiftyone.devicedetection.cloud": "^4.2.0",
      ...
  }
```

Packages usage:
- `fiftyone.devicedetection`: contains pipeline builder which can be used to build both `Cloud` and `On-Premise` engines pipeline.
- `fiftyone.devicedetection.cloud`: contains cloud engine and cloud pipeline builder.
- `fiftyone.devicedetection.onpremise`: contains on-premise engine and on-premise pipeline builder.

Next, you will need to update the `require` statement, the data file path and the `51d.json` file if the example require to.

The `require` statement will need to pick the corresponding module instead of using the relative path.

For example, if your example contains the below line:

```
const HardwareProfileCloudEngine = require((process.env.directory || __dirname) +
  '/../../hardwareProfileCloudEngine');
```

It will need to be updated to

```
const HardwareProfileCloudEngine = require('fiftyone.devicedetection.cloud').HardwareProfileCloudEngine;
```

Updated the data file path to point to where the data file is stored.

Update the `51d.json` file if required. For example, if the `51d.json` contains:

```
        "Elements": [
        {
            "elementName": "../../deviceDetectionCloud"
        },
```

It will need to be updated to 

```
        ...
        "Elements": [
        {
            "elementName": "fiftyone.devicedetection.cloud/DeviceDetectionCloud"
        },
    ...
```

If the `51d.json` contains the data file for on-premise example, it will also need to be updated to point to the correct location.

Once you have finished setting up, run the example:

e.g.

```
node gettingStarted.js
```
