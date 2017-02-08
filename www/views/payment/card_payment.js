/**
 * Created by admin on 1/31/2017.
 */
angular.module('starter')
    .controller('PaymentCtrl',function ($scope,$ionicLoading,PaymentService) {
        //card payment

        function acceptContact(params) {
            userRequests.acceptContactRequest(params, function (response) {
                if(response){
                    $state.go('app.userRequests', { 'unitId': $stateParams.unit.id });
                }
            });
        }

        function doPayment(response) {
            console.log(response)
            var params = { 'source': response.id, 'amount': '20' };
            /*user.doWalletTopup(params, function (response) {
                if(response){
                    popup.getAlertPopup({template: 'Your wallet has been credited S$' + $scope.payment.amount, title: 'Payment Successful'}, function (res) {
                        if($stateParams.from === 'contactAccept'){
                            var requestData = { 'unitId': $stateParams.unit.id, 'requestId': $stateParams.referenceId };
                            acceptContact(requestData);
                        }else if($stateParams.from === 'userProfile'){
                            $state.go('app.profile');
                        }else {
                            $state.go('app.popety.tab-timeline');
                        }
                    });
                }
            });*/
        }
        $scope.dropDownData = {
            dates: ["Day", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
            months: ["MM", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            years: ["YYYY"],
            info: "Date of birth is required"
        };
        var date = new Date();
        for (var i = date.getYear(); i <= date.getYear() + 50; i++) {
            $scope.dropDownData.years.push(1900 + i);
        }
        $scope.cardDetail = {
            nameOnCard:undefined,
            cardNumber:undefined,
            cvc:undefined,
            exp_month:'MM',
            exp_year:'YYYY',
        }

        $scope.generateToken = function () {
            if(!PaymentService.validateCardDetails($scope.cardDetail)) return
            $ionicLoading.show({
                template: 'Loading....'
            });
            Stripe.card.createToken({
//                name: $scope.payment.first_name + ' ' + $scope.payment.last_name,
                name: $scope.cardDetail.nameOnCard,
//                number: $scope.payment.cardNumber,
                number: '5105105105105100',
                cvc: '320',
                exp_month: '01',
                exp_year: '2020'
            }, function (status, response) {
                console.log(response)
                $ionicLoading.hide();
                switch (status) {
                    case 200:
                        // Track Opening Payment success screen
                        if (typeof ga !== 'undefined') {
                            window.ga.trackView('Topup success');
                        }
                        doPayment(response);
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

        $scope.editCard = function () {

        }

        $scope.addCard = function () {

        }


    })
    .service('PaymentService',function ($ionicPopup) {
        // An alert dialog
        var showAlert = function (message) {
            var alertPopup = $ionicPopup.alert({
                title: 'Attention!',
                template: message
            });
        };
        this.validCreditCard =  function validateCardNumber(number) {
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

        this.validateCardDetails = function (cardDetails) {
            if(cardDetails.nameOnCard == undefined || cardDetails.nameOnCard == '') {
                showAlert('Please enter name on card!')
                return false
            }else if(cardDetails.cardNumber != undefined || !this.validCreditCard(cardDetails.cardNumber) ) {
                showAlert('Please enter valid card number!')
                return false
            }else if(cardDetails.cvc == undefined || !validCvc(cardDetails.cvc)) {
                showAlert('Please enter valid three digit cvc number!')
                return false
            }
        }
    });
