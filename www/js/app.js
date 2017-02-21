// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'services', 'ngCordova', 'ngCordovaOauth','ionic.cloud','ngSanitize',
  'emojiApp'])
    .run(function ($ionicPlatform, $location, $ionicPopup, $ionicHistory) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);


            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
        $ionicPlatform.registerBackButtonAction(function () {
            if ($location.path() === "/home" || $location.path() === "home") {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Exit',
                    template: 'Are you sure you want exit?'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        navigator.app.exitApp();
                    } else {
                        console.log('You are not sure');
                    }
                });
            } else {
                $ionicHistory.goBack();
            }
            // if (true) {
            //   //navigator.app.exitApp();
            // } else {
            //   //handle back action!
            // }
        }, 100);
    })
    .constant('CONSTANTS', {
        url: 'https://ionic-songhop.herokuapp.com',
        fbAppId: '1287344741322935',
        twitterApiKey: 'F10TwLSYjuahegNC3T10FB75N',
        twitterApiSectet: 'paCiWQE8TXO9n1gq3jLFIgAmyJP1fj1BtaQsdCuAaAJpyVaZnY',
        BASE_URL: 'http://cleanosaurapp.onsisdev.info/customerapi/',
        PROFILE_IMAGE_URL: 'http://cleanosaurapp.onsisdev.info/public/media/customer/',
        MECH_PROFILE_IMAGE_URL: 'http://cleanosaurapp.onsisdev.info/public/media/cleaner/',
        CAR_IMAGE_URL: 'http://cleanosaurapp.onsisdev.info/public/media/carphoto/',
        FIREBASE_URL: 'https://cleanosaur-fbeab.firebaseio.com/',
        validEmail: function (email) {
            var atpos = email.indexOf("@");
            var dotpos = email.lastIndexOf(".");
            if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
                return false;
            } else {
                return true;
            }
        },
        validPhoneNo: function (phoneNo) {
            var phoneno = /^\d{10}$/;
            if (String(phoneNo).match(phoneno)) {
                return true;
            }
            else {
                return false;
            }
        },
        deviceType: function () {
            var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid();
            if (isIOS) {
                return 2;
            } else if (isAndroid) {
                return 1;
            } else {
                return 3;
            }
        },
    })
    .config(function ($stateProvider, $urlRouterProvider ,$ionicCloudProvider) {

        $ionicCloudProvider.init({
            "core": {
                "app_id": "b6050cd1"
            },
            "push": {
                "sender_id": "541166918614",
                "pluginConfig": {
                    "ios": {
                        "badge": true,
                        "sound": true
                    },
                    "android": {
                        "iconColor": "#343434"
                    }
                }
            }
        });

        //stripe payment
        window.Stripe.setPublishableKey('pk_test_th4VoSs8VNZLY3WiIrblBoUG');

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

        // setup an abstract state for the tabs directive
        //splash router
            .state('splash', {
                url: '/splash',
                templateUrl: 'views/splash/splash.html',
                controller: 'SplashCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'views/login/login.html',
                controller: 'LoginCtrl'
            })

            //sign up router
            .state("sign_up", {
                url: '/sign_up',
                templateUrl: 'views/signup/signup.html'
            })

            //sign up router
            .state("account_details", {
                url: '/account_details',
                templateUrl: 'views/account_detail/account_detail.html',
                controller: 'AccountDetailsCtrl'
            })

            //forgot password
            .state('forgot_password', {
                url: '/forgot_password',
                templateUrl: 'views/forgot_password/forgot_password.html',
                controller: 'ForgotPasswordCtrl'
            })
            //home router
            .state('home', {
                url: '/home',
                templateUrl: 'views/home/home.html',
                controller: 'HomeCtrl'
            })
            //profile router
            .state('profile_one', {
                url: '/profile_one',
                templateUrl: 'views/my_profile/profile_one.html',
                controller: 'ProfileCtrl'
            })

            //profile second page router
            .state('profile_two', {
                url: '/profile_two',
                templateUrl: 'views/my_profile/profile_two.html',
                controller: 'ProfileCtrl'
            })

            //about page router
            .state('about', {
                url: '/about',
                templateUrl: 'views/about/about.html',
                controller: 'ProfileCtrl'
            })
            //request detail
            .state('request_detail', {
                url: '/request_detail/:address',
                templateUrl: 'views/request_detail/request_detail.html',
                controller: 'ReqCtrl'
            })
            //request detail
            .state('select_time', {
                url: '/select_time',
                templateUrl: 'views/request_detail/select_time.html',
                controller: 'SelectTimeCtrl'
            })

            //request detail
            .state('mech_profile', {
                url: '/mech_profile/:cleaner_id',
                templateUrl: 'views/mechanic_profile/mech_profile.html',
                controller: 'MechProfileCtrl'
            })

            //mechanic on the way
            .state('on_the_way', {
                url: '/on_the_way/:appointment_id',
                templateUrl: 'views/on_the_way/on_the_way.html',
                controller: 'OnTheWayCtrl'
            })

            //rate your mechanic
            .state('rate_mech', {
                url: '/rate_mech/:appointment_id',
                templateUrl: 'views/rate_mechanic/rate_your_mech.html',
                controller: 'RateMechCtrl'
            })

            //payment screens
            .state('payment', {
                url: '/payment',
                templateUrl: 'views/payment/card_payment.html',
                controller: 'PaymentCtrl'
            })

            //edit card
            .state('edit_card', {
                url: '/edit_card',
                templateUrl: 'views/payment/edit_card.html',
                controller: 'PaymentCtrl'
            })
            //add new card
            .state('add_card', {
                url: '/add_card',
                templateUrl: 'views/payment/add_card.html',
                controller: 'PaymentCtrl'
            })
            //payment screens
            .state('pending_appointment', {
                url: '/pending_appointment',
                templateUrl: 'views/pending_appointment/pending_appointment.html',
                controller: 'PendingAppointmentCtrl'
            })
            //payment screens
            .state('history', {
                url: '/history',
                templateUrl: 'views/service_history/service_history.html',
                controller: 'HistoryCtrl'
            })

            //service history details
            .state('history_detail', {
                url: '/history_detail',
                templateUrl: 'views/service_history/service_history_detail.html',
                //controller: 'HistoryCtrl'
            })

            //service history details
            .state('notification', {
                url: '/notification',
                templateUrl: 'views/notification/notification.html',
                //controller: 'HistoryCtrl'
            })

            //work as cleaner
            .state('help', {
                url: '/help',
                templateUrl: 'views/help/help.html',
                controller: 'HelpCtrl'
            })
            //work as cleaner
          .state('page_two', {
            url: '/page_two',
            templateUrl: 'views/help/page_two.html',
            controller: 'HelpCtrl'
          })
            //work as cleaner
            .state('work_as_cleaner', {
                url: '/work_as_cleaner',
                templateUrl: 'views/sign_as_cleaner/work_as_cleaner.html',
                //controller: 'HistoryCtrl'
            })


            .state('chat_room', {
            url: '/chat_room/:appointment_id',
            templateUrl: 'views/chat_room/chat_room.html',
            controller: 'ChatCtrl'
        })
            //settings
            .state('setting', {
                url: '/setting',
                templateUrl: 'views/setting/setting.html',
                controller: 'SettingCtrl'
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/splash');
    });
