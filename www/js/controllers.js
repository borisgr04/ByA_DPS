angular.module('starter.controllers', [])
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
.controller('IdentificarPersonaCtrl', function ($scope, verificacionCiudadanoService, autenticacionService, $ionicPopup, $timeout, $ionicLoading, $location, $state) {
    
    $scope.ocultoMensaje = false;
    $scope.ocultoLoader = false;
    $scope.mensajeError = "";
    $scope.usuario = {};
    $scope.usuario.tipoDocumento = "";
    $scope.usuario.documento = "";    
    $scope.objConsulta = {};
    $scope._verificarCiudadano = function(){
        _verificarCiudadano();
    };
    $scope.validarDocumento = function () {
        $scope.mensajeError = "";
        var documento = $scope.usuario.documento;
        var tipoDocumento = $scope.usuario.tipoDocumento;
        console.log(('' + documento).length);
        if (documento == "") {
            $scope.mensajeError = "Debe completar el número de documento";
            $scope.ocultoMensaje = true;
        } else if (tipoDocumento == "CE" && ('' + documento).length > 6) {
            $scope.mensajeError = "La longitud máxima del número de documento es 6";
            $scope.usuario.documento = "";
            $scope.ocultoMensaje = true;
        } else if (tipoDocumento == "") {
            $scope.mensajeError = "Debe completar el tipo de identificación";
        } else if (! /^[0-9]+/.test(documento)) {
            $scope.mensajeError = "No se admiten caracteres especiales y la longitud máxima del número de documento es 10";
            $scope.usuario.documento = "";
            $scope.ocultoMensaje = true;            
        } else {
            $scope.ocultoLoader = true;
            _verificarCiudadano();
        }
    };
    
    _init();
    function _init() {
        _getToken();
    };    
    function _getToken() {
        if (byaSite._pedirToken()) {
            var serAut = autenticacionService._getTokenFirst();
            serAut.then(function (pl) {
                byaSite._setToken(pl.data.access_token);
            }, function (pl) {
                showAlert("Error:", "Ha sido imposible conectarse al servidor ");
            });
        }
    };    
    function _verificarCiudadano(){           
        var serVer = verificacionCiudadanoService._obtenerCuestionario($scope.usuario.tipoDocumento, $scope.usuario.documento);
        serVer.then(function (pl) {
            byaSite._setVar("lPreguntas",pl.data);
            $scope.ocultoLoader = false;
            //$state.go("app.pregunta_validacion");
            window.location.href = "#/app/pregunta_validacion";
        }, function (pl) {
            showAlert("Error:", "Ha sido imposible conectarse al servidor ");
            $scope.ocultoLoader = false;
        });
    };    
    function showAlert(title,data) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: data
        });
        alertPopup.then(function (res) {
            console.log('Thank you');
        });
    };  
})
.controller('PreguntasPersonasCtrl', function ($scope, $ionicPopup, $timeout) {
    $scope.lPreguntas = {};
    $scope.ids_preguntas = [];
    $scope.index_preguntas = 0;
    $scope.pregunta_actual = {};
    $scope.obj_respuestas = {};
    $scope._continuar = function(){
        _continuar();
    };
    $scope._verificarValidarRespuestaActual = function (respuesta) {
        $.each($scope.pregunta_actual.respuestas, function (index, item) {
            if (item.nombre != respuesta.nombre) item.value = false;
        });
    };
     
    _init();
    function _init() {
        _obtenerPreguntas();
    };
    function _obtenerPreguntas() {
        $scope.lPreguntas = byaSite._getVar("lPreguntas");
        $scope.obj_respuestas.cuestionarioField = [];
        $scope.obj_respuestas.idTransactionField = $scope.lPreguntas.CuestionarioProgramasPersonaResponse.idTransactionField;        
        _extraerIdsPreguntas();
    };
    function _extraerIdsPreguntas() {
        $.each($scope.lPreguntas.CuestionarioProgramasPersonaResponse.cuestionarioPersonaField, function (index, item) {
            var ban = false;
            $.each($scope.ids_preguntas, function (index2, item2) {
                if (item.preguntaField.idPreguntaField == item2) ban = true;
            });            
            if (!ban) $scope.ids_preguntas.push(item.preguntaField.idPreguntaField);
        });
        _preguntar(); 
    };
    function _preguntar() {
        $scope.pregunta_actual = {};
        $scope.pregunta_actual.respuestas = [];
        var respuesta_pendiente = {};
        var ban_res = false;
        $.each($scope.lPreguntas.CuestionarioProgramasPersonaResponse.cuestionarioPersonaField, function (index, item) {
            if (item.preguntaField.idPreguntaField == $scope.ids_preguntas[$scope.index_preguntas]) {
                $scope.pregunta_actual.pregunta = item.preguntaField.descripcionPreguntaField;
                var res = {};
                res.value = false;
                res.nombre = item.respuestaField.respuestaDePreguntaField;

                if (("" + res.nombre + "").toUpperCase() != ("ninguna de las anteriores").toUpperCase()) {
                    $scope.pregunta_actual.respuestas.push(res);
                }
                else {
                    respuesta_pendiente = res;
                    ban_res = true;
                }
            }
        });
        if (ban_res) {
            $scope.pregunta_actual.respuestas.push(respuesta_pendiente);
        }
    };
    function _esValidoRespuesta() {
        var respondio = false;
        $.each($scope.pregunta_actual.respuestas, function (index, respuesta) {
            if (respuesta.value) respondio = true;
        });
        return respondio;
    };
    function _buscarRespuestaSeleccionada() {
        var respuesta = "";
        $.each($scope.pregunta_actual.respuestas, function (index, item) {
            if (item.value) respuesta = item.nombre;
        });
    
        $.each($scope.lPreguntas.CuestionarioProgramasPersonaResponse.cuestionarioPersonaField, function (index, item) {
            if ((item.respuestaField.idPreguntaField == $scope.ids_preguntas[$scope.index_preguntas]) && (item.respuestaField.respuestaDePreguntaField == respuesta)) {
                $scope.obj_respuestas.cuestionarioField.push(item);
            }
        });
    };
    function _continuar() {
        if (_esValidoRespuesta()) {
            _buscarRespuestaSeleccionada();
            if (($scope.index_preguntas + 1) < $scope.ids_preguntas.length) {
                $scope.index_preguntas = $scope.index_preguntas + 1;
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
        showAlert("Atención","Se enviaran sus respuestas para ser validadas");
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
.controller('CumplimientoCtrl', function ($scope) {
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
  
  _llenarGrupos();
  function _llenarGrupos(){
      var e = {};
      e.name = "Periodo Cumplimiento Salud";
      e.fecha1 = "11-11-2015";
      e.name2 = "Periodo Cumplimiento Educación";
      e.fecha2 = "12-12-2015";
      e.items = ["Beneficiario","Tipo Inscripción","Cumplió","Fecha Cumplimiento"];
      
      var d = {};
      d.name = "Periodo Cumplimiento Salud";
      d.fecha1 = "11-11-2015"
      d.name2 = "Periodo Cumplimiento Educación";
      d.fecha2 = "12-12-2015";
      d.items = ["Beneficiario","Tipo Inscripción","Cumplió","Fecha Cumplimiento"];
      
      $scope.groups.push(e);
      $scope.groups.push(d);
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
  
    _llenarGrupos();
    function _llenarGrupos(){
        var e = {};
        e.name = "Periodo Cumplimiento Salud";
        e.fecha1 = "11-11-2015   ";
        e.name2 = "Periodo Cumplimiento Educación";
        e.fecha2 = "12-12-2015   ";
        e.items = ["Beneficiario","Tipo Inscripción","Cumplió","Fecha Cumplimiento"];
      
        var d = {};
        d.name = "Periodo Cumplimiento Salud";
        d.fecha1 = "11-11-2015"
        d.name2 = "Periodo Cumplimiento Educación";
        d.fecha2 = "12-12-2015";
        d.items = ["Beneficiario","Tipo Inscripción","Cumplió","Fecha Cumplimiento"];
      
        $scope.groups.push(e);
        $scope.groups.push(d);
    };
})
.controller('MenuFamiliasEnAccionCtrl', function ($scope) {
    $scope._goTo = function(value){
    window.location.href=value;
    };
})
.controller('EstadoFamiliaCtrl', function ($scope) {
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
  
    _llenarGrupos();
    function _llenarGrupos(){
        var e = {};
        e.name = "Nombre Miembro";
        e.items = ["Estado del Beneficiario","Targeta de Identidad","12345678","Camilo Perez","Nombre del Colegio","Priorizado","Graduado","Datos de Salud"];
     
        var d = {};
        d.name = "Nombre Miembro";
        d.items = ["Estado del Beneficiario","Targeta de Identidad","12345678","Camilo Perez","Nombre del Colegio","Priorizado","Graduado","Datos de Salud"];
      
        $scope.groups.push(e);
        $scope.groups.push(d);
    };
});
