angular.module('alacena.configController', ['ionic'])
/**
* Controlador de la pantalla de configuración
*/
.controller('ConfigCtrl', function($rootScope,$scope,$ionicModal,$translate,jsonFactory,LocalStorage,logdata,backup) {

  /**
  * Cuando termina de cargar los datos en pantalla
  */
  $scope.$watch('$viewContentLoaded', function(){
      $rootScope.$broadcast('loading:hide');
  });

  /**
  * Inicializa la pantalla de configuración
  */
  $scope.initialize = function(){
    logdata.messageLog('ConfigCtrl:initialize:Inicio');
    $rootScope.showReorderbutton = false;

    jsonFactory.getConfigData(function(data){
      $rootScope.configData = data;
      $scope.claseLista = $rootScope.configData.colorDefault;
      $scope.claseElemento = $rootScope.configData.colorDefaultElement;
      $scope.idiomaSeleccionado = $scope.configData.idiomaDefault;
    });
/*
    jsonFactory.getListData(function(data){
      $scope.listas = data;
    });
*/
    //$scope.nombreLista = $scope.configData.ListaDefecto;
    logdata.messageLog('ConfigCtrl:initialize:Fin');
  }
    /**
    * Cambiar el color por defecto para las listas
    */
    $scope.changeColor = function(claseLista){
      logdata.messageLog('ConfigCtrl:changeColor:'+claseLista);
      $rootScope.configData.colorDefault = claseLista;
      LocalStorage.set('configData',$rootScope.configData);
    };
    /**
    * Cambiar el color por defecto de los elementos de las listas
    */
    $scope.changeColorElement = function(claseElemento){
      logdata.messageLog('ConfigCtrl:changeColorElement:'+claseElemento);
      $rootScope.configData.colorDefaultElement = claseElemento;
      LocalStorage.set('configData',$rootScope.configData);
    };
/*
    $scope.changeListaDefecto = function(nombreLista){
      $scope.configData.ListaDefecto = nombreLista;
      LocalStorage.set('configData',$scope.configData);
    };
*/
    /**
    * Cambia el idioma de la aplicación y lo guarda en el fichero de configuración
    */
    $scope.changeIdioma = function(idiomaSeleccionado){
      logdata.messageLog('ConfigCtrl:changeIdioma:'+idiomaSeleccionado);
      $translate.use(idiomaSeleccionado);
      $rootScope.configData.idiomaDefault= idiomaSeleccionado;
      LocalStorage.set('configData',$rootScope.configData);
    };
    /**
    * Se crea el backup de los datos actuales
    */
    $scope.hacerBackup = function(){
      logdata.messageLog('ConfigCtrl:hacerBackup:Se lanza el backup de la aplicación');
      $rootScope.$broadcast('loading:show');
      backup.makeBckp();
      var formato = "YYYY-MM-DD HH:mm:ss";
      var dia = moment().format(formato);
      $rootScope.fechaUltimoBackup = dia;
      $rootScope.hayFechaUltimoBackup = true;
    };
    /**
    * Ventana modal para dar nombre de la lista a recuperar
    */
    $ionicModal.fromTemplateUrl('templates/retrieveBackupList.html', {
      scope: $scope
    }).then(function(modalBackupRetrieveList) {
      $scope.modalBackupRetrieveList = modalBackupRetrieveList;
    });
    /**
    * Se recupera el listado de los backups realizados
    */
    $scope.recuperarListaBackups = function(){
      logdata.messageLog('ConfigCtrl:recuperarListaBackups:Se lanza la recuperación de la lista de backups de la aplicación');
      $rootScope.$broadcast('loading:show');
      backup.retrieveBckpList(function(data){
        logdata.messageLog('ConfigCtrl:recuperarListaBackups:data:'+JSON.stringify(data));
        $scope.listaBackups = data;
        $rootScope.$broadcast('loading:hide');
        $scope.modalBackupRetrieveList.show();
      });
    };
    /**
    * Se recupera el backup seleccionado
    */
    $scope.recuperarBackup = function(backup){
      logdata.messageLog('ConfigCtrl:recuperarBackup:Se lanza la recuperación del backup de la aplicación');
      logdata.messageLog('ConfigCtrl:recuperarBackup:backup:'+backup);
      $scope.modalBackupRetrieveList.hide();
    };

});
