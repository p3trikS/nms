'use strict';

angular.module('myApp.rooms', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/rooms', {
                    templateUrl: 'views/rooms/rooms.html',
                    controller: 'RoomsCtrl'
                });
            }])
        .controller('RoomsCtrl', function ($rootScope, $scope, $http, $timeout) {
            function loadItems() {
                if (window.testingNMS) {
                    $timeout(function () {

                        var data = '<?xml version="1.0"?><formats><format formatid="1"><formatname><![CDATA[Countttry]]></formatname></format><format formatid="3"><formatname><![CDATA[Alternative]]></formatname></format><format formatid="6"><formatname><![CDATA[Hot AC]]></formatname></format><format formatid="8"><formatname><![CDATA[Top 40]]></formatname></format><format formatid="9"><formatname><![CDATA[R&B/Urban]]></formatname></format><format formatid="10"><formatname><![CDATA[Rhythmic]]></formatname></format><format formatid="11"><formatname><![CDATA[Rock - Mainstream]]></formatname></format><format formatid="16"><formatname><![CDATA[Rock - Active]]></formatname></format><format formatid="17"><formatname><![CDATA[Old School]]></formatname></format><format formatid="18"><formatname><![CDATA[Z Page]]></formatname></format><format formatid="19"><formatname><![CDATA[Mixers]]></formatname></format><format formatid="21"><formatname><![CDATA[Country Christmas]]></formatname></format><format formatid="22"><formatname><![CDATA[Reggaeton]]></formatname></format><format formatid="23"><formatname><![CDATA[Leaks]]></formatname></format><format formatid="24"><formatname><![CDATA[VIP]]></formatname></format><format formatid="25"><formatname><![CDATA[Xmas]]></formatname></format><format formatid="26"><formatname><![CDATA[Canadian Top 40]]></formatname></format><format formatid="27"><formatname><![CDATA[Canadian Urban]]></formatname></format><format formatid="28"><formatname><![CDATA[Canadian Country]]></formatname></format><format formatid="29"><formatname><![CDATA[Canadian Rock]]></formatname></format><format formatid="30"><formatname><![CDATA[Canadian Hot AC]]></formatname></format><format formatid="31"><formatname><![CDATA[Gospel]]></formatname></format><format formatid="33"><formatname><![CDATA[EDM]]></formatname></format><format formatid="34"><formatname><![CDATA[Triple A]]></formatname></format></formats>';
                        data = x2js.xml_str2json(data);
                        console.log(data);
                        var items = [];
                        for (var i = 0; i < data.formats.format.length; i++) {
                            var item = data.formats.format[i];
                            items.push({
                                id: item._formatid,
                                name: item.formatname.__cdata
                            });
                        }
                        $scope.items = items;
                    }, 1000);
                } else {
                    var params = {
                        userid: $rootScope.userid,
                        method: 'GetFormat'
                    };
                    $http.get($rootScope.baseURL + 'webservice.php?' + $.param(params),
                            params)
                            .success(function (data, status, headers, config) {
                                var data = x2js.xml_str2json(data);
                                console.log(data);
                                var items = [];
                                for (var i = 0; i < data.formats.format.length; i++) {
                                    var item = data.formats.format[i];
                                    items.push({
                                        id: item._formatid,
                                        name: item.formatname.__cdata
                                    });
                                }
                                $scope.items = items;
                            })
                            .error(function (data, status, headers, config) {
                            });
                }
            }
            loadItems();
        });