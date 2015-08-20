angular.module('alacena.services', [])

/**
* Factoría que permite
*/
.factory('jsonFactory',function($http,LocalStorage){

	var jsonFactory = {};

	/**
	* Recupera los datos de configuración de la App, si existen en el dispositivo, sino recupera del json de ejemplo
	*/	
	jsonFactory.getConfigData = function (callback){
		if(LocalStorage.get('configData')==null){
			$http.get('./json/Configuracion.json').success(function(response) {
				LocalStorage.set('configData',response);
        		callback(response);
    		});
		}else{
			callback(LocalStorage.get('configData'));
		}
	};

	/**
	* Recupera los datos de los elementos, si existen en el dispositivo, sino recupera del json de ejemplo
	*/	
	jsonFactory.getElementData = function (callback){
		if(LocalStorage.get('elementos')==null){
			$http.get('./json/Elementos.json').success(function(response) {
				LocalStorage.set('elementos',response);
        		callback(response);
    		});
		}else{
			callback(LocalStorage.get('elementos'));
		}		
	};

	/**
	* Recupera los datos de las listas, si existen en el dispositivo, sino recupera del json de ejemplo
	*/	
	jsonFactory.getListData = function (callback){
		if(LocalStorage.get('listas')==null){
			$http.get('./json/Listas.json').success(function(response) {
				LocalStorage.set('listas',response);
        		callback(response);
    		});
		}else{
			callback(LocalStorage.get('listas'));
		}			
	};		

	/**
	* Recupera los datos de los elementos de una lista, si existen en el dispositivo, sino recupera del json de ejemplo
	*/	
	jsonFactory.getElementListData = function (callback){
		if(LocalStorage.get('cantidadElementosLista')==null){
			$http.get('./json/CantidadElementoLista.json').success(function(response) {
				LocalStorage.set('cantidadElementosLista',response);
        		callback(response);
    		});
		}else{
			callback(LocalStorage.get('cantidadElementosLista'));
		}		
	};	

	return jsonFactory;
})

/**
* Factoría que permite almacenar, recuperar y eliminar datos del localstorage
*/
.factory('LocalStorage', function() {

        return {
            /**
             * Guarda en la base de datos del dispositivo el valor asociándolo a la clave
             */
            set: function(key, value) {
                localStorage.setItem(key, JSON.stringify(value));
            },
            /**
             * Recupera de la base de datos del dispositivo el valor asociado a la clave solicitada
             */
            get: function(key) {
                var resultado = localStorage.getItem(key);
                if (resultado !== null && resultado !== 'undefined' && resultado !== undefined) {
                    return JSON.parse(resultado);
                } else {
                    return null;
                }
            },
            /**
             * Elimina de la base de datos del dispositivo el valor asociado a la clave indicada
             */
            put: function(key) {
                localStorage.removeItem(key);
            }
        };
    });