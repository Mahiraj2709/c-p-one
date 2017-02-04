/**
 * Created by admin on 1/18/2017.
 */

angular.module('starter')
    .controller('MechProfileCtrl', function ($scope, $stateParams, MechanicData,CONSTANTS) {
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
    });