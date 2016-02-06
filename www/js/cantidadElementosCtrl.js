angular.module('alacena.cantidadElementosController', ['ionic'])
/**
* Controlador de la pantalla de lista de elementos
*/
.controller('ListaCtrl', function($rootScope,$scope,$stateParams,$filter,$translate,$ionicPopover,
                                  $ionicModal,$ionicListDelegate,$ionicPopup,$ionicFilterBar,
                                  jsonFactory,LocalStorage,logdata,$cordovaLocalNotification,
                                  favoritas,Spinner,webNotification,$state) {

  $scope.getElements = function (query) {
      if (query) {
          return {
              items: $filter('filtrarElementos')($rootScope.elementos, query)
          };
      }
      return {items: []};
  };
  $scope.itemsClicked = function (callback) {
      logdata.messageLog('itemsClicked:'+callback);
  };
  $scope.itemsRemoved = function (callback) {
      logdata.messageLog('itemsRemoved:'+callback);
  };
  /**
  * Cuando termina de cargar los datos en pantalla
  */
  $scope.$watch('$viewContentLoaded', function(){
      Spinner.hide();
  });

  /**
  * Para mostrar el menú en la lista de la compra
  */
  $ionicPopover.fromTemplateUrl('templates/menuListaCompra.html', {
      scope: $scope,
    }).then(function(popover) {
      $scope.popover = popover;
    });

  var filterBarInstance;
  /**
  * Muestra el filtro de la lista de elementos
  */
  $scope.showFilterBar = function () {
    $scope.popover.hide();
    $translate(['CANCELAR']).then(function (translations) {
      filterBarInstance = $ionicFilterBar.show({
        cancelText: translations.CANCELAR,
        debounce: true,
        delay: 25,
        items: $rootScope.elementosLista,
        update: function (filteredItems, filterText) {
          $rootScope.elementosLista = filteredItems;
          logdata.messageLog('ListaCtrl:showFilterBar:Filtrado por:'+filterText);
        }
      });
    });
  };
  /**
  * Inicializa la pantalla de lista de elementos
  */
  $scope.initialize = function(){

    logdata.messageLog('ListaCtrl:initialize:Inicio');

    $scope.nombreListaFavorita = "";
    $scope.nombreLista = $stateParams.nombreLista;
    $scope.listaEditable = $stateParams.listaEditable;
    $scope.colorLista = $stateParams.colorLista;

    $rootScope.showReorderbutton = false;

    $scope.coloresElementos = $rootScope.configData.configColorsElements;
    $scope.colorDefaultElement = $rootScope.configData.colorDefaultElement;
    $scope.colorbotonesEditablesDefaultElement = $filter('filter')($rootScope.configData.configColorsElements, {"claseElemento":$rootScope.configData.colorDefaultElement}, true)[0].botonesEditables;
    $scope.askAddListaCompra = $rootScope.configData.askAddListaCompra;
    $scope.deleteAt0 = $rootScope.configData.deleteAt0;
    $scope.cantidadMinimaDefecto = $rootScope.configData.cantidadMinimaDefecto;
    $scope.expireReminders = $rootScope.configData.expireReminders;

    /*
    jsonFactory.getListData(function(data){
      $rootScope.listas = data;
    });

    jsonFactory.getElementListData(function(data){
      $rootScope.elementosLista = data;
      var elementosFiltrados = $filter('filtrarLista')($rootScope.elementosLista,$scope.nombreLista);
      //$rootScope.showReorderbutton = elementosFiltrados.length > 1;
      $rootScope.showReorderbutton = false;
    });

    jsonFactory.getElementData(function(data){
      $rootScope.elementos = data;
    });

    jsonFactory.getConfigData(function(data){
      $scope.coloresElementos = data.configColorsElements;
      $scope.colorDefaultElement = data.colorDefaultElement;
      $scope.colorbotonesEditablesDefaultElement = $filter('filter')(data.configColorsElements, {"claseElemento":data.colorDefaultElement}, true)[0].botonesEditables;
      $scope.askAddListaCompra = data.askAddListaCompra;
      $scope.deleteAt0 = data.deleteAt0;
      $scope.cantidadMinimaDefecto = data.cantidadMinimaDefecto;
      $scope.expireReminders = data.expireReminders;
    });
    */
    /**
    * Ventana modal para añadir un elemento
    */
    $ionicModal.fromTemplateUrl('templates/addElemento.html', {
      scope: $scope
    }).then(function(modalElemento) {
      $scope.modalElemento = modalElemento;
    });

    logdata.messageLog('ListaCtrl:initialize:Fin');
  };
  /**
  * Se cierran los botones de operación
  */
  $scope.closeButons = function(){
    $rootScope.optionsOpen = !$rootScope.optionsOpen;
    $ionicListDelegate.closeOptionButtons();
  }
  /**
  * Muestra una ventana modal para editar un elemento
  */
  $scope.edit = function(item) {
    logdata.messageLog('ListaCtrl:edit:'+JSON.stringify(item));
    $rootScope.optionsOpen = !$rootScope.optionsOpen;
    if(item.caduca){
      $scope.fechaDisabled = false;
      item.fechaCaducidad = moment(item.fechaCaducidad).hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
    }else{
      $scope.fechaDisabled = true;
      item.fechaCaducidad = moment('3015-12-31T22:00:00.000Z').hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
    }
    $scope.newElement = item;
    $scope.newElement.colorElemento = item.colorElementoNoCaducado;
    $scope.newElement.colorBotones = item.colorBotonesNoCaducado;
    $scope.colorElemento = item.colorElementoNoCaducado;
    logdata.messageLog('ListaCtrl:edit:$scope.newElement='+JSON.stringify($scope.newElement));
    $ionicListDelegate.closeOptionButtons();
    $scope.modalElemento.show();
  };
  /**
  * Establece un color en un elemento concreto
  */
  $scope.setColor = function(claseElemento){
    logdata.messageLog('ListaCtrl:setColor:'+claseElemento);
    $scope.elementoLista.colorElemento = claseElemento;
    $scope.elementoLista.colorBotones = $filter('filter')($scope.coloresElementos, {"claseElemento":claseElemento})[0].botonesEditables;
    $scope.elementoLista.colorElementoNoCaducado = $scope.elementoLista.colorElemento;
    $scope.elementoLista.colorBotonesNoCaducado = $scope.elementoLista.colorBotones;
  };
  /**
   * Establece las notificaciones locales para la decha de caducidad de un elemento
   */
  $scope.establishExpireReminders = function(element){
    $translate(['CADUCIDAD','CADUCA_MANIANA','CADUCA_3_DIAS']).then(function (translations) {
      if(window.cordova){
        var objetoCaducidad1 = {
          id: moment().valueOf(),
          title: translations.CADUCIDAD,
          text: element.nombreLista+'\n'+element.nombreElemento+'\n'+translations.CADUCA_MANIANA,
          at: moment(element.fechaCaducidad).add(-1,'days'),
          sound: 'file://sounds/sound.mp3',
          data: {
                nombreLista: $scope.nombreLista,
                colorLista: $scope.colorLista,
                listaEditable: $scope.listaEditable
          }
        };
        if(ionic.Platform.isAndroid()){
          objetoNotificacion.icon = 'file://img/icon.png';
          objetoNotificacion.smallIcon = '';
        }
        var objetoCaducidad3 = objetoCaducidad1;
        objetoCaducidad3.at = moment(element.fechaCaducidad).add(-3,'days');
        objetoCaducidad3.text = element.nombreLista+'\n'+element.nombreElemento+'\n'+translations.CADUCA_3_DIAS;
        $cordovaLocalNotification.schedule([objetoCaducidad1,objetoCaducidad3]).then(function (result) {});
      }else{
        var milisecondsToCaducidad1 = moment(element.fechaCaducidad).add(-1,'days').subtract(1, 'hour').toDate().getTime() - moment().toDate().getTime();
        var milisecondsToCaducidad3 = moment(element.fechaCaducidad).add(-3,'days').subtract(1, 'hour').toDate().getTime() - moment().toDate().getTime();
        setTimeout(function hideNotification() {
          webNotification.showNotification(translations.CADUCIDAD, {
              body: element.nombreLista+'\n'+element.nombreElemento+'\n'+translations.CADUCA_MANIANA,
              icon: '../img/icon.png',
              onClick: function onNotificationClicked() {
                  $state.go('app.lista', {
                    nombreLista: $scope.nombreLista,
                    colorLista: $scope.colorLista,
                    listaEditable: $scope.listaEditable
                  });
              },
              pageVisibility : true,
              //autoClose: 3000 //auto close the notification after 2 seconds (you manually close it via hide function)
          }, function onShow(error, hide) {
              if (error) {
                logdata.messageError('Unable to show notification: ' + error.message);
              } else {
                  setTimeout(function hideNotification() {
                      hide(); //manually close the notification (or let the autoClose close it)
                  }, 5000);
              }
          });
        }, milisecondsToCaducidad1);
        setTimeout(function hideNotification() {
          webNotification.showNotification(translations.CADUCIDAD, {
              body: element.nombreLista+'\n'+element.nombreElemento+'\n'+translations.CADUCA_3_DIAS,
              icon: '../img/icon.png',
              onClick: function onNotificationClicked() {
                  $state.go('app.lista', {
                    nombreLista: $scope.nombreLista,
                    colorLista: $scope.colorLista,
                    listaEditable: $scope.listaEditable
                  });
              },
              pageVisibility : true,
              //autoClose: 3000 //auto close the notification after 2 seconds (you manually close it via hide function)
          }, function onShow(error, hide) {
              if (error) {
                logdata.messageError('Unable to show notification: ' + error.message);
              } else {
                  setTimeout(function hideNotification() {
                      hide(); //manually close the notification (or let the autoClose close it)
                  }, 5000);
              }
          });
        }, milisecondsToCaducidad3);
      }
    });
  };
  /**
  * Guarda un elemento creado o editado
  */
  $scope.save = function(element){
    logdata.messageLog('ListaCtrl:save:'+JSON.stringify(element.nombreElemento));
    if(element.nombreElemento.originalObject!==undefined){
      if(element.nombreElemento.originalObject.nombreElemento!==undefined){
        element.nombreElemento = element.nombreElemento.originalObject.nombreElemento;
        logdata.messageLog('ListaCtrl:save:1:'+element.nombreElemento);
      }else{
        element.nombreElemento = element.nombreElemento.originalObject;
        logdata.messageLog('ListaCtrl:save:2:'+element.nombreElemento);
      }
    }else{
      element.nombreElemento = element.nombreElemento;
      logdata.messageLog('ListaCtrl:save:3:'+element.nombreElemento);
    }
    logdata.messageLog('ListaCtrl:save:'+JSON.stringify(element.nombreElemento));
    if(element.caduca){
      logdata.messageLog('ListaCtrl:save:Se transforma la fecha de caducidad');
      element.fechaCaducidad = moment(element.fechaCaducidad).hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
      if($scope.expireReminders){
        $scope.establishExpireReminders(element);
      }
    }else{
      element.fechaCaducidad = moment('3015-12-31T22:00:00.000Z').hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
    }
    if($filter('filter')($rootScope.elementosLista,element).length===0) {
      logdata.messageLog('ElementosCtrl:save:Se comprueba que es nuevo');
      $rootScope.elementosLista.push(element);
      var listadoElementos = $filter('filter')($rootScope.elementos,{"nombreElemento":element.nombreElemento});
      if(listadoElementos!==undefined && listadoElementos.length===0) {
        logdata.messageLog('ElementosCtrl:save:Se comprueba que es nuevo en el histórico');
        $rootScope.elementos.push({"nombreElemento":element.nombreElemento});
      }
    }else{
      logdata.messageLog('ElementosCtrl:save:Se comprueba que es modificación');
      if(element.cantidadElemento<element.cantidadMinima){
        logdata.messageLog('ElementosCtrl:save:Se comprueba que se ha quedado bajo la catidad mínima');
        $scope.preguntaTraslado(element.nombreElemento,function(){
          logdata.messageLog('ElementosCtrl:save:Trasladamos a la Lista de la Compra');
          $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(element), 1);
          var elementosFiltrados = $filter('filter')($rootScope.elementosLista,
                {"nombreElemento":element.nombreElemento,"nombreLista":'LISTA_COMPRA'});
          if(elementosFiltrados.length > 0) {
            logdata.messageLog('ElementosCtrl:save:Ya existe, incrementamos la cantidad');
            var cantidadActual = elementosFiltrados[0].cantidadElemento;
            elementosFiltrados[0].cantidadElemento=cantidadActual+elementosFiltrados[0].cantidadMinima;
          }else{
            logdata.messageLog('ElementosCtrl:save:No existe, se crea');
            $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(element), 1);
            element.nombreLista='LISTA_COMPRA';
            element.cantidadElemento = element.cantidadMinima;
            $rootScope.elementosLista.push(element);
          }
          LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
        });
      }
    }
    logdata.messageLog('ElementosCtrl:save:Guardamos los cambios');
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    LocalStorage.set('elementos',$rootScope.elementos);
    $scope.modalElemento.hide();
    $ionicListDelegate.closeOptionButtons();
    $scope.initialize();
    $scope.$evalAsync();
  };
  /**
  * Mueve un elemento de una lista a otra
  */
  $scope.changeLista = function(lista){
    logdata.messageLog('ListaCtrl:changeLista:'+lista);
    var listaAnterior = $scope.elementoLista.nombreLista;
    if($scope.elementoLista.nombreLista==='LISTA_COMPRA'){
      logdata.messageLog('ListaCtrl:changeLista:Si se viene de Lista de la Compra se crea nuevo elemento');
      var newElementLista = {
        "nombreElemento":$scope.elementoLista.nombreElemento,
        "colorElemento":$scope.elementoLista.colorElemento,
        "colorBotones":$scope.elementoLista.colorBotones,
        "colorElementoNoCaducado":$scope.elementoLista.colorElementoNoCaducado,
        "colorBotonesNoCaducado":$scope.elementoLista.colorBotonesNoCaducado,
        "nombreLista":lista,
        "cantidadElemento":$scope.elementoLista.cantidadElemento,
        "caduca":$scope.elementoLista.caduca,
        "fechaCaducidad":$scope.elementoLista.fechaCaducidad,
        "cantidadMinima":$scope.elementoLista.cantidadMinima,
        "marked":false
      };
      logdata.messageLog('ListaCtrl:changeLista:newElementLista='+newElementLista);
      var busquedaNuevo = $filter('filter')($rootScope.elementosLista, {"nombreElemento":newElementLista.nombreElemento,"nombreLista":newElementLista.nombreLista}, true);
      if(busquedaNuevo.length>0){
        logdata.messageLog('ListaCtrl:changeLista:Ya existe, incrementamos la cantidad');
        var cantidadActualNuevo = busquedaNuevo[0].cantidadElemento;
        busquedaNuevo[0].cantidadElemento=cantidadActualNuevo+newElementLista.cantidadElemento;
      }else{
        logdata.messageLog('ElementosCtrl:changeLista:No existe, se crea');
        $rootScope.elementosLista.push(newElementLista);
      }
    }else{
      var busqueda = $filter('filter')($rootScope.elementosLista, {"nombreElemento":$scope.elementoLista.nombreElemento,"nombreLista":lista}, true);
      $scope.elementoLista.nombreLista = lista;
      if(busqueda.length>0){
        logdata.messageLog('ListaCtrl:changeLista:Ya existe, incrementamos la cantidad');
        var cantidadActual = busqueda[0].cantidadElemento;
        busqueda[0].cantidadElemento=cantidadActual+$scope.elementoLista.cantidadElemento;
      }else{
        logdata.messageLog('ElementosCtrl:changeLista:No existe, se crea');
        if(lista==='LISTA_COMPRA'){
          logdata.messageLog('ElementosCtrl:changeLista:Si es Lista de la Compra inicializamos valores');
          $scope.elementoLista.colorElemento = $scope.elementoLista.colorElementoNoCaducado;
          $scope.elementoLista.colorBotones = $scope.elementoLista.colorBotonesNoCaducado;
          $scope.elementoLista.fechaCaducidad = null;
          $scope.elementoLista.caduca = false;
        }
        $rootScope.elementosLista.push($scope.elementoLista);
      }
      var busquedaAnterior = $filter('filter')($rootScope.elementosLista, {"nombreElemento":$scope.elementoLista.nombreElemento,"nombreLista":listaAnterior}, true);
      if(busquedaAnterior[0].cantidadElemento === $scope.elementoLista.cantidadElemento){
        $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(busquedaAnterior[0]), 1);
      }else{
        busquedaAnterior[0].cantidadElemento=busquedaAnterior[0].cantidadElemento-$scope.elementoLista.cantidadElemento;
      }
    }
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    $scope.modalMoveElement.hide();
  };
  /**
  * Pregunta si se tiene que mover un elemento a la lista de la compra
  */
  $scope.preguntaTraslado = function(nombre,callback){
    logdata.messageLog('ListaCtrl:preguntaTraslado:'+nombre);
    logdata.messageLog('ListaCtrl:preguntaTraslado:$scope.askAddListaCompra='+$scope.askAddListaCompra);
    if($scope.askAddListaCompra){
      logdata.messageLog('ListaCtrl:preguntaTraslado:Se pregunta para hacer el traslado');
      $translate(['MOVER','NO','SI']).then(function (translations) {
        var confirmPopup = $ionicPopup.confirm({
          title: translations.MOVER+nombre,
          template: $translate('MOVER_PREGUNTA', { nombre:nombre }),
          cancelText: translations.NO,
          okText: translations.SI
        });
        confirmPopup.then(function(res) {
          if(res) {
            logdata.messageLog('ListaCtrl:preguntaTraslado:Se confirma el traslado'+JSON.stringify(res));
            callback();
          }
        });
      });
    }else{
      logdata.messageLog('ListaCtrl:preguntaTraslado:No se pregunta para hacer el traslado');
      callback();
    }

  };
  /**
  * Se quita una unidad a un elemento
  */
  $scope.minusElement = function(item) {
    logdata.messageLog('ListaCtrl:minusElement:'+JSON.stringify(item));
    var elemento = {
      "nombreElemento":item.nombreElemento,
      "colorElemento":item.colorElemento,
      "colorBotones":item.colorBotones,
      "colorElementoNoCaducado":item.colorElementoNoCaducado,
      "colorBotonesNoCaducado":item.colorBotonesNoCaducado,
      "nombreLista":item.nombreLista,
      "cantidadElemento":item.cantidadElemento,
      "caduca":item.caduca,
      "fechaCaducidad":item.fechaCaducidad,
      "cantidadMinima":item.cantidadMinima,
      "marked":item.marked
    };
    if(elemento.cantidadElemento>0){
      elemento.cantidadElemento = --elemento.cantidadElemento;
      item.cantidadElemento = --item.cantidadElemento;
      if(elemento.cantidadElemento<elemento.cantidadMinima){
        logdata.messageLog('ListaCtrl:minusElement:Se comprueba que se ha quedado bajo la catidad mínima');
        $scope.preguntaTraslado(elemento.nombreElemento,function(){
          logdata.messageLog('ListaCtrl:minusElement:Trasladamos a la Lista de la Compra');
          //$rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(elemento), 1);
          var elementosFiltrados = $filter('filter')($rootScope.elementosLista,
                {"nombreElemento":elemento.nombreElemento,"nombreLista":'LISTA_COMPRA'});
          if(elementosFiltrados.length > 0) {
            logdata.messageLog('ListaCtrl:minusElement:Ya existe, incrementamos la cantidad');
            var cantidadActual = elementosFiltrados[0].cantidadElemento;
            elementosFiltrados[0].cantidadElemento=cantidadActual+elementosFiltrados[0].cantidadMinima;
          }else{
            logdata.messageLog('ElementosCtrl:minusElement:No existe, se crea');
            elemento.nombreLista='LISTA_COMPRA';
            elemento.cantidadElemento = elemento.cantidadMinima;
            $rootScope.elementosLista.push(elemento);
          }
          LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
        });
      }
    }else{
      if(elemento.cantidadMinima===0){
        logdata.messageLog('ElementosCtrl:minusElement:No se traslada a la Lista de la Compra');
        if($scope.deleteAt0){
          $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(item), 1);
        }
      }else{
        $scope.preguntaTraslado(elemento.nombreElemento,function(){
          logdata.messageLog('ListaCtrl:minusElement:Trasladamos a la Lista de la Compra');
          if($scope.deleteAt0){
            $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(item), 1);
          }
          var elementosFiltrados = $filter('filter')($rootScope.elementosLista,
                {"nombreElemento":elemento.nombreElemento,"nombreLista":'LISTA_COMPRA'});
          if(elementosFiltrados.length > 0) {
            logdata.messageLog('ListaCtrl:minusElement:Ya existe, incrementamos la cantidad');
            var cantidadActual = elementosFiltrados[0].cantidadElemento;
            elementosFiltrados[0].cantidadElemento=cantidadActual+elementosFiltrados[0].cantidadMinima;
          }else{
            logdata.messageLog('ElementosCtrl:minusElement:No existe, se crea');
            elemento.nombreLista='LISTA_COMPRA';
            elemento.cantidadElemento = elemento.cantidadMinima;
            $rootScope.elementosLista.push(elemento);
          }
          LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
        });
      }
    }
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    $ionicListDelegate.closeOptionButtons();
    $scope.initialize();
    $scope.$evalAsync();
  };
  /**
  * Se añade una unidad a un elemento
  */
  $scope.plusElement = function(item) {
    logdata.messageLog('ListaCtrl:plusElement:'+JSON.stringify(item));
    item.cantidadElemento = ++item.cantidadElemento;
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    $ionicListDelegate.closeOptionButtons();
    $scope.initialize();
    $scope.$evalAsync();
  };
  /**
  * Muestra una ventana modal para mover un elemento de una lista a otra
  */
  $scope.moveTo = function(item) {
    logdata.messageLog('ListaCtrl:moveTo:'+JSON.stringify(item));
    $rootScope.optionsOpen = !$rootScope.optionsOpen;
    $scope.elementoLista = {
      "nombreElemento":item.nombreElemento,
      "colorElemento":item.colorElemento,
      "colorBotones":item.colorBotones,
      "colorElementoNoCaducado":item.colorElementoNoCaducado,
      "colorBotonesNoCaducado":item.colorBotonesNoCaducado,
      "nombreLista":item.nombreLista,
      "cantidadElemento":item.cantidadElemento,
      "caduca":item.caduca,
      "fechaCaducidad":item.fechaCaducidad,
      "cantidadMinima":item.cantidadMinima,
      "marked":item.marked
    };
    var listasFiltradas = $filter('filtrarQuitarLista')($rootScope.listas,$scope.nombreLista);
    $scope.nuevoNombreLista = listasFiltradas[0].nombreLista;
    $scope.fechaDisabled = !item.caduca;
    $scope.elementoLista.colorElemento = item.colorElementoNoCaducado;
    $scope.elementoLista.colorBotones = item.colorBotonesNoCaducado;
    $scope.colorElemento = item.colorElementoNoCaducado;
    $scope.modalMoveElement.show();
    $ionicListDelegate.closeOptionButtons();
  };
  /**
  * Se marca o desmarca un elemento de la lista de la compra
  */
  $scope.markAcquired = function(item) {
    logdata.messageLog('ListaCtrl:markAcquired:'+JSON.stringify(item));
    if(item.marked){
      item.marked = false;
    }else{
      item.marked = true;
    }
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
  };
  /**
  * Ventana modal para mover un elemento
  */
  $ionicModal.fromTemplateUrl('templates/moveElement.html', {
    scope: $scope
  }).then(function(modalMoveElement) {
    $scope.modalMoveElement = modalMoveElement;
  });
  /**
  * Cambia que el elemento tenga fecha de caducidad o no
  */
  $scope.cambioCaducidad = function(){
    logdata.messageLog('ListaCtrl:cambioCaducidad');
    $scope.fechaDisabled=!$scope.fechaDisabled;
    if($scope.fechaDisabled){
      $scope.newElement.fechaCaducidad = moment('3015-12-31T22:00:00.000Z').hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
    }else{
      $scope.newElement.fechaCaducidad = moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
    }
  };
  /**
   * Se resta una unidad minima a un elemento
   */
  $scope.minusElementMin = function(item){
    item.cantidadMinima = --item.cantidadMinima;
    $scope.checkMinimumElement();
  };
  /**
  * Se añade una unidad minima a un elemento
  */
  $scope.plusElementMin = function(item) {
    item.cantidadMinima = ++item.cantidadMinima;
  };
  /**
   * Chequea la cantidad minima de un elemento
   */
  $scope.checkMinimumElement = function(){
    var minimo = $scope.newElement.cantidadMinima;
    var cantidad = $scope.newElement.cantidadElemento;
    if(minimo>cantidad){
      $scope.newElement.cantidadMinima = cantidad;
    }
    if (minimo<0){
      $scope.newElement.cantidadMinima = 0;
    }
  };
  /**
   * Suma uno a la cantidad del elemento
   */
  $scope.plusAmountElement = function(item){
    item.cantidadElemento = ++item.cantidadElemento;
  };
  /**
   * Resta uno a la cantidad del elemento
   */
  $scope.minusAmountElement = function(item){
    item.cantidadElemento = --item.cantidadElemento;
    $scope.checkAmountElement();
  };
  /**
   * Chequea la cantidad de un elemento
   */
  $scope.checkAmountElement = function(){
    var minimo = $scope.newElement.cantidadMinima;
    var cantidad = $scope.newElement.cantidadElemento;
    if(cantidad<0){
      $scope.newElement.cantidadElemento = 0;
    }
    if(cantidad<minimo){
      $scope.newElement.cantidadElemento = minimo;
    }
  };
  /**
  * Muestra una ventana modal para añadir un elemento
  */
  $scope.addItem = function() {
    logdata.messageLog('ListaCtrl:addItem');
    var fechaCaducidadInicial = moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
    $scope.fechaDisabled = true;
    if($scope.nombreLista==='LISTA_COMPRA'){
      $scope.elementoListaCompra = true;
      fechaCaducidadInicial = moment('3015-12-31T22:00:00.000Z').hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
    }else{
      $scope.elementoListaCompra = false;
    }
    $translate(['ELEMENTO_NUEVO']).then(function (translations) {
      $scope.newElement = {
        "nombreElemento":translations.ELEMENTO_NUEVO,
        "colorElemento":$scope.colorDefaultElement,
        "colorBotones":$scope.colorbotonesEditablesDefaultElement,
        "colorElementoNoCaducado":$scope.colorDefaultElement,
        "colorBotonesNoCaducado":$scope.colorbotonesEditablesDefaultElement,
        "nombreLista":$scope.nombreLista,
        "cantidadElemento":$scope.cantidadMinimaDefecto,
        "caduca":!$scope.fechaDisabled,
        "fechaCaducidad":fechaCaducidadInicial,
        "cantidadMinima":$scope.cantidadMinimaDefecto,
        "marked":false
      };
      logdata.messageLog('ListaCtrl:addItem:$scope.newElement='+$scope.newElement);
      $scope.modalElemento.show();
    });
  };

  /*
  $scope.moveItem = function(item, fromIndex, toIndex) {
    $rootScope.elementosLista.splice(fromIndex, 1);
    $rootScope.elementosLista.splice(toIndex, 0, item);
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
  };
  */
  /**
  * Se mueve un elemento dentro de la lista de elementos
  */
  $scope.onItemDelete = function(item) {
    logdata.messageLog('ListaCtrl:onItemDelete');
    $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(item), 1);
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    $scope.showConfirm(item.nombreElemento);
    $rootScope.optionsOpen = !$rootScope.optionsOpen;
    $scope.initialize();
    $scope.$evalAsync();
  };
  /**
  * Muestra la ventana de confirmación para borrar un elemento
  */
  $scope.showConfirm = function(nombre) {
   logdata.messageLog('ListaCtrl:showConfirm:'+nombre);
   $translate(['BORRAR','NO','SI']).then(function (translations) {
     var confirmPopup = $ionicPopup.confirm({
       title: translations.BORRAR+nombre,
       template: $translate('BORRAR_PREGUNTA', { nombre:nombre }),
       cancelText: translations.NO,
       okText: translations.SI
     });
     confirmPopup.then(function(res) {
       $ionicListDelegate.closeOptionButtons();
       if(res) {
        logdata.messageLog('ListaCtrl:showConfirm:confirmado:'+res);
        $rootScope.elementos = $filter('filter')($rootScope.elementos, function(value, index) {return value.nombreElemento !== nombre;});
        LocalStorage.set('elementos',$rootScope.elementos);
        $ionicListDelegate.closeOptionButtons();
       }
     });
   });
  };
  /**
  * Se limpian los elementos marcados de la lista de la compra
  */
  $scope.limpiarMarcados = function(){
    logdata.messageLog('ListaCtrl:limpiarMarcados');
    $scope.popover.hide();
    $translate(['BORRAR','NO','SI','LIMPIAR_MARCADOS']).then(function (translations) {
      var confirmPopup = $ionicPopup.confirm({
        title: translations.BORRAR,
        template: translations.LIMPIAR_MARCADOS,
        cancelText: translations.NO,
        okText: translations.SI
      });
      confirmPopup.then(function(res) {
        if(res) {
         logdata.messageLog('ListaCtrl:showConfirm:confirmado:'+res);
         $rootScope.elementosLista = $filter('filter')($rootScope.elementosLista, function(value, index) {
           return (value.nombreLista !== 'LISTA_COMPRA' || value.marked !== true);});
         LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
        }
      });
    });
  };
  /**
  * Se limpia la lista de la compra
  */
  $scope.limpiarListaCompra = function(){
    logdata.messageLog('ListaCtrl:limpiarListaCompra');
    $scope.popover.hide();
    $translate(['BORRAR','NO','SI','BORRAR_COMPRA']).then(function (translations) {
      var confirmPopup = $ionicPopup.confirm({
        title: translations.BORRAR,
        template: translations.BORRAR_COMPRA,
        cancelText: translations.NO,
        okText: translations.SI
      });
      confirmPopup.then(function(res) {
        if(res) {
         logdata.messageLog('ListaCtrl:showConfirm:confirmado:'+res);
         $rootScope.elementosLista = $filter('filter')($rootScope.elementosLista, function(value, index) {return value.nombreLista !== 'LISTA_COMPRA';});
         LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
        }
      });
    });
  };
  /**
  * Ventana modal para dar nombre a la lista que guardar
  */
  $ionicModal.fromTemplateUrl('templates/saveList.html', {
    scope: $scope
  }).then(function(modalSaveList) {
    $scope.modalSaveList = modalSaveList;
  });
  /**
  * Se guarda la lista de la compra actual en un fichero
  */
  $scope.guardarListaFavorita = function(nombreListaFavorita){
    Spinner.show();
    logdata.messageLog('ListaCtrl:guardarListaFavorita:'+$scope.nombreListaFavorita);
    var listaFavorita = $filter('filter')($rootScope.elementosLista, function(value, index) {return value.nombreLista === 'LISTA_COMPRA';});
    favoritas.guardarLista(listaFavorita,nombreListaFavorita);
    $scope.modalSaveList.hide();
  };
  /**
  * Ventana modal para dar nombre de la lista a recuperar
  */
  $ionicModal.fromTemplateUrl('templates/retrieveList.html', {
    scope: $scope
  }).then(function(modalRetrieveList) {
    $scope.modalRetrieveList = modalRetrieveList;
  });
  /**
  * Se recupera una lista de listas de la compra guardadas
  */
  $scope.recuperarListasGuardadas = function(){
    $scope.popover.hide();
    favoritas.retriveListOfLists(function(data){
      logdata.messageLog('ListaCtrl:recuperarListasGuardadas:data:'+JSON.stringify(data));
      if(data!==null && data!== undefined && data.length >0){
        $scope.listasGuardadas = data;
        $scope.modalRetrieveList.show();
      }else{
        $translate(['AVISO','NO_EXISTEN_LISTAS']).then(function (translations) {
          $ionicPopup.alert({
            title: translations.AVISO,
            template: translations.NO_EXISTEN_LISTAS
          });
        });
      }
    });
  };
  /**
  * Se recupera una lista de la compra de entre las guardadas
  */
  $scope.recuperarListaFavorita = function(listaRecuperar){
    logdata.messageLog('ListaCtrl:recuperarListaFavorita:'+listaRecuperar);
    Spinner.show();
    favoritas.retrieveList(listaRecuperar,function(data){
      if(data!==null){
        var elementosListaRecuperada = JSON.parse(data);
        $translate(['SOBREESCRIBIR','INCLUIR','RECUPERAR_LISTA','RECUPERAR_LISTA_COMPRA']).then(function (translations) {
          var confirmPopup = $ionicPopup.confirm({
            title: translations.RECUPERAR_LISTA,
            template: translations.RECUPERAR_LISTA_COMPRA+' : '+$filter('filterNameJson')(listaRecuperar),
            cancelText: translations.INCLUIR,
            okText: translations.SOBREESCRIBIR
          });
          confirmPopup.then(function(res) {
            if(res) {
             logdata.messageLog('ListaCtrl:showConfirm:SOBREESCRIBIR:'+res);
             $rootScope.elementosLista = $filter('filter')($rootScope.elementosLista, function(value, index) {return value.nombreLista !== 'LISTA_COMPRA';});
             angular.forEach(elementosListaRecuperada, function(item) {
                 $rootScope.elementosLista.push(item);
             });
            }else{
             logdata.messageLog('ListaCtrl:showConfirm:INCLUIR:'+res);
             angular.forEach(elementosListaRecuperada, function(item) {
               var busqueda = $filter('filter')($rootScope.elementosLista, {"nombreElemento":item.nombreElemento,"nombreLista":'LISTA_COMPRA'}, true);
               if(busqueda.length>0){
                 logdata.messageLog('ListaCtrl:recuperarListaFavorita:Ya existe, incrementamos la cantidad');
                 var cantidadActual = busqueda[0].cantidadElemento;
                 busqueda[0].cantidadElemento=cantidadActual+item.cantidadElemento;
               }else{
                 logdata.messageLog('ListaCtrl:recuperarListaFavorita:No existe, se crea');
                 $rootScope.elementosLista.push(item);
               }
             });
            }
            LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
            $scope.modalRetrieveList.hide();
            Spinner.hide();
            $translate(['AVISO','LISTA_RECUPERADA']).then(function (translations) {
              $ionicPopup.alert({
                title: translations.AVISO,
                template: translations.LISTA_RECUPERADA
              });
            });
          });
        });
      }else{
        $scope.modalRetrieveList.hide();
        Spinner.hide();
        $translate(['ERROR','LISTA_NO_RECUPERADA']).then(function (translations) {
          $ionicPopup.alert({
            title: translations.ERROR,
            template: translations.LISTA_NO_RECUPERADA
          });
        });
      }
    });
  };
  /**
  * Ventana modal para crear un recordatorio para una lista
  */
  $ionicModal.fromTemplateUrl('templates/reminder.html', {
    scope: $scope
  }).then(function(modalReminder) {
    $scope.modalReminder = modalReminder;
  });
  /**
   * Función que crea un recordatorio para la lista
   */
  $scope.createReminder = function(){
      $scope.popover.hide();
      $scope.dateTimeReminder = moment().seconds(0).milliseconds(0).toDate();
      $scope.modalReminder.show();
  };
  /**
   * Objeto de fecha
   */
  $scope.datepickerObject = {
      titleLabel: ' ',//Optional
      todayLabel: 'O',//Optional
      closeLabel: '✘',//Optional
      setLabel: '✔',//Optional
      setButtonType : 'button-dark',  //Optional
      todayButtonType : 'button-dark',  //Optional
      closeButtonType : 'button-dark',  //Optional
      inputDate: $scope.dateTimeReminder,  //Optional
      mondayFirst: true,  //Optional
      weekDaysList:[" ", " ", " ", " ", " ", " ", " "],
      monthList: ['01','02','03','04','05','06','07','08','09','10','11','12'],
      templateType: 'popup', //Optional
      showTodayButton: false, //Optional
      modalHeaderColor: 'bar-dark', //Optional
      modalFooterColor: 'bar-dark', //Optional
      callback: function (val) {  //Mandatory
        if(val!==undefined){
          var tiempo = moment($scope.dateTimeReminder);
          $scope.dateTimeReminder = moment(val).hour(tiempo.hour()).minutes(tiempo.minutes()).toDate();
        }
      },
      dateFormat: 'dd-MM-yyyy', //Optional
      closeOnSelect: true, //Optional
  };
  /**
   * Objeto de tiempo
   */
  $scope.timePickerObject = {
    inputEpochTime: (moment().seconds(0).milliseconds(0).hour() * 60 * 60) + (moment().seconds(0).milliseconds(0).minutes() * 60),  //Optional
    step: 1,  //Optional
    format: 24,  //Optional
    titleLabel: ' ',//Optional
    setLabel: '✔',//Optional
    closeLabel: '✘',//Optional
    setButtonType: 'button-dark',  //Optional
    closeButtonType: 'button-dark',  //Optional
    callback: function (val) {    //Mandatory
      if(val!==undefined){
        var tiempo = moment(val * 1000);
        var horas = tiempo.hour();
        if(ionic.Platform.isAndroid()){
          horas=horas-1;
        }
        var minutos = tiempo.minutes();
        $scope.timePickerObject.inputEpochTime = val;
        if(horas>0){
          $scope.dateTimeReminder = moment($scope.dateTimeReminder).hour(horas).toDate();
        }
        if(minutos>0){
          $scope.dateTimeReminder = moment($scope.dateTimeReminder).minutes(minutos).toDate();
        }
      }
    }
  };
  /**
   * Función que establece el recordatorio según los datos
   */
  $scope.saveReminder = function(mensajeReminder){
    mensajeReminder = mensajeReminder!==null?mensajeReminder!==undefined?mensajeReminder:"":"";
      if(window.cordova){
        var objetoNotificacion = {
          id: moment().valueOf(),
          title: $scope.RECUERDA,
          text: $scope.nombreLista+'\n'+mensajeReminder,
          at: $scope.dateTimeReminder,
          sound: 'file://sounds/sound.mp3',
          data: {
                nombreLista: $scope.nombreLista,
                colorLista: $scope.colorLista,
                listaEditable: $scope.listaEditable
          }
        };
        if(ionic.Platform.isAndroid()){
          objetoNotificacion.icon = 'file://img/icon.png';
          objetoNotificacion.smallIcon = '';
        }
        $cordovaLocalNotification.schedule(objetoNotificacion).then(function (result) {
          $scope.modalReminder.hide();
        });
      }else{
        $scope.modalReminder.hide();
        var milisecondsToNotification = moment($scope.dateTimeReminder).subtract(1, 'hour').toDate().getTime() - moment().toDate().getTime();
        logdata.messageLog('ListaCtrl:saveReminder:'+milisecondsToNotification);
        setTimeout(function hideNotification() {
          webNotification.showNotification($scope.RECUERDA, {
              body: $scope.nombreLista+'\n'+mensajeReminder,
              icon: '../img/icon.png',
              onClick: function onNotificationClicked() {
                  $state.go('app.lista', {
                    nombreLista: $scope.nombreLista,
                    colorLista: $scope.colorLista,
                    listaEditable: $scope.listaEditable
                  });
              },
              pageVisibility : true,
              //autoClose: 3000 //auto close the notification after 2 seconds (you manually close it via hide function)
          }, function onShow(error, hide) {
              if (error) {
                logdata.messageError('Unable to show notification: ' + error.message);
              } else {
                  setTimeout(function hideNotification() {
                      hide(); //manually close the notification (or let the autoClose close it)
                  }, 5000);
              }
          });
        }, milisecondsToNotification);
      }
  };
});
