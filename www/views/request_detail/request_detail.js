/**
 * Created by admin on 1/4/2017.
 */
angular.module('starter')
    .controller('ReqCtrl', function ($scope, $rootScope, CONSTANTS, $ionicLoading, $ionicPopup,
                                     GooglePlacesService, SendRequest, $cordovaGeolocation) {
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
            property_type_id: 0,
            bathroom: 0,
            bedroom: 0,
            kitchen: 0,
            living_rooms: 0,
            extra_rooms: 0,
            clean_style_id: 0,
            device_type: CONSTANTS.deviceType(),
            session_token: window.localStorage.getItem("sess_tok"),
            address: undefined,
            latitude: undefined,
            longitude: undefined,
            work_order_details: undefined,
            appointment_date: undefined,
            appointment_timezone: undefined,
            cleaner_id: $rootScope.cleanerIds,
            confirm_price: undefined,
            language: 'en',
            appointment_time: undefined,
            coupon_code: undefined,
        };
        //
        $scope.property_type = [
            {
                property_id: "1",
                property_type: "No Home"
            }
        ];
        $scope.bathroom = [
            {
                bathroom: "Not Available",
                id: "1"
            }
        ];
        $scope.bedroom = [
            {
                bedroom: "Not Available",
                id: "1"
            }
        ];
        $scope.clean_style = [
            {
                id: "1",
                name: "Not Available"
            }
        ];
        $scope.cleaner_entry_type = [
            {
                entry_id: "1",
                entry_type: "Not Available"
            }
        ];
        function getDataCallback(responseData) {
            console.log(responseData);
            $scope.property_type = responseData.property_type;
            $scope.bathroom = responseData.bathroom;
            $scope.bedroom = responseData.bedroom;
            $scope.clean_style = responseData.clean_style;
        }

        $scope.reloadData = function (property_id) {
            console.log(property_id)
            //reload data
            SendRequest.getPropertyType(property_id, getDataCallback);
        }
        $scope.sendRequest = function () {
            if ($scope.date != undefined) {
                $scope.requestDetail.appointment_date = $scope.date.toISOString().slice(0, 19).replace('T', ' ').split(' ')[0];
                $scope.requestDetail.appointment_timezone = "Asia/Calcutta";
            }
            if ($scope.time != undefined)
                $scope.requestDetail.appointment_time = $scope.time.toISOString().slice(0, 19).replace('T', ' ').split(' ')[1];
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
    });