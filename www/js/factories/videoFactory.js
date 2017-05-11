angular.module('starter')
    .factory('videoFactory', function ($q, $cordovaCamera, CONSTANTS, $cordovaImagePicker, $ionicLoading) {
        // function take from Camera
        function useCamera() {
            var options = {
                limit: 1,
                duration: 10
            };
            navigator.device.capture.captureVideo(onSuccess, onError, options);
            function onSuccess(mediaFiles) {
                $ionicLoading.show({
                    template: 'Loading....'
                });
                var i, path, len;
                for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                    path = mediaFiles[i].fullPath;
                    console.log(path);
                }
                uploadVideoToServer(path);
            }

            function onError(error) {
                console.log('Error code: ' + error.code, null, 'Capture Error');
            }
        }

        // function take from Gallery
        function useGallery() {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                mediaType: Camera.MediaType.VIDEO
            };
            $cordovaCamera.getPicture(options).then(function (video) {
                // Loop through acquired images
                console.log(video)
                uploadVideoToServer(video);
                //return callback(video);
            }, function (error) {
                //return callback(false);
            });
        }

        // function get pictures
        function getPicture(imageCount, callback) {
        }

        function uploadVideoToServer(fileURL) {
            //upload the video to the server
            function win(r) {
                $ionicLoading.hide()
                console.log("Code = " + r.responseCode);
                console.log("Response = " + r.response);
                console.log("Sent = " + r.bytesSent);
            }

            function fail(error) {
                $ionicLoading.hide()
                alert("An error has occurred: Code = " + error.code);
                console.log("upload error source " + error.source);
                console.log("upload error target " + error.target);
            }

            var uri = encodeURI(CONSTANTS.BASE_URL + 'uploadprofilevideo');
            var options = new FileUploadOptions();
            options.fileKey = "profile_video";
            options.chunkedMode = false
            options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
            options.mimeType = "image/png";
            options.params = {
                'device_type': CONSTANTS.deviceType(),
                'session_token': window.localStorage.getItem('sess_tok')
            }
            //var headers={'headerParam':'headerValue'};
            //options.headers = headers;
            var ft = new FileTransfer();
            ft.onprogress = function (progressEvent) {
                if (progressEvent.lengthComputable) {
                    $ionicLoading.show({
                        template: 'Uploading video ' + Math.floor(progressEvent.loaded / progressEvent.total * 100) + "%"
                    });
                } else {

                    //loadingStatus.increment();
                }
            };
            //if device is android then check for permission and then proceed
            if (ionic.Platform.isAndroid()) {
                var permissions = cordova.plugins.permissions;
                permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);
                function checkPermissionCallback(status) {
                    if (!status.hasPermission) {
                        var errorCallback = function () {
                            console.warn('storage permission is not turned on');
                        }
                        permissions.requestPermission(
                            permissions.READ_EXTERNAL_STORAGE,
                            function (status) {
                                if (!status.hasPermission) errorCallback();
                                else ft.upload(fileURL, uri, win, fail, options);
                            },
                            errorCallback);
                    } else {
                        ft.upload(fileURL, uri, win, fail, options);
                    }
                }
            } else {
                ft.upload(fileURL, uri, win, fail, options);
            }
        }

        return {
            getPicture: getPicture,
            useCamera: useCamera,
            useGallery: useGallery
        };
    });
