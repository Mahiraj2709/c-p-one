/**
 * Created by admin on 1/3/2017.
 */
angular.module('starter')
    .service('ScanCard',function ($cordovaNgCardIO) {
        $cordovaNgCardIOProvider.setScanerConfig(
            {
                "expiry": true,
                "cvv": true,
                "zip": false,
                "suppressManual": false,
                "suppressConfirm": false,
                "hideLogo": true
            }
        );
        $cordovaNgCardIOProvider.setCardIOResponseFields(
            [
                "card_type",
                "redacted_card_number",
                "card_number",
                "expiry_month",
                "expiry_year",
                "short_expiry_year",
                "cvv",
                "zip"
            ]
        );

         var scanCard = $cordovaNgCardIO.scanCard()
            .then(function (response) {
                    //Success response - it`s an object with card data
                },
                function (response) {
                    //We will go there only when user cancel a scanning.
                    //response always null
                }
            );
    });
