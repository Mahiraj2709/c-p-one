angular.module('starter')
    .controller('SignupCtrl', function ($scope, $rootScope, $ionicModal, $ionicPopup, GooglePlacesService, $cordovaCamera,$cordovaGeolocation,ImageFactory,
$cordovaOauth, $http, $ionicLoading, $cordovaFileTransfer, TermCondition,$ionicPush,LocationData,services,$timeout,
                                        $ionicSideMenuDelegate, $location, CONSTANTS) {

        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude
                var long = position.coords.longitude
                $scope.signupDetails.latitude = lat
                $scope.signupDetails.longitude = long

                //$scope.showAlert(lat + "  " + long);
            }, function (err) {
                // error
            });

        $ionicSideMenuDelegate.canDragContent(false);
        var userImage;
        //1 for user and 2 for car image default is 0
        $scope.signupDetails = {
            first_name: '',
            last_name: '',
            /*day: 'Day',
            month: 'Month',
            year: 'Year',*/
            day: '01',
            month: '01',
            year: '1970',
            email: '',
            password: '',
            device_token: 'ad',
            device_id: 'ad',
            device_type: CONSTANTS.deviceType(),
            mobile: '',
            latitude: '0.0',
            longitude: '0.0',
            language: 'en',
            address: undefined,
            reference_mode: '',
            quick_blox_id: '233',
            profile_pic: '',
            login_type: "0"
        };

        $scope.socialLogin = {
            email:undefined,
            device_id:$ionicPush._token.id,
            device_token:$ionicPush._token.token,
            device_type:CONSTANTS.deviceType(),
            first_name:undefined,
            last_name:undefined,
            login_type:undefined,
            latitude:LocationData.latitude,
            longitude:LocationData.longitude,
            language:'en',
            address:'no address',
            quick_blox_id:'34',
            reference_mode:undefined
        }


        //Loading in 
        $scope.showLoading = function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hideLoading = function () {
            $ionicLoading.hide();
        };
        // An alert dialog
        $scope.showAlert = function (message) {
            var alertPopup = $ionicPopup.alert({
                title: 'Attention!',
                template: message
            });
        };
        // When button is clicked, the popup will be shown...
        $scope.showPopup = function () {
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
        $scope.openTnC = function () {
            $ionicModal.fromTemplateUrl('views/signup/terms_n_condition.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };
        $scope.cancelTnC = function () {
            $scope.modal.hide();
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
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
                userImage = $scope.imgURI;
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
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
                userImage = $scope.imgURI;
            }, function (err) {
                // An error occured. Show a message to the user
            });
        }
        // facebook(string clientId, array appScope);
        //facebook login
        $scope.fbLogin = function () {
            // if (1 == 1) {
            //     $scope.showAlert("Comming soon!");
            //     return;
            // }
            $cordovaOauth.facebook(CONSTANTS.fbAppId, ["email", "public_profile"]).then(function (result) {
                $http.get("https://graph.facebook.com/v2.2/me", {
                    params: {
                        access_token: result.access_token,
                        fields: "id,email,name,gender,picture",
                        format: "json"
                    }
                }).then(function (result) {
                    //$scope.showAlert(JSON.stringify(result.data));

                    ImageFactory.getBase64FromImageUrl(result.data.picture.data.url).then(function (imageData) {
                        $timeout(function () {
                            $scope.imgURI = imageData;
                        },0)
                        //console.log($scope.imgURI)
                        //console.log(imageData)
                    });

                    $scope.signupDetails.login_type = '1';

                    $scope.signupDetails.email = result.data.email;

                    var name = result.data.name.split(' ');
                    $scope.signupDetails.first_name = name[0];
                    if(name[1] != undefined) {
                        $scope.signupDetails.last_name = name[1];
                    }else {
                        //$scope.signupDetails.last_name = 'na';
                    }
                    //$scope.signupDetails.reference_mode = 'na';


                    //$scope.profileData = ;
                }, function (error) {
                    //alert("There was a problem getting your profile.  Check the logs for details.");
                    $scope.showAlert(error);
                });
            }, function (error) {
                $scope.showAlert(error);
            });
        };
        //twitter login 
        //twitter(string consumerKey, string consumerSecretKey, object options);
        $scope.twitterLogin = function () {
            if (1 == 1) {
                $scope.showAlert("Comming soon!");
                return;
            }
            $cordovaOauth.twitter("F10TwLSYjuahegNC3T10FB75N", "paCiWQE8TXO9n1gq3jLFIgAmyJP1fj1BtaQsdCuAaAJpyVaZnY").then(function (result) {
                $scope.showAlert(JSON.stringify(result));
                $http.get("https://api.twitter.com/1.1/users/show.json?screen_name=" + result.screen_name).then(function (result) {
                    //$scope.showAlert(JSON.stringify(result));
                    $scope.signupDetails.login_type = "2";
                    $scope.signupDetails.name = result.data.name;
                    $scope.imgURI = result.data.picture.data.url;
                    //$scope.profileData = ;
                }, function (error) {
                    //alert("There was a problem getting your profile.  Check the logs for details.");
                    $scope.showAlert(error);
                });
            }, function (error) {
                $scope.showAlert(error);
            });
        };
        //instagram login
        $scope.instaLogin = function () {
            if (1 == 1) {
                $scope.showAlert("Comming soon!");
                return;
            }
            $cordovaOauth.instagram("06aa6a6fa2a1492d90cec199676c5420", ["basic", "comments", "relationships"]).then(function (result) {
                $scope.showAlert(JSON.stringify(result));
                $scope.signupDetails.login_type = "3";
            }, function (error) {
                $scope.showAlert(error);
            });
        };
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
            $scope.signupDetails.address = result.description;
            $scope.predictions = [];
        };
        //set dropdown through code in 
        $scope.dropDownData = {
            dates: ["Day", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            months: ["Month", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            years: ["Year"],
            info: "Date of birth is required"
        };
        var date = new Date();
        for (var i = date.getYear(); i >= 0; i--) {
            $scope.dropDownData.years.push(1900 + i);
        }
        var formdata = new FormData();
        //signup user 
        $scope.signupUser = function () {
            if (!$scope.signupDetails.first_name) {
                $scope.showAlert("First Name is required");
            } else if ($scope.signupDetails.first_name.length > 20) {
                $scope.showAlert("First Name is not valid!");
            } else if (!$scope.signupDetails.last_name) {
                $scope.showAlert("Last is required");
            } else if ($scope.signupDetails.last_name.length > 20) {
                $scope.showAlert("Last Name is not valid!");
            }else if ($scope.signupDetails.day == "Day") {
                $scope.showAlert("Date is required");
            } else if ($scope.signupDetails.month == "Month") {
                $scope.showAlert("Month is required");
            } else if ($scope.signupDetails.year == "Year") {
                $scope.showAlert("Year is required");
            } else if (!$scope.signupDetails.email) {
                $scope.showAlert("Email Id is required");
            } else if (!CONSTANTS.validEmail($scope.signupDetails.email)) {
                $scope.showAlert("Email Id is not valid");
            } else if (!$scope.signupDetails.mobile) {
                $scope.showAlert("Phone number is required");
            }
            else if (!CONSTANTS.validPhoneNo($scope.signupDetails.mobile)) {
                $scope.showAlert("Phone number is not valid");
            }
            else if (!$scope.signupDetails.address) {
                $scope.showAlert("Address is required");
            }
            else if (!$scope.signupDetails.password) {
                $scope.showAlert("Password is required");
            } else if ($scope.signupDetails.password.length < 6) {
                $scope.showAlert("Password length should be minimum 6");
            } else if (!$scope.signupDetails.reference_mode) {
                $scope.showAlert("Please select your behaviour");
            } else if (!$scope.termAndCondition) {
                $scope.showAlert("Please accept terms and condtions");
            } else {
                //call signup api
                $scope.signupDetails.device_token = $ionicPush._token.token;
                $scope.signupDetails.device_id = $ionicPush._token.id;
                for (var key in $scope.signupDetails) {
                    if (key == "profile_pic") {
                        //userImage = getBase64Image(document.getElementById("profile_pic"));
                        if(userImage != undefined) {
                            formdata.append(key, dataURItoBlob(userImage), 'sdfsdf' + '.jpeg');
                        }
                        if (!String(userImage)) {
                        }
                    }
                    else {
                        formdata.append(key, $scope.signupDetails[key]);
                    }
                    //formdata.append(key, $scope.signupDetails[key]);
                }
                //check for internet connection
                $scope.showLoading();
                $scope.makeRequest();
            }
        };
        // NOW UPLOAD THE FILES.
        $scope.makeRequest = function () {
            var request = {
                method: 'POST',
                url: CONSTANTS.BASE_URL + 'signup',
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
                    if (d.response_status == "1") {
                        //clear user data
                        $scope.signupDetails.first_name = undefined
                        $scope.signupDetails.last_name = undefined
                        $scope.signupDetails.day = "Day"
                        $scope.signupDetails.month = "Month"
                        $scope.signupDetails.year = "Year"
                        $scope.signupDetails.email = undefined
                        $scope.signupDetails.password = undefined
                        $scope.signupDetails.mobile = undefined
                        $scope.signupDetails.reference_mode = undefined
                        $scope.signupDetails.profile_pic = undefined
                        $scope.signupDetails.login_type = undefined
                        $scope.signupDetails.address = undefined
                        $scope.termAndCondition = undefined
                        $scope.imgURI = undefined;
                        userImage = undefined
                        window.localStorage.setItem("profile", JSON.stringify(d.response_data.user_info));
                        window.localStorage.setItem("sess_tok", d.response_data.sess_tok);
                        window.localStorage.setItem("login", true);
                        $rootScope.userDetail = JSON.parse(window.localStorage.getItem("profile"));
                        $rootScope.profile_pic = CONSTANTS.PROFILE_IMAGE_URL + $rootScope.userDetail.profile_pic;
                        //if 1 show skip else not
                        $location.url("payment/"+0);
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

        // get base64 string from image url
        function getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/jpeg");
            return dataURL;
        }

        $scope.showCurrentIcon = true;
        $scope.loadTermCondition = function () {
            TermCondition.getTermCondition(function (data) {

            });
        };
    });