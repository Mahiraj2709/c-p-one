/**
 * Created by admin on 1/31/2017.
 */
angular.module('starter')
    .controller('PaymentCtrl', function ($scope, $ionicLoading, PaymentService, services,popups,CardData,$location,$stateParams) {
        $scope.hideSkip = false;

        if($stateParams.show_skip == '0') {
            $scope.hideSkip = true;
        }

        $scope.skipCard = function () {

        }

        $scope.cardInputBox = []

        services.customercards(function (respons) {
            if(respons.response_status == '1') {
                $scope.def = respons.response_data.customer_cards.def
                $scope.allCards = respons.response_data.customer_cards.cards;

                for(var i= 0; i<$scope.allCards.length; i++) {
                    $scope.allCards[i].def = false;
                    if($scope.allCards[i].id == $scope.def) {
                        $scope.allCards[i].def = true;
                    }
                }

                console.log($scope.allCards)
            }
        })
        //card payment
        function acceptContact(params) {
            userRequests.acceptContactRequest(params, function (response) {
                if (response) {
                    $state.go('app.userRequests', {'unitId': $stateParams.unit.id});
                }
            });
        }

        function doPayment(response) {
            console.log(response)
            var params = {'source': response.id, 'amount': '20'};
        }

        $scope.dropDownData = {
            dates: ["Day", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            months: ["MM", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            years: ["YYYY"],
            info: "Date of birth is required"
        };
        var date = new Date();
        for (var i = date.getYear(); i <= date.getYear() + 100; i++) {
            $scope.dropDownData.years.push(1900 + i);
        }
        $scope.cardDetail = {
            nameOnCard: undefined,
            cardNumber: undefined,
            cvc: undefined,
            exp_month: 'MM',
            exp_year: 'YYYY',
        }

        function generateToken() {
            if (!PaymentService.validateCardDetails($scope.cardDetail)) return
            $ionicLoading.show({
                template: 'Generating token....'
            });
            Stripe.card.createToken({
//                name: $scope.payment.first_name + ' ' + $scope.payment.last_name,
                name: $scope.cardDetail.nameOnCard,
//                number: $scope.payment.cardNumber,
                number: $scope.cardDetail.cardNumber,
                cvc: $scope.cardDetail.cvc,
                exp_month: $scope.cardDetail.exp_month,
                exp_year: $scope.cardDetail.exp_year
            }, function (status, response) {
                console.log(response)
                $ionicLoading.hide();
                switch (status) {
                    case 200:
                        // Track Opening Payment success screen
                        /*if (typeof ga !== 'undefined') {
                         window.ga.trackView('Topup success');
                         }*/
                        //doPayment(response);
                        services.addcardToStripe(response.id,function (response) {
                            // your card has been successufll y added
                            if(response.response_status == '1') {
                                popups.showAlert(response.response_msg)
                                $scope.cardDetail = {}
                            }
                        })
                        break;
                    case 402:
                        // Track Opening Payment error screen
                        if (typeof ga !== 'undefined') {
                            window.ga.trackView('Topup error: ' + response.error.message);
                        }
                        $scope.$apply(function () {
                            $scope.paymentFormError = {'flag': true, 'message': response.error.message};
                        });
                        break;
                    default:
                        // Track Opening Payment error screen
                        if (typeof ga !== 'undefined') {
                            window.ga.trackView('Topup error: Invalid card details.');
                        }
                        $scope.$apply(function () {
                            $scope.paymentFormError = {'flag': true, 'message': 'Invalid card details.'};
                        });
                }
            });
        };
        $scope.getCardType = function (cardNumber) {
            console.log(PaymentService.GetCardType(cardNumber))
        }

        $scope.editCard = function (card) {
            CardData.card = card;

            $location.url('/edit_card')
        }
        $scope.addCard = function () {
            generateToken();
        }

        $scope.makeDefault = function (isDef,cardId) {

            if(isDef) return

            services.makeCardDefault(cardId,function (response) {

            })
        }
    })
    .controller('AddCardCtrl',function ($scope, $ionicLoading, PaymentService, services,popups) {
        
    })
    .controller('EditCardCtrl',function ($scope,CardData,services,PaymentService,$ionicViewService,popups) {
        $scope.card = CardData.card;

        console.log(CardData.card)

        $scope.cardDetail = {
            nameOnCard: undefined,
            cardNumber: undefined,
            cvc: undefined,
            exp_month: CardData.card.exp_month+'',
            exp_year: CardData.card.exp_year+'',
            card_id:CardData.card.id
        }

        $scope.dropDownData = {
            dates: ["Day", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            months: ["MM", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
            years: ["YYYY"],
            info: "Date of birth is required"
        };
        var date = new Date();
        for (var i = date.getYear(); i <= date.getYear() + 100; i++) {
            $scope.dropDownData.years.push(1900 + i);
        }

        $scope.editCard = function () {
            if (!PaymentService.validateCardDetails($scope.cardDetail)) return
            services.editcarddetails($scope.cardDetail,function (response) {
                if(response.response_status == '1') {
                    $ionicViewService.getBackView().go();
                }
                popups.showAlert(response.response_msg)
            })
        }
        $scope.removeCard = function () {
//            if (!PaymentService.validateCardDetails($scope.cardDetail)) return
            services.removecard($scope.cardDetail.card_id,function (response) {
                if(response.response_status == '1') {
                    $ionicViewService.getBackView().go();
                }
                popups.showAlert(response.response_msg)

            })
        }
    })
    .service('PaymentService', function ($ionicPopup) {
        // An alert dialog
        var showAlert = function (message) {
            var alertPopup = $ionicPopup.alert({
                title: 'Attention!',
                template: message
            });
        };
        var validCreditCard = function validateCardNumber(number) {
            var regex = new RegExp("^[0-9]{16}$");
            if (!regex.test(number))
                return false;
            return luhnCheck(number);
        }

        function validCvc(phoneNo) {
            var phoneno = /^\d{3}$/;
            if (String(phoneNo).match(phoneno)) {
                return true;
            }
            else {
                return false;
            }
        }

        function luhnCheck(val) {
            var sum = 0;
            for (var i = 0; i < val.length; i++) {
                var intVal = parseInt(val.substr(i, 1));
                if (i % 2 == 0) {
                    intVal *= 2;
                    if (intVal > 9) {
                        intVal = 1 + (intVal % 10);
                    }
                }
                sum += intVal;
            }
            return (sum % 10) == 0;
        }

        /*function cardType(cardNo) {
         var mastercard = new RegExp("/^5[1-5]/");
         var visa = new RegExp("^[0-9]{16}$");
         var amex = new RegExp("^[0-9]{16}$");
         if (!regex.test(number))
         return false;

         if(String(cardNo).match(phoneno)) {
         }
         }*/
        this.validateCardDetails = function (cardDetails) {
            if (cardDetails.cardNumber == undefined) {
                showAlert('Please enter card number!')
                return false
            } else if (!validCreditCard(cardDetails.cardNumber)) {
                showAlert('Please enter valid card number!')
            } else if (cardDetails.nameOnCard == undefined || cardDetails.nameOnCard == '') {
                showAlert('Please enter name on card!')
                return false
            } else if (cardDetails.cvc == undefined || !validCvc(cardDetails.cvc)) {
                showAlert('Please enter valid three digit cvc number!')
                return false
            } else if (cardDetails.exp_month == 'MM') {
                showAlert('Please select expiry month!')
                return false
            } else if (cardDetails.exp_year == 'YYYY') {
                showAlert('Please select expiry year!')
                return false
            } else return true
        }
        this.GetCardType = function (number) {
            // visa
            var re = new RegExp("^4");
            if (number.match(re) != null)
                return "Visa";
            // Mastercard
            re = new RegExp("^5[1-5]");
            if (number.match(re) != null)
                return "Mastercard";
            // AMEX
            re = new RegExp("^3[47]");
            if (number.match(re) != null)
                return "AMEX";
            // Discover
            re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
            if (number.match(re) != null)
                return "Discover";
            // Diners
            re = new RegExp("^36");
            if (number.match(re) != null)
                return "Diners";
            // Diners - Carte Blanche
            re = new RegExp("^30[0-5]");
            if (number.match(re) != null)
                return "Diners - Carte Blanche";
            // JCB
            re = new RegExp("^35(2[89]|[3-8][0-9])");
            if (number.match(re) != null)
                return "JCB";
            // Visa Electron
            re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
            if (number.match(re) != null)
                return "Visa Electron";
            return "";
        }
        /*|| !this.validCreditCard(cardDetails.cardNumber
         scope.ccinfo.type =
         (/^5[1-5]/.test(value)) ? "mastercard"
         : (/^4/.test(value)) ? "visa"
         : (/^3[47]/.test(value)) ? 'amex'
         : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(value)) ? 'discover'
         : undefined
         ctrl.$setValidity('invalid',!!scope.ccinfo.type)*/
    })
    .factory('CardData',function () {
        return {
            card : undefined
        }
    });
