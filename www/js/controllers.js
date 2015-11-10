angular.module('starter.controllers', [])
.controller('MenuCtrl',function($scope,$state,$ionicHistory){
    $scope.back = function () {
        if ($ionicHistory.currentStateName() == "app.programas_inscritos") $ionicHistory.goBack(-2);
        else $ionicHistory.goBack();
    };         
})
.controller('HomeCtrl', function($scope, $ionicModal, $timeout, autenticacionService) {   
  _init();
  function _init(){
     _getToken();
  };  
  function _getToken(){
      var serAut = autenticacionService._getTokenFirst();
      serAut.then(function (pl) {
          byaSite._setToken(pl.data.access_token);
      }, function (pl) {
          showAlert("Error", "Ha sido imposible conectarse al servidor");
      });
  };
  function showAlert(title, data) {
      var alertPopup = $ionicPopup.alert({
          title: title,
          template: data
      });
      alertPopup.then(function (res) {
          console.log('Thank you');
      });
  };
})
.controller('IdentificarPersonaCtrl', function ($scope, $rootScope, verificacionCiudadanoService, autenticacionService, $ionicPopup, $timeout, $ionicLoading, $location, $state) {
    
    $scope.mostarMensaje = false;
    $scope.ocultoLoader = false;
    $scope.mensajeError = "";
    $scope.usuario = {};
    $scope.usuario.tipoDocumento = "";
    $scope.usuario.documento = ""; 
    $scope.maxLength = 10;   
    $scope.objConsulta = {};
    $scope.errorLongitudDocumento = false;
    
    $scope._verificarCiudadano = function(){
        _verificarCiudadano();
    };    
    
    $scope.maxLengthDocumento = function () {
        $scope.mostrarMensajesError = true;
        $scope.usuario.documento = "";
        $scope.mostarMensaje = false;
        var tipoDocumento = $scope.usuario.tipoDocumento;
        if (tipoDocumento == "TI" || tipoDocumento == "CC") {
            $scope.maxLength = 10;
        } else if (tipoDocumento == "CE") {
            $scope.maxLength = 6;
        }
    };  
      
    $scope.validarDocumento = function (form) {
        $rootScope.mostrarMensajesError = true;
        var tipoDocumento = $scope.usuario.tipoDocumento;
        if (form.$valid && tipoDocumento != "") {
            $scope.ocultoLoader = true;
            $scope.mostarMensaje = false;
            _verificarCiudadano();
        }else{
            $scope.mostarMensaje = true;
        }
    };
    
    var num = 0;
    
    $scope.keydown = function() {
        var str = "" + $scope.usuario.documento + "";        
        var tamaño = str.length+1;        
        console.log(tamaño+" "+$scope.maxLength);       
        
        if(tamaño > $scope.maxLength){    
            $scope.usuario.documento = parseInt(str.substr(0,$scope.maxLength-1)); 
            $scope.errorLongitudDocumento = true;           
        }else $scope.errorLongitudDocumento = false;
    };

    _init();
    function _init() {        
        _getToken();   
    };        
    function _getToken() {
        $scope.ocultoLoader = true;
        if (byaSite._pedirToken()) {
            var serAut = autenticacionService._getTokenFirst();
            serAut.then(function (pl) {
                byaSite._setToken(pl.data.access_token);
                $scope.ocultoLoader = false;
            }, function (pl) {   
                showAlert("Error:", "Ha sido   imposible conectarse al servidor ");
                $scope.ocultoLoader = false;
            });
        }
    };    
    function _verificarCiudadano(){           
        var serVer = verificacionCiudadanoService._obtenerCuestionario($scope.usuario.tipoDocumento, $scope.usuario.documento);
        serVer.then(function (pl) {
            byaSite._setVar("lPreguntas",pl.data);
            $scope.ocultoLoader = false;
            var FechaHoy = new Date();
            var FH = FechaHoy.getFullYear() + "-" + FechaHoy.getMonth() + "-" + FechaHoy.getDate();
            var FV = byaSite._getVar($scope.usuario.documento + "-fecha_verificacion");
            var IV = byaSite._getVar($scope.usuario.documento + "-intentos_verificacion");

            if ((FV == FH) && (IV == 2)) showAlert("Atención", "Usted ya ha realizado el máximo de intentos permitidos, por favor intente nuevamente mañana");
            else {
                var per = { tip_ide: $scope.usuario.tipoDocumento, ide: $scope.usuario.documento };
                byaSite._setVar("PersonaActual", per);
                $scope.usuario.tipoDocumento = "";
                $scope.usuario.documento = "";
                $rootScope.mostrarMensajesError = false;
                $state.go("app.pregunta_validacion");
            }
        }, function (pl) {
            showAlert("Error:", "Ha sido imposible concetarnos al servidor ");
            $scope.ocultoLoader = false;
        });
    };    
    function showAlert(title,data) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: data
        });
        alertPopup.then(function (res) {
            console.log('');
        });
    };  
})
.controller('PreguntasPersonasCtrl', function ($scope, $rootScope, $window, verificacionCiudadanoService, autenticacionService, $ionicPopup, $timeout, $state) {
    $rootScope.lPreguntas = {};
    $rootScope.ids_preguntas = [];
    $rootScope.index_preguntas = 0;
    $rootScope.pregunta_actual = {};
    $rootScope.obj_respuestas = {};
    $scope.ocultarLoader = false;
    $scope._continuar = function(){
        _continuar();
    };
    $scope._verificarValidarRespuestaActual = function (respuesta) {
        $.each($rootScope.pregunta_actual.respuestas, function (index, item) {
            if (item.nombre != respuesta.nombre) item.value = false;
        });
    };
    $rootScope._initPreguntas = function () {
        $rootScope.lPreguntas = {};
        $rootScope.ids_preguntas = [];
        $rootScope.index_preguntas = 0;
        $rootScope.pregunta_actual = {};
        $rootScope.obj_respuestas = {};
        _init();
    };
     
    _init();
    function _init() {
        _getToken();        
    };
    function _getToken() {
        $scope.ocultarLoader = true;
        if (byaSite._pedirToken()) {
            var serAut = autenticacionService._getTokenFirst();
            serAut.then(function (pl) {
                byaSite._setToken(pl.data.access_token);
                _obtenerPreguntas();
                $scope.ocultarLoader = false;
            }, function (pl) {
                showAlert("Error:", "Ha sido imposible conectarse al servidor ");
                $scope.ocultarLoader = false;
            });
        }
    };   
    function _obtenerPreguntas() {
        $rootScope.lPreguntas = byaSite._getVar("lPreguntas");
        $rootScope.obj_respuestas.cuestionarioField = [];
        $rootScope.obj_respuestas.idTransactionField = $rootScope.lPreguntas.CuestionarioProgramasPersonaResponse.idTransactionField;        
        _extraerIdsPreguntas();
    };
    function _extraerIdsPreguntas() {
        $.each($rootScope.lPreguntas.CuestionarioProgramasPersonaResponse.cuestionarioPersonaField, function (index, item) {
            var ban = false;
            $.each($rootScope.ids_preguntas, function (index2, item2) {
                if (item.preguntaField.idPreguntaField == item2) ban = true;
            });            
            if (!ban) $rootScope.ids_preguntas.push(item.preguntaField.idPreguntaField);
        });
        _preguntar(); 
    };
    function _preguntar() {
        $rootScope.pregunta_actual = {};
        $rootScope.pregunta_actual.respuestas = [];
        var respuesta_pendiente = {};
        var ban_res = false;
        $.each($rootScope.lPreguntas.CuestionarioProgramasPersonaResponse.cuestionarioPersonaField, function (index, item) {
            if (item.preguntaField.idPreguntaField == $rootScope.ids_preguntas[$rootScope.index_preguntas]) {
                $rootScope.pregunta_actual.pregunta = item.preguntaField.descripcionPreguntaField;
                var res = {};
                res.value = false;
                res.nombre = item.respuestaField.respuestaDePreguntaField;

                if (("" + res.nombre + "").toUpperCase() != ("ninguna de las anteriores").toUpperCase()) {
                    $rootScope.pregunta_actual.respuestas.push(res);
                }
                else {
                    respuesta_pendiente = res;
                    ban_res = true;
                }
            }
        });
        if (ban_res) {
            $rootScope.pregunta_actual.respuestas.push(respuesta_pendiente);
        }
    };
    function _esValidoRespuesta() {
        var respondio = false;
        $.each($rootScope.pregunta_actual.respuestas, function (index, respuesta) {
            if (respuesta.value) respondio = true;
        });
        return respondio;
    };
    function _buscarRespuestaSeleccionada() {
        var respuesta = "";
        $.each($rootScope.pregunta_actual.respuestas, function (index, item) {
            if (item.value) respuesta = item.nombre;
        });
    
        $.each($rootScope.lPreguntas.CuestionarioProgramasPersonaResponse.cuestionarioPersonaField, function (index, item) {
            if ((item.respuestaField.idPreguntaField == $rootScope.ids_preguntas[$rootScope.index_preguntas]) && (item.respuestaField.respuestaDePreguntaField == respuesta)) {
                $rootScope.obj_respuestas.cuestionarioField.push(item);
            }
        });
    };
    function _continuar() {
        if (_esValidoRespuesta()) {
            _buscarRespuestaSeleccionada();
            if (($rootScope.index_preguntas + 1) < $rootScope.ids_preguntas.length) {
                $rootScope.index_preguntas = $rootScope.index_preguntas + 1;
                _preguntar();
            }
            else {
                _enviarRespuestas();
            }
        } else {
            showAlert("Atención", "Debe seleccionar una de las respuestas");
        }
    };
    function _enviarRespuestas() {
        $scope.ocultarLoader = true;
        var serVerPre = verificacionCiudadanoService._validarCuestionario($rootScope.obj_respuestas); 
        serVerPre.then(function (pl) {
            if (pl.data.EsPersonaVerificada) {
                byaSite._removeVar("fecha_verificacion");
                byaSite._removeVar("intentos_verificacion");
                $scope.ocultarLoader = false;
                $state.go("app.programas_inscritos");
            } else _preguntasErroneas();
        }, function (pl) {
            showAlert("Error:", "Ha sido imposible conectarse al servidor ");
        });
    };
    function _preguntasErroneas() {
        var persona = byaSite._getVar("PersonaActual");
        var FechaHoy = new Date();
        var cadenaFechaVerificacion = persona.ide + "-fecha_verificacion";
        var cadenaIntentosVerificacion = persona.ide + "-intentos_verificacion";
        var FH = FechaHoy.getFullYear() + "-" + FechaHoy.getMonth() + "-" + FechaHoy.getDate();
        var FV = byaSite._getVar(cadenaFechaVerificacion);
        var IV = byaSite._getVar(cadenaIntentosVerificacion);

        

        if ((FV == null) && (IV == null)) {            
            byaSite._setVar(cadenaFechaVerificacion, FH.toString());
            byaSite._setVar(cadenaIntentosVerificacion, 1);
            showAlert("Atención", "Alguna de sus respuestas fue incorrecta, intente nuevamente");
            $scope.ocultarLoader = false;
            $rootScope.index_preguntas = 0;
            _preguntar();
        } else {
            if ((FH == FV) && (IV == 1)) {
                showAlert("Atención", "No paso validación inténtelo nuevamente mañana");
                byaSite._setVar(cadenaIntentosVerificacion, 2);
                $window.history.back();
            }
            else {
                if (FH != FV) {
                    byaSite._setVar(cadenaFechaVerificacion, FH);
                    byaSite._setVar(cadenaIntentosVerificacion, 1);
                    showAlert("Atención", "Alguna de sus respuestas fue incorrecta, intente nuevamente");
                    $scope.ocultarLoader = false;
                    $rootScope.index_preguntas = 0;
                    _preguntar();
                }
                else if (IV == 2) {
                    showAlert("Atención", "No paso validación inténtelo nuevamente mañana");
                    $window.history.back();
                }                
            }
        }        
    };
    function showAlert(title, data) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: data
        });
        alertPopup.then(function (res) {
            console.log('Thank you');
        });
    };
})
.controller('ProgramasInscritosCtrl', function ($scope, $ionicPopup, $ionicModal, $timeout, autenticacionService, utilidadMaestraService, atencionPeticionesService, $state) {
    $scope.lProgramasInscritos = [];
    $scope.persona = {};
    $scope._irDetallesPrograma = function (programa) {
        _irDetallesPrograma(programa);
    };    
    $scope.ocultoMensaje = false;
    $scope.ocultoLoader = false;

    _init();
    function _init() {
        _getTokenUM();
    };
    function _getTokenUM() {
        $scope.ocultoLoader = true;
        var serAut = autenticacionService._getTokenUtilidadMaertra();
        serAut.then(function (pl) {
            byaSite._setTokenUM(pl.data.access_token);
            _programasInscritos();
        }, function (pl) {
            showAlert("Error", "Ha sido imposible conectarse al servidor");
            $scope.ocultoLoader = false;
        });
    };
    function showAlert(title, data) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: data
        });
        alertPopup.then(function (res) {
            console.log('Thank you');
        });
    };
    function _programasInscritos() {
        $scope.persona = byaSite._getVar("PersonaActual");
        var serUtiMaes = utilidadMaestraService._obtenerProgramasInstritos($scope.persona.tip_ide, $scope.persona.ide);
        serUtiMaes.then(function (pl) {
            $scope.ocultoLoader = false;
            if(pl.data.Programas.length == 0){  
                $scope.ocultoMensaje = true;         
            }else{
                $scope.lProgramasInscritos = pl.data;   
                $.each($scope.lProgramasInscritos.Programas, function (index, item) {
                    if (item.programaField.idProgramaField == 1) item.img = "img/familias-en-accion.png";
                    else if (item.programaField.idProgramaField == 3) item.img = "img/jovenes-en-accion.png";
                    else  item.img = "img/logo_default.png";
                });                   
                var ban = false;
                for (var i = 0; i < $scope.lProgramasInscritos.Programas.length; i++) {
                    if($scope.lProgramasInscritos.Programas[i].programaField.idProgramaField == 1 || $scope.lProgramasInscritos.Programas[i].programaField.idProgramaField == 3){
                        ban = true;
                    }
                }
                if (ban) { $scope.ocultoMensaje = false; }
            }
            
        }, function (pl) {
            showAlert("Error: ", "Ha sido imposible conectarse al servidor ");
            $scope.ocultoLoader = false;
        });
    };
    function _irDetallesPrograma(programa) {
        byaSite._setVar("CodigoBeneficiario", programa.codigoBeneficiarioField);
        if(programa.programaField.idProgramaField == 1) $state.go('app.menu-familias-en-accion');
    };
})
.controller('LiquidacionYPagoCtrl', function ($scope) {
    $scope.groups = [];
    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {     
        return $scope.shownGroup === group;  
    };
    $scope.hojavida_MFA = {};
    $scope.liquidaciones = [];
    
    _init();
    function _init() {
        _TraerLiquidaciones();
    };
    function _TraerLiquidaciones() {
        var obj_completo = byaSite._getVar("HV_MFA");
        $scope.hojavida_MFA = obj_completo;
        $scope.liquidaciones = obj_completo.Liquidacion;
    };
})
.controller('MenuFamiliasEnAccionCtrl', function ($scope, $state, autenticacionService, $ionicPopup, $ionicModal, $timeout, atencionPeticionesService) {
    $scope.ocultarLoader = false;
    $scope._goTo = function (value) {
        if(!$scope.ocultarLoader) $state.go(value);
    };

    _init();
    function _init() {
        _getTokenDIS();
    };
    function _getTokenDIS() {
        $scope.ocultarLoader = true;
        var serAut = autenticacionService._getTokenDIS();
        serAut.then(function (pl) {
            $scope.ocultarLoader = false;
            byaSite._setTokenDIS(pl.data.access_token);
            _hojaVidaMasFamiliasEnAccion();
        }, function (pl) {
            $scope.ocultarLoader = false;
            showAlert("Error", "Ha sido imposible conectarse al servidor");
        });
    };    
    function _hojaVidaMasFamiliasEnAccion() {
        $scope.ocultarLoader = true;
        var serHVM = atencionPeticionesService._hojaVidaMFA(byaSite._getVar("CodigoBeneficiario"));
        serHVM.then(function (pl) {
            $scope.ocultarLoader = false;
            console.log(JSON.stringify(pl.data));
            byaSite._setVar("HV_MFA", pl.data);
        }, function (pl) {
            $scope.ocultarLoader = false;
            showAlert("Error", "Ha sido imposible conectarse al servidor"); 
            true;
        });
    };
    function showAlert(title, data) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: data
        });
        alertPopup.then(function (res) {
            console.log('Thank you');
        });
    };
})
.controller('EstadoFamiliaCtrl', function ($scope) {
    $scope.groups = [];
    $scope.nucleo_familiar_completo = [];
    $scope.nucleo_familiar = [];
    $scope.hojavida_MFA = {};   
    $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
    } else {
        $scope.shownGroup = group;
    }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };
    $scope._tipoDocumento = function (value) {
        if (value == 0) return "Cedula de Ciudadanía";
        else if (value == 4) return "Tarjeta de identidad";
        else return "";
    };
    $scope._getGrado = function (value) {
        return _grado(value);
    };

    $scope.indexActual = 0;
    $scope.canItems = 5;
    $scope.inicio = 0;
    $scope.fin = 0;
    $scope.fal = 0;
    $scope._verSiguientes = function () {
        $scope.indexActual += 1;
        _filtrarNucleo();
    };
    $scope._verAnterior = function () {
        $scope.indexActual = $scope.indexActual - $scope.canItems - $scope.canItems + 1;
        _filtrarNucleo();
    };
    $scope._prueba = function () {
        alert($scope.indexActual);
    };
  
    _init();
    function _init() {
        _TraerDatosFamiliares();
    };
    function _TraerDatosFamiliares() {
        var obj_completo = byaSite._getVar("HV_MFA");
        $scope.hojavida_MFA = obj_completo;
        $scope.nucleo_familiar_completo = obj_completo.NucleoFamiliar;
        _asignarDatosEducacion();
        _filtrarNucleo();
    };
    function _asignarDatosEducacion() {
        $.each($scope.nucleo_familiar_completo, function (index, persona) {
            $.each($scope.hojavida_MFA.Educacion, function (index, item_educacion) {
                if (persona.idPersonaField == item_educacion.datosBaseField.idPersonaField) {
                    persona.Colegio = item_educacion.educacionField.institucionEducativaField;
                    persona.Grado = item_educacion.educacionField.gradoEscolarField;
                    persona.Graduado = item_educacion.educacionField.graduadoBachillerField == "NO" ? "Sin Graduar" : "Graduado";
                }
            });
        });
    };
    function _filtrarNucleo() {
        var i = 0;
        var indexAux = $scope.indexActual;
        $scope.nucleo_familiar = [];
        $scope.fal = 0;
        for (i = $scope.indexActual; i - $scope.indexActual < $scope.canItems; i++) {            
            if ($scope.nucleo_familiar_completo[i] != null) {
                $scope.nucleo_familiar.push($scope.nucleo_familiar_completo[i]);
            } else $scope.fal++;
            indexAux = i;
        }
        $scope.indexActual = indexAux;
        $scope.inicio = $scope.indexActual + 1 - $scope.canItems + 1;
        $scope.fin = $scope.indexActual + 1 - $scope.fal;
    };
    function _grado(value) {
        if (value == 0) return "Prejardin";
        if (value == 1) return "Jardin";
        if (value == 2) return "Transición";
        if (value == 3) return "Primero";
        if (value == 4) return "Segundo";
        if (value == 5) return "Tercero";
        if (value == 6) return "Cuarto";
        if (value == 7) return "Quinto";
        if (value == 8) return "Sexto";
        if (value == 9) return "Septimo";
        if (value == 10) return "Octavo";
        if (value == 11) return "Noveno";
        if (value == 12) return "Decimo";
        if (value == 13) return "Undecimo";
    };
})
.controller('CumplimientoCtrl', function ($scope) {
    $scope.listaCumplimientos = [];
    $scope.groups = [];
    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {     
        return $scope.shownGroup === group;  
    };
    
    _init();
    function _init() {
        _TraerDatosCumplimientos();
    };
    function _TraerDatosCumplimientos() {
        var obj_completo = byaSite._getVar("HV_MFA");
        $scope.listaCumplimientos = obj_completo.Cumplimientos;
    };
})
.controller('NovedadesCtrl',function($scope){
    var novedades = byaSite._getVar("HV_MFA");
    $scope.listaNovedades = [];
    $scope.mostrarMensaje = false
    if(novedades.Novedades.length == 0){
        $scope.mostrarMensaje = true;
    }else{
        $scope.mostrarMensaje = false;
        $scope.listaNovedades = novedades.Novedades;
    }    
})
.controller('AntifraudeCtrl', function ($scope) {
    var novedades = byaSite._getVar("HV_MFA");
    $scope.listaNovedades = [];
    $scope.mostrarMensaje = false
    if (novedades.Novedades.length == 0) {
        $scope.mostrarMensaje = true;
    } else {
        $scope.mostrarMensaje = false;
        $scope.listaNovedades = novedades.Novedades;
    }
})
.controller('IdentificarPersonaPotencialCtrl', function ($scope, verificacionCiudadanoService, autenticacionService, $ionicPopup, $timeout, $ionicLoading, $location, $state) {

})
.controller('SeleccionarPersonaCtrl', function ($scope, verificacionCiudadanoService, autenticacionService, $ionicPopup, $timeout, $ionicLoading, $location, $state) {

})
.controller('ProgramasPotencialCtrl', function ($scope, verificacionCiudadanoService, autenticacionService, $ionicPopup, $timeout, $ionicLoading, $location, $state) {

})
.controller('InformacionProgramaCtrl', function ($scope, verificacionCiudadanoService, autenticacionService, $ionicPopup, $timeout, $ionicLoading, $location, $state) {

})
;
