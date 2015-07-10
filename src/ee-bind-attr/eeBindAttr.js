(function (angular) {
    'use strict';

    angular
        .module('eeBindAttr', [])

        .provider('eeBindAttr', function () {
            var whitelists = Object.create(null);

            /**
             * @param {string} alias
             * @param {Object.<string, Array.<string>>} whitelist - attribute names array mapped by element names.
             */
            this.addWhitelist = function (alias, whitelist) {
                if (typeof whitelist !== 'object' || whitelist == null) {
                    throw new Error('Whitelist has to be an object');
                }
                whitelists[alias] = Object.create(null);
                for (var elementName in whitelist) {
                    if (whitelist.hasOwnProperty(elementName) && Array.isArray(whitelist[elementName])) {
                        whitelists[alias][elementName] = [].concat(whitelist[elementName]);
                    }
                }
                return this;
            };

            this.$get = function () {
                return {
                    /**
                     * @param {Object} attributes
                     * @param {jQuery|HTMLElement} elem
                     * @param {string} whitelistAlias - previously defined whitelist
                     */
                    filterAllowedAttributes: function (attributes, elem, whitelistAlias) {
                        if (!(whitelistAlias in whitelists)) {
                            throw new Error(
                                'eeBindAttr could not filter attributes. `' + whitelistAlias + '` is unknown'
                            );
                        }
                        var filteredAttributes = Object.create(null);
                        var allowedAttributes =
                            whitelists[whitelistAlias][$(elem).prop('tagName').toLowerCase()] || [];
                        for (var attributeName in attributes) {
                            if (attributes.hasOwnProperty(attributeName) &&
                                allowedAttributes.indexOf(attributeName) > -1) {
                                filteredAttributes[attributeName] = attributes[attributeName];
                            }
                        }
                        return filteredAttributes;
                    },
                };
            };
        })
    /**
     * Each of the keys of the object given to the eeBindAttr directive will become the attributes of the element
     * the directive is placed on.
     */
        .directive('eeBindAttr', function ($parse, eeBindAttr) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr) {
                    var input = $parse(attr.eeBindAttr)(scope);
                    if (input.attr == null) {
                        input.attr = {};
                    }
                    if ('attr' in input && 'whitelist' in input &&
                        typeof input.attr === 'object' && input.attr != null) {
                        elem.attr(eeBindAttr.filterAllowedAttributes(input.attr, elem, input.whitelist));
                    } else {
                        throw new Error('eeBindAttr: Input has to be an object with keys `attr` and `whitelist`');
                    }
                },
            };
        });

})(angular);
