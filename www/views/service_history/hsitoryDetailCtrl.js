/**
 * Created by admin on 2/13/2017.
 */
angular.module('starter')
    .controller('HistoryDetailCtrl',function ($scope,popups,services,$stateParams,$ionicPopup) {

        var mapOptions = {
            center: new google.maps.LatLng('0.0','0.0'),
            zoom: 15,
            disableDefaultUI: true, // a way to quickly hide all controls
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            draggable: !("ontouchend" in document)
        };
        $scope.map = new google.maps.Map(document.getElementById("googlMap"), mapOptions);

        services.getHistoryDetail($stateParams.app_appointment_id,function (resposne) {
                if(resposne.response_status == '1') {
                  $scope.cleanerData = resposne.response_data.appointment[0];
                  getPrice($scope.cleanerData)
                    var latLng = new google.maps.LatLng($scope.cleanerData.customer_latitude, $scope.cleanerData.customer_longitude);
                    $scope.map.panTo(latLng);

                    var centerMarker = new google.maps.Marker({
                        map: $scope.map,
                        position: $scope.map.getCenter(),
                        //title: 'Some location',
                        icon: {
                            url: 'img/map-marker.png',
                            size: new google.maps.Size(40, 40)
                        }
                    });
                }
        })

      $scope.showAppointment = function () {
        $scope.appoimentPopup = $ionicPopup.show({
          templateUrl: 'views/custom_dialog/appointment_popup.html',
          scope: $scope,
        });
      }
      $scope.hideAppointmentPopup = function () {
        $scope.appoimentPopup.close()
      }

      function getPrice(appt) {
        if(appt.promocode_value != undefined || appt.promocode_value != undefined){

          var totalPrice = Number(appt.confirm_price);
          var promocodeValue = Number(appt.promocode_value);
          $scope.totalPrice = totalPrice - promocodeValue;
        }else {
          $scope.totalPrice = appt.confirm_price;
        }
      }
    })
