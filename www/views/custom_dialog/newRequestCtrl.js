/**
 * Created by maahi on 11/02/17.
 */
angular.module('starter')
    .controller('ReqAcptCtrl', function ($scope, CONSTANTS, $location, $ionicModal, $sce, popups,$ionicPopup,AppointmentData,
                                         ReqeustAcceptedFactory, $rootScope) {
        $scope.requestAccepted = true;
        $scope.videoLink = $sce.trustAsResourceUrl(CONSTANTS.MECH_PROFILE_IMAGE_URL + AppointmentData.profile_video);

        $scope.openVideoPlayer = function () {
            //video player modal
            //$rootScope.requestAcceptedPopup.close()
            if(AppointmentData.profile_video == undefined) {
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
            console.log('plese remove view from new request!')
            $scope.modal.remove();
        }
        $scope.viewMechProfile = function () {
            console.log('sjdfl')
            $location.url('mech_profile/' + $scope.payload.cleaner_id);
            //close popup
            //$scope.closePopUp();
            //clear all the data associated this profile
            //$rootScope.requestAcceptedPopup.close();
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
