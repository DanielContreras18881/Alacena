angular.module('alacena.controllers', [])
/**
* Controlador general
*/
.controller('AppCtrl', function() {})
/**
* Controlador de la intro
*/
.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate,$rootScope,LocalStorage) {

  // Called to navigate to the main app
  $scope.startApp = function() {
    LocalStorage.set('showedIntro',true);
    $state.go('app.listas');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})
/**
* Controlador del menú
*/
.controller('MenuCtrl', function(LocalStorage,$rootScope,$scope,logdata,$ionicPopup,jsonFactory,googleServices,$translate) {//auth,$state
  jsonFactory.getConfigData(function(data){
    $rootScope.configData = data;
    if(typeof navigator.globalization !== "undefined") {
        navigator.globalization.getPreferredLanguage(function(language) {
            console.log('app:run:getPreferredLanguage='+language);
            $translate.use((language.value).split("-")[0]).then(function(data) {}, function(error) {});
        }, function(error){
          logdata.messageError('app:run:getPreferredLanguage:error='+JSON.stringify(error));
        });
    }else{
      console.log('app:run:getPreferredLanguage:navegador=es');
      $translate.use(($rootScope.configData.idiomaDefault).split("-")[0]).then(function(data) {}, function(error) {});
    }
    if($rootScope.configData.googleLogin!==null && $rootScope.configData.googleLogin!==undefined && $rootScope.configData.googleLogin===true){
      $scope.authorize();
    }
    $rootScope.optionsOpen = false;
    $rootScope.hayFechaUltimoBackup = false;
    var hayFecha = LocalStorage.get('hayFechaUltimoBackup');
    if(hayFecha!==null && hayFecha!=='null' && hayFecha!==undefined){
      $rootScope.hayFechaUltimoBackup = hayFecha;
      $rootScope.fechaUltimoBackup  = LocalStorage.get('fechaUltimoBackup');
    }
  });
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
/*
    auth.signin({
      closable: false,
      // This asks for the refresh token
      // So that the user never has to log in again
      authParams: {
        scope: 'openid offline_access drive'
      }
    }, function(profile, idToken, accessToken, state, refreshToken) {
      console.log('profile:'+profile);
      console.log('idToken:'+idToken);
      console.log('accessToken:'+accessToken);
      console.log('state:'+state);
      console.log('refreshToken:'+refreshToken);
      /*store.set('profile', profile);
      store.set('token', idToken);
      store.set('refreshToken', refreshToken);
      $state.go('/app/listas');
    }, function(error) {
      console.log("There was an error logging in", error);
    });
    /*
    logdata.messageLog('GAPI:about='+JSON.stringify(
      Drive.about()
    ));
    logdata.messageLog('GAPI:listFiles='+JSON.stringify(
      Drive.listFiles()
    ));
    Drive.insertFiles({title: 'ficheroPrueba.txt', mimeType:'text/plain'}, {});
    */
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

    googleServices.init(function(data){
      logdata.messageLog('GAPI:dataUserInfo:'+JSON.stringify(data));
      if(data!==null && data!==undefined){
        $rootScope.nombreUsuario = data.displayName;
        $rootScope.imagenUsuario = data.picture.url;
        $rootScope.configData.googleLogin = true;
        LocalStorage.set('configData',$rootScope.configData);
      }else{
        $ionicPopup.alert({
          title: 'ERROR',
          template: 'No se ha podido hacer login contra Google.<br/>Inténtelo de nuevo más tarde'
        });
      }
    });

    logdata.messageLog('GAPI:Fin');
  };
});
