angular.module('starter.controllers', [])
.controller('HomeCtrl', function($scope, $ionicModal, $timeout, autenticacionService) { 
  
  _init();
  function _init(){
     _getToken();
  };  
  function _getToken(){
    var serAut = autenticacionService._getToken();
    serAut.then(function(pl){
        byaSite._setToken(pl.data.access_token);
    },function(pl){
        alert(JSON.stringify(pl));
    });
  };
  
})
.controller('IdentificarPersonaCtrl', function($scope, verificacionCiudadanoService) { 
  $scope.objConsulta = {};
  $scope._verificarCiudadano = function(){
    _verificarCiudadano();
  };
  
  _init();
  function _init(){     
  };  
  function _verificarCiudadano(){           
      var serVer = verificacionCiudadanoService._obtenerCuestionario($scope.tip_identificacion, $scope.identificacion);
      serVer.then(function (pl) {
          alert(JSON.stringify(pl));
      },function(pl){
          alert(JSON.stringify(pl));
      });
  };
  
})
.controller('PreguntasPersonasCtrl', function ($scope) {
    $scope.lPreguntas = {};
    $scope.ids_preguntas = [];
     
    _init();


    function _init() {
        _llenarPreguntas();
        _obtenerPreguntas();
    };
    function _llenarPreguntas() {
        var lpreguntas =
            {
                "CuestionarioProgramasPersonaResponse": {
                    "cuestionarioPersonaField": [
                    {
                        "preguntaField": {
                            "idPreguntaField": 9,
                            "descripcionPreguntaField": "¿Con cuál de estos correos electrónicos ha tenido relación?",
                            "tipoPreguntaField": 0
                        },
                        "respuestaField": {
                            "idTransaccionField": null,
                            "idPreguntaField": 9,
                            "respuestaDePreguntaField": "contactenos63@latinmail.com"
                        }
                    },
                    {
                        "preguntaField": {
                            "idPreguntaField": 5,
                            "descripcionPreguntaField": "¿Cuál de las siguientes es su fecha de nacimiento (aaaa-mm-dd)?",
                            "tipoPreguntaField": 0
                        },
                        "respuestaField": {
                            "idTransaccionField": null,
                            "idPreguntaField": 5,
                            "respuestaDePreguntaField": "2016-01-07"
                        }
                    },
                    {
                        "preguntaField": {
                            "idPreguntaField": 9,
                            "descripcionPreguntaField": "¿Con cuál de estos correos electrónicos ha tenido relación?",
                            "tipoPreguntaField": 0
                        },
                        "respuestaField": {
                            "idTransaccionField": null,
                            "idPreguntaField": 9,
                            "respuestaDePreguntaField": "ninguna de las anteriores"
                        }
                    },
                    {
                        "preguntaField": {
                            "idPreguntaField": 1,
                            "descripcionPreguntaField": "¿Con cuál de estas direcciones ha tenido relación?",
                            "tipoPreguntaField": 0
                        },
                        "respuestaField": {
                            "idTransaccionField": null,
                            "idPreguntaField": 1,
                            "respuestaDePreguntaField": "cll 26 n13 -60"
                        }
                    },
                    {
                        "preguntaField": {
                            "idPreguntaField": 1,
                            "descripcionPreguntaField": "¿Con cuál de estas direcciones ha tenido relación?",
                            "tipoPreguntaField": 0
                        },
                        "respuestaField": {
                            "idTransaccionField": null,
                            "idPreguntaField": 1,
                            "respuestaDePreguntaField": "auto norte n 93 -27"
                        }
                    },
                    {
                        "preguntaField": {
                            "idPreguntaField": 1,
                            "descripcionPreguntaField": "¿Con cuál de estas direcciones ha tenido relación?",
                            "tipoPreguntaField": 0
                        },
                        "respuestaField": {
                            "idTransaccionField": null,
                            "idPreguntaField": 1,
                            "respuestaDePreguntaField": "ninguna de las anteriores"
                        }
                    },
                    {
                        "preguntaField": {
                            "idPreguntaField": 9,
                            "descripcionPreguntaField": "¿Con cuál de estos correos electrónicos ha tenido relación?",
                            "tipoPreguntaField": 0
                        },
                        "respuestaField": {
                            "idTransaccionField": null,
                            "idPreguntaField": 9,
                            "respuestaDePreguntaField": "contactenos66@gmail.com"
                        }
                    },
                    {
                        "preguntaField": {
                            "idPreguntaField": 5,
                            "descripcionPreguntaField": "¿Cuál de las siguientes es su fecha de nacimiento (aaaa-mm-dd)?",
                            "tipoPreguntaField": 0
                        },
                        "respuestaField": {
                            "idTransaccionField": null,
                            "idPreguntaField": 5,
                            "respuestaDePreguntaField": "ninguna de las anteriores"
                        }
                    },
                    {
                        "preguntaField": {
                            "idPreguntaField": 5,
                            "descripcionPreguntaField": "¿Cuál de las siguientes es su fecha de nacimiento (aaaa-mm-dd)?",
                            "tipoPreguntaField": 0
                        },
                        "respuestaField": {
                            "idTransaccionField": null,
                            "idPreguntaField": 5,
                            "respuestaDePreguntaField": "2016-01-04"
                        }
                    }
                    ],
                    "programasPersonaField": null,
                    "idTransactionField": "258d0459-bacc-456b-bd91-6e1bf04d08f1"
                }
            }

        byaSite._setVar("lPreguntas", lpreguntas)
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

