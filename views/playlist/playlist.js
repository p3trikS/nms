'use strict';

angular.module('myApp.playlist', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/playlist', {
                    templateUrl: 'views/playlist/playlist.html',
                    controller: 'PlaylistCtrl'
                });
            }])
        .controller('PlaylistCtrl', ['$rootScope', '$scope', '$http', 'myApp.popupService', 'myApp.audioService',
            function ($rootScope, $scope, $http, $popups, $audioService) {
                function loadItems() {
                    if (window.testingNMS) {
                        var data = '<?xml version="1.0"?><songs><song songid="4064"><songtitle><![CDATA[Follow Me Down]]></songtitle><artistname><![CDATA[Pretty Reckless]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=PrettyRecklessAlbum14.jpg]]></coverartpath></song><song songid="8011"><songtitle><![CDATA[Ayo]]></songtitle><artistname><![CDATA[Chris Brown feat. Tyga]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=ChrisBrownAyo.jpg]]></coverartpath></song><song songid="6976"><songtitle><![CDATA[Bad Habit]]></songtitle><artistname><![CDATA[Kooks]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=KooksAlbum14.jpg]]></coverartpath></song><song songid="6890"><songtitle><![CDATA[Crystallized]]></songtitle><artistname><![CDATA[Young the Giant]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=YoungTheGiantAlbum14.jpg]]></coverartpath></song><song songid="6651"><songtitle><![CDATA[Forever]]></songtitle><artistname><![CDATA[Greta Prince]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=GretaPrinceForever.jpg]]></coverartpath></song><song songid="6962"><songtitle><![CDATA[Feeling Myself]]></songtitle><artistname><![CDATA[Nicki Minaj feat. Beyonce]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=NickiMinajAlbum14.jpg]]></coverartpath></song><song songid="6843"><songtitle><![CDATA[United State of Pop 2014 (Do What You Wanna Do)]]></songtitle><artistname><![CDATA[Earworm]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=EarwormUnitedStateOfPop2014.gif]]></coverartpath></song><song songid="6405"><songtitle><![CDATA[Girl Crush]]></songtitle><artistname><![CDATA[Little Big Town]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=LittleBigTownAlbum14.jpg]]></coverartpath></song><song songid="7750"><songtitle><![CDATA[Moonshine Money]]></songtitle><artistname><![CDATA[Jillian Kohr]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=jilliandec2014.jpg]]></coverartpath></song><song songid="6736"><songtitle><![CDATA[Apparently]]></songtitle><artistname><![CDATA[J. Cole]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=JCOLEDec2014.jpg]]></coverartpath></song><song songid="7158"><songtitle><![CDATA[Blank Space]]></songtitle><artistname><![CDATA[Taylor Swift ]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=TaylorSwiftAlbum14.jpg]]></coverartpath></song><song songid="7507"><songtitle><![CDATA[I See You]]></songtitle><artistname><![CDATA[Luke Bryan]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=LukeBryanAlbum13.jpg]]></coverartpath></song><song songid="245"><songtitle><![CDATA[Smile]]></songtitle><artistname><![CDATA[Avril Lavigne]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=AvrilSmile.jpg]]></coverartpath></song><song songid="1216999145"><songtitle><![CDATA[Dancing Tonight]]></songtitle><artistname><![CDATA[Kat Deluna]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=KatDelunaMar2011.jpg]]></coverartpath></song><song songid="1216915514"><songtitle><![CDATA[Not Strong Enough]]></songtitle><artistname><![CDATA[Apocalyptica feat. Doug Robb]]></artistname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=ApocalypticaJan11.jpg]]></coverartpath></song></songs>';
                        data = x2js.xml_str2json(data);
                        console.log(data);
                        var items = [];
                        for (var i = 0; i < data.songs.song.length; i++) {
                            var item = data.songs.song[i];
                            var parsed = {
                                index: i,
                                id: item._songid,
                                name: item.songtitle.__cdata,
                                artist: item.artistname.__cdata,
                                img: item.coverartpath.__cdata
                            };
                            items.push(parsed);
                        }
                        $scope.loaded = true;
                        $scope.items = items;
                    } else {
                        var params = {
                            userid: $rootScope.userid,
                            method: 'GetDownloadSongByUserId'
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
                                            index: i,
                                            id: item._songid,
                                            name: item.songtitle.__cdata,
                                            artist: item.artistname.__cdata,
                                            img: item.coverartpath.__cdata
                                        };
                                        items.push(parsed);
                                    }
                                    $scope.loaded = true;
                                    $scope.items = items;
                                })
                                .error(function (data, status, headers, config) {
                                });
                    }
                }
                $scope.removeFromList = function (item) {
                    var params = {
                        userid: $rootScope.userid,
                        method: 'DeleteDownloadSong',
                        songid: item.id
                    };
                    $http.post($rootScope.baseURL + 'webservice.php?' + $.param(params),
                            params)
                            .success(function (data, status, headers, config) {
                               
                            })
                            .error(function (data, status, headers, config) {
                                $popups.alert({
                                    text: 'Remove song error'
                                });
                                loadItems();
                            });
                };
                $scope.play = function (item) {
                    if (item) {
                        audioObject.clear();
                        $scope.currentSongIndex = item.index;
                        $scope.currentSong = item;
                        if ($scope.currentSong.url) {
                            audioObject.play($scope.currentSong.url);
                        } else {
                            if (window.testingNMS) {
                                var data = x2js.xml_str2json('<?xml version="1.0"?><songs><song songid="4064"><uploaddate><![CDATA[12-22-2014]]></uploaddate><songtitle><![CDATA[Pretty Reckless-Follow Me Down]]></songtitle><videopath><![CDATA[]]></videopath><length><![CDATA[4:10]]></length><bmp><![CDATA[]]></bmp><album><![CDATA[]]></album><instrumentalpathname><![CDATA[ ]]></instrumentalpathname><djintropathname><![CDATA[]]></djintropathname><acapellapathname><![CDATA[]]></acapellapathname><dirtypathname><![CDATA[]]></dirtypathname><wavfilesname><![CDATA[prettyreckless-followmedown.wav]]></wavfilesname><rapfilename><![CDATA[]]></rapfilename><songpathname><![CDATA[prettyreckless-followmedown.mp3]]></songpathname><instrumentalpath></instrumentalpath><djintropath></djintropath><songpath><![CDATA[http://www.newmusicserver.com/songs/prettyreckless-followmedown.mp3]]></songpath><acapellapath></acapellapath><dirtypath></dirtypath><wavfiles><![CDATA[http://www.newmusicserver.com/downloadwavfileiphone.php?song_id=4064&user_id=]]></wavfiles><rapfile></rapfile><artistname><![CDATA[Pretty Reckless]]></artistname><labelname><![CDATA[Razor & Tie]]></labelname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=PrettyRecklessAlbum14.jpg]]></coverartpath></song></songs>');
                                console.log(data);
                                var song = data.songs.song;
                                $scope.currentSong.url = song.songpath.__cdata;
                                audioObject.play($scope.currentSong.url);
                            } else {
                                var params = {
                                    userid: $rootScope.userid,
                                    songid: $scope.currentSong.id,
                                    method: 'GetSongById'
                                };
                                $http.get($rootScope.baseURL + 'webservice.php?' + $.param(params),
                                        params)
                                        .success(function (data, status, headers, config) {
                                            var data = x2js.xml_str2json(data);
                                            console.log(data);
                                            var song = data.songs.song;
                                            $scope.currentSong.url = song.songpath.__cdata;
                                            audioObject.play($scope.currentSong.url);
                                        })
                                        .error(function (data, status, headers, config) {
                                        });
                            }
                        }
                    }
                };
                $scope.stop = function () {
                    audioObject.clear();
                    $scope.currentSong = {};
                };
                $scope.startOver = function () {
                    audioObject.startOver();
                };
                $scope.prev = function () {
                    var index;
                    if ($scope.currentSongIndex > 0) {
                        index = $scope.currentSongIndex - 1;
                    } else {
                        index = $scope.items.length - 1;
                    }
                    $scope.play($scope.items[index]);
                };
                $scope.next = function () {
                    var index;
                    if ($scope.items.length > $scope.currentSongIndex + 1) {
                        index = $scope.currentSongIndex + 1;
                    } else {
                        index = 0;
                    }
                    $scope.play($scope.items[index]);
                };

                $scope.$on("$destroy", function () {
                    audioObject.clear();
                });
                $scope.$on("pause", function () {
                    audioObject.clear();
                    $scope.currentSong = {};
                });
                $scope.$on("resume", function () {
                    audioObject.clear();
                    $scope.currentSong = {};
                });

                $scope.items = [];
                $scope.currentSong = {};
                var options = {
                    trackFinished: function () {
                        if ($scope.items.length > $scope.currentSongIndex + 1) {
                            $scope.play($scope.items[$scope.currentSongIndex + 1]);
                        } else {
                            $scope.currentSong = {};
                        }
                    },
                    error: function (err) {
                        $scope.$apply(function () {
                            $scope.currentSong = {};
                            audioObject.clear();
                            $popups.alert({
                                title: "Error",
                                text: "Audio error: " + err
                            });
                        });
                    }
                };
                var audioObject = $audioService.getAudio(options);

                loadItems();
            }]);