/**
 * Created by admin on 1/20/2017.
 */
angular.module('starter')
    .controller('OnTheWayCtrl', function ($scope, AppointmentService, $stateParams, CONSTANTS, LocationData, AppointmentData, services,
                                          OnWayService, $ionicPopup, $location, $rootScope, popups, $ionicHistory, $interval,ChatMessages) {

        function getCleanerRating(cleanerId) {
            services.getCleanerFeedback($stateParams.cleaner_id,function (response) {
                if(response.response_status == '1') {
                    $scope.cleanerFeedback = response.response_data.rating;
                }
            })
        }

        var markerA = new google.maps.MarkerImage('img/mapcar-icon.png',
                new google.maps.Size(40, 40));
            var markerB = new google.maps.MarkerImage('img/map-marker.png',
                new google.maps.Size(40, 40));
            console.log('on the way' + $stateParams.appointment_id)
            $scope.cancelRequestData = {
                app_appointment_id: $stateParams.appointment_id,
                cancel_status: undefined,
                request_date: undefined,
                explain_reason: undefined,
                checkValue: undefined
            }
            // An alert dialog
            $scope.showAlert = function (message) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Attention!',
                    template: message
                });
            };
            $scope.openChat = function () {
                ChatMessages.mobileNumber = $scope.cleanerData.mobile
                services.getChatHistory($stateParams.appointment_id, function (response) {
                    if (response.response_status == '1') {
                        ChatMessages.pushChatHistory(response.response_data.chat)
                    }
                    $location.url('chat_room/' + $stateParams.appointment_id)
                })
            }
            AppointmentService.getAppointmentDetails($stateParams.appointment_id, function (appointmentData) {
                $scope.profileImage = CONSTANTS.MECH_PROFILE_IMAGE_URL + appointmentData.cleaner_pic;
                $scope.cleanerData = appointmentData;
                cleaner_id = appointmentData.cleaner_id; getCleanerRating(cleaner_id)
                $scope.requestId = "REQUEST ID-" + appointmentData.app_appointment_id;
                $scope.cancelRequestData.request_date = appointmentData.appointment_date
                //make appointment data availabe to the on the way screen
                //AppointmentData.appointment = customerData;*/
                onChangeHandler();
                OnWayService.getDistanceMatrix(new google.maps.LatLng(LocationData.latitude, LocationData.longitude),
                    new google.maps.LatLng($scope.cleanerData.customer_latitude, $scope.cleanerData.customer_longitude),
                    function (response) {
                        if (response != undefined) {
                            //distansc is
                            $scope.distance = response.rows[0].elements[0].distance.value;
                            $scope.duration = response.rows[0].elements[0].duration.value;
                        }
                    })
            });
            //show map
            var mapOptions = {
                center: new google.maps.LatLng(42.2901715, -89.0730158),
                zoom: 15,
                disableDefaultUI: true, // a way to quickly hide all controls
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $scope.on_way_map = new google.maps.Map(document.getElementById("on_way_map"), mapOptions);
            var pinA = new google.maps.Marker({
                //position: _route.start_location,
                map: $scope.on_way_map,
                icon: markerA
            });
            var pinB = new google.maps.Marker({
                //position: _route.end_location,
                map: $scope.on_way_map,
                icon: markerB
            });
            //draw path on the map
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer({
                suppressMarkers: true
            });
            directionsDisplay.setMap($scope.on_way_map);
            var onChangeHandler = function () {
                calculateAndDisplayRoute(directionsService, directionsDisplay, {
                    myLatitude: LocationData.latitude,
                    myLongitude: LocationData.longitude
                });
            };
            /*document.getElementById('start').addEventListener('change', onChangeHandler);
             document.getElementById('end').addEventListener('change', onChangeHandler);*/
            var markerA = new google.maps.MarkerImage('img/mapcar-icon.png',
                new google.maps.Size(40, 40));
            var markerB = new google.maps.MarkerImage('img/map-marker.png',
                new google.maps.Size(40, 40));

            function calculateAndDisplayRoute(directionsService, directionsDisplay, LatLng) {
                directionsService.route({
                    origin: new google.maps.LatLng(LatLng.myLatitude, LatLng.myLongitude),
                    destination: new google.maps.LatLng($scope.cleanerData.customer_latitude, $scope.cleanerData.customer_longitude),
                    travelMode: 'DRIVING'
                }, function (response, status) {
                    if (status === 'OK') {
                        directionsDisplay.setDirections(response);
                        var _route = response.routes[0].legs[0];
                        pinA.setPosition(_route.start_location)
                        //markers[0].icon = markerA
                        pinB.setPosition(_route.end_location)
                    } else {
                        //window.alert('Directions request failed due to ' + status);
                    }
                });
            }

            //onChangeHandler();
            $scope.CallNumber = function () {
                if ($scope.cleanerData == undefined) return
                window.plugins.CallNumber.callNumber(function () {
                    //success logic goes here
                }, function () {
                    //error logic goes here
                }, $scope.cleanerData.cleaner_mobile)
            };
            // cancel request popup
            $scope.showCancelRequestPopup = function () {
                $scope.data = {}
                // Custom popup
                $scope.myPopup = $ionicPopup.show({
                    templateUrl: 'views/custom_dialog/cancel_request_dialog.html',
                    scope: $scope,
                });
            };
            //scope close the pop-up on cancel icon clicked
            $scope.cancelCancelRequestPopup = function () {
                $scope.myPopup.close();
            }
            $scope.cancelRequest = function () {
                if ($scope.cancelRequestData.cancel_status == undefined) {
                    $scope.showAlert('Please choose reason!')
                    return
                } else if (($scope.cancelRequestData.explain_reason == undefined || $scope.cancelRequestData.explain_reason == '')) {
                    $scope.showAlert('Please explain reason!')
                    return
                } else {
                    OnWayService.cancelRequest($scope.cancelRequestData, function (response) {
                        $scope.myPopup.close();
                        $scope.showAlert(response.response_msg)
                        if (response.response_status == '1') {
                            $ionicHistory.clearCache().then(function () {
                                $location.url('/home');
                            });
                        }
                    })
                }
            }

            //Timer start function.
            function StartTimer() {
                //Initialize the Timer to run every 1000 milliseconds i.e. one second.
                $scope.Timer = $interval(function () {
                    //Display the current time.
                    services.getCleanerLocation({
                        app_appointment_id: $stateParams.appointment_id,
                        status: '5'
                    }, function (response) {
                        if (response.response_status == '1') {
                            calculateAndDisplayRoute(directionsService, directionsDisplay, {
                                myLatitude: response.response_data.appointment.cleaner_latitude,
                                myLongitude: response.response_data.appointment.cleaner_latitude
                            });
                        }
                    })
                }, 5 * 60 * 1000);
            };

            $scope.$on("$ionicView.beforeLeave", function (event, data) {
                console.log("leavidcdng view")
                if ($scope.Timer != undefined) {
                    $interval.cancel($scope.Timer);
                }
            });

            StartTimer();
            $scope.showAppointment = function () {
                $scope.appoimentPopup = $ionicPopup.show({
                    templateUrl: 'views/custom_dialog/appointment_popup.html',
                    scope: $scope,
                });
            }
            $scope.hideAppointmentPopup = function () {
                $scope.appoimentPopup.close()
            }
        }
    ).service('OnWayService', function ($ionicLoading, $http, CONSTANTS) {
    this.cancelRequest = function (cancelData, callback) {
        console.log(JSON.stringify(cancelData))
        $ionicLoading.show({
            template: 'Loading...'
        });
        var formdata = new FormData();
        formdata.append("device_type", CONSTANTS.deviceType());
        formdata.append('session_token', window.localStorage.getItem("sess_tok"));
        formdata.append("language", "en");
        formdata.append("app_appointment_id", cancelData.app_appointment_id);
        formdata.append("cancel_status", cancelData.cancel_status);
        formdata.append("request_date", cancelData.request_date);
        formdata.append("explain_reason", cancelData.explain_reason);
        formdata.append("user_timezone", 'Asia/Calcutta');
        console.log(formdata);
        var request = {
            method: 'POST',
            url: CONSTANTS.BASE_URL + 'cancelrequest',
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
                console.log(d)
                callback(d)
            })
            .error(function (err) {
                $ionicLoading.hide();
            });
    }
    this.getDistanceMatrix = function (origin, destination, callback) {
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: 'DRIVING',
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            }, function (response, status) {
                if (status !== 'OK') {
                    alert('Error was: ' + status);
                } else {
                    //console.log(response.rows)
                    callback(response)
                }
            });
    }
})
