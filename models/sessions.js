__.models.sessions = {
  data: null,
  delete: async function() {        
    return new Promise(function(resolve, reject) {
      MONGOREALM.user.functions.sessionDelete(localStorage.getItem("session_id")).then((r) => {
        if (r) {
          if (r.success) {          
            resolve();
          } else {
            reject(r);
          }
        }
      }).catch(reject);
    });
  }

  
};