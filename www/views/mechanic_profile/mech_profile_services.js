/**
 * Created by admin on 1/18/2017.
 */
angular.module('starter')
    .service('MechanicData',function ($ionicLoading, CONSTANTS,$http) {
        this.getMechanicProfile = function (cleanerId,callback) {
            $ionicLoading.show({
                template: 'Loading...'
            });
            var formdata = new FormData();
            formdata.append("device_type", CONSTANTS.deviceType());
            formdata.append('session_token', window.localStorage.getItem("sess_tok"));
            formdata.append("language", "en");
            formdata.append("view_cleaner_id", cleanerId);
//            console.log(formdata);
            var request = {
                method: 'POST',
                url: CONSTANTS.BASE_URL + 'viewprofile',
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
                        callback(d.response_data.profile[0])
                    } else {
                    }
                })
                .error(function (err) {
                    $ionicLoading.hide();
                });
        }
    })
