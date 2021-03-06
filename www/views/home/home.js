angular.module('starter')
    .controller('HomeCtrl', function ($scope, $rootScope, $ionicPopup, $http, GooglePlacesService, $timeout, SearchCleaner, LocationData, $ionicHistory,AppointmentData,
                                      $ionicLoading, $cordovaGeolocation, $location, $ionicSideMenuDelegate, $ionicViewService, services, CONSTANTS) {

      //ionic.Platform.fullscreen();
      services.getRating(function (response) {
            if (response.response_status == '1') {
                $rootScope.feedback = response.response_data.rating;
            }else {
                if(response.response_key == KEY_SESSION_OUT) {
                    //session does not exit now move to the login screen
                    clearAllUserData();
                    $ionicHistory.clearCache().then(function () {
                        for (var prop in $rootScope) {
                            if (prop.substring(0,1) !== '$') {
                                delete $rootScope[prop];
                            }
                        }
                        $location.path('login');
                    })
                }else {
                    $scope.showAlert(d.response_msg);
                }
            }
        })
        var formdata = new FormData();
        var cleanerIds = '';
        $ionicViewService.clearHistory();
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
        $scope.$on('$ionicView.enter', function () {
            // Anything you can think of
            console.log($ionicHistory.viewHistory());
            //load the modal again we come from customer profile view
            if ($ionicHistory.viewHistory().forwardView.stateName == 'mech_profile') {
                //show the modal agian
            }
        });
        $scope.user = {
            address: undefined
        };
        $rootScope.userDetail = JSON.parse(window.localStorage.getItem("profile"));
        console.log($rootScope.userDetail)
        $rootScope.profile_pic = CONSTANTS.PROFILE_IMAGE_URL + $rootScope.userDetail.profile_pic;
        //show logout popup
        // A confirm dialogF
        $rootScope.confirmLogout = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Logout',
                template: 'Are you sure you want logout?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    formdata.append("device_type", CONSTANTS.deviceType());
                    formdata.append("session_token", window.localStorage.getItem("sess_tok"))
                    formdata.append("language", "en")
                    $ionicSideMenuDelegate.toggleLeft();
                    logoutRequest();
                } else {
                    console.log('You are not sure');
                }
            });
        };
        $rootScope.closeSideMenu = function () {
            $ionicSideMenuDelegate.toggleLeft()
        };
        var mapOptions = {
            center: new google.maps.LatLng(LocationData.latitude, LocationData.longitude),
//            center: new google.maps.LatLng(43.07493, -89.381388),
            zoom: 13,
            disableDefaultUI: true, // a way to quickly hide all controls
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        //related to the home screen
        var options = {timeout: 10000, enableHighAccuracy: true};
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
            LocationData.latitude = position.coords.latitude;
            LocationData.longitude = position.coords.longitude
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            $scope.map.panTo(latLng);
        }, function (error) {
            console.log("Could not get location");
        });
        //call logout
        var logoutRequest = function () {
            $scope.showLoading();
            var request = {
                method: 'POST',
                url: CONSTANTS.BASE_URL + 'logout',
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
                        window.localStorage.removeItem("porfile");
                        window.localStorage.removeItem("login");
                        window.localStorage.removeItem("sess_tok");
                        $location.path('login');
                    } else {
                        if(d.response_key == KEY_SESSION_OUT) {
                            //session does not exit now move to the login screen
                            clearAllUserData();
                            $ionicHistory.clearCache().then(function () {
                                for (var prop in $rootScope) {
                                    if (prop.substring(0,1) !== '$') {
                                        delete $rootScope[prop];
                                    }
                                }
                                $location.path('login');
                            })
                        }else {
                            $scope.showAlert(d.response_msg);
                        }
                    }
                })
                .error(function (err) {
                    $scope.hideLoading();
                    console.log(err);
                    $scope.showAlert(err);
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
            $scope.user.address = result.description;
            $scope.predictions = [];
            GooglePlacesService.getLatLng(result.place_id)
                .then(function (result_location) {
                    // Now we are able to search restaurants near this location
                    $scope.map.panTo(result_location);
                });
        };
        //clear all address on tap
        $scope.clearAll = function () {
            $scope.user.address = ' ';
        }
        $scope.clearIcon = false;
        $scope.showCurrentIcon = true;
        var markers = [];
        var circles = [];
        //idle event lister
        google.maps.event.addListener($scope.map, 'idle', function () {
            //don't load the address if user has focus on the textfield
            if ($scope.clearIcon) {
                return;
            }
            //clear all marker
            clearMap()
            //add marker for the center of the map
            // Create marker
            var centerMarker = new google.maps.Marker({
                map: $scope.map,
                position: $scope.map.getCenter(),
                //title: 'Some location',
                icon: {
                    url: 'img/map-marker.png',
                    size: new google.maps.Size(40, 40),
                    /*origin: new google.maps.Point(0, 0),
                     anchor: new google.maps.Point(0, 0)*/
                }
            });
// Add circle overlay and bind to marker
            var circle = new google.maps.Circle({
                map: $scope.map,
                radius: 1200,
                strokeWeight: 0,
                fillColor: '#adadad'
            });
            circle.bindTo('center', centerMarker, 'position');
            addCircle(circle);
            //another circle
            var outerCirle = new google.maps.Circle({
                map: $scope.map,
                radius: 2400,
                strokeWeight: 0,
                fillColor: '#ADADAD'
            });
            outerCirle.bindTo('center', centerMarker, 'position');
            addMarker(centerMarker);
            addCircle(outerCirle);
            /*GooglePlacesService.getAddress($scope.map.getCenter(), function (address) {
             $timeout(function () {
             $scope.user.address = address.address_components[0].long_name + ", " + address.address_components[1].long_name;
             }, 000);
             console.log(address.address_components[0].long_name + ", " + address.address_components[1].long_name);
             });*/
            SearchCleaner.searchNearbyCleaner($scope.map.getCenter(), $scope.user.address, function (cleanerArray) {
                //console.log(cleanerArray);
                //clear map
                //$scope.map.clear();
                window.cleanerIds = '';
                for (var i = 0; i < cleanerArray.length; i++) {
                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        // draggable:true,
                        // animation: google.maps.Animation.DROP,
                        position: new google.maps.LatLng(cleanerArray[i].current_latitude, cleanerArray[i].current_longitude),
                        icon: {
                            url: 'img/mapcar-icon.png',
                            size: new google.maps.Size(40, 40)
                        }
                    });
                    addMarker(marker);
                    window.cleanerIds = window.cleanerIds + "," + cleanerArray[i].cleaner_id;
                }
                if (window.cleanerIds.length > 0) {
                    window.cleanerIds = window.cleanerIds.substr(1, window.cleanerIds.length)
                }
                $rootScope.cleanerIds = window.cleanerIds;
                //$scope.map.markers.push(marker);
            })
        });
        //refresh map everytime when home screen resumes
        document.addEventListener("resume", function () {
            google.maps.event.trigger($scope.map, 'resize');
        })
        // Adds a marker to the map and push to the array.
        function addMarker(marker) {
            console.log("marker pushed")
            markers.push(marker);
        }

        function addCircle(circle) {
            circles.push(circle);
        }

        // Sets the map on all markers in the array.
        function setMapOnAllMarkder(map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }

        function setMapOnAllCircles(map) {
            for (var i = 0; i < circles.length; i++) {
                circles[i].setMap(map);
            }
        }

        // Removes the markers from the map, but keeps them in the array.
        function clearMap() {
            setMapOnAllMarkder(null);
            setMapOnAllCircles(null);
        }

        $scope.sendRequest = function () {
            //send request
            /*$location.path('rate_mech/' + '392');
             return*/
            if ($scope.user.address == undefined || $scope.user.address == '') {
                $scope.showAlert('Please select address')
                return
            }
            $location.path('request_detail/' + $scope.user.address);
        }
        //scope close the pop-up on cancel icon clicked
        $scope.closePopUp = function () {
            $scope.myPopup.close();
        }


    //dummy to test cancel button not working i.e. request accepted popup
      testReqAccept()
      function testReqAccept(){
        var msg = {}
          msg.payload = {
        userLName:"Gupta",
          user_type:"2",
          cleaner_id:"236",
          profile_video:"e6d83006b779949ffbb843a6b12138dd.MOV",
          action:1,
          cleaner_avg_rating:3,
          profileImage:"67efdb74b6a60587613eabe451f73045.jpeg",
          customer_id:"107",
          message:"Ankit Gupta Cleaner Accept Request send by you to clean Home",
          userFName:"Ankit",
          app_appointment_id:"1176",
          deviceToken:"c1WuOygm58o:APA91bFMqJTui3eoTkB640ziuGzjKI99iP7r1B8aqzDQm5FJzaX2S4UgG38spjgPdLBd8y-WJ12Jc1lMKn8WtRjn47fT47Vhn-V2FTOgIuROvq5g5PcCKy6PrVTcg3NlKzMjU0UoL7cC"
      }
        //requst send by custoemr
        AppointmentData.app_appointment_id = msg.payload.app_appointment_id
        AppointmentData.profile_video = msg.payload.profile_video
        AppointmentData.cleaner_avg_rating = msg.payload.cleaner_avg_rating
        $rootScope.payload = msg.payload;
        $rootScope.cleaner_profile_pic = CONSTANTS.MECH_PROFILE_IMAGE_URL + msg.payload.profileImage;
        //popups.requestAcceptedPopup($scope)
        $rootScope.requestAcceptedPopup = $ionicPopup.show({
          templateUrl: 'views/custom_dialog/request_accepted.html',
          scope: $scope,
        });
      }

    });
