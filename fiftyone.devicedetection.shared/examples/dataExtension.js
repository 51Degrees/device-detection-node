class DataExtension {
  // Helper function to read property values from flowData
  static getValueHelper (elementData, propertyName) {
    try {
      const property = elementData[propertyName];
      if (property && property.hasValue) {
        if (Array.isArray(property.value)) {
          return property.value.join(', ');
        } else {
          return property.value;
        }
      } else {
        return `Unknown (${property.noValueMessage})`;
      }
    } catch (e) {
      return `Unknown (${e})`;
    }
  };
}

module.exports = DataExtension;
