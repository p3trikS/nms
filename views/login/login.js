'use strict';

angular.module('myApp.login', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/login', {
                    templateUrl: 'views/login/login.html',
                    controller: 'LoginCtrl'
                });
            }])
        .controller('LoginCtrl', ['$rootScope', '$scope', '$http', '$location', 'myApp.popupService', 'myApp.storageService', '$timeout',
            function ($rootScope, $scope, $http, $location, $popups, $storage, $timeout) {
                function login(email, pass) {
                    var params = {
                        method: 'ValidateUser',
                        email: email,
                        password: pass
                    };
                    $http.post($rootScope.baseURL + 'webservice.php?' + $.param(params),
                            params)
                            .success(function (data, status, headers, config) {
                                var $data = $($.parseXML(data));
                                var id = $data.find('user').attr('userid');
                                if (id) {
                                    if ($scope.rememberLogin) {
                                        $storage.set('email', params.email);
                                        $storage.set('password', params.password);
                                        $storage.set('remember', 'true');
                                    } else {
                                        $storage.set('email', '');
                                        $storage.set('password', '');
                                        $storage.set('remember', '');
                                    }
                                    $rootScope.userid = id;
                                    $location.path('/home');
                                } else {
                                    $popups.alert({
                                        text: 'Invalid login data!'
                                    });
                                }
                            })
                            .error(function (data, status, headers, config) {
                                $popups.alert({
                                    text: 'Invalid login data!'
                                });
                            });
                }
                function loginClicked() {
                    $scope.submitTried = true;
                    if ($scope.myForm.$valid) {
                        login($scope.email, $scope.password);
                    }
                }
                $scope.loginClicked = function () {
                    if (window.testingNMS) {
                        $rootScope.userid = $scope.password;
                        $location.path('/home');
                    } else {
                        loginClicked();
                    }
                };
                $scope.$on('key', function (event, keyCode) {
                    if (Number(keyCode) == 13) {
                        loginClicked();
                    }
                });
                $scope.email = $storage.get('email');
                $scope.password = $storage.get('password');
                var remember = Boolean($storage.get('remember'));
                $scope.rememberLogin = remember;
                if (remember) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $('#remember-login').prop('checked', true).checkboxradio('refresh');
                        });
                    });
                }
            }]);