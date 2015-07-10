beforeEach(function () {
    'use strict';

    jasmine.addMatchers({
        toBeIn: function () {
            return {
                /**
                 * @param {string|Array.<string>} propertyNameOrNames
                 * @param {object} object
                 */
                compare: function (propertyNameOrNames, object) {
                    var result = {};
                    var properties = Array.isArray(propertyNameOrNames) ? propertyNameOrNames : [propertyNameOrNames];
                    result.pass = properties.every(function (propertyName) {
                        return propertyName in object;
                    });
                    result.message = [
                        'Properties `' + properties.join(', ') + '` expected',
                        (result.pass ? 'not to be' : 'to be') + ' present in object',
                        angular.mock.dump(object),
                    ].join(' ');
                    return result;
                },
            };
        },
    });
});
