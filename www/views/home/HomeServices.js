/**
 * Created by admin on 1/3/2017.
 */
angular.module('starter')
    .service('SearchCleaner', function ($ionicLoading, $http, CONSTANTS,cleanUtils) {
        this.searchNearbyCleaner = function (latLng, address, callback) {
            var formdata = new FormData;
            formdata.append('device_type', CONSTANTS.deviceType());
            formdata.append('session_token', window.localStorage.getItem("sess_tok"));
            formdata.append('language', 'en');
            formdata.append('latitude', latLng.lat());
            formdata.append('longitude', latLng.lng());
            formdata.append('address', address);
            var request = {
                method: 'POST',
                url: CONSTANTS.BASE_URL + 'getsearchcleaner',
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
                    //$scope.showAlert(JSON.stringify(d));
                    console.log(d)
                    if (d.response_status == "1") {
                        if (d.response_data.cleaner) {
                            return callback(d.response_data.cleaner);
                        }
                    } else {
                        if(d.response_key == KEY_SESSION_OUT) {
                            cleanUtils.sessionOut()
                        }else {
                        }
                    }
                })
                .error(function (err) {
                    /*$scope.hideLoading();*/
                    console.log(err);
//                    $scope.showAlert(er
                });
        }

    });
