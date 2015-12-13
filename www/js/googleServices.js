angular.module('alacena.googleServices', [])

/**
* Factoría que permite
*/
.factory('googleServices',function($http,logdata,Drive,GAPI,$rootScope){

  function getUserInfo(callback){
    $http({
      method: 'GET',
      //url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+$rootScope.configData.access_token
      url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&key=1053014364968-i826ic0mfi6g0p4rk47ma09jl0gehgai.apps.googleusercontent.com'
    }).then(function successCallback(response) {
        logdata.messageLog('googleServices:init:getUserInfo:OK:'+JSON.stringify(response));
        callback(response.data);
      }, function errorCallback(response) {
        logdata.messageLog('googleServices:init:getUserInfo:KO:'+JSON.stringify(response));
        callback(null);
    });
  }

  var googleServices = {};

  googleServices.init = function(callback){
    GAPI.init()
      .then(
        function(){
          var dataUserDrive = Drive.about();
          callback(dataUserDrive.user);
        },
        function(){
          console.log('Something went wrong yes?');
        }
    );
    /*
    $cordovaOauth.google(
        "1053014364968-i826ic0mfi6g0p4rk47ma09jl0gehgai.apps.googleusercontent.com",
        [
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/contacts.readonly',
          'https://www.googleapis.com/auth/userinfo.profile'
        ],
        {redirect_uri: 'http://localhost/callback/'}
      ).then(
        function(result) {
          logdata.messageLog('googleServices:init:ok:'+JSON.stringify(result));
          $rootScope.authorized = true;
          $rootScope.configData.access_token = result.access_token;
          getUserInfo(callback);
        },
        function(error) {
          logdata.messageLog('googleServices:init:error:'+JSON.stringify(error));
          callback(null);
        }
    );
    */
  };

  googleServices.userInfo = function(callback){
    getUserInfo(callback);
  };

  googleServices.writeFile = function(fileName,data){
    var params = {
     "description": "Alacena: "+fileName,
     "editable": true,
     "fileExtension": "json",
     "mimeType": "application/json",
     "title": fileName
   };
    $http({
      method: 'POST',
      url: 'https://www.googleapis.com/upload/drive/v2/files?uploadType=media&convert=false&ocr=true&key='+$rootScope.configData.access_token,
      data: data
    }).then(function successCallback(response) {
        logdata.messageLog('googleServices:writeFile:OK:'+JSON.stringify(response));
      }, function errorCallback(response) {
        logdata.messageLog('googleServices:writeFile:KO:'+JSON.stringify(response));
    });
  };

  return googleServices;
})
;
