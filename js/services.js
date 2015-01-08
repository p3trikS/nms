angular.module('myApp')
        .service('myApp.popupService', function () {
            this.alert = function (options) {
                if (!options.title) {
                    options.title = 'Alert';
                }
                alert(options.text);
            };
        })
        .service('myApp.audioService', [
            '$rootScope', 'myApp.htmlAudioService', 'myApp.androidAudioService',
            function ($rootScope, $htmlAudio, $androidAudio) {
                this.getAudio = function (options) {
                    if ($rootScope.data.android) {
                        return new $androidAudio(options);
                    } else {
                        return $htmlAudio.initialize(options);
                    }
                };
            }])
        .service('myApp.storageService',
                function () {
                    function getCookie(cname) {
                        var name = cname + "=";
                        var ca = document.cookie.split(';');
                        for (var i = 0; i < ca.length; i++) {
                            var c = ca[i];
                            while (c.charAt(0) == ' ')
                                c = c.substring(1);
                            if (c.indexOf(name) == 0)
                                return c.substring(name.length, c.length);
                        }
                        return "";
                    }
                    function setCookie(cname, cvalue, exdays) {
                        var d = new Date();
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        var expires = "expires=" + d.toUTCString();
                        document.cookie = cname + "=" + cvalue + "; " + expires;
                    }
                    this.get = function (key) {
                        if (window.localStorage) {
                            return localStorage.getItem(key) || null;
                        } else {
                            return getCookie(key) || null;
                        }
                    };
                    this.set = function (key, value) {
                        if (window.localStorage) {
                            localStorage.setItem(key, value);
                        } else {
                            setCookie(key, value, 365 * 10);
                        }
                    };
                })
        .service('myApp.htmlAudioService', function ($timeout) {
            var audioObject = {
                player: null,
                options: null,
                initialize: function (opts) {
                    audioObject.options = opts;
                    if (!audioObject.player) {
                        audioObject.player = new Audio();
                        audioObject.player.crossOrigin = true;
                        audioObject.player.addEventListener('playing', function () {
                            console.log('AUDIO: PLAYING');
                            if (audioObject.options.running) {
                                audioObject.options.running();
                            }
                        });
                        audioObject.player.addEventListener('pause', function () {
                            console.log('AUDIO: PAUSED');
                            if (audioObject.options.stopped) {
                                audioObject.options.stopped();
                            }
                        });
                        audioObject.player.addEventListener('error', function (err) {
                            if (audioObject.error) {
                                console.log('AUDIO: ERROR ' + audioObject.error.code);
                                if (audioObject.error.code) {
                                    if (audioObject.options.error) {
                                        audioObject.options.error(audioObject.error.code);
                                    }
                                }
                            }
                        });
                        audioObject.player.addEventListener('ended', function () {
                            console.log('AUDIO: TRACK FINISHED');
                            if (audioObject.options.trackFinished) {
                                audioObject.options.trackFinished();
                            }
                        });
                        audioObject.player.addEventListener('timeupdate', function () {
                            if (audioObject.options.progress) {
                                audioObject.options.progress(audioObject.player.currentTime);
                            }
                        });
                    }
                    return audioObject;
                },
                play: function (url) {
                    if (audioObject.player) {
                        audioObject.clear();
                        console.log('AUDIO: SRC = ' + url);
                        console.log('AUDIO: LOADING');
                        $timeout(function () {
                            if (audioObject.options.loading) {
                                audioObject.options.loading();
                            }
                            audioObject.player.src = url;
                            audioObject.player.play();
                        });
                    }
                },
                pause: function () {
//                    clear();
                },
                startOver: function () {
                    if (audioObject.player) {
                        var src = audioObject.player.src;
                        audioObject.clear();
                        audioObject.play(src);
                    }
                },
                stop: function () {
                    audioObject.clear();
                },
                clear: function () {
                    if (audioObject.player) {
                        if (audioObject.player.src && audioObject.player.src != '') {
                            audioObject.player.pause();
                            audioObject.player.src = '';
                            $timeout(function () {
                                if (audioObject.options.stopped) {
                                    audioObject.options.stopped();
                                }
                            });
                        }
                    }
                }
            };
            return audioObject;
        })
        .service('myApp.androidAudioService', function () {
            return function (options) {
                var self = this;
                this.player = null;
                this.interval = null;
                var lastUserAudioAction = 0;
                if (!options) {
                    options = {};
                }

                this.play = function (url) {
                    self.clear();
                    console.log('AUDIO: SRC = ' + url);
                    self.player = new Media(url, function () {
                        console.log('AUDIO: SUCCESS');
                        var diff = new Date().getTime() - lastUserAudioAction;
                        if (diff > 500) {
                            console.log('AUDIO: TRACK FINISHED');
                            if (options.trackFinished) {
                                options.trackFinished();
                            }
                        }
                    }, function (err) {
                        console.log('AUDIO: ERROR ' + JSON.stringify(err));
                        if (Number(err.code)) {
                            if (options.error) {
                                options.error(JSON.stringify(err));
                            }
                        }
                    }, function (status) {
                        if (status == Media.MEDIA_STARTING) {
                            console.log('AUDIO: LOADING');
                            if (options.loading) {
                                options.loading();
                            }
                        }
                        if (status == Media.MEDIA_RUNNING) {
                            console.log('AUDIO: RUNNING');
                            if (options.running) {
                                options.running();
                            }
                        }
                        if (status == Media.MEDIA_STOPPED) {
                            console.log('AUDIO: STOPPED');
                            if (options.stopped) {
                                options.stopped();
                            }
                        }
                    });
                    lastUserAudioAction = new Date().getTime();
                    self.player.play();
                    self.interval = setInterval(function () {
                        if (self.player) {
                            self.player.getCurrentPosition(
                                    // success callback
                                            function (position) {
                                                if (position > -1) {
                                                    if (options.progress) {
                                                        options.progress(position);
                                                    }
                                                }
                                            },
                                            // error callback
                                                    function (e) {
                                                        console.log("Error getting pos=" + e);
                                                    }
                                            );
                                        }
                            }, 300);
                };
                this.pause = function () {
//                    if (self.player) {
//                        self.player.pause();
//                    }
                };
                this.startOver = function () {
                    if (self.player) {
                        lastUserAudioAction = new Date().getTime();
                        self.player.seekTo(0);
                    }
                };
                this.stop = function () {
                    self.clear();
                };
                this.clear = function () {
                    if (self.interval) {
                        clearInterval(self.interval);
                    }
                    if (self.player) {
                        lastUserAudioAction = new Date().getTime();
                        self.player.stop();
                        self.player.release();
                        self.player = null;
                    }
                };
            };
        });