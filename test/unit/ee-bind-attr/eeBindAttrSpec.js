describe('Module: eeBindAttr', function () {
    'use strict';

    beforeEach(module('eeBindAttr'));

    describe('Provider: eeBindAttr', function () {
        // TODO
    });

    describe('Service: eeBindAttr', function () {

        describe('method `filterAllowedAttributes`', function () {
            var initializeAndInvoke = function (fn) {
                var eeBindAttr;
                var whitelistAlias = 'fooWhitelist';
                var whitelist = {
                    a: ['target', 'download'],
                };

                module(function (eeBindAttrProvider) {
                    eeBindAttrProvider.addWhitelist(whitelistAlias, whitelist);
                });

                inject(function (_eeBindAttr_) {
                    eeBindAttr = _eeBindAttr_;
                });

                return fn({whitelistAlias: whitelistAlias, whitelist: whitelist, eeBindAttr: eeBindAttr});
            };

            it('should only allowed defined attributes on a node', function () {
                initializeAndInvoke(function (args) {
                    var whitelistAlias = args.whitelistAlias;
                    var whitelist = args.whitelist;
                    var eeBindAttr = args.eeBindAttr;
                    var elem = $('<a>');
                    var attributes = {
                        target: '_blank',
                        id: 'you_shall_not_pass',
                        download: 'foo.txt',
                    };
                    var filteredAttributes = eeBindAttr.filterAllowedAttributes(attributes, elem, whitelistAlias);

                    expect('id').not.toBeIn(filteredAttributes);
                    expect(whitelist.a).toBeIn(filteredAttributes);
                });
            });

            it('should be able to run when HTMLElement is given', function () {
                initializeAndInvoke(function (args) {
                    var whitelistAlias = args.whitelistAlias;
                    var whitelist = args.whitelist;
                    var eeBindAttr = args.eeBindAttr;
                    var elem = $('<a>')[0]; // Notice the unwrapping of the created element.
                    var attributes = {
                        target: '_blank',
                        id: 'you_shall_not_pass',
                        download: 'foo.txt',
                    };
                    var filteredAttributes = eeBindAttr.filterAllowedAttributes(attributes, elem, whitelistAlias);

                    expect('id').not.toBeIn(filteredAttributes);
                    expect(whitelist.a).toBeIn(filteredAttributes);
                });
            });

            it('should pass attribute values', function () {
                initializeAndInvoke(function (args) {
                    var whitelistAlias = args.whitelistAlias;
                    var whitelist = args.whitelist;
                    var eeBindAttr = args.eeBindAttr;
                    var elem = $('<a>');
                    var attributes = {
                        target: '_blank',
                        id: 'you_shall_not_pass',
                        download: 'foo.txt',
                    };
                    var filteredAttributes = eeBindAttr.filterAllowedAttributes(attributes, elem, whitelistAlias);

                    expect(Object.keys(filteredAttributes).length).toBe(whitelist.a.length);
                    Object.keys(filteredAttributes).forEach(function (attributeName) {
                        expect(filteredAttributes[attributeName]).toBe(attributes[attributeName]);
                    });
                });
            });

            it('should copy the provided map', function () {
                initializeAndInvoke(function (args) {
                    var whitelistAlias = args.whitelistAlias;
                    var whitelist = args.whitelist;
                    var eeBindAttr = args.eeBindAttr;
                    var elem = $('<foo>');
                    var attributes = {
                        bar: 'you_shall_not_pass',
                    };

                    whitelist.foo = ['bar'];

                    var filteredAttributes = eeBindAttr.filterAllowedAttributes(attributes, elem, whitelistAlias);

                    expect(whitelist.foo).not.toBeIn(filteredAttributes);
                });
            });
        });
    });
});
