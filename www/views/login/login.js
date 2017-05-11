angular.module('starter')
    .controller('LoginCtrl', function ($scope, $rootScope, $ionicPopup, $http, $ionicLoading, $ionicPush, $timeout,LocationData,services,$ionicHistory,$twitterApi,
                                       $cordovaGeolocation, $cordovaOauth, $ionicViewService, $location, $ionicSideMenuDelegate, CONSTANTS) {
        $ionicViewService.clearHistory();
        $ionicSideMenuDelegate.canDragContent(false);
        /*var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude
                var long = position.coords.longitude
                $scope.loginDetails.latitude = lat
                $scope.loginDetails.longitude = long
                //$scope.showAlert(lat + "  " + long);
            }, function (err) {
                // error
            });
 */       $scope.loginDetails = {
            email: '',
            password: '',
            device_type: CONSTANTS.deviceType(),
            device_token:'na',
            device_id: 'na',
            latitude: LocationData.latitude,
            longitude: LocationData.longitude,
            language: 'en'
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
        // An alert dialog
        $scope.showAlert = function (message) {
            var alertPopup = $ionicPopup.alert({
                title: 'Attention!',
                template: message
            });
        };
        // facebook(string clientId, array appScope);
        //facebook login
        $scope.fbLogin = function () {
            $cordovaOauth.facebook(CONSTANTS.fbAppId, ["email", "public_profile"]).then(function (result) {
                $http.get("https://graph.facebook.com/v2.2/me", {
                    params: {
                        access_token: result.access_token,
                        fields: "id,email,name,gender,picture",
                        format: "json"
                    }
                }).then(function (result) {
                    //$scope.showAlert(JSON.stringify(result.data));
                    //$scope.profileData = ;
                    socialLogin(result.data.id);
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
            $cordovaOauth.twitter("F10TwLSYjuahegNC3T10FB75N", "paCiWQE8TXO9n1gq3jLFIgAmyJP1fj1BtaQsdCuAaAJpyVaZnY").then(function (result) {
                $twitterApi.configure('F10TwLSYjuahegNC3T10FB75N', 'paCiWQE8TXO9n1gq3jLFIgAmyJP1fj1BtaQsdCuAaAJpyVaZnY', result);
                $twitterApi.getUserDetails(result.user_id).then(function(result) {
                    console.log(result)
                    socialLogin(result.id)
                });
            }, function (error) {
                //alert("There was a problem getting your profile.  Check the logs for details.");
                $scope.showAlert(error);
            })
                , function (error) {
                $scope.showAlert(error);
            }
        };
        //instagram login
        $scope.instaLogin = function () {
            $cordovaOauth.instagram("06aa6a6fa2a1492d90cec199676c5420", ["basic", "comments", "relationships"]).then(function (result) {
                services.getInstagramData(result.access_token, function (response) {
                    socialLogin(response.data.id)
                })
            }, function (error) {
                $scope.showAlert(error);
            });
        };
        var formdata = new FormData();
        $scope.loginUser = function () {
            if (!$scope.loginDetails.email) {
                $scope.showAlert("User Id is required");
            } else if (!CONSTANTS.validEmail($scope.loginDetails.email)) {
                $scope.showAlert("User Id is an email");
            } else if (!$scope.loginDetails.password) {
                $scope.showAlert("Password is required");
            } else if ($scope.loginDetails.password.length < 6) {
                $scope.showAlert("Password length should be minimum 6");
            } else {
                $scope.loginDetails.device_token = $ionicPush._token.token;
                $scope.loginDetails.device_id = $ionicPush._token.id;
                //call login api
                for (var key in $scope.loginDetails) {
                    formdata.append(key, $scope.loginDetails[key]);
                }

                $scope.showLoading();
                $scope.makeRequest();
//                console.log($scope.loginDetails)
            }
        };
        // NOW UPLOAD THE FILES.
        $scope.makeRequest = function () {
            var request = {
                method: 'POST',
                url: CONSTANTS.BASE_URL + 'login',
                data: formdata,
                headers: {
                    'Content-Type': undefined
                }
            };
            // SEND THE FILES.
            $http(request)
                .success(function (d) {
                    $scope.hideLoading();
                    console.log(d);
                    if (d.response_status == "1") {
                        //clear the user data
                        $scope.loginDetails.email = undefined
                        $scope.loginDetails.password = undefined
                        window.localStorage.setItem("profile", JSON.stringify(d.response_data.profile));
                        window.localStorage.setItem("login", true);
                        window.localStorage.setItem("sess_tok", d.response_data.session_token);
                        $rootScope.userDetail = JSON.parse(window.localStorage.getItem("profile"));
                        $rootScope.profile_pic = CONSTANTS.PROFILE_IMAGE_URL + $rootScope.userDetail.profile_pic;
                        $location.path('home');
                    } else {
                        $scope.showAlert(d.response_msg);
                    }
                })
                .error(function (err) {
                    $scope.hideLoading();
                    console.log(err);
                });
        };

        function socialLogin(profile_id) {
            var user = {
                social_user_id: profile_id,
                device_id: $ionicPush._token.id,
                device_token: $ionicPush._token.token,
                device_type: CONSTANTS.deviceType(),
                latitude: LocationData.latitude,
                longitude: LocationData.longitude,
                language: 'en',
            }
            console.log(user)
            $scope.showLoading();
            services.socialLogin(user, function (response) {
                $scope.hideLoading();
                if (response.response_status == '1') {
                    window.localStorage.setItem("profile", JSON.stringify(response.response_data.user_info));
                    window.localStorage.setItem("login", true);
                    window.localStorage.setItem("sess_tok", response.response_data.session_token);
                    $rootScope.userDetail = JSON.parse(window.localStorage.getItem("profile"));
                    $rootScope.profile_pic = CONSTANTS.PROFILE_IMAGE_URL + $rootScope.userDetail.profile_pic;
                    $location.path('home');
                } else {
                    //show error message
                    $scope.showAlert(response.response_msg);
                }
            })
        }

        $scope.openPlayStore = function () {
          if(ionic.Platform.isIOS()){
            cordova.InAppBrowser.open('https://itunes.apple.com/us/app/cleanosaur-pro/id1234141195?ls=1&mt=8', '_system', 'location=yes');
          }
          else {
            cordova.InAppBrowser.open('https://play.google.com/store/apps/details?id=com.cleanosaur.service', '_system', 'location=yes');
          }
        }

    });
