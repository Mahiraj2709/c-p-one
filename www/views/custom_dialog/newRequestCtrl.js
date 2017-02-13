/**
 * Created by maahi on 11/02/17.
 */
angular.module('starter')
    .controller('ReqAcptCtrl', function ($scope, CONSTANTS, $location, $ionicModal, $sce, $ionicPopup, ReqeustAcceptedFactory, $rootScope) {
        $scope.requestAccepted = true;
        //video player modal
        $scope.videoLink = $sce.trustAsResourceUrl('http://airshareapp.onsisdev.info/public/media/video/1484900352.mp4');
        $scope.openVideoPlayer = function () {
            $ionicModal.fromTemplateUrl('views/dialog/video_player.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };
        $scope.closeVideoPlayer = function () {
            $scope.modal.hide();
        }
        $scope.viewMechProfile = function () {
            console.log('sjdfl')
            $location.url('mech_profile/' + $scope.payload.cleaner_id);
            //close popup
            //$scope.closePopUp();
            //clear all the data associated this profile
            $rootScope.requestAcceptedPopup.close();
        }
        $scope.launchMechOnWay = function () {
            console.log('sjdfl')
            $rootScope.requestAcceptedPopup.close();
            $location.url('on_the_way/' + $rootScope.payload.app_appointment_id);
            $rootScope.mechOnWayViewTitle = 'Cleanosaur on the way'
            $rootScope.payload = undefined;
            $rootScope.cleaner_profile_pic = undefined;
        }
    });
