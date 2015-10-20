app.service("autenticacion", function ($http) {
    var req = {
        method: 'POST',
        url: 'http://186.170.31.187/DPS/Utilidad/InfraRESTAuthorization/oauth2/token',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: { 
            username: 'UtilidadUser',
            password: 'McetmsUt7l$7d4d',
            grant_type: 'password',
            client_id: '9d8a73d138f649628259e5429038d49b' 
        }
    };
    
    
    this.Post = function () {
        $http(req).then
    };
});