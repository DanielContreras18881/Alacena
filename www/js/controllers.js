angular.module('alacena.controllers', [])
/**
* Controlador general
*/
.controller('AppCtrl', function() {})
/**
* Controlador de la intro
*/
.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate,$rootScope,LocalStorage) {

  $scope.initialize = function(){
    $scope.slidesTutorial = [
      {"image":"img/tutorial/tut_01.png","text":"TUT_01"},
      {"image":"img/tutorial/tut_02.png","text":"TUT_02"},
      {"image":"img/tutorial/tut_03.png","text":"TUT_03"},
      {"image":"img/tutorial/tut_07.png","text":"TUT_07"},
      {"image":"img/tutorial/tut_08.png","text":"TUT_08"},
      {"image":"img/tutorial/tut_09.png","text":"TUT_09"},
      {"image":"img/tutorial/tut_11.png","text":"TUT_11"},
      {"image":"img/tutorial/tut_12.png","text":"TUT_12"},
      {"image":"img/tutorial/tut_13.png","text":"TUT_13"},
      {"image":"img/tutorial/tut_15.png","text":"TUT_15"},
      {"image":"img/tutorial/tut_16.png","text":"TUT_16"},
      {"image":"img/tutorial/tut_17.png","text":"TUT_17"},
      {"image":"img/tutorial/tut_18.png","text":"TUT_18"},
      {"image":"img/tutorial/tut_19.png","text":"TUT_19"},
      {"image":"img/tutorial/tut_20.png","text":"TUT_20"},
      {"image":"img/tutorial/tut_21.png","text":"TUT_21"},
    ];
  }
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
.controller('MenuCtrl', function(LocalStorage,$rootScope,$scope,logdata,$ionicPopup,jsonFactory,googleServices,$translate,$filter) {//auth,$state
  jsonFactory.getConfigData(function(data){
    $rootScope.configData = data;
    $rootScope.optionsOpen = false;
    $rootScope.hayFechaUltimoBackup = false;
    var hayFecha = LocalStorage.get('hayFechaUltimoBackup');
    if(hayFecha!==null && hayFecha!=='null' && hayFecha!==undefined){
      $rootScope.hayFechaUltimoBackup = hayFecha;
      $rootScope.fechaUltimoBackup  = LocalStorage.get('fechaUltimoBackup');
    }
    if(typeof navigator.globalization !== "undefined") {
        navigator.globalization.getPreferredLanguage(function(language) {
            console.log('app:run:getPreferredLanguage='+language);
            $translate.use((language.value).split("-")[0]).then(function(data) {
              $rootScope.textoFechaUltimoBackup = $filter('filterDateBckp')($rootScope.fechaUltimoBackup );
              $rootScope.$evalAsync();
            }, function(error) {});
        }, function(error){
          logdata.messageError('app:run:getPreferredLanguage:error='+JSON.stringify(error));
        });
    }else{
      console.log('app:run:getPreferredLanguage:navegador=es');
      $translate.use(($rootScope.configData.idiomaDefault).split("-")[0]).then(function(data) {
        $rootScope.textoFechaUltimoBackup = $filter('filterDateBckp')($rootScope.fechaUltimoBackup );
        $rootScope.$evalAsync();
      }, function(error) {});
    }
    if($rootScope.configData.googleLogin!==null && $rootScope.configData.googleLogin!==undefined && $rootScope.configData.googleLogin===true){
      $scope.authorize();
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
