/**
 * Created by admin on 1/19/2017.
 */

angular.module('starter')
    .service('AppointmentService',function (CONSTANTS,$ionicLoading,$http ) {
        this.getAppointmentDetails = function (appointmentId,callback) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var formdata = new FormData();
            formdata.append("device_type", CONSTANTS.deviceType());
            formdata.append('session_token', window.localStorage.getItem("sess_tok"));
            formdata.append("language", "en");
            formdata.append("app_appointment_id", appointmentId);
            var request = {
                method: 'POST',
                url: CONSTANTS.BASE_URL + 'getappointment',
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

                    console.log(d)
                    if (d.response_status == "1") {
                        callback(d.response_data.appointment)
                    } else {
                    }
                })
                .error(function (err) {
                    $ionicLoading.hide();
                });
        }
        this.getRequestValueWithCode = function (requestStatus) {
            if (requestStatus != undefined) {

                switch(requestStatus) {
                    case '1':
                        return 'Finished'
                        break;
                    case '2':
                        return 'Dropped'
                        break;
                    case '3':
                        return 'Started'
                        break;
                    case '4':
                        return 'Arrived'
                        break;
                    case '5':
                        return 'Accepted'
                        break;
                    case '6':
                        return 'Pending'
                        break;
                    case '7':
                        return 'Rejected'
                        break;
                    case '8':
                        return 'Cancelled by Cleaner'
                        break;
                    case '9':
                        return 'Cancelled by Customer'
                        break;
                    case '10':
                        return 'No Response'
                        break;
                    case '11':
                        return 'No Cleaner Found'
                        break;
                    default:
                        return 'NA'
                }
            }
        }
    });

