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
    .service('SendRequest', function ($http, $ionicLoading,CONSTANTS,$ionicPopup,$location) {
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
                    }
                })
                .error(function (err) {
                    /*hideLoading();*/
                    $ionicLoading.hide();
                    console.log(err);
//                    showAlert(er
                });
        }

        this.sendRequest = function (requestData) {

            console.log(requestData);
            var formdata = new FormData;
            //validate all the fields
            if(requestData.property_type_id < 1){
                showAlert("Please select property type!");
            } else if (requestData.square_feet_id < 1) {
                showAlert("Please give square feed of your property!");
            }  else if (requestData.bedroom_id < 1) {
                showAlert("How many bedrooms do you have?");
            } else if (requestData.bathroom_id < 1) {
                showAlert("How many bathrooms do you have?");
            } else if (requestData.clean_style_id < 1) {
                showAlert("Select your style!");
            } else if (requestData.cleaner_entry_id < 1) {
                showAlert("How will you enter?");
            }else if (!requestData.confirm_price) {
                showAlert("Please enter price!");
            }else if (isNaN(requestData.confirm_price)) {
                showAlert("Please enter valid price!");
            }else if (!requestData.work_order_details) {
                showAlert("Provide work order detail!");
            } else if (!requestData.address) {
                showAlert("Please enter address!");
            }else if (!requestData.appointment_date) {
                showAlert("Please choose appointment date!");
            } /*else if (!requestData.appointment_timezone) {
                showAlert("Email Id is required");
            } */
            else if (!requestData.appointment_time) {
                showAlert("Please select time!");
            } else {
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
                            $location.url('/home');
                            //return callback(d.response_data);
                        } else {
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
