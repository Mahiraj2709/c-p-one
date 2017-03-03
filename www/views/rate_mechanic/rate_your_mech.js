/**
 * Created by admin on 1/31/2017.
 */
angular.module('starter')
    .controller('RateMechCtrl', function ($scope, $rootScope, AppointmentService, services, $stateParams, CONSTANTS, popups,
                                          $location, LocationData, $ionicHistory, AppointmentData) {


        $scope.reqeustCompeteData = $rootScope.reqeustCompetePayload;
        $scope.rate_mechProfile = CONSTANTS.MECH_PROFILE_IMAGE_URL + $rootScope.reqeustCompetePayload.profile_pic;
        AppointmentService.getAppointmentDetails($stateParams.appointment_id, function (appointmentData) {
            $scope.profileImage = CONSTANTS.MECH_PROFILE_IMAGE_URL + appointmentData.cleaner_pic;
            $scope.cleanerData = appointmentData;
            cleaner_id = appointmentData.cleaner_id;
            $scope.requestId = "REQUEST ID-" + $stateParams.appointment_id;
        });
        $scope.rateObj = {
            appointment_id: $stateParams.appointment_id,
            rating: 0,
            review: undefined,
            tip: undefined,
        };
        $scope.setRating = function (rating) {
            //console.log(rating)
            $scope.rateObj.rating = rating;
        }
        $scope.rateYourMechanic = function () {
            if ($scope.rateObj.rating < 1) {
                popups.showAlert('Please review your Cleanosaur!')
                return
            } else if ($scope.rateObj.review == undefined || $scope.rateObj.review == '') {
                popups.showAlert('Please review your Cleanosaur request!')
                return
            } else {
                console.log($scope.rateObj)
                services.rateMechanic($scope.rateObj, function (response) {
                    popups.showAlert(response.response_msg)
                    if (response.response_status == "1") {

                        $rootScope.reqeustCompeteData = undefined;
                        $ionicHistory.clearCache().then(function () {
                            $location.url('/home');
                        });
                    }
                })
            }
        }
    })