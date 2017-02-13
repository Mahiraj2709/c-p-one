/**
 * Created by maahi on 10/02/17.
 */
angular.module('starter')
  .factory('services', function ($http, CONSTANTS, $ionicLoading) {
    function logout() {
      $ionicLoading.show({
        template: 'Loading...'
      });
      var formdata = new FormData(responseCallback)
      formdata.append("device_type", CONSTANTS.deviceType());
      formdata.append("session_token", window.localStorage.getItem("sess_tok"))
      formdata.append("language", "en")
      var request = {
        method: 'POST',
        url: CONSTANTS.BASE_URL + 'logout',
        data: formdata
      };
      // SEND THE FILES.
      $http(request)
        .success(function (res) {
          responseCallback(res)
        })
        .error(function (err) {
          $ionicLoading.hide()
          console.log(err);
          //$scope.showAlert(err);
        });
    }

    function sendMessage(message, appointment_id) {
      var formdata = new FormData();
      formdata.append('device_type', CONSTANTS.deviceType());
      formdata.append('session_token', window.localStorage.getItem("sess_tok"));
      formdata.append('chat_message', message);
      formdata.append('app_appointment_id', appointment_id);
      formdata.append('language', 'en');

      console.log(formdata)

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
        .success(function (res) {
          //console.log(d)
          //responseCallback(res)
        })
        .error(function (err) {

        });
    }

    function getChatHistory(appointment_id, responseCallback) {
      $ionicLoading.show({
        template: 'Loading previous chat...'
      });
      var formdata = new FormData();
      formdata.append('device_type', CONSTANTS.deviceType());
      formdata.append('session_token', window.localStorage.getItem("sess_tok"));
      formdata.append('app_appointment_id', appointment_id);
      formdata.append('language', 'en');

      console.log(formdata)

      var request = {
        method: 'POST',
        url: CONSTANTS.BASE_URL + 'chathistory',
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
        .success(function (res) {
          console.log(res)
          $ionicLoading.hide()
          responseCallback(res)
        })
        .error(function (err) {
          $ionicLoading.hide()
        });
    }

    function rateMechanic(rateObj, responseCallback) {
      $ionicLoading.show({
        template: 'Submitting your rating...'
      });
      var formdata = new FormData();
      formdata.append('device_type', CONSTANTS.deviceType());
      formdata.append('session_token', window.localStorage.getItem("sess_tok"));
      formdata.append('app_appointment_id', rateObj.appointment_id);
      formdata.append('language', 'en');
      formdata.append('review', rateObj.review);
      formdata.append('rating', rateObj.rating);
      formdata.append('tip', rateObj.tip);

      console.log(formdata)

      var request = {
        method: 'POST',
        url: CONSTANTS.BASE_URL + 'sendfeedback',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formdata,
        headers: {
          'Content-Type': undefined
        }
      };

    }

    function staticContent(parent_id, responseCallback) {
      $ionicLoading.show({
        template: 'Submitting your rating...'
      });
      var formdata = new FormData();
      formdata.append('device_type', CONSTANTS.deviceType());
      formdata.append('session_token', window.localStorage.getItem("sess_tok"));
      formdata.append('parent_id', parent_id);

      var request = {
        method: 'POST',
        url: CONSTANTS.BASE_URL + 'getstaticcontent',
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
        .success(function (res) {
          console.log(res)
          $ionicLoading.hide()
          responseCallback(res)
        })
        .error(function (err) {
          $ionicLoading.hide()
        });
    }

    function getProfileVideo(responseCallback) {
      $ionicLoading.show({
        template: 'Loading...'
      });
      var formdata = new FormData();
      formdata.append('device_type', CONSTANTS.deviceType());
      formdata.append('session_token', window.localStorage.getItem("sess_tok"));


      var request = {
        method: 'POST',
        url: CONSTANTS.BASE_URL + 'getuploadedprofilevideo',
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
        .success(function (res) {
          console.log(res)
          $ionicLoading.hide()
          responseCallback(res)
        })
        .error(function (err) {
          $ionicLoading.hide()
        });
    }

    return {
      logout: logout,
      sendMessage: sendMessage,
      getChatHistory: getChatHistory,
      rateMechanic: rateMechanic,
      staticContent: staticContent,
      getProfileVideo:getProfileVideo
    }
  });
