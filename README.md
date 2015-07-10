# eeBindAttr

The missing ngBindAttrs with a bit of safety.

# Note

This package is currently in-development.
Feel free to use it but note that it may have bugs and it may not provide the functionality you need.
See the [known limitations](#known-limitations) section.

## Installation

Use bower:

```
bower install ee-bind-attr
```

or npm:

```
bower install --save ee-bind-attr
```

## Usage

This module provides an attribute directive which gives the user similar possibilities as the deprecated `ngBindAttr`
(with slightly modified syntax).

### In the application config phase

(see [the note on security](#security))

```
angular
    .module('myApp', [
        'eeBindAttr',
    ])
    .config(function (eeBindAttrProvider) {
        eeBindAttrProvider
            .setWhitelist('whitelistName', {
                a: ['download', 'title'],
            })
            .setWhitelist('anotherMoreRestrictiveWhitelistName', {
                a: ['download'],
            });
    })
```

### In the controller
```
this.attributes = {
    download: 'file-name.zip',
    title: 'Download the file',
};
```

### In the template
```
<div ng-controller="myCtrl as ctrl">
    <!-- both attributes will be bound -->
    <a ee-bind-attr="{whitelist: 'whitelistName', attrs: ctrl.attributes}">My link</a>
    <!-- only `download` will be bound -->
    <a ee-bind-attr="{whitelist: 'anotherMoreRestrictiveWhitelistName', attrs: ctrl.attributes}">My link</a>
    <!-- no attribute will be bound -->
    <button ee-bind-attr="{whitelist: 'whitelistName', attrs: ctrl.attributes}">My button</button>
</div>
```


## Rationale

`ngBindAttr` was a core AngularJS directive once, but
[it has been removed](https://github.com/angular/angular.js/issues/1925#issuecomment-12960531) in favor of 
[ngAttr attribute bindings](https://docs.angularjs.org/guide/directive#-ngattr-attribute-bindings).

The "new way" has one drawback: one has to know in advance which attributes are to be added to the element. This reduces
the flexibility `ngBindAttr` gave.

The aim of this project is to allow to use the old `ngBindAttr` syntax where `ngAttr` is not enough.

## Security

To ensure security only whitelisted attributes can be added to the element. Attributes are whitelisted on per-element
basis. This means one can allow `download` attribute on `a` elements but if it's not whitelisted then `download`
attribute won't be set on the `a` element even though it's present in the 

## Known limitations
The watch functionality `ngBindAttr` had is not re-created yet. THis means that:
 - attributes which are to be transferred to the element you use `eeBindAttr` on need to be known in advance, before the
element is created
 - if the object containing attribute values changes those changes won't get transferred to the element attributes.
