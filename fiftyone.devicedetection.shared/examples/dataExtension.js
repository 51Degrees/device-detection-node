class DataExtension {
  // Helper function to read property values from flowData
  static getValueHelper (flowData, propertyKey) {
    var device = flowData.device;
    try {
      const property = device[propertyKey];
      if (property.hasValue && property) {
        return property.value;
      } else {
        return property.noValueMessage;
      }
    } catch (error) {
      return `Unknown. ${error}`;
    }
  };
}

module.exports = DataExtension;
