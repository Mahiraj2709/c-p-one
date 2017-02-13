/**
 * Created by admin on 1/5/2017.
 */
angular.module('starter')
  .controller('ChatCtrl', function ($scope, $rootScope, CONSTANTS, $timeout,
                                    $ionicScrollDelegate, ChatMessages, $stateParams) {
    $rootScope.profile_pic = CONSTANTS.PROFILE_IMAGE_URL + $rootScope.userDetail.profile_pic;
    $scope.hideTime = true;
    console.log($stateParams.appointment_id);
    var alternate,
      isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
    $scope.sendMessage = function () {
      var d = new Date();
      d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
      services.sendMessage($scope.data.message, $stateParams.app_appointment_id);
      ChatMessages.pushChat({
        userId: '12345',
        text: $scope.data.message,
        customer_profile_pic: $rootScope.profile_pic,
        cleaner_fname: $rootScope.userDetail.first_name,
        cleaner_lname: $rootScope.userDetail.last_name,
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

    function pushChat(chat) {
      this.messages.push({
        userId: '54321',
        text: (chat.text != undefined) ? chat.text : 'not key',
        customer_profile_pic: CONSTANTS.CUSTOMER_PROFILE_IMAGE_URL + chat.cleaner_profile_pic,
        cleaner_fname: chat.cleaner_fname,
        cleaner_lname: chat.cleaner_lname,
        created_dt: chat.created_dt,
        time: '323'
      })
    }

    return {
      messages: messages,
      pushChat: pushChat
    };
  })

