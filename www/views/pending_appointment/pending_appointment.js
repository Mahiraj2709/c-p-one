/**
 * Created by admin on 2/1/2017.
 */
angular.module('starter')
    .controller('PendingAppointmentCtrl',function ($scope,PendingAppointmentServices,$ionicPopup,$location,AppointmentData,AppointmentService) {
        PendingAppointmentServices.getAppointment(function (appointmentArray) {
            $scope.appointmentArray = appointmentArray;
        });
        //date formatter   yourDate.toISOString().split('T')[0]


        $scope.trackAppointment = function (appointmentId,status) {
            //track the current appointmnt id
//            console.log(appointmentId)
            AppointmentService.getAppointmentDetails(appointmentId,function (customerData) {
                AppointmentData.appointment = customerData;

                if(status == '4') AppointmentData.viewTitle = 'Cleanosaur has arrived'
                $location.url('on_the_way/'+appointmentId);
            })
        }

        //get the status on basis of status code
        $scope.getStatus = function (statusCode) {
            return AppointmentService.getRequestValueWithCode(statusCode)
        }
    })
    .service('PendingAppointmentServices',function ($ionicLoading,$http,CONSTANTS ) {
    this.getAppointment = function ( callback) {
        $ionicLoading.show({
            template: 'Loading...'
        });
        var formdata = new FormData();
        formdata.append("device_type", CONSTANTS.deviceType());
        formdata.append('session_token', window.localStorage.getItem("sess_tok"));
        formdata.append("language", "en");
        var request = {
            method: 'POST',
            url: CONSTANTS.BASE_URL + 'getpendingappointment',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formdata,
            headers: {
                'Content-Type': undefined
            }
        };
        // SEND THE FILES.
        $http(request)
            .success(function (d) {
                $ionicLoading.hide();

                console.log(JSON.stringify())
                if (d.response_status == "1") {
                    callback(d.response_data.appointment)
                } else {
                }
            })
            .error(function (err) {
                $ionicLoading.hide();
            });
    }
})
