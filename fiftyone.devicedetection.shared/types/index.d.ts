export let errorMessages: {
    cacheNotSupport: string;
    evidenceNotFound: string;
    dataFilePathRequired: string;
    fileNotFound: string;
    moduleDirNotFound: string;
    nativeModuleNotFound: string;
    invalidFileExtension: string;
    licenseKeyRequired: string;
    invalidPerformanceProfile: string;
    propertyKeyDataFiles: string;
    propertyNotFound: string;
    badDataUnsupportedVersion: string;
    badDataIncorrectFormat: string;
};
export let testConstants: {
    envVars: {
        resourceKeyEnvVar: string;
        superResourceKeyEnvVar: string;
        platformResourceKeyEnvVar: string;
        hardwareResourceKeyEnvVar: string;
        browserResourceKeyEnvVar: string;
        noSetHeaderResourceKeyEnvVar: string;
        licenseKeyEnvVar: string;
    };
    legacyEnvVars: {
        _51DEGREES_RESOURCE_KEY: string;
        _51DEGREES_RESOURCE_KEY_SUPER: string;
        _51DEGREES_RESOURCE_KEY_PLATFORM: string;
        _51DEGREES_RESOURCE_KEY_HARDWARE: string;
        _51DEGREES_RESOURCE_KEY_BROWSER: string;
        _51DEGREES_RESOURCE_KEY_NO_SETHEADER: string;
    };
    userAgents: {
        chromeUA: string;
        edgeUA: string;
        firefoxUA: string;
        safariUA: string;
        curlUA: string;
    };
};
export let keyUtils: {
    getNamedKey: (keyName: string) => string;
    getResourceKey: (envVarName: string) => string;
    missingResourceKeyMessage: (envVarName: string) => string;
    isInvalidKey: (keyValue: string) => boolean;
};
export let exampleOutput: typeof import("./tests/exampleOutput");
export let exampleConstants: {
    defaultEvidenceValues: Map<string, string>[];
    fileNames: {
        enterpriseDataFileName: string;
        liteDataFileName: string;
        uaFileName: string;
        evidenceFileName: string;
    };
};
export let optionsExtension: typeof import("./examples/optionsExtension");
export let dataExtension: typeof import("./examples/dataExtension");
