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
        superResourceKeyEnvVar: string;
        platformResourceKeyEnvVar: string;
        hardwareResourceKeyEnvVar: string;
        browserResourceKeyEnvVar: string;
        noSetHeaderResourceKeyEnvVar: string;
        licenseKeyEnvVar: string;
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
    isInvalidKey: (keyValue: string) => boolean;
};
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
