var byaSite = new Object();
var byaSite = {
    pedirTokenSiempre: true,
    siAlert:true,
    token_dps_VC: "token_DPS_VC",
    _pedirToken: function(){
        return this.pedirTokenSiempre;
    },
    _getToken: function (fc_success) {
        return localStorage.getItem(this.token_dps_VC);
     },
     _setToken: function(token){
        localStorage.setItem(this.token_dps_VC,token);
     },
     _setVar: function (name,obj) {
        localStorage.setItem(name, JSON.stringify(obj));
     },
     _getVar: function (name) {
        return JSON.parse(localStorage.getItem(name));
     },
     _removeVar: function (name) {
        localStorage.removeItem(name);
     },
     alert: function (value) {
         if (this.siAlert) {
             alert(JSON.stringify(value));
         }
     }
};
