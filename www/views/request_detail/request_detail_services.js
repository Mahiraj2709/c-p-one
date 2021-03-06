/**
 * Created by admin on 1/5/2017.
 */
angular.module('starter')
    .factory('RequestData', function () {
        var factory = {
            device_type: undefined,
            session_token: undefined,
            language: undefined,
            property_id: undefined,
        };
        return factory;
    })
    .service('SendRequest', function ($http, $ionicLoading,CONSTANTS,$ionicPopup,$location,$ionicHistory,popups) {
        this.getPropertyType = function (property_id,callback) {
            $ionicLoading.show({
                template: "Loading data..."
            })
            var formdata = new FormData;
            formdata.append('device_type', CONSTANTS.deviceType());
            formdata.append('session_token', window.localStorage.getItem("sess_tok"));
            formdata.append('language', 'en');
            formdata.append('property_id', property_id);

            var request = {
                method: 'POST',
                url: CONSTANTS.BASE_URL + 'getpropertytype',
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
                    //showAlert(JSON.stringify(d));
                    //console.log(d);
                    if (d.response_status == "1") {
                        return callback(d.response_data);
                    } else {
                        if(d.response_status == '2'){
                            $location.url('add_card')
                        }
                        popups.showAlert(d.response_msg);
                    }
                })
                .error(function (err) {
                    /*hideLoading();*/
                    $ionicLoading.hide();
                    console.log(err);
//                    showAlert(er
                });
        }
        function validAppointmentDate(date) {
            var currentDate = new Date();
            var appointmentDate = new Date(date.replace(/-/g, "/"));

            console.log('current data ' + currentDate)
            console.log('appointmentDate ' + appointmentDate)
            console.log('condition ' + (appointmentDate >= currentDate))

            return appointmentDate >= currentDate
        }
        this.sendRequest = function (requestData,defaultCard,callback) {

            console.log(requestData);
            var formdata = new FormData;
            //validate all the fields
            if (!requestData.work_order_details) {
                showAlert("Provide work order detail!");
            }else if (!requestData.appointment_date) {
                showAlert("Please choose appointment date!");
            } /*else if (!requestData.appointment_timezone) {
                showAlert("Email Id is required");
            } */
            else if (!requestData.appointment_time) {
                showAlert("Please select time!");
            }else if(!validAppointmentDate(requestData.appointment_date)){
                showAlert("Appointment date can't be past date!");
            }
            else if (!requestData.confirm_price) {
                showAlert("Please enter price!");
            }else if (isNaN(requestData.confirm_price)) {
                showAlert("Please enter valid price!");
            }else if (requestData.confirm_price <= 0) {
                showAlert("Price can't be zero!");
            }else if (defaultCard == undefined) {
                callback()
                //showAlert("You have not selected any card!");
            }else {
                //call signup api
                for (var key in requestData) {
                    if (key == "profile_pic") {
                        //userImage = getBase64Image(document.getElementById("profile_pic"));
                        formdata.append(key, dataURItoBlob(userImage), 'sdfsdf' + '.jpeg');
                        if (!String(userImage)) {
                        }
                    }
                    else {
                        formdata.append(key, requestData[key]);
                    }
                    //formdata.append(key, requestData[key]);
                }
                //check for internet connection
                makeRequest();
            }

            function makeRequest() {
                $ionicLoading.show({
                    template: "Requesting..."
                })

                var request = {
                    method: 'POST',
                        url: CONSTANTS.BASE_URL + 'sendrequest',
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
                        //showAlert(JSON.stringify(d));
                        console.log(d);
                        if (d.response_status == "1") {
                            $ionicPopup.alert({
                                title: 'Success!',
                                template: "Your request has been sent and will be answered by the first available Cleanosaur",
                                okText: 'RAWR!'
                            });

                            $ionicHistory.clearCache().then(function(){
                                $location.url('/home');
                            });
                            //return callback(d.response_data);
                        } else {
                          popups.showAlert(d.response_msg)
                        }
                    })
                    .error(function (err) {
                        /*hideLoading();*/
                        $ionicLoading.hide();
                        console.log(err);
//                    showAlert(er
                    });
            }

            function showAlert(message) {
                $ionicPopup.alert({
                    title: 'Attention!',
                    template: message
                });
            }
        }
    });
