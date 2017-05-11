/**
 * Created by maahi on 11/02/17.
 */
angular.module('starter')
    .controller('HelpCtrl', function ($scope, $stateParams, $location, HelpFactory, services, CONSTANTS, $cordovaSocialSharing) {
        $scope.pageTitle = HelpFactory.pageTitle
        services.staticContent('0', function (response) {
            if (response.response_status == '1') {
                //$scope.last_clean = response.response_data.last_clean[0];
                $scope.helps = response.response_data.staticcontent;
                services.getAppointment(response.response_data.last_clean.app_appointment_id, function (response) {
                    if (response.response_status == '1') {
                        $scope.lastAppointment = response.response_data.appointment;
                        getMapImage($scope.lastAppointment, function (imgUrl) {
                            $scope.mapImage = imgUrl
                        })
                        $scope.lastCleanProfile = CONSTANTS.PROFILE_IMAGE_URL + $scope.lastAppointment.customer_pic;
                    }
                })
            }
        })
        function getMapImage(appointment, imgCallback) {
            services.getDirection({
                start: {
                    latitude: appointment.customer_latitude,
                    longitude: appointment.customer_longitude,
                },
                destination: {
                    latitude: appointment.cleaner_latitude,
                    longitude: appointment.cleaner_longitude,
                }
            }, function (location,response) {
                imgCallback(getStaticImage({
                    center: {
                        latitude: (Number(appointment.customer_latitude) + Number(appointment.cleaner_latitude)) / 2,
                        longitude: (Number(appointment.customer_longitude) + Number(appointment.cleaner_longitude)) / 2,
                    },
                    start: {
                        latitude: appointment.customer_latitude,
                        longitude: appointment.customer_longitude,
                    },
                    destination: {
                        latitude: appointment.cleaner_latitude,
                        longitude: appointment.cleaner_longitude,
                    },
                    points: response.routes[0].overview_polyline.points
                }))
            })
        };
        $scope.nextPage = function () {
            $location.url('clean_cost_review')
        }
        $scope.sendMail = function () {
            $cordovaSocialSharing
                .shareViaEmail('', 'Report your issue with Cleanosaur.', ['support@cleanosaur.com'], null, null, undefined)
                .then(function (result) {
                    // Success!
                }, function (err) {
                    // An error occurred. Show a message to the user
                });
        }
        /*$scope.nextPage = function (help) {
         console.log(help)
         HelpFactory.pageTitle = help.name
         console.log(HelpFactory)
         if (help.name != undefined && help.name != '') {
         if (help.id == '124') {
         //lauch clean and cost review page
         $location.url('clean_cost_review')
         } else
         $location.url('help_page_two/' + help.id)
         }
         }*/
    })
    .controller('PageTwoCtrl', function ($scope, $stateParams, $location, HelpFactory, services) {
        $scope.pageTitle = HelpFactory.pageTitle
        console.log($scope.pageTitle)
        services.staticContent($stateParams.parent_id, function (response) {
            if (response.response_status == '1') {
                $scope.helps = response.response_data.staticcontent;
            }
        })
        $scope.nextPage = function (help) {
            HelpFactory.pageTitle = help.name
            if (help.content == undefined || help.content == '') {
                $location.url('help_page_two/' + help.id)
            } else {
                $location.url('help_content/' + help.content)
            }
        }
    })
    .controller('CleanReviewCtrl', function ($scope, $stateParams, HistoryServices, $location, HelpFactory, services, LocationData, CONSTANTS) {
    HistoryServices.getHistory('2017-01-01', new Date().toISOString().split('T')[0], function (appointmentArray) {
        $scope.images = []
        $scope.appointmentArray = appointmentArray;

        for(var i = 0; i < $scope.appointmentArray.length; i++) {

            services.getDirection({
                start: {
                    latitude: $scope.appointmentArray[i].customer_latitude,
                    longitude: $scope.appointmentArray[i].customer_longitude,
                },
                destination: {
                    latitude: $scope.appointmentArray[i].cleaner_latitude,
                    longitude: $scope.appointmentArray[i].cleaner_longitude,
                }
            }, function (location,response) {
                $scope.images.splice(i,0, getStaticImage({
                    center: {
                        latitude: (Number(location.start.latitude) + Number(location.destination.latitude)) / 2,
                        longitude: (Number(location.start.longitude) + Number(location.destination.longitude)) / 2,
                    },
                    start: {
                        latitude: location.start.latitude,
                        longitude: location.start.longitude,
                    },
                    destination: {
                        latitude: location.destination.latitude,
                        longitude: location.destination.longitude,
                    },
                    points: response.routes[0].overview_polyline.points
                }))
            });
        }

    });
    $scope.getProfileImage = function (profile_pic) {
        return CONSTANTS.MECH_PROFILE_IMAGE_URL + profile_pic;
    }

    $scope.lauchNextPage = function (apmt,imageUrl) {
        HelpFactory.appointment = apmt;
        HelpFactory.imageUrl = imageUrl;
        $location.url('clean_cost_review_detail')
    }
    //new google.maps.Map(e.target, mapOptions);
})
    .controller('CleanReviewDetailCtrl', function ($scope, $stateParams, $location, HelpFactory, services, CONSTANTS) {
        $scope.appointment = HelpFactory.appointment;

        //getMapImage($scope.appointment)
        services.getstaticcontent('0', function (response) {
            if (response.response_status == '1') {
                $scope.helps = response.response_data.staticcontent;
            }
        })
        $scope.nextPage = function (help) {
            HelpFactory.pageTitle = help.name
            if (help.content == undefined || help.content == '') {
                $location.url('help_page_two/' + help.id)
            } else {
                $location.url('help_content/' + help.content)
            }
        }
        $scope.getProfileImage = function (profile_pic) {
            return CONSTANTS.MECH_PROFILE_IMAGE_URL + profile_pic;
        }
        $scope.mapImg = HelpFactory.imageUrl
    })
    .controller('ContentCtrl', function ($scope, $stateParams, $location, HelpFactory, services) {
        $scope.pageTitle = HelpFactory.pageTitle
        $scope.helpContent = $stateParams.content
    })
    .factory('HelpFactory', function () {
        return {
            pageTitle: 'Help',
            appointment: {},
            imageUrl:undefined
        }
    });

