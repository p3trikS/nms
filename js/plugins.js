window.volumeService = {
    getVolume: function (callback) {
        if (window.cordova) {
            cordova.exec(callback, function (err) {
                console.log('VOLUMESERVICE GETVOLUME ERROR');
            }, "VolumePlugin", "getVolume", []);
        }
    },
    setVolume: function (value) {
        if (window.cordova) {
            console.log('VOLUMESERVICE SET: '+value);
            cordova.exec(function () {
                console.log('VOLUMESERVICE SETVOLUME OK');
            }, function (err) {
                console.log('VOLUMESERVICE SETVOLUME ERROR');
            }, "VolumePlugin", "setVolume", [value]);
        }
    },
    listen: function () {
        if (window.cordova) {
            cordova.exec(function () {
                console.log('VOLUMESERVICE listen OK');
            }, function (err) {
                console.log('VOLUMESERVICE listen ERROR');
            }, "VolumePlugin", "listen", []);
        }
    },
    stopListening: function () {
        if (window.cordova) {
            cordova.exec(function () {
                console.log('VOLUMESERVICE stopListening OK');
            }, function (err) {
                console.log('VOLUMESERVICE stopListening ERROR');
            }, "VolumePlugin", "stopListening", []);
        }
    }
};