/**
 * Created by admin on 3/25/2017.
 */
angular.module('starter')
    .controller('NotificationCtrl', function ($scope, services, popups) {

        services.getpromocodenotification(function (respons) {
            if (respons.response_status == '1') {
                $scope.notification = respons;
            }
        })
    })
