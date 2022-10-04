__.models.accounts = {
  data: null,

  /**************************************************
    CREATE a new account when registering
    dataToSend
      {
        "email":"",
        "first_name":"",
        "last_name":"",
        
      }

    response data:
     - undefined
  ***************************************************/
  create: function(dataToSave) {
    return new Promise(function(resolve, reject) {
      MONGOREALM.user.functions.accountCreate(dataToSave).then((r) => {
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

  /**************************************************
    GET  account by the session id
    - Sending the sessionid string

    response data:
     - the account object
  ***************************************************/
  get: function() {
    let that = this;
    return new Promise(function(resolve, reject) {
      MONGOREALM.user.functions.accountGet(localStorage.getItem("session_id")).then((r) => {
        if (r) {
          if (r.success) {
            that.data = r.data;
            resolve(((r.data) ? r.data : null));
          } else {
            reject(r);
          }
        }
      }).catch(reject);
    });
  },


  /**************************************************
  CHECK USERNAME  See if the username already exists
  - Sending the sessionid string

  response data:
   - the account object
***************************************************/
  checkUsername: function(username) {
    return new Promise(function(resolve, reject) {
      MONGOREALM.user.functions.accountUsernameCheck(username).then((r) => {
        if (r) {
          if (r.success) {
            resolve();
          } else {
            reject(((r && r.details) ? r.details : ""));
          }
        }
      }).catch(reject);
    });
  },

  addStudent:function(dataToSave){
    return new Promise(function(resolve, reject) {
      MONGOREALM.user.functions.accountStudentAdd(localStorage.getItem("session_id"), dataToSave).then((r) => {
        if (r) {
          if (r.success) {
            resolve();
          } else {
            reject(((r && r.details) ? r.details : ""));
          }
        }
      }).catch(reject);
    });
  }
  
};