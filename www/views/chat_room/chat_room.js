/**
 * Created by admin on 1/5/2017.
 */
angular.module('starter')
    .controller('ChatCtrl', function ($scope, $rootScope, CONSTANTS, $timeout, services,
                                      $ionicScrollDelegate, ChatMessages, $stateParams) {
        $rootScope.profile_pic = CONSTANTS.PROFILE_IMAGE_URL + $rootScope.userDetail.profile_pic;
        $scope.hideTime = true;
        console.log($stateParams.appointment_id);
        var alternate,
            isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
        $scope.sendMessage = function () {
            var d = new Date();
            d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
            services.sendMessage($scope.data.message, $stateParams.appointment_id);
            ChatMessages.pushChat({
                userType: '1',
                text: $scope.data.message,
                profile_pic: $rootScope.profile_pic,
                fname: $rootScope.userDetail.first_name,
                lname: $rootScope.userDetail.last_name,
                created_dt: '',
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
        $scope.messages = ChatMessages.messages;
    })
    .directive('input', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                'returnClose': '=',
                'onReturn': '&',
                'onFocus': '&',
                'onBlur': '&'
            },
            link: function (scope, element, attr) {
                element.bind('focus', function (e) {
                    if (scope.onFocus) {
                        $timeout(function () {
                            scope.onFocus();
                        });
                    }
                });
                element.bind('blur', function (e) {
                    if (scope.onBlur) {
                        $timeout(function () {
                            scope.onBlur();
                        });
                    }
                });
                element.bind('keydown', function (e) {
                    if (e.which == 13) {
                        if (scope.returnClose) element[0].blur();
                        if (scope.onReturn) {
                            $timeout(function () {
                                scope.onReturn();
                            });
                        }
                    }
                });
            }
        }
    })
    .factory('ChatMessages', function ($http, CONSTANTS) {

        var messages = [];

        function pushMyChat(chat) {
            this.messages.push(chat)
        }

        function pushNotificationChat(chat) {
            console.log(chat)
            this.messages.push({
                userType: '2',
                text: chat.message,
                profile_pic: CONSTANTS.MECH_PROFILE_IMAGE_URL + chat.customer_profile_pic,
                fname: chat.customer_fname,
                lname: chat.customer_lname,
                created_dt: chat.created_dt,
                time: '323'
            })
        }

        function pushChatHistory(chatArray) {
            for (var i = 0; i < chatArray.length; i++) {
                var userType = '1'
                var profileImage = CONSTANTS.PROFILE_IMAGE_URL + chatArray[i].cleaner_profile_pic
                var fName = chatArray[i].cleaner_fname;
                var lName = chatArray[i].cleaner_lname;
                if (chatArray[i].sender_user_type == '1') {
                    userType = '2'
                    profileImage = CONSTANTS.MECH_PROFILE_IMAGE_URL + chatArray[i].cleaner_profile_pic
                    fName = chatArray[i].cleaner_fname;
                    lName = chatArray[i].cleaner_lname;
                }
                this.messages.push({
                    userType: userType,
                    text: chatArray[i].chat_message,
                    profile_pic: profileImage,
                    fname: fName,
                    lname: lName,
                    created_dt: chatArray[i].created_dt,
                    time: '323'
                })
            }
        }

        return {
            messages: messages,
            pushChat: pushMyChat,
            pushNotificationChat: pushNotificationChat,
            pushChatHistory: pushChatHistory
        };
    })

