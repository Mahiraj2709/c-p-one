/**
 * Created by admin on 2/24/2017.
 */
angular.module('starter')
    .controller('VideoCtrl',function ($scope,$rootScope,$ionicPopup) {

        // Execute action on hide modal
        $scope.$on('modal.shown', function() {
            // Execute action
            $rootScope.requestAcceptedPopup.close()
        });

        // Execute action on remove modal
        $scope.$on('modal.hidden', function() {
            // Execute action
            //show the new reqeust popup
            $rootScope.requestAcceptedPopup = $ionicPopup.show({
                templateUrl: 'views/custom_dialog/request_accepted.html',
                scope: $rootScope,
            });
        });

        $scope.closeVideoPlayer = function () {
            console.log('plese remove view from new request!')
            $scope.modal.remove();
        }

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
            //show the new reqeust popup
            $rootScope.requestAcceptedPopup = $ionicPopup.show({
                templateUrl: 'views/custom_dialog/request_accepted.html',
                scope: $rootScope,
            });
        });
    })
