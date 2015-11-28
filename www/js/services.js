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
    this._getTokenDIS = function () {
        var dat = "username=FocalizacionUser&password=JentcF9c7liz72o15o6$&grant_type=password&client_Id=ce29f4d9e3a04a6aaf44746adad8f31d";
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
    this._getTokenFoc = function () {
        var dat = "username=FocalizacionUser&password=JentcF9c7liz72o15o6$&grant_type=password&client_Id=e2b7e5a65926490ca6ad5799304fbed5";
        var pet = {
            method: 'POST',
            url: 'http://186.170.31.187/DPS/Utilidad/InfraRESTAuthorization/oauth2/token',
            headers: {
                'User-Agent': 'Fiddler',
                'content-type': 'application/x-www-form-urlencoded',
                'Content-Length': '118',
                'Host': 'urania.accionsocial.col'
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
app.service("atencionPeticionesService", function ($http) {
    this._hojaVidaMFA = function (cod_ide) {
        var pet = {
            method: 'GET',
            url: 'http://186.170.31.187/DPS/GestionAtencionCiudadano/AtencionPeticionesDISWebAPI/HojaVidaMFA/' + cod_ide,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + byaSite._getTokenDIS()
            }
        }
        var req = $http(pet);
        return req;
    };
});
app.service("focalizacionService", function ($http) {
    this._focalizacion = function (tip_ide, ide) {
        tip_ide = tip_ide != null ? tip_ide : "";
        ide = tip_ide != null ? ide : "";

        var pet = {
            method: 'GET',
            url: 'http://186.170.31.187/DPS/DireccionIngresoSocial/InfraestructuraFocalizacionWebAPI/ConsultarPotencial?pTipoIdentificacion=' + tip_ide + '&pTipoPrograma=0&pNumeroIdentificacion=' + ide,
            headers: {
                'User-Agent': 'Fiddler',
                'Authorization': 'Bearer ' + byaSite._getTokenFOC(),
                'Host': 'urania.accionsocial.col',
                'Content-Length': '0'
            }
        }
        var req = $http(pet);
        return req;
    };
});
app.service("mensajesService", function ($http) {
    this._mensjes = function () {
        var pet = {
            method: 'GET',
            url: 'http://186.170.31.187/DPS/DireccionIngresoSocial/InfraestructuraFocalizacionWebAPI/ObtenerMensajesAdministrados?pCodMensaje=',
            headers: {
                'User-Agent': 'Fiddler',
                'Authorization': 'Bearer ' + byaSite._getTokenFOC(),
                'Host': 'urania.accionsocial.col',
                'Content-Length': '0'
            }
        }
        var req = $http(pet);
        return req;
    };
});