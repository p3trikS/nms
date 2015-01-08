'use strict';

angular.module('myApp.songDetail', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
                $routeProvider.when('/song-detail/:songName', {
                    templateUrl: 'views/song-detail/song-detail.html',
                    controller: 'SongDetailCtrl'
                });
                $routeProvider.when('/song-detail/:songName/:fromPlaylist', {
                    templateUrl: 'views/song-detail/song-detail.html',
                    controller: 'SongDetailCtrl'
                });
            }])
        .controller('SongDetailCtrl', ['$rootScope', '$scope', '$http', '$routeParams', 'myApp.popupService', '$timeout', 'myApp.audioService',
            function ($rootScope, $scope, $http, $routeParams, $popups, $timeout, $audioService) {
                function getData() {
                    if (window.testingNMS) {
                        var data = '<?xml version="1.0"?><songs><song songid="4064"><uploaddate><![CDATA[12-22-2014]]></uploaddate><songtitle><![CDATA[Pretty Reckless-Follow Me Down]]></songtitle><videopath><![CDATA[]]></videopath><length><![CDATA[4:10]]></length><bmp><![CDATA[]]></bmp><album><![CDATA[]]></album><instrumentalpathname><![CDATA[ ]]></instrumentalpathname><djintropathname><![CDATA[]]></djintropathname><acapellapathname><![CDATA[]]></acapellapathname><dirtypathname><![CDATA[]]></dirtypathname><wavfilesname><![CDATA[prettyreckless-followmedown.wav]]></wavfilesname><rapfilename><![CDATA[]]></rapfilename><songpathname><![CDATA[prettyreckless-followmedown.mp3]]></songpathname><instrumentalpath></instrumentalpath><djintropath></djintropath><songpath><![CDATA[http://www.newmusicserver.com/songs/prettyreckless-followmedown.mp3]]></songpath><acapellapath></acapellapath><dirtypath></dirtypath><wavfiles><![CDATA[http://www.newmusicserver.com/downloadwavfileiphone.php?song_id=4064&user_id=]]></wavfiles><rapfile></rapfile><artistname><![CDATA[Pretty Reckless]]></artistname><labelname><![CDATA[Razor & Tie]]></labelname><coverartpath><![CDATA[http://www.newmusicserver.com/view_logo_thumb.php?img=PrettyRecklessAlbum14.jpg]]></coverartpath></song></songs>';
                        data = x2js.xml_str2json(data);
                        console.log(data);
                        var song = data.songs.song;
                        $scope.song = {
                            id: song._songid,
                            artist: song.artistname.__cdata,
                            title: song.songtitle.__cdata,
                            label: song.labelname.__cdata,
                            uploaded: song.uploaddate.__cdata,
                            length: song.length.__cdata,
                            img: song.coverartpath.__cdata,
                            url: song.songpath.__cdata
                        };
                    } else {
                        var songName = $routeParams.songName;
                        var params = {
                            userid: $rootScope.userid,
                            songid: songName,
                            method: 'GetSongById'
                        };
                        $http.get($rootScope.baseURL + 'webservice.php?' + $.param(params),
                                params)
                                .success(function (data, status, headers, config) {
                                    var data = x2js.xml_str2json(data);
                                    console.log(data);
                                    var song = data.songs.song;
                                    $scope.song = {
                                        id: song._songid,
                                        artist: song.artistname.__cdata,
                                        title: song.songtitle.__cdata,
                                        label: song.labelname.__cdata,
                                        uploaded: song.uploaddate.__cdata,
                                        length: song.length.__cdata,
                                        img: song.coverartpath.__cdata,
                                        url: song.songpath.__cdata,
                                        inPlaylist: $routeParams.fromPlaylist
                                    };
                                })
                                .error(function (data, status, headers, config) {
                                });
                    }
                }
                function getVolume() {
                    if ($scope.data.android) {
                        volumeService.getVolume(function (res) {
                            $scope.$apply(function () {
                                $scope.volume = res.volume;
                                console.log('getVolume=' + $scope.volume);
                                $timeout(function () {
                                    $('#slider-volume').slider("refresh");
                                    $timeout(function () {
                                        $scope.volumeLoaded = true;
                                    });
                                });
                            });
                        });
                    }
                }

                $scope.volumeChanged = function () {
                    if ($scope.data.android) {
                        volumeService.setVolume($scope.volume);
                    }
                };
                $scope.playClicked = function () {
                    if ($scope.state == 'LOADING' || $scope.state == 'PLAYING') {
                        audioObject.stop();
                    } else {
                        $scope.timePlayed = 0;
                        audioObject.play($scope.song.url);
                    }
                };
                $scope.addClicked = function () {
                    var params = {
                        userid: $rootScope.userid,
                        method: 'InsertDownloadSong',
                        songid: $scope.song.id
                    };
                    $http.post($rootScope.baseURL + 'webservice.php?' + $.param(params),
                            params)
                            .success(function (data, status, headers, config) {
                                $scope.song.inPlaylist = true;
//                                $popups.alert({
//                                    title: "Success",
//                                    text: "Song added to playlist."
//                                });
                            })
                            .error(function (data, status, headers, config) {
                                $popups.alert({
                                    title: "Error",
                                    text: "Song could not be added to playlist."
                                });
                            });
                };
                 $scope.removeClicked = function () {
                    var params = {
                        userid: $rootScope.userid,
                        method: 'DeleteDownloadSong',
                        songid: $scope.song.id
                    };
                    $http.post($rootScope.baseURL + 'webservice.php?' + $.param(params),
                            params)
                            .success(function (data, status, headers, config) {
                                $scope.song.inPlaylist = false;
//                                $popups.alert({
//                                    title: "Success",
//                                    text: "Song removed from playlist."
//                                });
                            })
                            .error(function (data, status, headers, config) {
                                $popups.alert({
                                    title: "Error",
                                    text: "Song could not be removed from playlist."
                                });
                            });
                };

                // initialize
                $scope.$on('volume', function (event, value) {
                    if ($scope.data.android) {
                        $scope.volume = value;
                        console.log('volume event=' + $scope.volume);
                        $timeout(function () {
                            $('#slider-volume').slider("refresh");
                        });
                    }
                });
                $scope.$on("$destroy", function () {
                    audioObject.clear();
                });
                $scope.$on("pause", function () {
                    audioObject.clear();
                });
                $scope.$on("resume", function () {
                    audioObject.clear();
                });
                var audioObject = null;
                $scope.song = {};
                $scope.state = 'STOPPED';
                getData();
                var options = {
                    error: function (err) {
                        $scope.$apply(function () {
                            $scope.state = 'STOPPED';
                            $popups.alert({
                                title: "Error",
                                text: "Audio error: " + err
                            });
                        });
                    },
                    loading: function () {
                        $scope.$apply(function () {
                            $scope.state = 'LOADING';
                        });
                    },
                    running: function () {
                        $scope.$apply(function () {
                            $scope.state = 'PLAYING';
                        });
                    },
                    stopped: function () {
                        $scope.$apply(function () {
                            $scope.state = 'STOPPED';
                        });
                    },
                    progress: function (position) {
                        $scope.$apply(function () {
                            $scope.timePlayed = position;
                        });
                    }
                };
                audioObject = $audioService.getAudio(options);
                if ($scope.data.android) {
                    getVolume();
                }
            }]);




        