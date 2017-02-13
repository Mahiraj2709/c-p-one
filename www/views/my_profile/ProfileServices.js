/**
 * Created by admin on 1/2/2017.
 */

angular.module('starter')
    .service('UploadVideo',function ($cordovaFileTransfer,CONSTANTS, $ionicLoading) {
        this.captureVideo = function () {
            var options = {
                limit: 1,
                duration: 10
            };

            navigator.device.capture.captureVideo(onSuccess, onError, options);

                $ionicLoading.show({
                    template: 'Loading....'
                });
                var i, path, len;

                for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                    path = mediaFiles[i].fullPath;
                    console.log(path);
                }

                //upload the video to the server
                var options = {
                    fileKey: "profile_video",
                    fileName: "profilevide.mp4",
                    chunkedMode: false,
                    mimeType: "image/png",
                    params : {'device_type':CONSTANTS.deviceType(), 'session_token':window.localStorage.getItem('sess_tok')}
                };
                $cordovaFileTransfer.upload(CONSTANTS.BASE_URL + 'uploadprofilephoto', path, options).then(function (result) {
                    $ionicLoading.hide();
                    console.log("SUCCESS: " + JSON.stringify(result.response));
                }, function (err) {
                    $ionicLoading.hide();
                    console.log("ERROR: " + JSON.stringify(err));
                }, function (progress) {
                    console.log(progress);
                    // constant progress updates
                    $ionicLoading.show({
                        template:'Uploading..'+progress
                    })
                });
            }

            function onError(error) {
                console.log('Error code: ' + error.code, null, 'Capture Error');
            }

    })
    .service('UploadImageService',function (CONSTANTS,ImgFormData, $http,$ionicLoading) {

        this.uploadImage = function (imgData,position) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var formdata = new FormData();
            formdata.append('device_type', CONSTANTS.deviceType());
            formdata.append('session_token', window.localStorage.getItem("sess_tok"));
            formdata.append('profile_pic',ImgFormData(imgData),'image.jpeg');
            formdata.append('position', position);

            var request = {
                method: 'POST',
                url: CONSTANTS.BASE_URL + 'uploadprofilephoto',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formdata,
                headers: {
                    'Content-Type': undefined
                }
            };
            // SEND THE FILES.
            $http(request)
                .success(function (d) {
                    $ionicLoading.hide();
                    //$scope.showAlert(JSON.stringify(d));
                    if (d.response_status == "1") {
                        console.log("image uploaded successfully");
                    } else {
                        //$scope.showAlert(d.response_msg);
                    }
                })
                .error(function (err) {
                    /*$scope.hideLoading();*/
                    $ionicLoading.hide();
                    console.log(err);
//                    $scope.showAlert(er
                });
        }
    })
    .factory('LoadImagesService',function ($http,$ionicLoading, CONSTANTS) {
        return function (callback) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var formdata = new FormData();
            formdata.append('device_type', CONSTANTS.deviceType());
            formdata.append('session_token', window.localStorage.getItem("sess_tok"));

            var request = {
                method: 'POST',
                url: CONSTANTS.BASE_URL + 'getuploadedprofilephoto',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: formdata,
                headers: {
                    'Content-Type': undefined
                }
            };
            // SEND THE FILES.
            $http(request)
                .success(function (d) {
                    $ionicLoading.hide();
                    //$scope.showAlert(JSON.stringify(d));
                    if (d.response_status == "1") {
                        return callback(d.response_data.profile);
                    } else {
                    }
                })
                .error(function (err) {
                    /*$scope.hideLoading();*/
                    $ionicLoading.hide();
                    console.log(err);
//                    $scope.showAlert(er
                });
        }
    });
