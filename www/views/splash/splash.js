angular.module('starter')
    .controller('SplashCtrl', function ($scope, $rootScope,$timeout, $ionicSideMenuDelegate, $location, $ionicPush,
                                        LocationAlert, $ionicPlatform,LocationData,$cordovaGeolocation,$ionicLoading) {
        $ionicSideMenuDelegate.canDragContent(false);

        $ionicPush.register().then(function (t) {
            return $ionicPush.saveToken(t);
        }).then(function (t) {
            console.log('Token saved:', t.token);
        });
        /*$timeout(function () {
            var loggedIn = localStorage.getItem('login');
            if (!loggedIn) {
                $location.url('/login');
            } else {
                $location.url('/home');
            }
        }, 000);
*/

        LocationAlert.isLocationEnabled(function (enabled) {
            if (enabled) {
                getLocation()
            }
        });
        $ionicPlatform.ready(function () {
                document.addEventListener("resume", function () {
                LocationAlert.isLocationEnabled(function (enabled) {
                    if (enabled) {

                        //get the
                        getLocation()

                    }
                });
                console.log("The application is resuming from the background");
            }, false);
        });


        function getLocation() {
            $ionicLoading.show({
                template: 'Getting current location...'
            })
            var options = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

                $ionicLoading.hide()
                //my lat lng factory
                LocationData.latitude = position.coords.latitude
                LocationData.longitude = position.coords.longitude
                console.log(position.coords.latitude)

                $timeout(function () {
                    var loggedIn = localStorage.getItem('login');
                    if (!loggedIn) {
                        $location.url('/login');
                    } else {
                        $location.url('/home');
                    }
                }, 000);
            });
        }
    });