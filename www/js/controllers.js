angular.module('alacena.controllers', [])
/**
* Controlador general
*/
.controller('AppCtrl', function() {

})
/**
* Controlador del menú
*/
.controller('MenuCtrl', function($q,LocalStorage,$rootScope,$scope,logdata,googleServices,$ionicPopup,jsonFactory,DriveService,Drive,GAPI) {
  $rootScope.authorized = false;
  jsonFactory.getConfigData(function(data){
    $rootScope.configData = data;
    if($rootScope.configData.access_token!==null && $rootScope.configData.access_token!==undefined){
      $rootScope.authorized = true;
      googleServices.userInfo(function(data){
        if(data!==null){
          $rootScope.nombreUsuario = data.name;
          $rootScope.imagenUsuario = data.picture;
        }
      });
    }
  });
  $rootScope.optionsOpen = false;
  $rootScope.hayFechaUltimoBackup = false;
  var hayFecha = LocalStorage.get('hayFechaUltimoBackup');
  if(hayFecha!==null && hayFecha!=='null' && hayFecha!==undefined){
    $rootScope.hayFechaUltimoBackup = hayFecha;
    $rootScope.fechaUltimoBackup  = LocalStorage.get('fechaUltimoBackup');
  }
  GAPI.init();
  /**
  * Muestra las opciones de reordenación
  */
  $rootScope.reorder = function(){
    $rootScope.showReorder = !$rootScope.showReorder;
  };
  /**
  * Función que realiza la autorización con Google
  */
  $scope.authorize = function () {
    logdata.messageLog('GAPI:Inicio');
    logdata.messageLog('GAPI:about='+JSON.stringify(
      Drive.about()
    ));
    logdata.messageLog('GAPI:listFiles='+JSON.stringify(
      Drive.listFiles()
    ));
    Drive.insertFiles({title: 'ficheroPrueba.txt', mimeType:'text/plain'}, {});
    /*
    var defer = $q.defer();
    var client_id = "1053014364968-i826ic0mfi6g0p4rk47ma09jl0gehgai.apps.googleusercontent.com";//web-app
    var scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/userinfo.email'];

    Drive.authenticate(client_id, scopes, {redirect_uri: 'http://localhost/callback/'})
        .then(function (response) {
          if (response) {
            console.log("UserInfo: " + JSON.stringify(response));
            token = response.access_token;
            gapi.auth.setToken(response);
            //email= response.authResponse.email;
            authenticated = true;
            defer.resolve('authenticated');
          }
        },
        function (error) {
          console.log("" + error);
          defer.reject('de-authenticated');
        });
    return defer.promise;
    */
    /*
    DriveService.files.insert({title: 'ficheroPrueba.txt', mimeType:'text/plain'});
    logdata.messageLog('GAPI:'+JSON.stringify(
      DriveService.files.list({q:"mimeType = 'text/plain' and trashed = false"}, true).data
    ));
    */
    /*
    googleServices.userInfo(function(dataUserInfo){
        logdata.messageLog('GAPI:dataUserInfo:'+JSON.stringify(dataUserInfo));
    });
    */
    /*
    googleServices.init(function(data){
      LocalStorage.set('configData',$rootScope.configData);
      if(data!==null){
        $rootScope.nombreUsuario = data.name;
        $rootScope.imagenUsuario = data.picture;
      }else{
        $ionicPopup.alert({
          title: 'ERROR',
          template: 'No se ha podido hacer login contra Google.<br/>Inténtelo de nuevo más tarde'
        });
      }
    });
    */
    logdata.messageLog('GAPI:Fin');
  };
});
