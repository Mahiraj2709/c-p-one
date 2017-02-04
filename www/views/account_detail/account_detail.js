angular.module('starter')
    .controller('AccountDetailsCtrl', function($scope, $ionicPopup, $http, $ionicLoading, $location,$ionicSideMenuDelegate, $ionicViewService,CONSTANTS) {
        $ionicViewService.clearHistory();
        $ionicSideMenuDelegate.canDragContent(false);
        $scope.accountDetails = {
            email: '',
            cardNumber: '',
            device_type: CONSTANTS.deviceType(),
            language: 'en'
        };

        // An alert dialog
        $scope.showAlert = function(message) {
            var alertPopup = $ionicPopup.alert({
                title: 'Attention!',
                template: message
            });
        };

        //Loading in 
        $scope.showLoading = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hideLoading = function() {
            $ionicLoading.hide();
        };

        var formdata = new FormData();

        $scope.addCard = function() {
            $scope.showAlert("Comming soon!");
            return;
            // if (!validateCardNumber($scope.accountDetails.cardNumber)) {
            //     $scope.showAlert("Please enter a valid card number!");
            // }  else {
            //     //call login api
            //     for (var key in $scope.forgotPasswordDetails) {
            //         formdata.append(key, $scope.accountDetails[key]);
            //     }
            //     $scope.showLoading();
            //     $scope.makeRequest();
            // }
        };


        // NOW UPLOAD THE FILES.
        $scope.makeRequest = function() {

            var request = {
                method: 'POST',
                url: CONSTANTS.BASE_URL + 'forgotpassword',
                data: formdata,
                headers: {
                    'Content-Type': undefined
                }
            };

            // SEND THE FILES.
            $http(request)
                .success(function(d) {
                    $scope.hideLoading();
                    console.log(d);
                    if (d.response_status == "1") {
                        $scope.showAlert(d.response_msg);
                        $location.path('login');
                    } else {
                        $scope.showAlert(d.response_msg);
                    }
                })
                .error(function(err) {
                    $scope.hideLoading();
                    $scope.showAlert(err);
                    console.log(err);
                });
        };

        //validate card number
        function validateCardNumber(number) {
            var regex = new RegExp("^[0-9]{16}$");
            if (!regex.test(number))
                return false;

            return luhnCheck(number);
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


    });