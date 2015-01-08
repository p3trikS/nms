'use strict';

angular.module('myApp.search', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/search/:query', {
                    templateUrl: 'views/search/search.html',
                    controller: 'SearchCtrl'
                });
            }])
        .controller('SearchCtrl', function ($rootScope, $scope, $http, $routeParams, $location) {
            function loadItems() {
                var query = $routeParams.query;
                var params = {
                    userid: $rootScope.userid,
                    method: 'GetSongsByKeyword',
                    keyword: query
                };
                 
                
                $http.get($rootScope.baseURL + 'webservice.php?' + $.param(params),
                        params)
                        .success(function (data, status, headers, config) {
                            var data = x2js.xml_str2json(data);
                            console.log(data);
                            var items = [];
                            for (var i = 0; i < data.songs.song.length; i++) {
                                var item = data.songs.song[i];
                                var parsed = {
                                    id: item._songid,
                                    name: item.songtitle.__cdata,
                                    artist: item.artistname.__cdata,
                                    img: item.coverartpath.__cdata
                                };
                                items.push(parsed);
                            }
                            $scope.items = items;
                        })
                        .error(function (data, status, headers, config) {
                        });
            }
            loadItems();
        });