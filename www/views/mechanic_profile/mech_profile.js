/**
 * Created by admin on 1/18/2017.
 */

angular.module('starter')
    .controller('MechProfileCtrl', function ($scope, $rootScope, $ionicPopup, $location, $ionicHistory, $stateParams, MechanicData, CONSTANTS, $ionicModal, popups, AppointmentData, $sce) {
        console.log($stateParams.cleaner_id);
        $scope.getCustomerData = function () {
            MechanicData.getMechanicProfile($stateParams.cleaner_id, function (mechData) {
                $scope.mechData = mechData;
                //set the four images for the profile
                $scope.profile_pic = CONSTANTS.MECH_PROFILE_IMAGE_URL + mechData.profile_pic;
                $scope.profileImages = [];
                for (var i = 0; i < mechData.cleaner_album_profile_pic.length; i++) {
                    $scope.profileImages.push(CONSTANTS.MECH_PROFILE_IMAGE_URL + mechData.cleaner_album_profile_pic[i].profile_pic);
                }
            });
        }
        $scope.videoLink = $sce.trustAsResourceUrl(CONSTANTS.MECH_PROFILE_IMAGE_URL + AppointmentData.profile_video);
        $scope.openVideoPlayer = function () {
            //video player modal
            if (AppointmentData.profile_video == undefined) {
                popups.showAlert('Cleanosaur has not uploaded any video!')
                return
            }

            $ionicModal.fromTemplateUrl('views/custom_dialog/video_player.html', {
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
        $scope.launchMechOnWay = function () {

            $rootScope.mechOnWayViewTitle = 'Cleanosaur on the way'
            $ionicHistory.clearCache().then(function () {
                $location.url('on_the_way/' + $rootScope.payload.app_appointment_id);
                $rootScope.payload = undefined;
                $rootScope.cleaner_profile_pic = undefined;
            })

        }
    });