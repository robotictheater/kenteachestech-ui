__.models.accounts = {
  data: null,

  type: function(checkIf) {
    if (checkIf) {
      return (__.models.accounts.data.session.user_type.toLowerCase() === checkIf.toLowerCase())
    } else {
      return __.models.accounts.data.session.user_type
    }
  },

  currentStudent: function() {
    if (__.models.accounts.data.session.username) {
      return __.models.accounts.data.students[__.models.accounts.data.session.username];
    } else {
      return false;
    }

  },
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
    UPDATE account info
    dataToSend
      {
        "email":"",
        "first_name":"",
        "last_name":"",
        
      }

    response data:
     - 
  ***************************************************/
  update: function(dataToSave) {
    return new Promise(function(resolve, reject) {
      MONGOREALM.user.functions.accountUpdate(localStorage.getItem("session_id"), dataToSave).then((r) => {
        if (r) {
          if (r.success) {
            __.models.accounts.data.first_name = dataToSave.first_name;
            __.models.accounts.data.last_name = dataToSave.last_name;
            __.models.accounts.data.email = dataToSave.email;
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

  addStudent: function(dataToSave) {
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
  },

  updateStudent: function(dataToSave) {
    return new Promise(function(resolve, reject) {
      MONGOREALM.user.functions.accountStudentUpdate(localStorage.getItem("session_id"), dataToSave).then((r) => {
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

  verifyUsernamePassword: function(dataToSend) {
    return new Promise(function(resolve, reject) {
      MONGOREALM.user.functions.verifyUsernamePassword(dataToSend).then((r) => {
        if (r) {
          if (r.success && r.data && r.data.session_id) {
            resolve(r.data);
          } else {
            reject(((r && r.details) ? r.details : ""));
          }
        }
      }).catch(reject);
    });
  },

  enrollStudent: function(courseId) {
    return new Promise(function(resolve, reject) {
      MONGOREALM.user.functions.accountStudentEnroll(localStorage.getItem("session_id"), courseId).then((r) => {
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