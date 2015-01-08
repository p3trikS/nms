var app = angular.module('myApp')
        .filter('escapeTwice', function () {
            return function (input) {
                return encodeURIComponent(encodeURIComponent(input))
            };
        });