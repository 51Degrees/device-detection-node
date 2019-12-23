{
    "targets": [
        {
            "target_name": "FiftyOneDeviceDetectionHashV4",
            "sources": [
                # Common C
                "device-detection-cxx/src/common-cxx/cache.c",
                "device-detection-cxx/src/common-cxx/collection.c",
                "device-detection-cxx/src/common-cxx/component.c",
                "device-detection-cxx/src/common-cxx/data.c",
                "device-detection-cxx/src/common-cxx/dataset.c",
                "device-detection-cxx/src/common-cxx/evidence.c",
                "device-detection-cxx/src/common-cxx/exceptionsc.c",
                "device-detection-cxx/src/common-cxx/file.c",
                "device-detection-cxx/src/common-cxx/headers.c",
                "device-detection-cxx/src/common-cxx/list.c",
                "device-detection-cxx/src/common-cxx/memory.c",
                "device-detection-cxx/src/common-cxx/overrides.c",
                "device-detection-cxx/src/common-cxx/pool.c",
                "device-detection-cxx/src/common-cxx/profile.c",
                "device-detection-cxx/src/common-cxx/properties.c",
                "device-detection-cxx/src/common-cxx/property.c",
                "device-detection-cxx/src/common-cxx/resource.c",
                "device-detection-cxx/src/common-cxx/results.c",
                "device-detection-cxx/src/common-cxx/status.c",
                "device-detection-cxx/src/common-cxx/string.c",
                "device-detection-cxx/src/common-cxx/textfile.c",
                "device-detection-cxx/src/common-cxx/threading.c",
                "device-detection-cxx/src/common-cxx/tree.c",
                "device-detection-cxx/src/common-cxx/value.c",
                # Common C++
                "device-detection-cxx/src/common-cxx/CollectionConfig.cpp",
                "device-detection-cxx/src/common-cxx/ComponentMetaData.cpp",
                "device-detection-cxx/src/common-cxx/ConfigBase.cpp",
                "device-detection-cxx/src/common-cxx/Date.cpp",
                "device-detection-cxx/src/common-cxx/EngineBase.cpp",
                "device-detection-cxx/src/common-cxx/EvidenceBase.cpp",
                "device-detection-cxx/src/common-cxx/Exceptions.cpp",
                "device-detection-cxx/src/common-cxx/MetaData.cpp",
                "device-detection-cxx/src/common-cxx/ProfileMetaData.cpp",
                "device-detection-cxx/src/common-cxx/PropertyMetaData.cpp",
                "device-detection-cxx/src/common-cxx/RequiredPropertiesConfig.cpp",
                "device-detection-cxx/src/common-cxx/ResultsBase.cpp",
                "device-detection-cxx/src/common-cxx/ValueMetaData.cpp",
                # Device Detection C
                "device-detection-cxx/src/dataset-dd.c",
                "device-detection-cxx/src/results-dd.c",
                # Device Detection C++
                "device-detection-cxx/src/ConfigDeviceDetection.cpp",
                "device-detection-cxx/src/EngineDeviceDetection.cpp",
                "device-detection-cxx/src/EvidenceDeviceDetection.cpp",
                "device-detection-cxx/src/ResultsDeviceDetection.cpp",
                # Hash C
                "device-detection-cxx/src/hash/hash.c",
                # Hash C++
                "device-detection-cxx/src/hash/ComponentMetaDataCollectionHash.cpp",
                "device-detection-cxx/src/hash/ComponentMetaDataCollectionHashGenerated.cpp",
                "device-detection-cxx/src/hash/ConfigHash.cpp",
                "device-detection-cxx/src/hash/EngineHash.cpp",
                "device-detection-cxx/src/hash/MetaDataHash.cpp",
                "device-detection-cxx/src/hash/PropertyMetaDataCollectionForComponentHash.cpp",
                "device-detection-cxx/src/hash/PropertyMetaDataCollectionForComponentHashGenerated.cpp",
                "device-detection-cxx/src/hash/PropertyMetaDataCollectionHash.cpp",
                "device-detection-cxx/src/hash/PropertyMetaDataCollectionHashGenerated.cpp",
                "device-detection-cxx/src/hash/ResultsHash.cpp",
                # Node Wrapper
                "hash_node_wrap.cxx",
            ],
            "conditions": [
                            ['OS=="mac"', {
                                "xcode_settings": {
                                "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
                                }
                            }]
                        ],
            "cflags_cc!": ["-fno-exceptions"],
            #"cflags_cc": ["-std=gnu++11"],
            #"cflags_c": ["-std=gnu11"],
            "cflags": ["<!(node -e \"\
                var v8Version = process.versions.v8;\
                var string = '-DSWIG_V8_VERSION=0x';\
                var arr = v8Version.split('.');\
                for (var i = 0; i < 3; i++) {\
                    if (arr[i].length === 1) {\
                        string += '0';\
                        }\
                    string += arr[i];\
                }\
                console.log(string);\")"]
        },
        {
            "target_name": "FiftyOneDeviceDetectionPatternV4",
            "sources": [
                # Common C
                "device-detection-cxx/src/common-cxx/cache.c",
                "device-detection-cxx/src/common-cxx/collection.c",
                "device-detection-cxx/src/common-cxx/component.c",
                "device-detection-cxx/src/common-cxx/data.c",
                "device-detection-cxx/src/common-cxx/dataset.c",
                "device-detection-cxx/src/common-cxx/evidence.c",
                "device-detection-cxx/src/common-cxx/exceptionsc.c",
                "device-detection-cxx/src/common-cxx/file.c",
                "device-detection-cxx/src/common-cxx/headers.c",
                "device-detection-cxx/src/common-cxx/list.c",
                "device-detection-cxx/src/common-cxx/memory.c",
                "device-detection-cxx/src/common-cxx/overrides.c",
                "device-detection-cxx/src/common-cxx/pool.c",
                "device-detection-cxx/src/common-cxx/profile.c",
                "device-detection-cxx/src/common-cxx/properties.c",
                "device-detection-cxx/src/common-cxx/property.c",
                "device-detection-cxx/src/common-cxx/resource.c",
                "device-detection-cxx/src/common-cxx/results.c",
                "device-detection-cxx/src/common-cxx/status.c",
                "device-detection-cxx/src/common-cxx/string.c",
                "device-detection-cxx/src/common-cxx/textfile.c",
                "device-detection-cxx/src/common-cxx/threading.c",
                "device-detection-cxx/src/common-cxx/tree.c",
                "device-detection-cxx/src/common-cxx/value.c",
                # Common C++
                "device-detection-cxx/src/common-cxx/CollectionConfig.cpp",
                "device-detection-cxx/src/common-cxx/ComponentMetaData.cpp",
                "device-detection-cxx/src/common-cxx/ConfigBase.cpp",
                "device-detection-cxx/src/common-cxx/Date.cpp",
                "device-detection-cxx/src/common-cxx/EngineBase.cpp",
                "device-detection-cxx/src/common-cxx/EvidenceBase.cpp",
                "device-detection-cxx/src/common-cxx/Exceptions.cpp",
                "device-detection-cxx/src/common-cxx/MetaData.cpp",
                "device-detection-cxx/src/common-cxx/ProfileMetaData.cpp",
                "device-detection-cxx/src/common-cxx/PropertyMetaData.cpp",
                "device-detection-cxx/src/common-cxx/RequiredPropertiesConfig.cpp",
                "device-detection-cxx/src/common-cxx/ResultsBase.cpp",
                "device-detection-cxx/src/common-cxx/ValueMetaData.cpp",
                # Device Detection C
                "device-detection-cxx/src/dataset-dd.c",
                "device-detection-cxx/src/results-dd.c",
                # Device Detection C++
                "device-detection-cxx/src/ConfigDeviceDetection.cpp",
                "device-detection-cxx/src/EngineDeviceDetection.cpp",
                "device-detection-cxx/src/EvidenceDeviceDetection.cpp",
                "device-detection-cxx/src/ResultsDeviceDetection.cpp",
                # Pattern C
                "device-detection-cxx/src/pattern/pattern.c",
                "device-detection-cxx/src/pattern/node.c",
                "device-detection-cxx/src/pattern/signature.c",
                "device-detection-cxx/src/cityhash/city.c",
                # Pattern C++
                "device-detection-cxx/src/pattern/ComponentMetaDataBuilderPattern.cpp",
                "device-detection-cxx/src/pattern/ComponentMetaDataCollectionPattern.cpp",
                "device-detection-cxx/src/pattern/ConfigPattern.cpp",
                "device-detection-cxx/src/pattern/EnginePattern.cpp",
                "device-detection-cxx/src/pattern/MetaDataPattern.cpp",
                "device-detection-cxx/src/pattern/ProfileMetaDataBuilderPattern.cpp",
                "device-detection-cxx/src/pattern/ProfileMetaDataCollectionPattern.cpp",
                "device-detection-cxx/src/pattern/PropertyMetaDataBuilderPattern.cpp",
                "device-detection-cxx/src/pattern/PropertyMetaDataCollectionForComponentPattern.cpp",
                "device-detection-cxx/src/pattern/PropertyMetaDataCollectionPattern.cpp",
                "device-detection-cxx/src/pattern/ResultsPattern.cpp",
                "device-detection-cxx/src/pattern/ValueMetaDataBuilderPattern.cpp",
                "device-detection-cxx/src/pattern/ValueMetaDataCollectionBasePattern.cpp",
                "device-detection-cxx/src/pattern/ValueMetaDataCollectionForProfilePattern.cpp",
                "device-detection-cxx/src/pattern/ValueMetaDataCollectionForPropertyPattern.cpp",
                "device-detection-cxx/src/pattern/ValueMetaDataCollectionPattern.cpp",
                # Node Wrapper
                "pattern_node_wrap.cxx",
            ],
            "conditions": [
                            ['OS=="mac"', {
                                "xcode_settings": {
                                "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
                                }
                            }]
                        ],
            "cflags_cc!": ["-fno-exceptions"],
            "cflags_cc": ["-std=gnu++11"],
            "cflags_c": ["-std=gnu11"],
            "cflags": ["<!(node -e \"\
                var v8Version = process.versions.v8;\
                var string = '-DSWIG_V8_VERSION=0x';\
                var arr = v8Version.split('.');\
                for (var i = 0; i < 3; i++) {\
                    if (arr[i].length === 1) {\
                        string += '0';\
                        }\
                    string += arr[i];\
                }\
                console.log(string);\")"]
        }

    ]
}

