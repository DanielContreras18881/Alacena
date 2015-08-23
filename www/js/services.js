angular.module('alacena.services', [])

/**
* Factoría que permite
*/
.factory('jsonFactory',function($http,LocalStorage,$log){

	var jsonFactory = {};

	/**
	* Recupera los datos de configuración de la App, si existen en el dispositivo, sino recupera del json de ejemplo
	*/
	jsonFactory.getConfigData = function (callback){
		$http.get('./json/Configuracion.json').success(function(response) {
			var datosConfig = response;
			if(LocalStorage.get('configData')==null){
					$log.debug('Primera instalación');
					LocalStorage.set('configData',datosConfig);
					callback(datosConfig);
			}else{
				$log.debug('Actualizando configuración');
				var configLocalData = LocalStorage.get('configData');
				configLocalData.configColorsElements = datosConfig.configColorsElements;
				configLocalData.configColors = datosConfig.configColors;
				configLocalData.idiomas = datosConfig.idiomas;
				callback(configLocalData);
			}
		});
	};

	/**
	* Recupera los datos de los elementos, si existen en el dispositivo, sino recupera del json de ejemplo
	*/
	jsonFactory.getElementData = function (callback){
		if(LocalStorage.get('elementos')==null){
			$log.debug('Primera instalación');
			$http.get('./json/Elementos.json').success(function(response) {
				LocalStorage.set('elementos',response);
        		callback(response);
    		});
		}else{
			$log.debug('Se recuperan los elementos');
			callback(LocalStorage.get('elementos'));
		}
	};

	/**
	* Recupera los datos de las listas, si existen en el dispositivo, sino recupera del json de ejemplo
	*/
	jsonFactory.getListData = function (callback){
		if(LocalStorage.get('listas')==null){
			$log.debug('Primera instalación');
			$http.get('./json/Listas.json').success(function(response) {
				LocalStorage.set('listas',response);
        		callback(response);
    		});
		}else{
			$log.debug('Se recuperan las listas');
			callback(LocalStorage.get('listas'));
		}
	};

	/**
	* Recupera los datos de los elementos de una lista, si existen en el dispositivo, sino recupera del json de ejemplo
	*/
	jsonFactory.getElementListData = function (callback){
		if(LocalStorage.get('cantidadElementosLista')==null){
			$log.debug('Primera instalación');
			$http.get('./json/CantidadElementoLista.json').success(function(response) {
				LocalStorage.set('cantidadElementosLista',response);
        		callback(response);
    		});
		}else{
			$log.debug('Se recuperan los elementos de una lista');
			callback(LocalStorage.get('cantidadElementosLista'));
		}
	};

	return jsonFactory;
})

/**
* Factoría que permite almacenar, recuperar y eliminar datos del localstorage
*/
.factory('LocalStorage', function($log) {

        return {
            /**
             * Guarda en la base de datos del dispositivo el valor asociándolo a la clave
             */
            set: function(key, value) {
								$log.debug('Guarda:'+JSON.stringify(value));
                localStorage.setItem(key, JSON.stringify(value));
            },
            /**
             * Recupera de la base de datos del dispositivo el valor asociado a la clave solicitada
             */
            get: function(key) {
								$log.debug('Recupera:'+key);
                var resultado = localStorage.getItem(key);
                if (resultado !== null && resultado !== 'undefined' && resultado !== undefined) {
										$log.debug('Recuperado:'+JSON.stringify(resultado));
                    return JSON.parse(resultado);
                } else {
										$log.debug('No encontrado:'+key);
                    return null;
                }
            },
            /**
             * Elimina de la base de datos del dispositivo el valor asociado a la clave indicada
             */
            put: function(key) {
								$log.debug('Borrad:'+key);
                localStorage.removeItem(key);
            }
        };
    });
