app.service("autenticacion", function ($http) {
    this._getToken = function () {
        var pet = {
            method: 'POST',
            url: 'http://186.170.31.187/DPS/Utilidad/InfraRESTAuthorization/oauth2/token',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'                
            },
            data: { 
                'username':'UtilidadUser',
                'password':'McetmsUt7l$7d4d',
                'grant_type':'password',
                'client_Id':'9d8a73d138f649628259e5429038d49b'
            }
        }
        var req = $http(pet);
        return req;
    };
});