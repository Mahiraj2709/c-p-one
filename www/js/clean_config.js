/**
 * Created by admin on 3/25/2017.
 */

/*var googleStaticImage = 63.259591,-144.667969&zoom=6&size=400x400\
 &markers=color:blue%7Clabel:S%7C62.107733,-145.541936&markers=size:tiny%7Ccolor:green%7CDelta+Junction,AK\
 &markers=size:mid%7Ccolor:0xFFFF00%7Clabel:C%7CTok,AK"&key=YOUR_API_KEY'*/
var GOOGLE_MAP_API_KEY = 'AIzaSyAxNHvWCsk1SSDyynjYjVdrKC0nX0bFBAg'
var GOOGLE_DIRECTION_SERVICE_API_KEY = 'AIzaSyDhq8fW50pqrFgpD5-n7vce4XmpeWZTDCY'
var KEY_SESSION_OUT = '8'

CLEANER_PLAY_STORE_LINK = 'https://play.google.com/store/apps/details?id=com.cleanosaur.service'
CUSTOMER_PLAY_STORE_LINK = 'https://play.google.com/store/apps/details?id=com.cleanosuar.customer'
CLEANER_ITUNES_LINK = 'https://itunes.apple.com/us/app/cleanosaur-pro/id1234141195?ls=1&mt=8'
CUSTOMER_ITUNES_LINK = 'https://itunes.apple.com/us/app/cleanosuar/id1234159233?ls=1&mt=8'


var getStaticImage = function (imageData) {
    return 'https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=400x150&markers=icon:https://farm3.staticflickr.com/2813/33812136555_8c9798d885_o_d.png|label:A|' + imageData.start.latitude + ',' + imageData.start.longitude + '&markers=icon:https://farm3.staticflickr.com/2813/32999194393_0ce1b7160e_o_d.png|label:C|' + imageData.destination.latitude + ',' + imageData.destination.longitude
        + '&path=weight:2|color:color:0x59b3f1|enc:'+imageData.points+'&key=' + GOOGLE_MAP_API_KEY;
    /*return 'https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=400x150&markers=size:large|color:red|label:A|' + imageData.start.latitude + ',' + imageData.start.longitude + '&markers=size:large|color:red|label:C|' + imageData.destination.latitude + ',' + imageData.destination.longitude
     + '&path=weight:2|color:color:0x59b3f1|enc:'+imageData.points+'&key=' + GOOGLE_MAP_API_KEY;*/
}

function clearAllUserData() {
    window.localStorage.removeItem("porfile");
    window.localStorage.removeItem("login");
    window.localStorage.removeItem("sess_tok");
}
