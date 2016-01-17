angular.module('alacena.configController', ['ionic'])
/**
* Controlador de la pantalla de configuración
*/
.controller('ConfigCtrl', function($rootScope,$scope,$ionicModal,$translate,$ionicPopup,jsonFactory,LocalStorage,logdata,backup,Spinner) {

  /**
  * Cuando termina de cargar los datos en pantalla
  */
  $scope.$watch('$viewContentLoaded', function(){
      Spinner.hide();
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
  };
  /**
  * Guarda los cambios realizados en la configuración
  */
  $scope.saveConfig = function(){
    logdata.messageLog('ConfigCtrl:saveConfig');
    LocalStorage.set('configData',$rootScope.configData);
  };
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
      Spinner.show();
      backup.makeBckp(function(data){
        if(data){
          var formato = "YYYY-MM-DD HH:mm:ss";
          var dia = moment().format(formato);
          $rootScope.fechaUltimoBackup = dia;
          $rootScope.hayFechaUltimoBackup = true;
          $translate(['EXITO','BACKUP_OK',]).then(function (translations) {
            Spinner.hide();
            $ionicPopup.alert({
  						title: translations.EXITO,
  						template: translations.BACKUP_OK
  					});
          });
        }else{
          $rootScope.hayFechaUltimoBackup = false;
          $translate(['ERROR','BACKUP_KO',]).then(function (translations) {
            Spinner.hide();
            $ionicPopup.alert({
              title: translations.ERROR,
              template: translations.BACKUP_KO
            });
          });
        }
      });
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
      Spinner.show();
      backup.retrieveBckpList(function(data){
        logdata.messageLog('ConfigCtrl:recuperarListaBackups:data:'+JSON.stringify(data));
        $scope.listaBackups = data;
        $scope.modalBackupRetrieveList.show();
        Spinner.hide();
      });
    };
    /**
    * Se recupera el backup seleccionado
    */
    $scope.recuperarBackup = function(backupRecuperar){
      logdata.messageLog('ConfigCtrl:recuperarBackup:Se lanza la recuperación del backup de la aplicación');
      logdata.messageLog('ConfigCtrl:recuperarBackup:backup:'+backupRecuperar);
      $translate(['PREGUNTA_RECUPERAR_BACKUP','NO','SI']).then(function (translations) {
        var confirmPopup = $ionicPopup.confirm({
          title: translations.PREGUNTA_RECUPERAR_BACKUP,
          template: $translate('PREGUNTA_RECUPERAR_NOMBRE_BACKUP', { nombre:backupRecuperar }),
          cancelText: translations.NO,
          okText: translations.SI
        });
        confirmPopup.then(function(res) {
          if(res) {
            Spinner.show();
            backup.retrieveBckp(backupRecuperar,function(data){
              $scope.modalBackupRetrieveList.hide();
              Spinner.hide();
              if(data){
                $translate('MOVER_PREGUNTA', { nombre:nombre })
                $ionicPopup.alert({
                  title: $translate('AVISO'),
                  template: $translate('BACKUP_RECUPERADO', { nombre:backupRecuperar })
                });
              }else{
                $ionicPopup.alert({
                  title: $translate('ERROR'),
                  template: $translate('BACKUP_NO_RECUPERADO', { nombre:backupRecuperar })
                });
              }
            });
          }
        });
      });
    };

});
