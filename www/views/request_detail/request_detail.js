/**
 * Created by admin on 1/4/2017.
 */
angular.module('starter')
    .controller('ReqCtrl', function ($scope, $rootScope, CONSTANTS, $ionicLoading, $ionicPopup, $stateParams,popups,
                                     GooglePlacesService, SendRequest, $cordovaGeolocation,services,popups) {
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude
                var long = position.coords.longitude
                $scope.requestDetail.latitude = lat
                $scope.requestDetail.longitude = long
                //$scope.showAlert(lat + "  " + long);
            }, function (err) {
                // error
            });
        // An alert dialog
        $scope.showAlert = function (message) {
            var alertPopup = $ionicPopup.alert({
                title: 'Attention!',
                template: message
            });
        };
        $scope.date = undefined;
        $scope.time = undefined;
        $scope.requestDetail = {
            property_type_id: "1",
            bathroom: '1',
            bedroom: '1',
            kitchen: '1',
            living_rooms: '1',
            extra_rooms: '1',
            clean_style_id: "1",
            device_type: CONSTANTS.deviceType(),
            session_token: window.localStorage.getItem("sess_tok"),
            address: $stateParams.address,
            latitude: undefined,
            longitude: undefined,
            work_order_details: undefined,
            appointment_date: undefined,
            appointment_timezone: undefined,
            cleaner_id: $rootScope.cleanerIds,
            confirm_price: undefined,
            language: 'en',
            appointment_time: undefined,
            coupon_code: '',
        };
        //
        function getDataCallback(responseData) {
            console.log(responseData);
            $scope.property_type = responseData.property_type;
            $scope.bathroom = responseData.bathroom;
            $scope.bedroom = responseData.bedroom;
            $scope.clean_style = responseData.clean_style;
        }

        /*  $scope.reloadData = function (property_id) {
         console.log(property_id)
         //reload data
         SendRequest.getPropertyType(property_id, getDataCallback);
         }*/

        $scope.currentTime = new Date().toString('yyyy-MM-dd');

        $scope.sendRequest = function () {
            //check if stripe cards are added

            if($rootScope.userDetail.stripe_id == undefined ||  $rootScope.userDetail.stripe_id == '') {
                $scope.showAlert('You have not added any card. Please add credit card!');

                $location.url('payment/'+'1')
            }


            if ($scope.date != undefined) {
                $scope.requestDetail.appointment_date = $scope.date.toString('yyyy-MM-dd');
                $scope.requestDetail.appointment_timezone = "UTC";
            }
            if ($scope.time != undefined) {
                $scope.requestDetail.appointment_time = $scope.time.toISOString().slice(0, 19).replace('T', ' ').split(' ')[1];
                $scope.requestDetail.appointment_date = $scope.requestDetail.appointment_date + " "+String($scope.time).split(' ')[4]
            }
//            console.log($scope.requestDetail.appointment_date)
//            console.log($scope.requestDetail.appointment_time)
            //console.log($scope.date)
//            console.log($scope.time)

            SendRequest.sendRequest($scope.requestDetail);
        }
        $scope.getPlacePredictions = function (query) {
            console.log(query)
            if (query !== "") {
                GooglePlacesService.getPlacePredictions(query)
                    .then(function (predictions) {
                        $scope.predictions = predictions;
                    });
            } else {
                $scope.requestDetail.address = [];
            }
        };
        $scope.selectSearchResult = function (result) {
            $scope.requestDetail.address = result.description;
            $scope.predictions = [];
        };
        //clear all address on tap
        $scope.clearAll = function () {
            $scope.requestDetail.address = ' ';
        }
        $scope.clearIcon = false;
        $scope.showCurrentIcon = true;
        
        $scope.checkPromoCode = function(promoCode) {
            if($scope.requestDetail.coupon_code == '') {
                popups.showAlert('Please enter promo code!'); return;
            }
            services.checkpromocode(promoCode,function (response) {
                popups.showAlert(response.response_msg)

                if(response.response_status == '0') {
                    $scope.requestDetail.coupon_code = '';
                }
            })
        };
    });