angular.module('starter')
    .controller('SplashCtrl', function ($scope, $rootScope, $timeout, $ionicSideMenuDelegate, ChatMessages, CONSTANTS, ReqeustAcceptedFactory,
                                        $location, $ionicPush, AppointmentData, popups, $ionicHistory, services, $ionicPopup,
                                        LocationAlert, $ionicPlatform, LocationData, $cordovaGeolocation, $ionicLoading) {
        $ionicSideMenuDelegate.canDragContent(false);
        $ionicPush.register().then(function (t) {
            return $ionicPush.saveToken(t);
        }).then(function (t) {
            console.log('Token saved:', t.token);
        });
        /*$timeout(function () {

         var loggedIn = localStorage.getItem('login');
         if (!loggedIn) {
         $location.url('/login');
         } else {
         $location.url('/home');
         }
         }, 000);


         */
        //customer - NmFhZWU1MTg1YTIwMmQwOGQ2ZmY3NzEzYWVmNDVmZTk
        //cleaner - N2NhMTMwYmYyZGJkZjg4NzE2NWEyMjUzMTU5NTJlZmU
        LocationAlert.isLocationEnabled(function (enabled) {
            if (enabled) {
                getLocation()
            }
        });
        $ionicPlatform.ready(function () {
            document.addEventListener("resume", function () {
                LocationAlert.isLocationEnabled(function (enabled) {
                    if (enabled) {

                        //get the
                        getLocation()
                    }
                });
                console.log("The application is resuming from the background");
            }, false);
        });
        function getLocation() {
            if (LocationData.latitude != undefined) return
            $ionicLoading.show({
                template: 'Getting current location...'
            })
            var options = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                $ionicLoading.hide()
                //my lat lng factory
                LocationData.latitude = position.coords.latitude
                LocationData.longitude = position.coords.longitude
                console.log(position.coords.latitude)
                $timeout(function () {
                    var loggedIn = localStorage.getItem('login');
                    if (!loggedIn) {
                        $location.url('/login');
                    } else {
                        $location.url('/home');
                    }
                }, 000);
            });
        }

        $rootScope.$on('cloud:push:notification', function (event, data) {
                var msg = data.message;
                //$scope.showAlert(msg.title + ': ' + msg.text);
                console.log(msg);
                // When button is clicked, the popup will be shown...
                if (msg.payload != undefined) {
                    var action = msg.payload.action
                    if (action != undefined) {
                        switch (action) {
                            case 1:
                                //requst send by custoemr
                                AppointmentData.app_appointment_id = msg.payload.app_appointment_id
                                AppointmentData.profile_video = msg.payload.profile_video
                                $rootScope.payload = msg.payload;
                                $rootScope.cleaner_profile_pic = CONSTANTS.MECH_PROFILE_IMAGE_URL + msg.payload.profileImage;
                                //popups.requestAcceptedPopup($scope)
                                $rootScope.requestAcceptedPopup = $ionicPopup.show({
                                    templateUrl: 'views/custom_dialog/request_accepted.html',
                                    scope: $rootScope,
                                });
                                break
                            case 4:
                                //cleaner has arrived
                                popups.showAlert(msg.payload.message)
                                if ($ionicHistory.currentView().stateName != 'on_the_way') {
                                    $location.url('on_the_way/' + msg.payload.app_appointment_id);
                                }
                                $rootScope.mechOnWayViewTitle = 'Cleanosaur has arrived'
                                break
                            case 5:
                                //cleaner has completed his task
                                popups.showAlert(msg.payload.message)
                                $rootScope.reqeustCompetePayload = msg.payload;
                                $location.url('rate_mech/' + msg.payload.app_appointment_id);
                                break
                            case 13:
                                //chat message
                                console.log($ionicHistory.currentView())

                                if ($ionicHistory.currentView().stateName != 'chat_room') {
                                    $rootScope.messages = []
                                    ChatMessages.mobileNumber = undefined    //load all messages from the service

                                    services.getChatHistory(msg.payload.response_data.chat[0].app_appointment_id, function (response) {
                                        if (response.response_status == '1') {
                                            console.log(JSON.stringify(response.response_data.chat))
                                            ChatMessages.pushChatHistory(response.response_data.chat)
                                        }
                                        $location.url('chat_room/' + msg.payload.response_data.chat[0].app_appointment_id)
                                    })
                                } else {
                                    ChatMessages.pushNotificationChat(msg.payload.response_data.chat[0]);
                                    //$location.url('chat_room/' + msg.payload.response_data.chat[0].app_appointment_id)
                                }
                        }
                    }
                }
            }
        );
    });
