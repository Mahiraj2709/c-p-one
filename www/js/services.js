angular.module('services', [])
    .service('GooglePlacesService', function ($q) {
        this.getPlacePredictions = function (query) {
            var dfd = $q.defer(),
                service = new google.maps.places.AutocompleteService();
            service.getPlacePredictions({input: query}, function (predictions, status) {
                if (status != google.maps.places.PlacesServiceStatus.OK) {
                    dfd.resolve([]);
                }
                else {
                    dfd.resolve(predictions);
                }
            });
            return dfd.promise;
        };
        this.getLatLng = function (placeId) {
            var dfd = $q.defer(),
                geocoder = new google.maps.Geocoder;
            geocoder.geocode({'placeId': placeId}, function (results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        dfd.resolve(results[0].geometry.location);
                    }
                    else {
                        dfd.reject("no results");
                    }
                }
                else {
                    dfd.reject("error");
                }
            });
            return dfd.promise;
        };

        this.getAddress = function (latLng,callback) {
            var geocoder = new google.maps.Geocoder;

            geocoder.geocode({'location': latLng}, function(results, status) {
                if (status === 'OK') {
                    if (results[1]) {
                        //return the first result to the callback
                        callback(results[0]);
                    } else {

                    }
                } else {
                }
            });
        };
    })
    .factory('ImagePickerService', function ($cordovaCamera) {
        var factory = {};
        factory.takePhoto = function () {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                return finalImage = "data:image/jpeg;base64," + imageData;
            }, function (err) {
                // An error occured. Show a message to the user
            });
        };
        factory.choosePhoto = function () {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                return finalImage = "data:image/jpeg;base64," + imageData;
            }, function (err) {
                // An error occured. Show a message to the user
            });
        };
        return factory;
    }).factory('ImgFormData', function () {
    return function (dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    }
})
    .service('TermCondition', function ($http, CONSTANTS, $ionicLoading) {
        this.getTermCondition = function (callback) {
            $ionicLoading.show({
                template: 'Loading Terms and Conditions...'
            });
            var formdata = new FormData;
            formdata.append('session_token', window.localStorage.getItem('session_tok'));
            formdata.append('language', 'en');
            formdata.append('identifier', 'terms-condition-customer');
            var request = {
                method: 'POST',
                url: CONSTANTS.BASE_URL + 'pages',
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
                        return callback(d.response_data.page.pages_desc);
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
    })
    .service('LocationAlert', function ($ionicPlatform, $ionicPopup) {
        this.isLocationEnabled = function (callback) {
            $ionicPlatform.ready(function () {
                if (window.cordova) {
                    cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
                        callback(enabled);
                        if (!enabled) {
                            // An alert dialog
                                var alertPopup = $ionicPopup.alert({
                                    title: '<b>Location Services</b> </br> Settings must be changed',
                                    template: 'Location Services must be enabled for Cleanosaur to function.'
                                });
                                alertPopup.then(function (res) {
                                    if (window.cordova) {
                                        cordova.plugins.diagnostic.switchToLocationSettings();
                                    }
                                });
                        }else {
                        }
                    }, function (error) {
                    });
                }
            })
        };
    })
    .factory('AppointmentData',function () {
        var appointment = {
          viewTitle:'Cleanosaur on the way',
          app_appointment_id:undefined,
          appointment:undefined
        };

        return appointment;
    })
    .factory('LocationData',function () {
        var Location = {
            longitude:undefined,
            latitude:undefined
        };

        return Location;
    })
    .factory('ReqeustAcceptedFactory',function () {
    var payload = {
        payload:undefined,
        cleaner_profile_pic : undefined
    };

    return payload;
});
