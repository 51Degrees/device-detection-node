module.exports = {
    /**
     * Helper to convert a swig vector into a standard JavaScript array
     * @param {Object} vector
    */
    vectorToArray: function (vector) {

        let output = [];

        for (var i = 0; i < vector.size(); i++) {
            output.push(vector.get(i));
        }

        return output;

    },
    /**
     * Helper to convert a JavaScript array to a swig vector
     * @param {Object} vector
    */
    arrayToVector: function (array) {

        let vector = new swigWrapper.VectorStringSwig();

        array.forEach(function (item) {

            vector.add(item);

        });

        return vector;

    },

    /**
     * Helper to convert a Swig date to a JavaScript one
     * @param {Object} vector
    */
    swigDateToDate: function (swigDate) {

        let date = new Date();

        date.setFullYear(swigDate.getYear());
        date.setMonth(swigDate.getMonth());
        date.setDate(swigDate.getDay());

        return date;

    }
};