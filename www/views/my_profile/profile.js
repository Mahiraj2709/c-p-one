angular.module('starter')
    .controller('ProfileCtrl', function ($scope, $rootScope, $http, GooglePlacesService, $ionicLoading,
                                         $ionicPopup, ImagePickerService,popups,
                                         $location, $timeout, $cordovaCamera, $cordovaGeolocation,
                                         CONSTANTS, UploadImageService, LoadImagesService,
                                         videoFactory, services, $sce, $ionicModal) {

        services.getRating(function (response) {
            if(response.response_status == '1') {
                $rootScope.feedback = response.response_data.rating;
            }
        })

        var imgPosition = -1;
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude
                var long = position.coords.longitude
                $scope.profileDetails.latitude = lat
                $scope.profileDetails.latitude = long
                //$scope.showAlert(lat + "  " + long);
            }, function (err) {
                // error
            });
        // An alert dialog
        $scope.showAlert = function (message) {
            var alertPopup = $ionicPopup.alert({
                title: 'Attention!',
                template: message
            });
        };
        //Loading in
        $scope.showLoading = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hideLoading = function () {
            $ionicLoading.hide();
        };
        // When button is clicked, the popup will be shown...
        $scope.showPopup = function (imgposition) {
            imgPosition = imgposition;
            $scope.data = {}
            // Custom popup
            $scope.myPopup = $ionicPopup.show({
                templateUrl: 'views/signup/image_chooser.html',
                scope: $scope,
            });
        };
        //scope close the pop-up on cancel icon clicked
        $scope.closePopUp = function () {
            $scope.myPopup.close();
        }
        //camera funcitions
        $scope.takePhoto = function () {
            $scope.myPopup.close();
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
                if (imgPosition == 0) {
                    $scope.temp_profile_pic = "data:image/jpeg;base64," + imageData;
                    $scope.profile_pic = "data:image/jpeg;base64," + imageData;
                } else if (imgPosition == 1) {
                    $scope.firstImage = "data:image/jpeg;base64," + imageData;
                    UploadImageService.uploadImage($scope.firstImage, 1);
                } else if (imgPosition == 2) {
                    $scope.secondImage = "data:image/jpeg;base64," + imageData;
                    UploadImageService.uploadImage($scope.secondImage, 2);
                } else if (imgPosition == 3) {
                    $scope.thirdImage = "data:image/jpeg;base64," + imageData;
                    UploadImageService.uploadImage($scope.thirdImage, 3);
                } else if (imgPosition == 4) {
                    $scope.fourthImage = "data:image/jpeg;base64," + imageData;
                    UploadImageService.uploadImage($scope.fourthImage, 4);
                }
            }, function (err) {
                // An error occured. Show a message to the user
            });
        }
        $scope.choosePhoto = function () {
            $scope.myPopup.close();
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
                if (imgPosition == 0) {
                    $scope.temp_profile_pic = "data:image/jpeg;base64," + imageData;
                    $scope.profile_pic = "data:image/jpeg;base64," + imageData;
                } else if (imgPosition == 1) {
                    $scope.firstImage = "data:image/jpeg;base64," + imageData;
                    UploadImageService.uploadImage($scope.firstImage, 1);
                } else if (imgPosition == 2) {
                    $scope.secondImage = "data:image/jpeg;base64," + imageData;
                    UploadImageService.uploadImage($scope.secondImage, 2);
                } else if (imgPosition == 3) {
                    $scope.thirdImage = "data:image/jpeg;base64," + imageData;
                    UploadImageService.uploadImage($scope.thirdImage, 3);
                } else if (imgPosition == 4) {
                    $scope.fourthImage = "data:image/jpeg;base64," + imageData;
                    UploadImageService.uploadImage($scope.fourthImage, 4);
                }
            }, function (err) {
                // An error occured. Show a message to the user
            });
        }
        //$scope.hideKeyboard = cordova.plugins.Keyboard.close();
        var profile = JSON.parse(window.localStorage.getItem('profile'));
        var date_of_birth = String(profile.date_of_birth).split("-");
        var _day = date_of_birth[2];
        var _month = date_of_birth[1];
        var _year = date_of_birth[0];
        $scope.enableInput = {
            mobile: false,
            address: false
        };
        //set dropdown through code in
        $scope.dropDownData = {
            dates: ["Day", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            months: ["Month", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            years: ["Year"],
            info: "Date of birth is required"
        };
        var date = new Date();
        for (var i = date.getYear(); i >= 0; i--) {
            $scope.dropDownData.years.push(1900 + i);
        }
        $scope.getPlacePredictions = function (query) {
            console.log(query)
            if (query !== "") {
                GooglePlacesService.getPlacePredictions(query)
                    .then(function (predictions) {
                        $scope.predictions = predictions;
                    });
            } else {
                $scope.predictions = [];
            }
        };
        $scope.selectSearchResult = function (result) {
            $scope.profileDetails.address = result.description;
            $scope.predictions = [];
        };
        $scope.profileDetails = {
            first_name: profile.first_name,
            last_name: profile.last_name,
            about_your_description: profile.about_your_description,
            device_type: CONSTANTS.deviceType(),
            session_token: window.localStorage.getItem("sess_tok"),
            email: profile.email,
            mobile: profile.mobile,
            language: 'en',
            latitude: '0.0',
            longitude: '0.0',
            profile_pic: undefined,
            address: "na",
            day: "01",
            month: "01",
            year: "1970",
            reference_mode: profile.reference_mode,
            quick_blox_id: profile.quick_blox_id
        }
        $scope.editField = function (type) {
            //disable all input fields first
            for (var key in $scope.enableInput) {
                $scope.enableInput[key] = true;
            }
            if (type == 'phone') {
                $timeout(function () {
                    $scope.enableInput.mobile = false;
                    document.getElementById('mobile').focus();
                    cordova.plugins.Keyboard.show();
                }, 0);
            } else if (type == 'address') {
                $timeout(function () {
                    $scope.enableInput.address = false;
                    document.getElementById('address').focus();
                    cordova.plugins.Keyboard.show();
                }, 0);
            }
        };
        $scope.showKey = function () {
            //cordova.plugins.Keyboard.close();
            cordova.plugins.Keyboard.show();
        }
        //function to move to the next page
        $scope.moveToNext = function () {
            //copy all the profile details to the home myprofile service
            if (!$scope.profileDetails.first_name) {
                $scope.showAlert("First Name is required");
            } else if (!$scope.profileDetails.last_name) {
                $scope.showAlert("Last Name is required");
            } else {
                $location.path('profile_two');
            }
        }
        var formdata = new FormData();
        //update profile
        $scope.updateProfile = function () {
            if ($scope.profileDetails.day == "Day") {
                $scope.showAlert("Date is required");
            } else if ($scope.profileDetails.month == "Month") {
                $scope.showAlert("Month is required");
            } else if ($scope.profileDetails.year == "Year") {
                $scope.showAlert("Year is required");
            } else if (!$scope.profileDetails.email) {
                $scope.showAlert("Email Id is required");
            } else if (!CONSTANTS.validEmail($scope.profileDetails.email)) {
                $scope.showAlert("Email Id is not valid");
            } else if (!$scope.profileDetails.mobile) {
                $scope.showAlert("Phone number is required");
            } else if (!CONSTANTS.validPhoneNo($scope.profileDetails.mobile)) {
                $scope.showAlert("Phone number is not valid");
            } else if (!$scope.profileDetails.address) {
                $scope.showAlert("Address is required");
            }
            else if (!$scope.profileDetails.reference_mode) {
                $scope.showAlert("Please select your behaviour");
            } else {
                //call signup api
                for (var key in $scope.profileDetails) {
                    if (key == "profile_pic") {
                        if (typeof $scope.temp_profile_pic !== 'undefined') {
                            formdata.append(key, dataURItoBlob($scope.temp_profile_pic), 'profile_image' + '.jpeg');
                        }
                    } else {
                        formdata.append(key, $scope.profileDetails[key]);
                    }
                }
                //check for internet connection
                console.log($scope.profileDetails);
                $scope.showLoading();
                $scope.makeRequest();
            }
        };
        // NOW UPLOAD THE FILES.
        $scope.makeRequest = function () {
            var request = {
                method: 'POST',
                url: CONSTANTS.BASE_URL + 'editprofile',
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
                    $scope.hideLoading();
                    //$scope.showAlert(JSON.stringify(d));
                    if (d.response_status == "1") {
                        $scope.showAlert(d.response_msg);
                        window.localStorage.setItem("profile", JSON.stringify(d.response_data.profile));
                        $rootScope.userDetail = d.response_data.profile;
                        $rootScope.profile_pic = CONSTANTS.PROFILE_IMAGE_URL + d.response_data.profile.profile_pic;
                    } else {
                        $scope.showAlert(d.response_msg);
                    }
                })
                .error(function (err) {
                    $scope.hideLoading();
                    console.log(err);
                    $scope.showAlert(err);
                });
        };
        function dataURItoBlob(dataURI) {
            var binary = atob(dataURI.split(',')[1]);
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
        }

        $scope.chooseImage = function (position) {
            $scope.showPopup();
        }
        $scope.loadFourImages = LoadImagesService(function (imgArray) {
            for (var i = 0; i < imgArray.length; i++) {
                var position = imgArray[i].position;
                if (position == 1) {
                    $scope.firstImage = CONSTANTS.PROFILE_IMAGE_URL + imgArray[i].profile_pic;
                } else if (position == 2) {
                    $scope.secondImage = CONSTANTS.PROFILE_IMAGE_URL + imgArray[i].profile_pic;
                } else if (position == 3) {
                    $scope.thirdImage = CONSTANTS.PROFILE_IMAGE_URL + imgArray[i].profile_pic;
                } else if (position == 4) {
                    $scope.fourthImage = CONSTANTS.PROFILE_IMAGE_URL + imgArray[i].profile_pic;
                }
            }
        });
        $scope.clearIcon = false;
        $scope.showCurrentIcon = true;
//video chooser and player service
        $scope.videoChooser = function () {
            $scope.videoPopup = $ionicPopup.show({
                templateUrl: 'views/custom_dialog/video_select_dialog.html',
                scope: $scope,
            });
        }
        $scope.captureVideo = function () {
            videoFactory.useCamera()
            $scope.videoPopup.close()
        };
        $scope.chooseVideo = function () {
            videoFactory.useGallery()
            $scope.videoPopup.close()
        }
        $scope.closeVideoPopup = function () {
            $scope.videoPopup.close()
        }
        $scope.showVideo = function () {
            //$scope.videoPopup.close()
            services.getProfileVideo(function (resposne) {
                if (resposne.response_status == 1) {
                    $scope.videoPopup.close()
                    if (resposne.response_data.profile.length == 0) {
                        popups.showAlert('You have not uploaded any video!');
                        return
                    }
                    $scope.videoLink = $sce.trustAsResourceUrl(CONSTANTS.PROFILE_IMAGE_URL + resposne.response_data.profile[0].profile_video)
                    $ionicModal.fromTemplateUrl('views/custom_dialog/my_video_player.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(function (modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });
                }
            })
        }
        $scope.closeVideoPlayer = function () {
            $scope.modal.remove();
        }
    });
