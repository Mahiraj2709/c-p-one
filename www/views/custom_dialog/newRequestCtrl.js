/**
 * Created by maahi on 11/02/17.
 */
angular.module('starter')
    .controller('ReqAcptCtrl', function ($scope, CONSTANTS, $location, $ionicModal, $sce, popups,$ionicPopup,AppointmentData,
                                         ReqeustAcceptedFactory, $rootScope) {

      $scope.requestAccepted = true;
      $rootScope.mechanic_video = $sce.trustAsResourceUrl(CONSTANTS.MECH_PROFILE_IMAGE_URL + AppointmentData.profile_video);

        $scope.openVideoPlayer = function () {
            //video player modal
            //$rootScope.requestAcceptedPopup.close()
            if(AppointmentData.profile_video == undefined) {
                popups.showAlert('Cleanosaur has not uploaded any video!')
                return
            }

            $ionicModal.fromTemplateUrl('views/custom_dialog/video_player.html', {
                scope: $rootScope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };

        $scope.cleaner_avg_rating = AppointmentData.cleaner_avg_rating
        $rootScope.closeCleanerVideoPlayer = function () {
            console.log('plese remove view from new request!')
            $scope.modal.remove();
        }

        $scope.viewMechProfile = function () {
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

      // Execute action on hide modal
      $rootScope.$on('modal.shown', function() {
        // Execute action
        $rootScope.requestAcceptedPopup.close()
      });

      // Execute action on remove modal
      $rootScope.$on('modal.hidden', function() {
        // Execute action
        //show the new reqeust popup
        $rootScope.requestAcceptedPopup = $ionicPopup.show({
          templateUrl: 'views/custom_dialog/request_accepted.html',
          scope: $rootScope,
        });
      });
    });
