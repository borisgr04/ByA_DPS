var byaSite = new Object();
var byaSite = {
    pedirTokenSiempre: true,
    siAlert:true,
    token_dps_VC: "token_DPS_VC",
    token_dps_UM: "token_DPS_UM",
    token_dps_DIS: "token_DPS_DIS",
    token_dps_FOC: "token_DPS_FOC",
    _pedirToken: function(){
        return this.pedirTokenSiempre;
    },
    _getToken: function (fc_success) {
        return localStorage.getItem(this.token_dps_VC);
     },
     _setToken: function(token){
        localStorage.setItem(this.token_dps_VC,token);
     },
     _getTokenUM: function (fc_success) {
         return localStorage.getItem(this.token_dps_UM);
     },
     _setTokenUM: function (token) {
         localStorage.setItem(this.token_dps_UM, token);
     },
     _getTokenDIS: function (fc_success) {
         return localStorage.getItem(this.token_dps_DIS);
     },
     _setTokenDIS: function (token) {
         localStorage.setItem(this.token_dps_DIS, token);
     },
     _getTokenFOC: function (fc_success) {
         return localStorage.getItem(this.token_dps_FOC);
     },
     _setTokenFOC: function (token) {
         localStorage.setItem(this.token_dps_FOC, token);
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
     },
     console: function (value) {
         if (this.siAlert) {
             console.log(JSON.stringify(value));
         }
     }
};
