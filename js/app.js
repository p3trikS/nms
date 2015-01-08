'use strict';

// NMS APP VERSION 8

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.login',
    'myApp.home',
    'myApp.rooms',
    'myApp.roomDetail',
    'myApp.songDetail',
    'myApp.playlist',
    'myApp.search',
    'myApp.contacts'
]).
        config(['$routeProvider', function ($routeProvider) {
                $routeProvider.otherwise({redirectTo: '/login'});
            }]).
        config(['$httpProvider', '$provide', function ($httpProvider, $provide) {
                $provide.factory('myHttpInterceptor', function ($q) {
                    return {
                        // optional method
                        'request': function (config) {
                            if (config.url.indexOf('php') != -1) {
                                setTimeout(function () {
                                    $.mobile.loading('checkLoaderPosition');
                                    $.mobile.loading('show');
                                    $.mobile.loading('checkLoaderPosition');
                                    setTimeout(function () {
                                        $.mobile.loading('checkLoaderPosition');
                                    }, 150);
                                }, 100);
                            }
                            return config;
                        },
                        // optional method
                        'response': function (response) {
                            if (response.config.url.indexOf('php') != -1) {
                                setTimeout(function () {
                                    $.mobile.loading('hide');
                                }, 100);
                            }
                            return response;
                        },
                        // optional method
                        'responseError': function (response) {
                            if (response.config.url.indexOf('php') != -1) {
                                setTimeout(function () {
                                    $.mobile.loading('hide');
                                }, 100);
                            }
                            return response;
                        },
                        // optional method
                        'requestError': function (response) {
                            if (response.config.url.indexOf('php') != -1) {
                                setTimeout(function () {
                                    $.mobile.loading('hide');
                                }, 100);
                            }
                            return response;
                        }
                    };
                });
                $httpProvider.interceptors.push('myHttpInterceptor');
            }])
        .run(function ($rootScope, $location, $window) {


            if (!window.console) {
                window.console = {
                    log: function () {
                    }};
            }

            $rootScope.baseURL = 'http://www.newmusicserver.com/music/';
            $rootScope.data = {
                android: window.android,
                bannerImageSrc: 'img/banner.gif',
                bannerClicked: function () {
//                    alert('banner');
                }
            };
            $rootScope.$on('$destroy', function () {
                $.mobile.loading('hide');
            });

            $(document).on('keypress', function (e) {
                $rootScope.$apply(function () {
                    $rootScope.$broadcast('key', e.keyCode);
                });
            });

            window.x2js = new X2JS();

            $('body').append($.mobile.loading());

            $rootScope.$on('$locationChangeSuccess', function (event, value) {
                $rootScope.currentPage = $location.path().split('/')[1];
            });

            if ($rootScope.data.android) {
                setTimeout(function () {
                    volumeService.listen();
                    window.updateVolume = function (value) {
                        $rootScope.$apply(function () {
                            $rootScope.$broadcast('volume', value);
                        });
                    };
                }, 3000);
                document.addEventListener("backbutton", function () {
                    switch ($rootScope.currentPage) {
                        case 'login':
                        case 'home':
                            navigator.app.exitApp();
                            break;
                        default:
                            $window.history.back();
                            break;
                    }
                }, false);

                document.addEventListener("pause", function () {
                    $rootScope.$apply(function () {
                        $rootScope.$broadcast('pause');
                    });
                }, false);
                document.addEventListener("resume", function () {
                    $rootScope.$apply(function () {
                        $rootScope.$broadcast('resume');
                    });
                }, false);
            }
        });