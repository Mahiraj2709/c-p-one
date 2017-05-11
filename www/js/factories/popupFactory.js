/**
 * Created by maahi on 10/02/17.
 */

angular.module('starter')
  .factory('popups',function ($ionicModal,$ionicPopup,services,$location) {
     function showAlert(message) {
       $ionicPopup.alert({
         title: 'Attention!',
         template: message
       });
     }

     function requestCancelled(message) {
       $ionicPopup.alert({
         title: 'Request cancelled!',
         template: message
       });
     }

     function termAndConditionModal() {

     }

     function requestAcceptedPopup(splashScope) {

     }

     function confirmLogoutPopup() {
       $ionicPopup.confirm({
         title: 'Logout',
         template: 'Are you sure you want logout?'
       }).then(function (res) {
         if (res) {

           services.logout(function (response) {
             if (response.response_status == "1") {
               window.localStorage.removeItem("porfile");
               window.localStorage.removeItem("login");
               window.localStorage.removeItem("sess_tok");
               $location.path('login');
             } else {
               //$scope.showAlert(d.response_msg);
             }
           });
         } else {
           console.log('You are not sure');
         }
     })
     }

     return {
       showAlert:showAlert,
       requestCancelled:requestCancelled,
       requestAcceptedPopup:requestAcceptedPopup,
       confirmLogoutPopup:confirmLogoutPopup
     }
  })
