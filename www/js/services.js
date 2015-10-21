app.service("autenticacionService", function ($http) {
    this._getTokenFirst = function () {
        var dat = "username=UtilidadUser&password=McetmsUt7l$7d4d&grant_type=password&client_Id=9d8a73d138f649628259e5429038d49b";
        var pet = {
            method: 'POST',
            url: 'http://186.170.31.187/DPS/Utilidad/InfraRESTAuthorization/oauth2/token',
            headers: {
                'Accept': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: dat
        }
        var req = $http(pet);
        return req;
    };
    this._getTokenUtilidadMaertra = function () {
        var dat = "username=UtilidadUser&password=McetmsUt7l$7d4d&grant_type=password&client_Id=6e6234a800df4e78b3afa860c63a6a07";
        var pet = {
            method: 'POST',
            url: 'http://186.170.31.187/DPS/Utilidad/InfraRESTAuthorization/oauth2/token',
            headers: {
                'Accept': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: dat
        }
        var req = $http(pet);
        return req;
    };
});
app.service("verificacionCiudadanoService", function ($http) {
    this._obtenerCuestionario = function (tip_ide, ide) {

        tip_ide = tip_ide != null ? tip_ide : "";
        ide = tip_ide != null ? ide : "";

        var pet = {
            method: 'GET',
            url: 'http://186.170.31.187/DPS/VerificacionCiudadano/InfraVerificaCiudadanoWebAPI/ObtenerCuestionario?CantidadPreguntas=3&CantidadRespuestas=3&NumeroDocumento=' + ide + '&TipoDocumento=' + tip_ide,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + byaSite._getToken(),
                'Content-Type': 'application/json'
            }
        }
        var req = $http(pet);
        return req;
    };
    this._validarCuestionario = function (obj_respuesta) {
        var pet = {
            method: 'POST',
            url: 'http://186.170.31.187/DPS/VerificacionCiudadano/InfraVerificaCiudadanoWebAPI/VerificarCuestionario',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + byaSite._getToken()
            },
            data: obj_respuesta
        }
        var req = $http(pet);
        return req;
    };
});
app.service("utilidadMaestraService", function ($http) {
    this._obtenerProgramasInstritos = function (tip_ide, ide) {
        tip_ide = tip_ide != null ? tip_ide : "";
        ide = tip_ide != null ? ide : "";

        var pet = {
            method: 'GET',
            url: 'http://186.170.31.187/DPS/MaestraBeneficiarios/InfraMaestraBeneficiariosWebAPI/ObtenerBeneficios?NumeroDocumento=' + ide + '&TipoDocumento=' + tip_ide,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + byaSite._getTokenUM()
            }
        }
        var req = $http(pet);
        return req;
    };
});