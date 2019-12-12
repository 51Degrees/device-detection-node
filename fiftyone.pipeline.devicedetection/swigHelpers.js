/* ********************************************************************
 * Copyright (C) 2019  51Degrees Mobile Experts Limited.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * ******************************************************************** */

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