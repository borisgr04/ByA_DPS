var byaSite = new Object();
var byaSite = {
    token_dps: "token_DPS",
     _getToken: function(){
         return localStorage.getItem(this.token_dps);
     },
     _setToken: function(token){
        localStorage.setItem(this.token_dps,token);
     },
     _setVar: function (name,obj) {
        localStorage.setItem(name, JSON.stringify(obj));
     },
     _getVar: function (name) {
        return JSON.parse(localStorage.getItem(name));
     },
     _removeVar: function (name) {
        localStorage.removeItem(name);
     }
};
