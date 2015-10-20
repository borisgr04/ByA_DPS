angular.module('starter.controllers', [])
.controller('HomeCtrl', function($scope, $ionicModal, $timeout, $http) { 

})

.controller('IdentificarPersonaCtrl',function($scope){
  
  $scope.oculto = false;
  $scope.mensajeError = "";
  $scope.usuario = {};
  $scope.usuario.tipoDocumento = null;
  $scope.usuario.documento = "";
  
  $scope.regresar = function(){
    
  }
  
  $scope.unitChanged = function(){
    alert($scope.usuario.tipoDocumento.tipo);
  }
  
  $scope.validarDocumento = function(){
    var documento = $scope.usuario.documento;
    if(documento == ""){
      $scope.mensajeError = "Debe seleccionar por lo menos un parámetro de búsqueda";
      $scope.oculto = true;
    }else if (! /^[0-9]+$/.test(documento)) {
      $scope.mensajeError = "No se admiten caracteres especiales";
      $scope.usuario.documento = "";
      $scope.oculto = true;
    }
    
  }
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

