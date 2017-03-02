/**
 * Created by admin on 3/2/2017.
 */
angular.module('starter')
    .controller('cleanosaurCtrl',function ($scope) {
        $scope.downloadCleaner = function () {
            cordova.InAppBrowser.open('https://play.google.com/store/apps/details?id=com.app.cleanosaur', '_blank', 'location=yes');
        }
    })
