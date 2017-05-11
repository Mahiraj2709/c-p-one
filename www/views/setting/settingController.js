/**
 * Created by maahi on 11/02/17.
 */
angular.module('starter')
  .controller('SettingCtrl', function () {

    /*services.getProfile(function (response) {
     if(response.response_status == '1') {
     $scope.settingProfile = response.response_data.profile;
     }
     })


     $scope.saveSettings = function () {

     var profileDetails = {
     first_name: $scope.settingProfile.first_name,
     last_name: $scope.settingProfile.last_name,
     about_your_description: $scope.settingProfile.about_your_description,
     device_type: CONSTANTS.deviceType(),
     session_token: window.localStorage.getItem("sess_tok"),
     email: $scope.settingProfile.email,
     mobile: $scope.settingProfile.mobile,
     language: 'en',
     latitude: LocationData.latitude,
     longitude: LocationData.longitude,
     address: $scope.settingProfile.address,
     day: "01",
     month: "01",
     year: "1970",
     reference_mode: $scope.settingProfile.reference_mode,
     quick_blox_id: $scope.settingProfile.quick_blox_id,
     office_addrs: $scope.settingProfile.office_addrs,
     home_addrs: $scope.settingProfile.home_addrs,
     emergency_contact: $scope.settingProfile.emergency_contact,
     }

     if($scope.settingProfile != undefined) {
     services.updateProfile(profileDetails,function (response) {
     if(response.response_status == '1') {
     $scope.settingProfile = response.response_data.profile;
     }
     })
     }else {
     popups.showAlert("Failed!")
     }

     }*/

  }).controller('SuggestInvite', function ($scope) {
  $scope.facebookInvite = function () {
    facebookConnectPlugin.appInvite(
      {
        url: "https://play.google.com/store/apps/details?id=com.cleanosuar.customer",
        picture: "https://lh3.googleusercontent.com/Um20qwcKVBjSNrXEtVn0gQTpFJFxorT3ruCxLSnPEXRKVE0CbAN5mBRYZIi3wF63KQ=w300-rw"
      },
      function (obj) {
        if (obj) {
          if (obj.completionGesture == "cancel") {
            // user canceled, bad guy
          } else {
            // user really invited someone :)
          }
        } else {
          // user just pressed done, bad guy
        }
      },
      function (obj) {
        // error
        console.log(obj);
      }
    );
  }
})
  .controller('ContactCtrl', function ($scope, $cordovaSocialSharing) {
    $scope.$on('$ionicView.loaded', function () {
      function onSuccess(contacts) {
        $scope.contacts = contacts;
        console.log(contacts)
        //alert('Found ' + contacts.length + ' contacts.');
      };

      function onError(contactError) {
        //alert('onError!');
      };

// find all contacts with 'Bob' in any name field
      var options = new ContactFindOptions();
      options.multiple = true;
      //options.desiredFields = [navigator.contacts.fieldType.id];
      options.hasPhoneNumber = true;
      var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
      navigator.contacts.find(fields, onSuccess, onError, options);
    })

    $scope.invite = function (phoneNos) {
      // access multiple numbers in a string like: '0612345678,0687654321'
      var message = "Hi, I have downloaded cleanosaur App to clean and its awesome. Get Cleanosuaur here "
      if(ionic.Platform.isIOS()){
        message = message + 'https://itunes.apple.com/us/app/cleanosuar/id1234159233?ls=1&mt=8'
      }
      else {
        message = message + 'https://play.google.com/store/apps/details?id=com.cleanosuar.customer'
      }
      $cordovaSocialSharing
        .shareViaSMS(message, phoneNos)
        .then(function (result) {
          // Success!
        }, function (err) {
          // An error occurred. Show a message to the user
        });
    }
  })
  .controller('EditNotificationCtrl', function ($scope, services, popups) {
    $scope.setting = {}

    $scope.$on('$ionicView.loaded', function () {
      services.notificationsetting(function (response) {
        if (response.response_status == '1') {
          if (response.response_data.notificationsetting == '1') {
            $scope.setting.text = 'text';
              console.log($scope.setting.text + '1')
          } else if (response.response_data.notificationsetting == '2') {
            $scope.setting.text = 'noti';
            console.log($scope.setting.text + '2')
          }
        }
      })
    })

    $scope.saveSettings = function () {
      var type;
      if ($scope.setting.text == 'text')
        type = '1'
      else
        type = '2'
      services.editnotificationsetting(type, function (response) {

      })
    }
  })

