/**
 * Created by admin on 1/31/2017.
 */
angular.module('starter')
    .controller('RateMechCtrl', function ($scope,AppointmentService, services,$stateParams, CONSTANTS, popups,LocationData,AppointmentData) {
      AppointmentService.getAppointmentDetails($stateParams.appointment_id, function (appointmentData) {

        $scope.profileImage = CONSTANTS.MECH_PROFILE_IMAGE_URL + appointmentData.cleaner_pic;
        $scope.cleanerData = appointmentData;
        cleaner_id = appointmentData.cleaner_id;
        $scope.requestId = "REQUEST ID-" + appointmentData.app_appointment_id;
      });

      $scope.rateObj = {
        appointment_id:$stateParams.appointment_id,
        rating:0,
        review:undefined,
        tip:undefined,

      };
      $scope.setRating = function (rating) {
        //console.log(rating)
        $scope.rateObj.rating = rating;
      }

      $scope.rateYourMechanic = function () {
        if($scope.rateObj.rating < 1) {
          popups.showAlert('Please rate your mechanic!')
          return
        }else if($scope.rateObj.review == undefined || $scope.rateObj.review == '') {
          popups.showAlert('Please review your mechanic!')
          return
        }else {
          services.rateMechanic($scope.rateObj,function (response) {

          })
        }
      }

    })

