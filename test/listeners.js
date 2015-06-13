/*jslint node: true */
"use strict";

var H = require('../index').EventEmitter;
var _ = require('lodash');
var assert = require('assert');

describe('HevEmitter listeners', function () {
    var h;

    beforeEach(function () {
        h = new H();
    });

    var listenerShouldMatch = function (listenerRoute, matchRoute) {
        it('"' + listenerRoute.join('/') + '" should be returned by listeners of "' + matchRoute.join('/') + '"', function () {
            var f = function () {};
            h.on(listenerRoute, f);
            var l = h.listeners(matchRoute);
            assert.equal(1, l.length);
            assert(_.contains(l, f));
        });
    };

    var listenerShouldNotMatch = function (listenerRoute, matchRoute) {
        it('"' + listenerRoute.join('/') + '" *not* should be returned by listeners of "' + matchRoute.join('/') + '"', function () {
            var f = function () {};
            h.on(listenerRoute, f);
            var l = h.listeners(matchRoute);
            assert.equal(0, l.length);
        });
    };

    var shouldPrecedeInMatch = function (firstRoute, secondRoute, matchRoute) {
        it('"' + firstRoute.join('/') + '" should precede "' + secondRoute.join('/')
           + '"  by listeners of "' + matchRoute.join('/') + '"', function () {
            var f = function () {};
            var g = function () {};
            h.on(listenerRoute, f);
            h.on(listenerRoute, g);
            var l = h.listeners(matchRoute);
            assert.equal(2, l.length);
            assert(_.contains(l, f));
            assert(_.contains(l, g));
            assert(_.indexOf(l, f) < _.indexOf(l, g));
        });

        it('"' + firstRoute.join('/') + '" should precede "' + secondRoute.join('/')
           + '"  by listeners of "' + matchRoute.join('/') + '" (opposite order)', function () {
            var f = function () {};
            var g = function () {};
            h.on(listenerRoute, g);
            h.on(listenerRoute, f);
            var l = h.listeners(matchRoute);
            assert.equal(2, l.length);
            assert(_.contains(l, f));
            assert(_.contains(l, g));
            assert(_.indexOf(l, f) < _.indexOf(l, g));
        });
    };


    _.each([
        [['name'], ['name']]
        , [['name'], ['*']]
        , [['name'], ['**']]
        , [['*'], ['name']]
        , [['*'], ['*']]
        , [['*'], ['**']]
        , [['**'], ['name']]
        , [['**'], ['*']]
        , [['**'], ['**']]

        , [['name', 'name2'], ['name', 'name2']]
        , [['name', 'name2'], ['*', 'name2']]
        , [['name', 'name2'], ['name', '*']]
        , [['name', 'name2'], ['**']]
        , [['name', 'name2'], ['name', '**']]

        , [['*', 'name2'], ['name', 'name2']]
        , [['*', 'name2'], ['*', 'name2']]
        , [['*', 'name2'], ['name', '*']]
        , [['*', 'name2'], ['**']]
        , [['*', 'name2'], ['name', '**']]

        , [['name', '*'], ['name', 'name2']]
        , [['name', '*'], ['*', 'name2']]
        , [['name', '*'], ['name', '*']]
        , [['name', '*'], ['**']]
        , [['name', '*'], ['name', '**']]

        , [['**'], ['name', 'name2']]
        , [['**'], ['*', 'name2']]
        , [['**'], ['name', '*']]
        , [['**'], ['**']]
        , [['**'], ['name', '**']]
    ], function (args) {
        listenerShouldMatch.apply(null, args);
    });

    _.each([
        [['name'], ['otherName']]
        , [['name'], ['name', '**']]

        , [['name', 'otherName'], ['name', 'anotherName']]
        , [['otherName', 'name'], ['anotherName', 'name']]
        , [['name', 'name2'], ['*', 'anotherName']]
        , [['name', 'name2'], ['anotherName', '*']]
        , [['name', 'name2'], ['anotherName', '**']]

        , [['*', 'name2'], ['name', 'anotherName']]
        , [['*', 'name2'], ['*', 'anotherName']]

        , [['name', '*'], ['anotherName', 'name2']]
        , [['name', '*'], ['anotherName', '*']]
        , [['name', '*'], ['anotherName', '**']]

        , [['name', 'name2'], ['name', 'name2', '**']]
        , [['name', 'name2'], ['*', 'name2', '**']]
        , [['name', 'name2'], ['name', '*', '**']]

        , [['*', 'name2'], ['name', 'name2', '**']]
        , [['*', 'name2'], ['*', 'name2', '**']]
        , [['*', 'name2'], ['name', '*', '**']]

        , [['name', '*'], ['name', 'name2', '**']]
        , [['name', '*'], ['*', 'name2', '**']]
        , [['name', '*'], ['name', '*', '**']]

        , [['name', 'name2', '**'], ['name', 'name2']]
        , [['name', 'name2', '**'], ['*', 'name2']]
        , [['name', 'name2', '**'], ['name', '*']]

        , [['*', 'name2', '**'], ['name', 'name2']]
        , [['*', 'name2', '**'], ['*', 'name2']]
        , [['*', 'name2', '**'], ['name', '*']]

        , [['name', '*', '**'], ['name', 'name2']]
        , [['name', '*', '**'], ['*', 'name2']]
        , [['name', '*', '**'], ['name', '*']]

    ], function (args) {
        listenerShouldNotMatch.apply(null, args);
    });


    _.each([
        [['*'], ['name'], ['name']]
        , [['**'], ['name'], ['name']]
        , [['**'], ['*'], ['name']]

        , [['*'], ['name'], ['*']]
        , [['**'], ['name'], ['*']]
        , [['**'], ['*'], ['*']]

        , [['*'], ['name'], ['**']]
        , [['**'], ['name'], ['**']]
        , [['**'], ['*'], ['**']]


        , [['name', '*'], ['name', 'name'], ['name', 'name']]
        , [['*', 'name'], ['name', 'name'], ['name', 'name']]
        , [['*', '*'], ['name', 'name'], ['name', 'name']]
        , [['name', '**'], ['name', 'name'], ['name', 'name']]
        , [['*', '**'], ['name', 'name'], ['name', 'name']]
        , [['**'], ['name', 'name'], ['name', 'name']]

        , [['*', 'name'], ['name', '*'], ['name', 'name']]
        , [['*', '*'], ['name', '*'], ['name', 'name']]
        , [['name', '**'], ['name', '*'], ['name', 'name']]
        , [['*', '**'], ['name', '*'], ['name', 'name']]
        , [['**'], ['name', '*'], ['name', 'name']]

        , [['*', '*'], ['*', 'name'], ['name', 'name']]
        , [['name', '**'], ['*', 'name'], ['name', 'name']]
        , [['*', '**'], ['*', 'name'], ['name', 'name']]
        , [['**'], ['*', 'name'], ['name', 'name']]

        , [['*', '**'], ['name', '**'], ['name', 'name']]
        , [['**'], ['name', '**'], ['name', 'name']]


        , [['name', '*'], ['name', 'name'], ['name', '*']]
        , [['*', 'name'], ['name', 'name'], ['name', '*']]
        , [['*', '*'], ['name', 'name'], ['name', '*']]
        , [['name', '**'], ['name', 'name'], ['name', '*']]
        , [['*', '**'], ['name', 'name'], ['name', '*']]
        , [['**'], ['name', 'name'], ['name', '*']]

        , [['*', 'name'], ['name', '*'], ['name', '*']]
        , [['*', '*'], ['name', '*'], ['name', '*']]
        , [['name', '**'], ['name', '*'], ['name', '*']]
        , [['*', '**'], ['name', '*'], ['name', '*']]
        , [['**'], ['name', '*'], ['name', '*']]

        , [['*', '*'], ['*', 'name'], ['name', '*']]
        , [['name', '**'], ['*', 'name'], ['name', '*']]
        , [['*', '**'], ['*', 'name'], ['name', '*']]
        , [['**'], ['*', 'name'], ['name', '*']]

        , [['*', '**'], ['name', '**'], ['name', '*']]
        , [['**'], ['name', '**'], ['name', '*']]


        , [['name', '*'], ['name', 'name'], ['*', 'name']]
        , [['*', 'name'], ['name', 'name'], ['*', 'name']]
        , [['*', '*'], ['name', 'name'], ['*', 'name']]
        , [['name', '**'], ['name', 'name'], ['*', 'name']]
        , [['*', '**'], ['name', 'name'], ['*', 'name']]
        , [['**'], ['name', 'name'], ['*', 'name']]

        , [['*', 'name'], ['name', '*'], ['*', 'name']]
        , [['*', '*'], ['name', '*'], ['*', 'name']]
        , [['name', '**'], ['name', '*'], ['*', 'name']]
        , [['*', '**'], ['name', '*'], ['*', 'name']]
        , [['**'], ['name', '*'], ['*', 'name']]

        , [['*', '*'], ['*', 'name'], ['*', 'name']]
        , [['name', '**'], ['*', 'name'], ['*', 'name']]
        , [['*', '**'], ['*', 'name'], ['*', 'name']]
        , [['**'], ['*', 'name'], ['*', 'name']]

        , [['*', '**'], ['name', '**'], ['*', 'name']]
        , [['**'], ['name', '**'], ['*', 'name']]



        , [['name', '*'], ['name', 'name'], ['**']]
        , [['*', 'name'], ['name', 'name'], ['**']]
        , [['*', '*'], ['name', 'name'], ['**']]
        , [['name', '**'], ['name', 'name'], ['**']]
        , [['*', '**'], ['name', 'name'], ['**']]
        , [['**'], ['name', 'name'], ['**']]

        , [['*', 'name'], ['name', '*'], ['**']]
        , [['*', '*'], ['name', '*'], ['**']]
        , [['name', '**'], ['name', '*'], ['**']]
        , [['*', '**'], ['name', '*'], ['**']]
        , [['**'], ['name', '*'], ['**']]

        , [['*', '*'], ['*', 'name'], ['**']]
        , [['name', '**'], ['*', 'name'], ['**']]
        , [['*', '**'], ['*', 'name'], ['**']]
        , [['**'], ['*', 'name'], ['**']]

        , [['*', '**'], ['name', '**'], ['**']]
        , [['**'], ['name', '**'], ['**']]
    ], function (args) {
        shouldPrecedeInMatch.apply(null, args);
    });

});
