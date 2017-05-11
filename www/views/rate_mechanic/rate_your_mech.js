/**
 * Created by admin on 1/31/2017.
 */
angular.module('starter')
    .controller('RateMechCtrl', function ($scope, $rootScope, AppointmentService, services, $stateParams, CONSTANTS, popups,$ionicPopup,
                                          $location, LocationData, $ionicHistory, AppointmentData) {
        $scope.cleanerData = AppointmentData.appointment;
        $scope.reqeustCompeteData = $rootScope.reqeustCompetePayload;
      getPrice();
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
                popups.showAlert('Please rate your Cleanosaur!')
                return
            } else if ($scope.rateObj.review == undefined || $scope.rateObj.review == '') {
                popups.showAlert('Please review your Cleanosaur request!')
                return
            } else {

                if($scope.rateObj.tip != undefined) {
                    if(isNaN($scope.rateObj.tip) || $scope.rateObj.tip <= 0){
                        popups.showAlert('Please enter correct price!')
                    }else {
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
                }else {
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
        }

        $scope.showAppointment = function () {
            $scope.appoimentPopup = $ionicPopup.show({
                templateUrl: 'views/custom_dialog/appointment_popup.html',
                scope: $scope,
            });
        }
        $scope.hideAppointmentPopup = function () {
            $scope.appoimentPopup.close()
        }


      function getPrice() {
        if($scope.reqeustCompeteData.price_description.promocode_value != undefined || $scope.reqeustCompeteData.price_description.promocode_value != undefined){

          var totalPrice = Number($scope.reqeustCompeteData.price_description.confirm_price);
          var promocodeValue = Number($scope.reqeustCompeteData.price_description.promocode_value);;
          $scope.totalPrice =  totalPrice - promocodeValue;
        }else {
          $scope.totalPrice = $scope.reqeustCompeteData.price_description.confirm_price;
        }
      }
    })
    .controller('MakePayment', function ($scope, services,AppointmentService) {

        $scope.paymentObj = {
            app_appointment_id:'',
            confirm_price:'',
            tip:''
        }
        $scope.makePayment = function () {
            services.makePayment($scope.paymentObj,function (response) {

            });
        }
    })
