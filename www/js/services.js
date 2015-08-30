angular.module('alacena.services', [])

/**
* Factoría que permite
*/
.factory('jsonFactory',function($http,LocalStorage,logdata){

	var jsonFactory = {};

	/**
	* Recupera los datos de configuración de la App, si existen en el dispositivo, sino recupera del json de ejemplo
	*/
	jsonFactory.getConfigData = function (callback){
		$http.get('./json/Configuracion.json').success(function(response) {
			var datosConfig = response;
			if(LocalStorage.get('configData')==null){
					logdata.debug('Primera instalación');
					LocalStorage.set('configData',datosConfig);
					callback(datosConfig);
			}else{
				logdata.debug('Actualizando configuración');
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
			logdata.debug('Primera instalación');
			$http.get('./json/Elementos.json').success(function(response) {
				LocalStorage.set('elementos',response);
        		callback(response);
    		});
		}else{
			logdata.debug('Se recuperan los elementos');
			callback(LocalStorage.get('elementos'));
		}
	};

	/**
	* Recupera los datos de las listas, si existen en el dispositivo, sino recupera del json de ejemplo
	*/
	jsonFactory.getListData = function (callback){
		if(LocalStorage.get('listas')==null){
			logdata.debug('Primera instalación');
			$http.get('./json/Listas.json').success(function(response) {
				LocalStorage.set('listas',response);
        		callback(response);
    		});
		}else{
			logdata.debug('Se recuperan las listas');
			callback(LocalStorage.get('listas'));
		}
	};

	/**
	* Recupera los datos de los elementos de una lista, si existen en el dispositivo, sino recupera del json de ejemplo
	*/
	jsonFactory.getElementListData = function (callback){
		if(LocalStorage.get('cantidadElementosLista')==null){
			logdata.debug('Primera instalación');
			$http.get('./json/CantidadElementoLista.json').success(function(response) {
				LocalStorage.set('cantidadElementosLista',response);
        		callback(response);
    		});
		}else{
			logdata.debug('Se recuperan los elementos de una lista');
			callback(LocalStorage.get('cantidadElementosLista'));
		}
	};

	return jsonFactory;
})

/**
* Factoría que permite almacenar, recuperar y eliminar datos del localstorage
*/
.factory('LocalStorage', function(logdata) {

        return {
            /**
             * Guarda en la base de datos del dispositivo el valor asociándolo a la clave
             */
            set: function(key, value) {
								logdata.debug('Guarda:'+JSON.stringify(value));
                localStorage.setItem(key, JSON.stringify(value));
            },
            /**
             * Recupera de la base de datos del dispositivo el valor asociado a la clave solicitada
             */
            get: function(key) {
								logdata.debug('Recupera:'+key);
                var resultado = localStorage.getItem(key);
                if (resultado !== null && resultado !== 'undefined' && resultado !== undefined) {
										logdata.debug('Recuperado:'+JSON.stringify(resultado));
                    return JSON.parse(resultado);
                } else {
										logdata.debug('No encontrado:'+key);
                    return null;
                }
            },
            /**
             * Elimina de la base de datos del dispositivo el valor asociado a la clave indicada
             */
            put: function(key) {
								logdata.debug('Borrado:'+key);
                localStorage.removeItem(key);
            }
        };
    })

		/**
		* Factoría que guarda en un fichero el log
		*/
		.factory('logdata', function($cordovaFile,$rootScope) {

			var formatoDia = 'YYYY_MM_DD';
			var formato = "YYYY-MM-DD HH:mm:ss";
			var dia = moment().format(formatoDia);

			return{
					createLogFile: function(){
						if($rootScope.dataDirectory!==''){
							$cordovaFile.createFile($rootScope.dataDirectory,"alacena_"+dia+".log", true)
					      .then(function (success) {
					        console.log('FICHERO CREADO');
					      }, function (error) {
					        console.log('FICHERO NO CREADO:'+JSON.stringify(error));
					    });
						}
					},
					info: function(message){
						var txtLog = '{'+moment().format(formato)+'}-[INFO]:::'+message+'\n';
						if($rootScope.dataDirectory!==''){
							$cordovaFile.writeExistingFile($rootScope.dataDirectory, "alacena_"+dia+".log", txtLog)
								.then(function (success) {
										console.log(txtLog);
								}, function (error) {
										console.log(error);
								}
							);
						}else{
							console.log(txtLog);
						}
					},
					error: function(message){
						var txtLog = '{'+moment().format(formato)+'}-[ERROR]:::'+message+'\n';
						if($rootScope.dataDirectory!==''){
							$cordovaFile.writeExistingFile($rootScope.dataDirectory, "alacena_"+dia+".log", txtLog)
								.then(function (success) {
									console.log(txtLog);
								}, function (error) {
										console.log(error);
								}
							);
						}else{
							console.log(txtLog);
						}
					},
					debug: function(message){
						var txtLog = '{'+moment().format(formato)+'}-[DEBUG]:::'+message+'\n';
						if($rootScope.dataDirectory!==''){
							$cordovaFile.writeExistingFile($rootScope.dataDirectory, "alacena_"+dia+".log", txtLog)
								.then(function (success) {
									console.log(txtLog);
								}, function (error) {
										console.log(error);
									}
							);
						}else{
							console.log(txtLog);
						}
					},
					warn: function(message){
						var txtLog = '{'+moment().format(formato)+'}-[WARN]:::'+message+'\n';
						if($rootScope.dataDirectory!==''){
							$cordovaFile.writeExistingFile($rootScope.dataDirectory, "alacena_"+dia+".log", txtLog)
								.then(function (success) {
									console.log(txtLog);
								}, function (error) {
										console.log(error);
									}
							);
						}else{
							console.log(txtLog);
						}
					},
			};
		});
