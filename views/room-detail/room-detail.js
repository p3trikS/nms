'use strict';

angular.module('myApp.roomDetail', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/room-detail/:name/:section', {
                    templateUrl: 'views/room-detail/room-detail.html',
                    controller: 'RoomDetailCtrl'
                });
            }])
        .controller('RoomDetailCtrl', function ($rootScope, $scope, $http, $routeParams, $location) {
            function loadItems() {
                var room = $routeParams.name;
                var params = {
                    userid: $rootScope.userid,
                    formatid: room,
                    method: 'GetSongsByFormat'
                };
                $http.get($rootScope.baseURL + 'webservice.php?' + $.param(params),
                        params)
                        .success(function (data, status, headers, config) {
                            var data = x2js.xml_str2json(data);
                            console.log(data);
                            var items = [];
                            for (var i = 0; i < data.songs.song.length; i++) {
                                var item = data.songs.song[i];
                                items.push({
                                    id: item._songid,
                                    name: item.songtitle.__cdata,
                                    artist: item.artistname.__cdata,
                                    img: item.coverartpath.__cdata
                                });
                            }
                            $scope.items = items;
                        })
                        .error(function (data, status, headers, config) {
                        });
            }
            $scope.sectionTitle = decodeURIComponent(decodeURIComponent($routeParams.section));
            loadItems();
        });