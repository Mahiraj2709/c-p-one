/**
 * Created by admin on 1/20/2017.
 */
angular.module('starter')
    .controller('OnTheWayCtrl', function ($scope, AppointmentService, $stateParams,CONSTANTS ,LocationData,$ionicPopup,$location) {

        console.log('on the way'+$stateParams.appointment_id)
        $scope.openChat = function () {
            $location.url('chat_room/'+$stateParams.appointment_id);
        }
        AppointmentService.getAppointmentDetails($stateParams.appointment_id, function (appointmentData) {

                $scope.profileImage =CONSTANTS.MECH_PROFILE_IMAGE_URL + appointmentData.cleaner_pic;
                 $scope.cleanerData = appointmentData;

                 cleaner_id = appointmentData.cleaner_id;

                 $scope.requestId = "REQUEST ID-"+ appointmentData.app_appointment_id;
                //make appointment data availabe to the on the way screen
                //AppointmentData.appointment = customerData;*/
            onChangeHandler();
            });
            //show map
            var mapOptions = {
                center: new google.maps.LatLng(42.2901715, -89.0730158),
                zoom: 15,
                disableDefaultUI: true, // a way to quickly hide all controls
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $scope.on_way_map = new google.maps.Map(document.getElementById("on_way_map"), mapOptions);
            //draw path on the map
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer({
                suppressMarkers: true
            });
            directionsDisplay.setMap($scope.on_way_map);
            var onChangeHandler = function () {
                calculateAndDisplayRoute(directionsService, directionsDisplay);
            };
            /*document.getElementById('start').addEventListener('change', onChangeHandler);
             document.getElementById('end').addEventListener('change', onChangeHandler);*/
            var markerA = new google.maps.MarkerImage('img/mapcar-icon.png',
                new google.maps.Size(40, 40));
            var markerB = new google.maps.MarkerImage('img/map-marker.png',
                new google.maps.Size(40, 40));

            function calculateAndDisplayRoute(directionsService, directionsDisplay) {
                directionsService.route({
                    origin: new google.maps.LatLng(LocationData.latitude, LocationData.longitude),
                    destination: new google.maps.LatLng($scope.cleanerData.customer_latitude, $scope.cleanerData.customer_longitude),
                    travelMode: 'DRIVING'
                }, function (response, status) {
                    if (status === 'OK') {
                        directionsDisplay.setDirections(response);
                        var _route = response.routes[0].legs[0];
                        pinA = new google.maps.Marker({
                            position: _route.start_location,
                            map: $scope.on_way_map,
                            icon: markerA
                        });
                        pinB = new google.maps.Marker({
                            position: _route.end_location,
                            map: $scope.on_way_map,
                            icon: markerB
                        });
                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
                });
            }

            //onChangeHandler();
            $scope.CallNumber = function () {

                if($scope.cleanerData == undefined) return
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
    }
    )