angular.module('starter')
    .controller('SplashCtrl', function ($scope, $rootScope,$timeout, $ionicSideMenuDelegate, $location, $ionicPush, LocationAlert, $ionicPlatform) {
        $ionicSideMenuDelegate.canDragContent(false);

        $ionicPush.register().then(function (t) {
            return $ionicPush.saveToken(t);
        }).then(function (t) {
            console.log('Token saved:', t.token);
        });
        $timeout(function () {
            var loggedIn = localStorage.getItem('login');
            if (!loggedIn) {
                $location.url('/login');
            } else {
                $location.url('/home');
            }
        }, 000);


        /*LocationAlert.isLocationEnabled(function (enabled) {
            if (enabled) {
                var loggedIn = localStorage.getItem('login');
                if (!loggedIn) {
                    $location.url('/login');
                } else {
                    $location.url('/home');
                }
            }
        });
        $ionicPlatform.ready(function () {
            document.addEventListener("resume", function () {
                LocationAlert.isLocationEnabled(function (enabled) {
                    if(enabled) {
                        $timeout(function () {
                            var loggedIn = localStorage.getItem('login');
                            if (!loggedIn) {
                                $location.url('/login');
                            } else {
                                $location.url('/home');
                            }
                        }, 000);
                    }
                });
                console.log("The application is resuming from the background");
            }, false);
        });*/
    });