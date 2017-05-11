/**
 * Created by admin on 3/27/2017.
 */
angular.module('starter')
    .factory('cleanUtils', function ($rootScope,$ionicHistory,$location) {
        function sessionOut(){
                //session does not exit now move to the login screen
                clearAllUserData();
                $ionicHistory.clearCache().then(function () {
                    for (var prop in $rootScope) {
                        if (prop.substring(0,1) !== '$') {
                            delete $rootScope[prop];
                        }
                    }
                    $location.path('login');
                })
        }

        return {
            sessionOut:sessionOut
        }
    })