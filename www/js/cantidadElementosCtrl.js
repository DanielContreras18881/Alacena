angular.module('alacena.cantidadElementosController', ['ionic'])
/**
* Controlador de la pantalla de lista de elementos
*/
.controller('ListaCtrl', function($rootScope,$scope,$stateParams,$ionicModal,$ionicListDelegate,jsonFactory,LocalStorage,$filter,$ionicPopup,$ionicFilterBar,logdata,$translate) {

  var filterBarInstance;
  /**
  * Muestra el filtro de la lista de elementos
  */
  $scope.showFilterBar = function () {
    $translate(['CANCELAR']).then(function (translations) {
      filterBarInstance = $ionicFilterBar.show({
        cancelText: translations.CANCELAR,
        debounce: true,
        delay: 25,
        items: $rootScope.elementosLista,
        update: function (filteredItems, filterText) {
          $rootScope.elementosLista = filteredItems;
          logdata.debug('ListaCtrl:showFilterBar:Filtrado por:'+filterText);
        }
      });
    });
  };
  /**
  * Inicializa la pantalla de lista de elementos
  */
  $scope.initialize = function(){

    logdata.debug('ListaCtrl:initialize:Inicio');

    $scope.nombreLista = $stateParams.nombreLista;
    $scope.listaEditable = $stateParams.listaEditable;
    $scope.colorLista = $stateParams.colorLista;

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
    });
    logdata.debug('ListaCtrl:initialize:Fin');
  }
  /**
  * Muestra una ventana modal para editar un elemento
  */
  $scope.edit = function(item) {
    logdata.debug('ListaCtrl:edit:'+JSON.stringify(item));
    var formato = "YYYY-MM-DD";
    item.fechaCaducidad = moment(item.fechaCaducidad,formato).hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
    $scope.newElement = item;
    $scope.newElement.colorElemento = item.colorElementoNoCaducado;
    $scope.newElement.colorBotones = item.colorBotonesNoCaducado;
    $scope.colorElemento = item.colorElementoNoCaducado;
    $ionicListDelegate.closeOptionButtons();
    $scope.modalElemento.show();
  };
  /**
  * Establece un color en un elemento concreto
  */
  $scope.setColor = function(claseElemento){
    logdata.debug('ListaCtrl:setColor:'+claseElemento);
    $scope.elementoLista.colorElemento = claseElemento;
    $scope.elementoLista.colorBotones = $filter('filter')($scope.coloresElementos, {"claseElemento":claseElemento})[0].botonesEditables;
    $scope.elementoLista.colorElementoNoCaducado = $scope.elementoLista.colorElemento;
    $scope.elementoLista.colorBotonesNoCaducado = $scope.elementoLista.colorBotones;
  };
  /**
  * Guarda un elemento creado o editado
  */
  $scope.save = function(element){
    logdata.debug('ListaCtrl:save:'+element);
    if(element.caduca){
      var entrada = moment(element.fechaCaducidad);
      var formato = "YYYY-MM-DD";
      element.fechaCaducidad = entrada.format(formato);
    }
    if($filter('filter')($rootScope.elementosLista,element).length==0) {
      $rootScope.elementosLista.push(element);
      if($filter('filter')($rootScope.elementos,{"nombreElemento":element.nombreElemento}).length==0) {
        $rootScope.elementos.push({"nombreElemento":element.nombreElemento});
      }
    }else{
      if(element.cantidadElemento<element.cantidadMinima){
        $scope.preguntaTraslado(element.nombreElemento,function(){
          $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(element), 1);
          var elementosFiltrados = $filter('filter')($rootScope.elementosLista,
                {"nombreElemento":element.nombreElemento,"nombreLista":'LISTA_COMPRA'});
          if(elementosFiltrados.length > 0) {
            var cantidadActual = elementosFiltrados[0].cantidadElemento;
            elementosFiltrados[0].cantidadElemento=cantidadActual+elementosFiltrados[0].cantidadMinima;
          }else{
            $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(element), 1);
            element.nombreLista='LISTA_COMPRA';
            element.cantidadElemento = element.cantidadMinima;
            $rootScope.elementosLista.push(element);
          }
          LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
        });
      }
    }
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    LocalStorage.set('elementos',$rootScope.elementos);
    $scope.modalElemento.hide();
    $ionicListDelegate.closeOptionButtons();
  };
  /**
  * Mueve un elemento de una lista a otra
  */
  $scope.changeLista = function(lista){
    logdata.debug('ListaCtrl:changeLista:'+lista);
    if($scope.elementoLista.nombreLista==='LISTA_COMPRA'){
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
      var busqueda = $filter('filter')($rootScope.elementosLista, {"nombreElemento":newElementLista.nombreElemento,"nombreLista":newElementLista.nombreLista}, true);
      if(busqueda.length>0){
        var cantidadActual = busqueda[0].cantidadElemento;
        busqueda[0].cantidadElemento=cantidadActual+newElementLista.cantidadElemento;
      }else{
        $rootScope.elementosLista.push(newElementLista);
      }
    }else{
      var busqueda = $filter('filter')($rootScope.elementosLista, {"nombreElemento":$scope.elementoLista.nombreElemento,"nombreLista":lista}, true);
      $scope.elementoLista.nombreLista = lista;
      if(busqueda.length>0){
        var cantidadActual = busqueda[0].cantidadElemento;
        busqueda[0].cantidadElemento=cantidadActual+$scope.elementoLista.cantidadElemento;
      }else{
        if(lista==='LISTA_COMPRA'){
          $scope.elementoLista.colorElemento = $scope.elementoLista.colorElementoNoCaducado;
          $scope.elementoLista.colorBotones = $scope.elementoLista.colorBotonesNoCaducado;
          $scope.elementoLista.fechaCaducidad = null;
          $scope.elementoLista.caduca = false;
        }
      }
    }
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    $scope.modalMoveElement.hide();
  };
  /**
  * Pregunta si se tiene que mover un elemento a la lista de la compra
  */
  $scope.preguntaTraslado = function(nombre,callback){
    logdata.debug('ListaCtrl:preguntaTraslado:'+nombre);
    if($scope.askAddListaCompra){
      $translate(['MOVER','NO','SI']).then(function (translations) {
        var confirmPopup = $ionicPopup.confirm({
          title: translations.MOVER+nombre,
          template: $translate('MOVER_PREGUNTA', { nombre:nombre }),
          //template: '¿Deseas mover '+nombre+' a la Lista de la Compra?',
          cancelText: translations.NO,
          okText: translations.SI
        });
        confirmPopup.then(function(res) {
          if(res) {
             callback();
          }
        });
      });
    }else{
      callback();
    }

  }
  /**
  * Se quita una unidad a un elemento
  */
  $scope.minusElement = function(item) {
    logdata.debug('ListaCtrl:minusElement:'+JSON.stringify(item));
    if(item.cantidadElemento>0){
      item.cantidadElemento = --item.cantidadElemento;
      if(item.cantidadElemento<item.cantidadMinima){
        $scope.preguntaTraslado(item.nombreElemento,function(){
          $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(item), 1);
          var elementosFiltrados = $filter('filter')($rootScope.elementosLista,
                {"nombreElemento":item.nombreElemento,"nombreLista":'LISTA_COMPRA'});
          if(elementosFiltrados.length > 0) {
            var cantidadActual = elementosFiltrados[0].cantidadElemento;
            elementosFiltrados[0].cantidadElemento=cantidadActual+elementosFiltrados[0].cantidadMinima;
          }else{
            $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(item), 1);
            item.nombreLista='LISTA_COMPRA';
            item.cantidadElemento = item.cantidadMinima;
            $rootScope.elementosLista.push(item);
          }
          LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
        });
      }
    }else{
      if(item.cantidadMinima==0){
        $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(item), 1);
      }else{
        $scope.preguntaTraslado(item.nombreElemento,function(){
          $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(item), 1);
          var elementosFiltrados = $filter('filter')($rootScope.elementosLista,
                {"nombreElemento":item.nombreElemento,"nombreLista":'LISTA_COMPRA'});
          if(elementosFiltrados.length > 0) {
            var cantidadActual = elementosFiltrados[0].cantidadElemento;
            elementosFiltrados[0].cantidadElemento=cantidadActual+elementosFiltrados[0].cantidadMinima;
          }else{
            item.nombreLista='LISTA_COMPRA';
            item.cantidadElemento = item.cantidadMinima;
            $rootScope.elementosLista.push(item);
          }
          LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
        });
      }
    }
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    $ionicListDelegate.closeOptionButtons();
  };
  /**
  * Se añade una unidad a un elemento
  */
  $scope.plusElement = function(item) {
    logdata.debug('ListaCtrl:plusElement:'+JSON.stringify(item));
    item.cantidadElemento = ++item.cantidadElemento;
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    $ionicListDelegate.closeOptionButtons();
  };
  /**
  * Muestra una ventana modal para mover un elemento de una lista a otra
  */
  $scope.moveTo = function(item) {
    logdata.debug('ListaCtrl:moveTo:'+JSON.stringify(item));
    $scope.elementoLista = item;
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
    logdata.debug('ListaCtrl:markAcquired:'+JSON.stringify(item));
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
    logdata.debug('ListaCtrl:cambioCaducidad');
    $scope.fechaDisabled=!$scope.fechaDisabled;
    $scope.newElement.fechaCaducidad = null;
  }
  /**
  * Muestra una ventana modal para añadir un elemento
  */
  $scope.addItem = function() {
    logdata.debug('ListaCtrl:addItem');
    $scope.fechaDisabled = false;
    $translate(['ELEMENTO_NUEVO']).then(function (translations) {
      $scope.newElement = {
        "nombreElemento":translations.ELEMENTO_NUEVO,
        "colorElemento":$scope.colorDefaultElement,
        "colorBotones":$scope.colorbotonesEditablesDefaultElement,
        "colorElementoNoCaducado":$scope.colorDefaultElement,
        "colorBotonesNoCaducado":$scope.colorbotonesEditablesDefaultElement,
        "nombreLista":$scope.nombreLista,
        "cantidadElemento":1,
        "caduca":!$scope.fechaDisabled,
        "fechaCaducidad":moment().toDate(),
        "cantidadMinima":0,
        "marked":false
      };
    });
    $scope.modalElemento.show();
  };
  /**
  * Ventana modal para añadir un elemento
  */
  $ionicModal.fromTemplateUrl('templates/addElemento.html', {
    scope: $scope
  }).then(function(modalElemento) {
    $scope.modalElemento = modalElemento;
  });

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
    logdata.debug('ListaCtrl:onItemDelete');
    $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(item), 1);
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    $scope.showConfirm(item.nombreElemento);
  };
  /**
  * Muestra la ventana de confirmación para borrar un elemento
  */
  $scope.showConfirm = function(nombre) {
   logdata.debug('ListaCtrl:showConfirm:'+nombre);
   $translate(['BORRAR','NO','SI']).then(function (translations) {
     var confirmPopup = $ionicPopup.confirm({
       title: translations.BORRAR+nombre,
       template: $translate('BORRAR_PREGUNTA', { nombre:nombre }),
       cancelText: translations.NO,
       okText: translations.SI
     });
     confirmPopup.then(function(res) {
       if(res) {
        logdata.debug('ListaCtrl:showConfirm:confirmado:'+res);
        $rootScope.elementos = $filter('filter')($rootScope.elementos, function(value, index) {return value.nombreElemento !== nombre;});
        LocalStorage.set('elementos',$rootScope.elementos);
        $ionicListDelegate.closeOptionButtons();
       }
     });
   });
  };

});
