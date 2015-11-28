angular.module('starter.controllers', [])
.controller('MenuCtrl', function ($scope, $state, $ionicHistory, $window, $rootScope) {
    $scope.back = function () {
        if ($ionicHistory.currentStateName() == "app.programas_inscritos") $ionicHistory.goBack(-2);
        else $ionicHistory.goBack();
    };
    $scope.limpiar = function () {
        $rootScope.mostrarMensajesError = false;
        $rootScope.usuario = {};
        $rootScope.usuario.tipoDocumento = "";
        $rootScope.usuario.documento = "";
    };
})
.controller('HomeCtrl', function ($scope, $ionicModal, $timeout, autenticacionService, mensajesService, $rootScope) {
    $scope.$on('$ionicView.enter', function () {
        $scope.ocultarLoader = false;
        _init();
    });
    $scope.ocultarLoader = false;

    function _init() {
        $rootScope.TituloMenu.titulo = '<img class="logoEncabezado" src="img/logo2.png"/> DPS Móvil';
        _getToken();
        _Mensajes();
    };
    function _Mensajes() {
        $scope.ocultarLoader = true;
        var ser = mensajesService._mensjes();
        ser.then(function (pl) {
            $scope.ocultarLoader = false;
            byaSite._setVar("obj_mensajes", pl.data);
        }, function (pl) {
            $scope.ocultarLoader = false;
            showAlert("Error", "Ha sido imposible conectarse al servidor");
        });
    };
    function _getToken(){
        $scope.ocultarLoader = true;
        var serAut = autenticacionService._getTokenFirst();
        serAut.then(function (pl) {
            $scope.ocultarLoader = false;
            byaSite._setToken(pl.data.access_token);
        }, function (pl) {
            $scope.ocultarLoader = false;
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
    $scope.$on('$ionicView.enter', function () {
        $scope.mensajeError = "";
        $rootScope.usuario = {};
        $rootScope.usuario.tipoDocumento = "";
        $rootScope.usuario.documento = "";
        $scope.maxLength = 10;
        $scope.objConsulta = {};
        $scope.errorLongitudDocumento = false;
        $scope.mostarMensaje = false;
        $scope.ocultoLoader = false;
        $rootScope.mostrarMensajesError = false;
        _init();
    });   
    $scope._verificarCiudadano = function () {
        _verificarCiudadano();
    };      
    $scope.maxLengthDocumento = function () {
        $rootScope.mostrarMensajesError = true;
        $rootScope.usuario.documento = "";
        $scope.mostarMensaje = false;
        var tipoDocumento = $rootScope.usuario.tipoDocumento;
        if (tipoDocumento == "TI" || tipoDocumento == "CC") {
            $scope.maxLength = 10;
        } else if (tipoDocumento == "CE") {
            $scope.maxLength = 6;
        }
    };        
    $scope.validarDocumento = function (form) {
        $rootScope.mostrarMensajesError = true;
        var tipoDocumento = $rootScope.usuario.tipoDocumento;
        if (form.$valid && tipoDocumento != "") {
            $scope.ocultoLoader = true;
            $scope.mostarMensaje = false;
            _verificarCiudadano();
        }else{
            $scope.mostarMensaje = true;
        }
    };      
    $scope.keydown = function() {
        var str = "" + $rootScope.usuario.documento + "";        
        var tamaño = str.length+1;              
        
        if(tamaño > $scope.maxLength){    
            $rootScope.usuario.documento = parseInt(str.substr(0,$scope.maxLength-1)); 
            $scope.errorLongitudDocumento = true;           
        }else $scope.errorLongitudDocumento = false;
    };

    function _init() {
        $rootScope.TituloMenu.titulo = '<img class="logoEncabezado" src="img/logo2.png"/> En qué estoy inscrito?';
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
        var serVer = verificacionCiudadanoService._obtenerCuestionario($rootScope.usuario.tipoDocumento, $rootScope.usuario.documento);
        serVer.then(function (pl) {
            byaSite._setVar("lPreguntas",pl.data);
            $scope.ocultoLoader = false;
            var FechaHoy = new Date();
            var FH = FechaHoy.getFullYear() + "-" + FechaHoy.getMonth() + "-" + FechaHoy.getDate();
            var FV = byaSite._getVar($rootScope.usuario.documento + "-fecha_verificacion");
            var IV = byaSite._getVar($rootScope.usuario.documento + "-intentos_verificacion");

            if ((FV == FH) && (IV == 2)) showAlert("Atención", "Usted ya ha realizado el máximo de intentos permitidos, por favor intente nuevamente mañana");
            else {
                var per = { tip_ide: $rootScope.usuario.tipoDocumento, ide: $rootScope.usuario.documento };
                byaSite._setVar("PersonaActual", per);
                $rootScope.usuario.tipoDocumento = "";
                $rootScope.usuario.documento = "";
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
    $scope.$on('$ionicView.enter', function () {
        $rootScope.lPreguntas = {};
        $rootScope.ids_preguntas = [];
        $rootScope.index_preguntas = 0;
        $rootScope.pregunta_actual = {};
        $rootScope.obj_respuestas = {};
        $scope.ocultarLoader = false;
        _init();
    });
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
     
    function _init() {
        $rootScope.TituloMenu.titulo = '<img class="logoEncabezado" src="img/logo2.png"/> En qué estoy inscrito?';
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
.controller('ProgramasInscritosCtrl', function ($scope, $ionicPopup, $rootScope, $ionicModal, $timeout, autenticacionService, utilidadMaestraService, atencionPeticionesService, $state) {
    $scope.$on('$ionicView.enter', function () {
        $scope.lProgramasInscritos = [];
        $scope.persona = {};
        $scope.HV_MFA = {};
        $scope.ocultoMensaje = false;
        $scope.ocultoLoader = false;
        _init();
    });    
    $scope._irDetallesPrograma = function (programa) {
        _irDetallesPrograma(programa);
    };      

    function _init() {
        $rootScope.TituloMenu.titulo = '<img class="logoEncabezado" src="img/logo2.png"/> En qué estoy inscrito?';
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
            } else {
                _getTokenDIS();
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
    function _getTokenDIS() {
        $scope.ocultoLoader = true;
        var serAut = autenticacionService._getTokenDIS();
        serAut.then(function (pl) {
            $scope.ocultoLoader = false;
            byaSite._setTokenDIS(pl.data.access_token);
            _hojaVidaMasFamiliasEnAccion();
        }, function (pl) {
            $scope.ocultoLoader = false;
            showAlert("Error", "Ha sido imposible conectarse al servidor");
        });
    };
    function _hojaVidaMasFamiliasEnAccion() {
        var id = 0;
        $.each($scope.lProgramasInscritos.Programas, function (index, item) {
            if (item.programaField.idProgramaField == 1) {
                id = item.codigoBeneficiarioField;
            }
        });
        if (id != 0) {
            $scope.ocultoLoader = true;
            var serHVM = atencionPeticionesService._hojaVidaMFA(id);
            serHVM.then(function (pl) {
                $scope.ocultoLoader = false;
                $scope.HV_MFA = pl.data;
            }, function (pl) {
                $scope.ocultoLoader = false;
                showAlert("Error", "Ha sido imposible conectarse al servidor");
                true;
            });
        }
    };
})
.controller('LiquidacionYPagoCtrl', function ($scope, $rootScope) {
    $scope.$on('$ionicView.enter', function () {
        $scope.groups = [];
        $scope.hojavida_MFA = {};
        $scope.liquidaciones = [];
        _init();
    });    
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
    
    function _init() {
        $rootScope.TituloMenu.titulo = '<img class="logoEncabezado" src="img/logo2.png"/> Liquidación y Pagos';
        _TraerLiquidaciones();
    };
    function _TraerLiquidaciones() {
        var obj_completo = byaSite._getVar("HV_MFA");
        $scope.hojavida_MFA = obj_completo;
        $scope.liquidaciones = obj_completo.Liquidacion;
    };
})
.controller('MenuFamiliasEnAccionCtrl', function ($scope, $rootScope, $state, autenticacionService, $ionicPopup, $ionicModal, $timeout, atencionPeticionesService) {
    $scope.$on('$ionicView.enter', function () {
        $scope.ocultarLoader = false;
        _init();
    });    
    $scope._goTo = function (value) {
        if(!$scope.ocultarLoader) $state.go(value);
    };

    function _init() {
        $rootScope.TituloMenu.titulo = '<img class="logoEncabezado" src="img/logo2.png"/> Más Familias en Acción';
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
.controller('EstadoFamiliaCtrl', function ($scope, $rootScope) {
    $scope.$on('$ionicView.enter', function () {
        $scope.groups = [];
        $scope.nucleo_familiar_completo = [];
        $scope.nucleo_familiar = [];
        $scope.hojavida_MFA = {};
        $scope.indexActual = 0;
        $scope.canItems = 5;
        $scope.inicio = 0;
        $scope.fin = 0;
        $scope.fal = 0;
        _init();
    });       
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
        if (value == "CC") return "Cedula de Ciudadanía";
        else if (value == "TI") return "Tarjeta de identidad";
        else return "";
    };
    $scope._getGrado = function (value) {
        return _grado(value);
    };    
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
  
    function _init() {
        $rootScope.TituloMenu.titulo = '<img class="logoEncabezado" src="img/logo2.png"/> Datos Familiares';
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
.controller('CumplimientoCtrl', function ($scope, $rootScope) {
    $scope.$on('$ionicView.enter', function () {
        $scope.listaCumplimientos = [];
        $scope.groups = [];
        _init();
    });    
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
    $scope.mostrarTituloSalud = function (cumplimiento) {
        if (cumplimiento.cumplimientoField.cumplimientoTipoIncentivoField == "SALUD")
            return true;
    };    
    $scope.mostrarTituloEducacion = function (cumplimiento) {
        if (cumplimiento.cumplimientoField.cumplimientoTipoIncentivoField == "EDUCACION")
            return true;
    };
    
    function _init() {
        $rootScope.TituloMenu.titulo = '<img class="logoEncabezado" src="img/logo2.png"/> Cumplimiento';
        _TraerDatosCumplimientos();
    };
    function _TraerDatosCumplimientos() {
        var obj_completo = byaSite._getVar("HV_MFA");
        $scope.listaCumplimientos = obj_completo.Cumplimientos;
    };
})
.controller('NovedadesCtrl', function ($scope, $rootScope) {
    $scope.$on('$ionicView.enter', function () {
        _init();
    });

    function _init() {
        $rootScope.TituloMenu.titulo = '<img class="logoEncabezado" src="img/logo2.png"/> Novedades';
        _verNovedades();
    };
    function _verNovedades() {
        var novedades = byaSite._getVar("HV_MFA");
        $scope.listaNovedades = [];
        $scope.mostrarMensaje = false
        if (novedades.Novedades.length == 0) {
            $scope.mostrarMensaje = true;
        } else {
            $scope.mostrarMensaje = false;
            $scope.listaNovedades = novedades.Novedades;
        }
    };       
})
.controller('AntifraudeCtrl', function ($scope, $rootScope) {
    $scope.$on('$ionicView.enter', function () {
        _init();
    });

    function _init() {
        $rootScope.TituloMenu.titulo = '<img class="logoEncabezado" src="img/logo2.png"/> Antifraudes';
        _verAntifraudes();
    };
    function _verAntifraudes() {
        var novedades = byaSite._getVar("HV_MFA");
        $scope.listaNovedades = [];
        $scope.mostrarMensaje = false
        if (novedades.Novedades.length == 0) {
            $scope.mostrarMensaje = true;
        } else {
            $scope.mostrarMensaje = false;
            $scope.listaNovedades = novedades.Novedades;
        }
    };
})
.controller('IdentificarPersonaPotencialCtrl', function ($scope, $rootScope, focalizacionService, verificacionCiudadanoService, autenticacionService, $ionicPopup, $timeout, $ionicLoading, $location, $state) {
    $scope.$on('$ionicView.enter', function () {
        $scope.mensajeError = "";
        $rootScope.usuario = {};
        $rootScope.usuario.tipoDocumento = "";
        $rootScope.usuario.documento = "";
        $scope.maxLength = 10;
        $scope.objConsulta = {};
        $scope.errorLongitudDocumento = false;
        $scope.mostarMensaje = false;
        $scope.ocultoLoader = false;
        $rootScope.mostrarMensajesError = false;
        _init();
    });    
    $scope._verificarCiudadano = function () {
        _verificarCiudadano();
    };
    $scope.maxLengthDocumento = function () {
        $rootScope.mostrarMensajesError = true;
        $rootScope.usuario.documento = "";
        $scope.mostarMensaje = false;
        var tipoDocumento = $rootScope.usuario.tipoDocumento;
        if (tipoDocumento == "1" || tipoDocumento == "2" || tipoDocumento == "5") {
            $scope.maxLength = 10;
        } else if (tipoDocumento == "3") {
            $scope.maxLength = 6;
        }
    };
    $scope.validarDocumento = function (form) {
        $rootScope.mostrarMensajesError = true;
        var tipoDocumento = $rootScope.usuario.tipoDocumento;
        if (form.$valid && tipoDocumento != "") {
            $scope.ocultoLoader = true;
            $scope.mostarMensaje = false;
            _verificarCiudadano();
        } else {
            $scope.mostarMensaje = true;
        }
    };
    $scope.keydown = function () {
        var str = "" + $rootScope.usuario.documento + "";
        var tamaño = str.length + 1;
        console.log(tamaño + " " + $scope.maxLength);

        if (tamaño > $scope.maxLength) {
            $rootScope.usuario.documento = parseInt(str.substr(0, $scope.maxLength - 1));
            $scope.errorLongitudDocumento = true;
        } else $scope.errorLongitudDocumento = false;
    };

    function _init() {
        $rootScope.TituloMenu.titulo = '<img class="logoEncabezado" src="img/logo2.png"/> A qué soy Potencial?';
        _getTokenFOC();
    };
    function _getTokenFOC() {
        $scope.ocultarLoader = true;
        var serAut = autenticacionService._getTokenFoc();
        serAut.then(function (pl) {
            $scope.ocultarLoader = false;
            byaSite._setTokenFOC(pl.data.access_token);
        }, function (pl) {
            $scope.ocultarLoader = false;
            showAlert("Error", "Ha sido imposible conectarse al servidor");
        });
    };
    function _verificarCiudadano() {
        $scope.ocultarLoader = true;
        var serFoca = focalizacionService._focalizacion($rootScope.usuario.tipoDocumento, $rootScope.usuario.documento);
        serFoca.then(function (pl) {
            $scope.ocultarLoader = false;
            byaSite._setVar("Focalizacion", pl.data);
            $rootScope.usuario = {};
            $rootScope.usuario.tipoDocumento = "";
            $rootScope.usuario.documento = "";
            _siIrPersonas(pl.data);
        }, function (pl) {
            $scope.ocultarLoader = false;
            showAlert("Error", "Ha sido imposible conectarse al servidor");
        });
    };
    function _siIrPersonas(obj) {
        if ((obj[0].length > 0) || (obj[1].length > 0) || (obj[2].length > 0)) {
            $state.go("app.seleccionar_personas");
        } else {
            showAlert("Atención", "Lo sentimos, no es potencial para ningún programa");
        }
    }
    function showAlert(title, data) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: data
        });
        alertPopup.then(function (res) {
            console.log('');
        });
    };
})
.controller('SeleccionarPersonaCtrl', function ($scope, $rootScope, verificacionCiudadanoService, autenticacionService, $ionicPopup, $timeout, $ionicLoading, $location, $state, $ionicHistory) {
    $scope.$on('$ionicView.enter', function () {
        $scope.focalizacion = [];
        $scope.personas_programas = [];
        _init();
    });    
    $scope.ValidarPreguntaSeleccionada = function (persona) {
        $.each($scope.personas_programas, function (index, item) {
            if ((item.tipIde == persona.tipIde) && (item.Documento == persona.Documento) && (item.Nombre == persona.Nombre)) {
                item.check = true;
            } else item.check = false;
        });
    };
    $scope._seleccionarPersona = function () {
        _seleccionarPersona();
    };

    function _init() {
        $rootScope.TituloMenu.titulo = '<img class="logoEncabezado" src="img/logo2.png"/> A qué soy Potencial?';
        _traerFocalizacion();
    };
    function _traerFocalizacion() {
        $scope.focalizacion = byaSite._getVar("Focalizacion");
        if ($scope.focalizacion == null) {
            $ionicHistory.goBack()
        }

        _procesarObjeto();

        if (($scope.personas_programas.length == 0) || ($scope.personas_programas == null)) {
            $ionicHistory.goBack()
        }

    };
    function _procesarObjeto() {
        _primeraLista();
        _segundoLista();
        _terceraLista();
    };
    function _primeraLista() {
        $.each($scope.focalizacion[0], function (index, item) {
            var ban = false;
            var indexEncontrado = 0;
            var nombre1 = item.PrimerNombre + " " + item.SegundoNombre + " " + item.PrimerApellido + " " + item.SegundoApellido;
            $.each($scope.personas_programas, function (index2, item2) {    
                if ((nombre1 == item2.Nombre) && (item.TipoDocumento == item2.tipIde) && (item.DocumentoIdentificacion == item2.Documento)) {
                    ban = true;
                    indexEncontrado = index2;
                }
            });
            if (ban) {
                var banP = false;
                $.each($scope.personas_programas[indexEncontrado].lProgramas, function (index3, item3) {
                    if (item3 == item.IdPrograma) banP = true;
                });
                if (!banP) $scope.personas_programas[indexEncontrado].lProgramas.push(item.IdPrograma);
            }
            else {
                var persona = {};
                persona.tipIde = item.TipoDocumento;
                persona.TipoIdentificacion = "C.C.";
                persona.Documento = item.DocumentoIdentificacion;
                persona.Nombre = item.PrimerNombre + " " + item.SegundoNombre + " " + item.PrimerApellido + " " + item.SegundoApellido;
                persona.check = false;
                persona.lProgramas = [];
                persona.lProgramas.push(item.IdPrograma);
                $scope.personas_programas.push(persona);
            }
        });
    };
    function _segundoLista() {
        $.each($scope.focalizacion[1], function (index, item) {
            var ban = false;
            var indexEncontrado = 0;
            var nombre1 = item.PrimerNombre + " " + item.SegundoNombre + " " + item.PrimerApellido + " " + item.SegundoApellido;
            $.each($scope.personas_programas, function (index2, item2) {
                if ((nombre1 == item2.Nombre) && (item.TipoDocumento == item2.tipIde) && (item.DocumentoIdentificacion == item2.Documento)) {
                    ban = true;
                    indexEncontrado = index2;
                }
            });
            if (ban) {
                var banP = false;
                $.each($scope.personas_programas[indexEncontrado].lProgramas, function (index3, item3) {
                    if (item3 == item.IdPrograma) banP = true;
                });
                if (!banP) $scope.personas_programas[indexEncontrado].lProgramas.push(item.IdPrograma);
            }
            else {
                var persona = {};
                persona.tipIde = item.TipoDocumento;
                persona.TipoIdentificacion = "C.C.";
                persona.Documento = item.DocumentoIdentificacion;
                persona.Nombre = item.PrimerNombre + " " + item.SegundoNombre + " " + item.PrimerApellido + " " + item.SegundoApellido;
                persona.check = false;
                persona.lProgramas = [];
                persona.lProgramas.push(item.IdPrograma);
                $scope.personas_programas.push(persona);
            }
        });
    };
    function _terceraLista() {
        $.each($scope.focalizacion[2], function (index, item) {
            var ban = false;
            var indexEncontrado = 0;
            var nombre1 = item.PrimerNombre + " " + item.SegundoNombre + " " + item.PrimerApellido + " " + item.SegundoApellido;
            $.each($scope.personas_programas, function (index2, item2) {
                if ((nombre1 == item2.Nombre) && (item.TipoDocumento == item2.tipIde) && (item.DocumentoIdentificacion == item2.Documento)) {
                    ban = true;
                    indexEncontrado = index2;
                }
            });
            if (ban) {
                var banP = false;
                $.each($scope.personas_programas[indexEncontrado].lProgramas, function (index3, item3) {
                    if (item3 == item.IdPrograma) banP = true;
                });
                if (!banP) $scope.personas_programas[indexEncontrado].lProgramas.push(item.IdPrograma);
            }
            else {
                var persona = {};
                persona.tipIde = item.TipoDocumento;
                persona.TipoIdentificacion = "C.C.";
                persona.Documento = item.DocumentoIdentificacion;
                persona.Nombre = item.PrimerNombre + " " + item.SegundoNombre + " " + item.PrimerApellido + " " + item.SegundoApellido;
                persona.check = false;
                persona.lProgramas = [];
                persona.lProgramas.push(item.IdPrograma);
                $scope.personas_programas.push(persona);
            }
        });
    };
    function _seleccionarPersona() {
        var ban = false;
        var personaSeleccionada = {};
        $.each($scope.personas_programas, function (index, item) {   
            if (item.check) {
                ban = true;
                personaSeleccionada = item;
            }
        });
        if (ban) {
            byaSite._setVar("persona_seleccionada_potencial", personaSeleccionada);
            $state.go("app.programas_potencial");
        } else {
            showAlert("Atención","Debe seleccionar una de las opciones");
        }
    };
    function showAlert(title, data) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: data
        });
        alertPopup.then(function (res) {
            console.log('');
        });
    };
})
.controller('ProgramasPotencialCtrl', function ($scope, $rootScope, verificacionCiudadanoService, autenticacionService, $ionicPopup, $timeout, $ionicLoading, $location, $state) {
    $scope.$on('$ionicView.enter', function () {
        $scope.persona = {};
        $scope.lProgramas = [];
        _init();
    });    
    $scope._elegirPrograma = function (programa) {
        byaSite._setVar("id_programa_potencial_elegio", programa.Id);
        $state.go("app.informacion_programa");
    };

    function _init() {
        $rootScope.TituloMenu.titulo = '<img class="logoEncabezado" src="img/logo2.png"/> A qué soy Potencial?';
        _Programas();
    };
    function _Programas() {
        $scope.persona = byaSite._getVar("persona_seleccionada_potencial");
        $.each($scope.persona.lProgramas,function(index,item){
            var e = {};            
            if (item == 1) {
                e.NombrePrograma = "Más Familias en Acción";
                e.TextoPrograma = "MFA";
                e.Id = 1;
                e.Img = "img/familias-en-accion.png";
            }
            if (item == 2) {
                e.NombrePrograma = "Jovenes en Acción";
                e.TextoPrograma = "JEA";
                e.Id = 2;
                e.Img = "img/jovenes-en-accion.png";
            }
            if (item == 3) {
                e.NombrePrograma = "Programa Ingreso Prosperidad Social";
                e.TextoPrograma = "IPS";
                e.Id = 3;
                e.Img = "img/logo_default.png";
            }
            if (item == 4) {
                e.NombrePrograma = "Cien mil Viviendas Gratis";
                e.TextoPrograma = "CVG";
                e.Id = 4;
                e.Img = "img/logo_default.png";
            }
            $scope.lProgramas.push(e);
        });
    };
})
.controller('InformacionProgramaCtrl', function ($scope, $rootScope, verificacionCiudadanoService, autenticacionService, $ionicPopup, $timeout, $ionicLoading, $location, $state) {
    $scope.$on('$ionicView.enter', function () {
        $scope.id_programa = {};
        $scope.programa = {};
        _init();
    });

    function _init() {
        $rootScope.TituloMenu.titulo = '<img class="logoEncabezado" src="img/logo2.png"/> A qué soy Potencial?';
        _programa();
    };
    function _programa() {
        $scope.id_programa = byaSite._getVar("id_programa_potencial_elegio");
        if ($scope.id_programa == 1) {
            $scope.programa.Img = "img/mas_familias_accion.jpg";
            $scope.programa.Nombre = "Programa Más Familias en Acción";
            $scope.programa.Texto = _buscarMensaje(8);
        }
        if ($scope.id_programa == 2) {
            $scope.programa.Img = "img/jovenes_en_accion.jpg";
            $scope.programa.Nombre = "Programa Jovenes en Acción";
            $scope.programa.Texto = _buscarMensaje(9);
        }
        if ($scope.id_programa == 3) {
            $scope.programa.Img = "img/logo.png";
            $scope.programa.Nombre = "Programa Ingreso Prosperidad Social";
            $scope.programa.Texto = "Contacte a su gestor para averiguar cuando puede inscribirse";
        }
        if ($scope.id_programa == 4) {
            $scope.programa.Img = "img/logo.png";
            $scope.programa.Nombre = "Programa Cien mil Viviendas Gratis";
            $scope.programa.Texto = _buscarMensaje(1);
        }
    };
    function _buscarMensaje(cod) {
        var objMensajes = byaSite._getVar("obj_mensajes");
        var mens = "";
        $.each(objMensajes, function (index, item) {
            if (item.CodMensaje == cod) {
                mens = item.Mensaje;
            }
        });
        return mens;
    };
})
;
