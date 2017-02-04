/**
 * Created by admin on 1/5/2017.
 */
angular.module('starter')
    .controller('ChatCtrl', function ($scope,$rootScope,CONSTANTS, $timeout, $ionicScrollDelegate,ChatService,$stateParams) {
        $rootScope.profile_pic = CONSTANTS.PROFILE_IMAGE_URL + $rootScope.userDetail.profile_pic;
        $scope.hideTime = true;
        console.log($stateParams.appointment_id);
        var alternate,
            isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
        $scope.sendMessage = function () {
            alternate = !alternate;
            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
            ChatService.sendMessage($scope.data.message,$stateParams.appointment_id);
            $scope.messages.push({
                userId: '12345',
                text: $scope.data.message,
                customer_profile_pic: $rootScope.profile_pic,
                f_name:$rootScope.userDetail.first_name,
                l_name:$rootScope.userDetail.last_name,
                created_dt:'',
                time: d
            });
            delete $scope.data.message;
            $ionicScrollDelegate.scrollBottom(true);
        };
        $scope.inputUp = function () {
            if (isIOS) $scope.data.keyboardHeight = 216;
            $timeout(function () {
                $ionicScrollDelegate.scrollBottom(true);
            }, 300);
        };
        $scope.inputDown = function () {
            if (isIOS) $scope.data.keyboardHeight = 0;
            $ionicScrollDelegate.resize();
        };
        $scope.closeKeyboard = function () {
            // cordova.plugins.Keyboard.close();
        };
        $scope.data = {};
        $scope.myId = '12345';
        $scope.messages = [];


        function pushMessage(chat) {
            console.log(chat)
            console.log($scope.messages)
            $scope.messages.push({
                userId: '54321',
                text: chat.message,
                customer_profile_pic:CONSTANTS.MECH_PROFILE_IMAGE_URL  + chat.customer_profile_pic,
                created_dt:chat.created_dt,
                f_name:chat.customer_fname,
                l_name:chat.customer_lname,
                time: '323'
            });
            $timeout(function () {
                $ionicScrollDelegate.scrollBottom(true);
            }, 100);
        }

        $scope.$on('cloud:push:notification', function (event, data) {
            var msg = data.message;
            //$scope.showAlert(msg.title + ': ' + msg.text);
            console.log(msg);
            // When button is clicked, the popup will be shown...
            if (msg.payload != undefined) {
                pushMessage(msg.payload.response_data.chat[0]);
                //pushMessage(msg.payload.response_data.chat[0]);
                if ($scope.payload == undefined) {
                    $scope.payload = msg.payload;
                    //$scope.openTnC();
                } else if ($scope.payload.response_data.chat[0].app_appointment_id != msg.payload.response_data.chat[0].app_appointment_id) {
                    //if(msg.payload.)
                    $scope.payload = msg.payload;
                    if(msg.paload.action != undefined && msg.paload.action == '13') {
                        pushMessage(msg.payload.response_data.chat[0]);
                    }

                    //$scope.openTnC();
                }
            }
        });

    })
    .directive('input', function($timeout) {
        return {
            restrict: 'E',
            scope: {
                'returnClose': '=',
                'onReturn': '&',
                'onFocus': '&',
                'onBlur': '&'
            },
            link: function(scope, element, attr) {
                element.bind('focus', function(e) {
                    if (scope.onFocus) {
                        $timeout(function() {
                            scope.onFocus();
                        });
                    }
                });
                element.bind('blur', function(e) {
                    if (scope.onBlur) {
                        $timeout(function() {
                            scope.onBlur();
                        });
                    }
                });
                element.bind('keydown', function(e) {
                    if (e.which == 13) {
                        if (scope.returnClose) element[0].blur();
                        if (scope.onReturn) {
                            $timeout(function() {
                                scope.onReturn();
                            });
                        }
                    }
                });
            }
        }
    })
    .service('ChatService',function (CONSTANTS, $http) {
        this.sendMessage = function (message,appointment_id) {
            var formdata = new FormData();
            formdata.append('device_type', CONSTANTS.deviceType());
            formdata.append('session_token', window.localStorage.getItem("sess_tok"));
            formdata.append('chat_message', message);
            formdata.append('app_appointment_id', appointment_id);
            formdata.append('language', 'en');
            var request = {
                method: 'POST',
                url: CONSTANTS.BASE_URL + 'appointmentchat',
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
                    console.log(d)
                    if (d.response_status == "1") {

                    } else {
                        //$scope.showAlert(d.response_msg);
                    }
                })
                .error(function (err) {
                    /*$scope.hideLoading();*/
                    console.log(err);
//                    $scope.showAlert(err);
                });
        }
    });

