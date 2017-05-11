/**
 * Created by admin on 3/2/2017.
 */
angular.module('starter')
    .controller('cleanosaurCtrl',function ($scope) {
        $scope.downloadCleaner = function () {
          if(ionic.Platform.isIOS()){
            cordova.InAppBrowser.open(CLEANER_ITUNES_LINK, '_system', 'location=yes');
          }
          else {
            cordova.InAppBrowser.open(CLEANER_PLAY_STORE_LINK, '_system', 'location=yes');
          }
        }
    })
