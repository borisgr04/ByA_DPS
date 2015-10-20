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
          alert(JSON.stringify(pl));
      });
  };  
})
.controller('IdentificarPersonaCtrl', function ($scope, verificacionCiudadanoService, autenticacionService, $ionicPopup, $timeout) {
    $scope.objConsulta = {};
    $scope._verificarCiudadano = function(){
        _verificarCiudadano();
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
        var serVer = verificacionCiudadanoService._obtenerCuestionario($scope.objConsulta.tip_identificacion, $scope.objConsulta.identificacion);
        serVer.then(function (pl) {
            byaSite._setVar("lPreguntas", pl.data);
            window.location.href = "#/app/pregunta_validacion";
        }, function (pl) {
            showAlert("Error:", "Ha sido imposible conectarse al servidor ");
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
.controller('PreguntasPersonasCtrl', function ($scope) {
    $scope.lPreguntas = {};
    $scope.ids_preguntas = [];
     
    _init();

    function _init() {
        _obtenerPreguntas();
    };
    function _obtenerPreguntas() {
        $scope.lPreguntas = byaSite._getVar("lPreguntas");       
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

