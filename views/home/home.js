'use strict';

angular.module('myApp.home', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/home', {
                    templateUrl: 'views/home/home.html',
                    controller: 'HomeCtrl'
                });
            }])
        .controller('HomeCtrl', function ($scope, $location) {
            $scope.search = function () {
//                console.log('search query: ' + $scope.query);
                if ($scope.query) {
                    $location.path('/search/' + $scope.query);
                }
            }
            $scope.$on('key', function (event, keyCode) {
                if (Number(keyCode) == 13) {
                    $scope.search();
                }
            });
        });