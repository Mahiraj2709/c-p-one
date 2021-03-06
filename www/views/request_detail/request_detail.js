/**
 * Created by admin on 1/4/2017.
 */
angular.module('starter')
    .controller('ReqCtrl', function ($scope, $rootScope, CONSTANTS, $ionicLoading, $ionicPopup, $stateParams, popups,
                                     GooglePlacesService, SendRequest, $cordovaGeolocation, services, $location, $ionicModal) {
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
            //send to add card and if default card is added then allow send request
            if ($scope.date != undefined) {
                $scope.requestDetail.appointment_date = $scope.date.toString('yyyy-MM-dd');
                $scope.requestDetail.appointment_timezone = "UTC";
            }
            if ($scope.time != undefined) {
                $scope.requestDetail.appointment_time = $scope.time.toISOString().slice(0, 19).replace('T', ' ').split(' ')[1];
                $scope.requestDetail.appointment_date = $scope.requestDetail.appointment_date + " " + String($scope.time).split(' ')[4]
            }
//            console.log($scope.requestDetail.appointment_date)
//            console.log($scope.requestDetail.appointment_time)
            //console.log($scope.date)
//            console.log($scope.time)
            SendRequest.sendRequest($scope.requestDetail, $scope.defaultCard, function () {
                //this call back function set the purpose of choosing the default card if not selected
                console.log('open modal now')
                $scope.openChooseCardModal()
            });
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
        $scope.checkPromoCode = function (promoCode) {
            if ($scope.requestDetail.coupon_code == '') {
                popups.showAlert('Please enter promo code!');
                return;
            }
            services.checkpromocode(promoCode, function (response) {
                popups.showAlert(response.response_msg)
                if (response.response_status == '0') {
                    $scope.requestDetail.coupon_code = '';
                }
            })
        };
        function createChooseCardModal() {
            $ionicModal.fromTemplateUrl('views/custom_dialog/choose_card_modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.chooseCardModal = modal;
                $scope.chooseCardModal.show()
                getAllCards();
            });
        }

        $scope.openChooseCardModal = function () {
            createChooseCardModal()
        };
        $scope.closeChooseCardModal = function () {
            $scope.chooseCardModal.remove();
        };
        $scope.defaultCard = undefined
        $scope.makeDefault = function (isDef, cardId) {
            console.log(cardId)
            if (isDef) return
            services.makeCardDefault(cardId, function (response) {
                $scope.defaultCard = cardId;
            })
        }
        $scope.addNewCard = function () {
            $scope.closeChooseCardModal()
            $location.url('add_card')
        }
        function getAllCards() {
            services.customercards(function (respons) {
                if (respons.response_status == '1') {
                    $scope.defaultCard = respons.response_data.customer_cards.def
                    $scope.allCards = respons.response_data.customer_cards.cards;
                    for (var i = 0; i < $scope.allCards.length; i++) {
                        $scope.allCards[i].def = false;
                        if ($scope.allCards[i].id == $scope.defaultCard) {
                            $scope.allCards[i].def = true;
                        }
                    }
                    console.log($scope.allCards)
                }
            })
        }
    });