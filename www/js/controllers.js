angular.module('alacena.controllers', ['ngCordova'])

.filter('filterDate', function()
    {
        return function(input)
        {
          var _date = "";
            if(input !== null){
              var formato = "YYYY-MM-DD";

              var entrada = moment(input,formato).hours(0).minutes(0).seconds(0).milliseconds(0);
              var hoy =  moment().hours(0).minutes(0).seconds(0).milliseconds(0);
              var maniana = moment().add(1,'days').hours(0).minutes(0).seconds(0).milliseconds(0);
              var sigSemana = moment().add(7,'days').hours(0).minutes(0).seconds(0).milliseconds(0);
              var quinceDias = moment().add(15,'days').hours(0).minutes(0).seconds(0).milliseconds(0);

              var info = "caduca ";

              if(entrada<hoy){
                _date = "CADUCADO!";
              }else if(hoy>=entrada){
                _date = info+"hoy";
              }else if (maniana>=entrada){
                _date = info+"mañana";
              }else if (sigSemana>=entrada){
                _date = info+"la semana que viene";
              /*}else if (quinceDias>=entrada){
                _date = info+"en dos semanas";*/
              }else{
                _date = info+"el "+entrada.format("D MM YY");
              }
            }
            return _date;
        };
    })

.filter('filtrarLista', function() {

    return function(arr, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        angular.forEach(arr, function(item) {

            if (item.nombreLista.toLowerCase().indexOf(searchString) > -1) {
                result.push(item);
            }

        });

        return result;

    };

})

.filter('filtrarQuitarLista', function() {

    return function(arr, searchString) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        angular.forEach(arr, function(item) {

            if (item.nombreLista.toLowerCase().indexOf(searchString) === -1) {
                result.push(item);
            }

        });

        return result;

    };

})

.controller('AppCtrl', function() {

})

.controller('MenuCtrl', function($rootScope) {

  $rootScope.reorder = function(){
      $rootScope.showReorder = !$rootScope.showReorder;
  }

})

.controller('ConfigCtrl', function($rootScope,$scope,jsonFactory,LocalStorage) {

  $scope.initialize = function(){
    $rootScope.showReorderbutton = false;

    jsonFactory.getConfigData(function(data){
      $rootScope.configData = data;
    });
/*
    jsonFactory.getListData(function(data){
      $scope.listas = data;
    });
*/
    $scope.claseLista = $rootScope.configData.colorDefault;
    $scope.claseElemento = $rootScope.configData.colorDefaultElement;
    //$scope.nombreLista = $scope.configData.ListaDefecto;
    //$scope.idiomaSeleccionado = $scope.configData.idiomaDefault;
  }

    $scope.changeColor = function(claseLista){
      $rootScope.configData.colorDefault = claseLista;
      LocalStorage.set('configData',$rootScope.configData);
    };

    $scope.changeColorElement = function(claseElemento){
      $rootScope.configData.colorDefaultElement = claseElemento;
      LocalStorage.set('configData',$rootScope.configData);
    };
/*
    $scope.changeListaDefecto = function(nombreLista){
      $scope.configData.ListaDefecto = nombreLista;
      LocalStorage.set('configData',$scope.configData);
    };
*/
/*
    $scope.changeIdioma = function(idiomaSeleccionado){
      alert(JSON.stringify(idiomaSeleccionado));
    };
*/

})

.controller('ElementosCtrl', function($rootScope,$scope,jsonFactory,LocalStorage,$filter,$ionicPopup,$ionicModal,$ionicListDelegate) {

  $scope.initialize = function(){
    $rootScope.showReorderbutton = false;

    jsonFactory.getElementData(function(data){
      $rootScope.elementos = data;
    });

    jsonFactory.getElementListData(function(data){
      $rootScope.elementosLista = data;
    });

    jsonFactory.getListData(function(data){
      $rootScope.listas = data;
    });

    jsonFactory.getConfigData(function(data){
      $scope.colorDefaultElement = data.colorDefaultElement;
      $scope.colorbotonesEditablesDefaultElement = $filter('filter')(data.configColorsElements, {"claseElemento":data.colorDefaultElement}, true)[0].botonesEditables;
    });
  }

  $ionicModal.fromTemplateUrl('templates/createElement.html', {
    scope: $scope
  }).then(function(modalCreateElement) {
    $scope.modalCreateElement = modalCreateElement;
  });

  $scope.cambioCaducidad = function(){
    $scope.fechaDisabled=!$scope.fechaDisabled;
    $scope.elementoLista.fechaCaducidad = null;
  }

  $scope.changeLista = function(){
    if($scope.elementoLista.caduca){
      //Comprobar la cantidad de elementos y la cantidad minima por si hay que mandarlo a la lista de la compra
      var entrada =new moment($scope.elementoLista.fechaCaducidad);
      var formato = "YYYY-MM-DD";
      $scope.elementoLista.fechaCaducidad = entrada.format(formato);
    }
    $rootScope.elementosLista.push($scope.elementoLista);
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    $scope.modalCreateElement.hide();
  };

  $scope.mostrarListas = function(nombre) {
    var elementosListaFiltrados = $filter('filter')($rootScope.elementosLista,
                                                    function(value, index) {
                                                      return value.nombreElemento === nombre;
                                                    });
    if(elementosListaFiltrados.length>0){
      var listasElemento = '';
        angular.forEach(elementosListaFiltrados, function(item) {
            if (item.nombreLista.indexOf('Lista de la Compra') > -1) {
                listasElemento+=item.nombreLista+' - '+item.cantidadElemento;
                if(item.cantidadElemento>1){
                  listasElemento+=' unidades';
                }else{
                  listasElemento+=' unidad';
                }
                listasElemento+='<br/>';
            }
        });
         var alertPopup = $ionicPopup.alert({
           title: 'Tienes '+nombre,
           template: listasElemento
         });
         alertPopup.then(function(res) {});
    }else{
      var confirmPopup = $ionicPopup.confirm({
        title: 'No existe el elemento',
        template: '¿Deseas añadir '+nombre+' a la Lista de la Compra?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          $scope.fechaDisabled = false;
          $scope.elementoLista = {
            "nombreElemento":nombre,
            "colorElemento":$scope.colorDefaultElement,
            "colorBotones":$scope.colorbotonesEditablesDefaultElement,
            "nombreLista":'Lista de la Compra',
            "cantidadElemento":1,
            "caduca":!$scope.fechaDisabled,
            "fechaCaducidad":moment().toDate(),
            "cantidadMinima":0,
            "marked":false
          };
          $scope.modalCreateElement.show();
        }
      });
    }
  };

  $scope.onItemDelete = function(item) {
    $rootScope.elementos.splice($rootScope.elementos.indexOf(item), 1);
    LocalStorage.set('elementos',$rootScope.elementos);
    $scope.showConfirm(item.nombreElemento);
  };

  $scope.showConfirm = function(nombre) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Borrar '+nombre,
     template: '¿Deseas borrar '+nombre+' de todas sus listas?'
   });
   confirmPopup.then(function(res) {
     if(res) {
        $rootScope.elementosLista = $filter('filter')($rootScope.elementosLista, function(value, index) {return value.nombreElemento !== nombre;});
        LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
        $ionicListDelegate.closeOptionButtons();
     }
   });
  };

})

.controller('ListasCtrl', function($rootScope,$scope,$ionicModal,$ionicListDelegate,jsonFactory,LocalStorage,$filter) {

  $scope.initialize = function(){

    jsonFactory.getListData(function(data){
      $rootScope.listas = data;
      $rootScope.showReorderbutton = $rootScope.listas.length > 2;
    });

    jsonFactory.getConfigData(function(data){
      $scope.coloresListas = data.configColors;
      $scope.colorDefault = data.colorDefault;
      $scope.colorBotonesDefault = $filter('filter')(data.configColors, {"claseLista":data.colorDefault}, true)[0].botonesEditables;
    });

    jsonFactory.getElementListData(function(data){
      $rootScope.elementosLista = data;
    });

  }

  $scope.share = function(item) {
    alert('Share Item: ' + item.nombreLista);
    $ionicListDelegate.closeOptionButtons();
  };

  $scope.edit = function(item) {
    $scope.newList = item;
    $ionicListDelegate.closeOptionButtons();
    $scope.modalLista.show();
  };

  $scope.save = function(element){
    if($rootScope.listas.indexOf(element) === -1) {
      $rootScope.listas.push(element);
    }
    LocalStorage.set('listas',$rootScope.listas);
    $scope.modalLista.hide();
  };

  $scope.setColor = function(claseLista){
    $scope.newList.colorLista = claseLista;
    $scope.newList.colorBotones = $filter('filter')($scope.coloresListas, {"claseLista":claseLista}, true)[0].botonesEditables;
  };

  $scope.addItem = function() {
    $scope.newList =   {
      "nombreLista":"lista nueva",
      "colorLista":$scope.colorDefault,
      "colorBotones":$scope.colorBotonesDefault,
      "listaEditable":true
    };
    $scope.modalLista.show();
  };

  $ionicModal.fromTemplateUrl('templates/addLista.html', {
    scope: $scope
  }).then(function(modalLista) {
    $scope.modalLista = modalLista;
  });

  $scope.moveItem = function(item, fromIndex, toIndex) {
    if(item.listaEditable && toIndex!==0){
      $rootScope.listas.splice(fromIndex, 1);
      $rootScope.listas.splice(toIndex, 0, item);
      LocalStorage.set('listas',$rootScope.listas);
    }
  };

  $scope.onItemDelete = function(item) {
    $rootScope.listas.splice($rootScope.listas.indexOf(item), 1);
    LocalStorage.set('listas',$rootScope.listas);
    $rootScope.elementosLista = $filter('filter')($rootScope.elementosLista, function(value, index) {return value.nombreLista !== item.nombreLista;});
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
  };

})

.controller('ListaCtrl', function($rootScope,$scope,$stateParams,$ionicModal,$ionicListDelegate,jsonFactory,LocalStorage,$filter,$cordovaLocalNotification,$ionicPopup) {

    $scope.initialize = function(){

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
    }

  $scope.edit = function(item) {
    var formato = "YYYY-MM-DD";
    item.fechaCaducidad = moment(item.fechaCaducidad,formato).hours(0).minutes(0).seconds(0).milliseconds(0).toDate();
    $scope.newElement = item;
    $ionicListDelegate.closeOptionButtons();
    $scope.modalElemento.show();
  };

  $scope.setColor = function(claseElemento){
    $scope.newElement.colorElemento = claseElemento;
    $scope.newElement.colorBotones = $filter('filter')($scope.coloresElementos, {"claseElemento":claseElemento})[0].botonesEditables;
  };

  $scope.save = function(element){
    if(element.caduca){
      //Comprobar la cantidad de elementos y la cantidad minima por si hay que mandarlo a la lista de la compra
      var entrada =new moment(element.fechaCaducidad);
      var formato = "YYYY-MM-DD";
      element.fechaCaducidad = entrada.format(formato);
    }
    if($filter('filter')($rootScope.elementosLista,element).length==0) {
      $rootScope.elementosLista.push(element);
      if($filter('filter')($rootScope.elementos,{"nombreElemento":element.nombreElemento}).length==0) {
        $rootScope.elementos.push({"nombreElemento":element.nombreElemento});
      }
    }
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    LocalStorage.set('elementos',$rootScope.elementos);
    $scope.modalElemento.hide();
    $ionicListDelegate.closeOptionButtons();
  };

  $scope.changeLista = function(lista){
    if($scope.elementoLista.nombreLista==='Lista de la Compra'){
      var newElementLista = $scope.elementoLista;
      newElementLista.nombreLista = lista;
      if($rootScope.elementosLista.indexOf(newElementLista) === -1) {
        $rootScope.elementosLista.push(newElementLista);
      }else{
        var cantidadActual = $rootScope.elementosLista[$rootScope.elementosLista.indexOf(newElementLista)].cantidadElemento;
        $rootScope.elementosLista[$rootScope.elementosLista.indexOf(newElementLista)].cantidadElemento=cantidadActual+newElementLista.cantidadElemento;
        $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(newElementLista), 1);
      }
    }else{
      $scope.elementoLista.nombreLista = lista;
      if($rootScope.elementosLista.indexOf($scope.elementoLista) === -1) {
        $rootScope.elementosLista.push($scope.elementoLista);
      }else{
        var cantidadActual = $rootScope.elementosLista[$rootScope.elementosLista.indexOf($scope.elementoLista)].cantidadElemento;
        $rootScope.elementosLista[$rootScope.elementosLista.indexOf($scope.elementoLista)].cantidadElemento=cantidadActual+$scope.elementoLista.cantidadElemento;
        $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf($scope.elementoLista), 1);
      }
    }
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    $scope.modalMoveElement.hide();
  };

  $scope.preguntaTraslado = function(nombre,callback){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Mover '+nombre,
      template: '¿Deseas mover '+nombre+' a la Lista de la Compra?'
    });
    confirmPopup.then(function(res) {
      if(res) {
         callback();
      }
    });
  }

  $scope.minusElement = function(item) {
    if(item.cantidadElemento>0){
      item.cantidadElemento = --item.cantidadElemento;
      if(item.cantidadElemento<item.cantidadMinima){
        $scope.preguntaTraslado(item.nombreElemento,function(){
          var elementosFiltrados = $filter('filter')($rootScope.elementosLista,
                {"nombreElemento":item.nombreElemento,"nombreLista":"Lista de la Compra"});
          if(elementosFiltrados.length > 0) {
            var cantidadActual = $rootScope.elementosLista[$rootScope.elementosLista.indexOf(elementosFiltrados[0])].cantidadElemento;
            $rootScope.elementosLista[$rootScope.elementosLista.indexOf(elementosFiltrados[0])].cantidadElemento=cantidadActual+elementosFiltrados[0].cantidadMinima;
            $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(item), 1);
          }else{
            item.nombreLista="Lista de la Compra";
            item.cantidadElemento = item.cantidadMinima;
          }
        });
      }
    }else{
      if(item.cantidadMinima==0){
        $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(item), 1);
      }else{
        $scope.preguntaTraslado(item.nombreElemento,function(){
          item.nombreLista="Lista de la Compra";
          item.cantidadElemento = item.cantidadMinima;
        });
      }
    }
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    $ionicListDelegate.closeOptionButtons();
    /*
    $cordovaLocalNotification.schedule({
      id: 1,
      title: 'Title here',
      text: 'Text here',
      data: {
        customProperty: 'custom value'
      }
    }).then(function (result) {
      alert('Prueba');
    });
    */
  };

  $scope.plusElement = function(item) {
    item.cantidadElemento = ++item.cantidadElemento;
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    $ionicListDelegate.closeOptionButtons();
  };

  $scope.moveTo = function(item) {
    $scope.elementoLista = item;
    var listasFiltradas = $filter('filtrarQuitarLista')($rootScope.listas,$scope.nombreLista);
    $scope.nuevoNombreLista = listasFiltradas[0].nombreLista;
    $scope.fechaDisabled = !item.caduca;
    $scope.modalMoveElement.show();
    $ionicListDelegate.closeOptionButtons();
  };

  $scope.markAcquired = function(item) {
    if(item.marked){
      item.marked = false;
    }else{
      item.marked = true;
    }
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
  };

  $ionicModal.fromTemplateUrl('templates/moveElement.html', {
    scope: $scope
  }).then(function(modalMoveElement) {
    $scope.modalMoveElement = modalMoveElement;
  });

  $scope.cambioCaducidad = function(){
    $scope.fechaDisabled=!$scope.fechaDisabled;
    $scope.newElement.fechaCaducidad = null;
  }

  $scope.addItem = function() {
    $scope.fechaDisabled = false;
    $scope.newElement = {
      "nombreElemento":"elemento",
      "colorElemento":$scope.colorDefaultElement,
      "colorBotones":$scope.colorbotonesEditablesDefaultElement,
      "nombreLista":$scope.nombreLista,
      "cantidadElemento":1,
      "caduca":!$scope.fechaDisabled,
      "fechaCaducidad":moment().toDate(),
      "cantidadMinima":0,
      "marked":false
    };
    $scope.modalElemento.show();
  };

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

  $scope.onItemDelete = function(item) {
    $rootScope.elementosLista.splice($rootScope.elementosLista.indexOf(item), 1);
    LocalStorage.set('cantidadElementosLista',$rootScope.elementosLista);
    $scope.showConfirm(item.nombreElemento);
  };

  $scope.showConfirm = function(nombre) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Borrar '+nombre,
     template: '¿Deseas borrar '+nombre+' del histórico?'
   });
   confirmPopup.then(function(res) {
     if(res) {
      $rootScope.elementos = $filter('filter')($rootScope.elementos, function(value, index) {return value.nombreElemento !== nombre;});
      LocalStorage.set('elementos',$rootScope.elementos);
      $ionicListDelegate.closeOptionButtons();
     }
   });
  };

});
