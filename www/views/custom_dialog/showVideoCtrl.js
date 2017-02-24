/**
 * Created by admin on 2/24/2017.
 */
angular.module('starter')
    .controller('VideoCtrl',function ($scope,$rootScope) {

        $scope.$on('$ionicView.enter',function (event,data) {
            //hide the new request popup
            $rootScope.requestAcceptedPopup.close()
        })

        $scope.$on('$ionicView.leave',function (event,data) {
            //show the new reqeust popup
            $rootScope.requestAcceptedPopup = $ionicPopup.show({
                templateUrl: 'views/custom_dialog/request_accepted.html',
                scope: $rootScope,
            });
        })
    })
