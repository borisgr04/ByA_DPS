var byaSite = new Object();
var byaSite = {
    token_dps: "token_DPS",
     _getToken: function(){
         localStorage.getItem(this.token_dps);
     },
     _setToken: function(token){
        localStorage.setItem(this.token_dps,token);
     }
};
