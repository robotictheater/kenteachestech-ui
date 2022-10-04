__.models.logins = {
  data: null,

  /**************************************************
    CREATE a new login record
    dataToSave
      {
        "email":""
      }

    response:
     - No data only success bool    
  ***************************************************/
  create: function(dataToSave) {
    return new Promise(function(resolve, reject) {
      MONGOREALM.user.functions.loginCreate(dataToSave).then((r) => {
        if (r) {
          if (r.success) {
            resolve(((r.data) ? r.data : null));
          } else {
            reject((r.details) ? r.details : "Failed to create your login. Please try again.");
          }
        }else{
          reject("Something went wrong. The server responded with NULL.");
        }
      }).catch(reject);
    });
  },

  /**************************************************
      VERIFY a new login record
      dataToSend
        {
          "email":"",
          "passcode":""
        }
  
      response data:
       - session_id
    ***************************************************/
  validate: function(dataToSend) {
    return new Promise(function(resolve, reject) {
      MONGOREALM.user.functions.loginValidate(dataToSend).then((r) => {
        if (r) {
          if (r.success) {
            resolve(((r.data) ? r.data : null));
          } else {
            reject(r);
          }
        }
      }).catch(reject);
    });
  },

  validateSession: function() {
    return new Promise(function(resolve, reject) {
      MONGOREALM.user.functions.validateSession(dataToSave).then((r) => {
        if (r) {
          if (r.success) {
            resolve(((r.data) ? r.data : null));
          } else {
            reject(r);
          }
        }
      }).catch(reject);
    });
  },


};