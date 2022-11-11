__.models.progressreports = {

  get: function(studentId) {
    return new Promise(function(resolve, reject) {
      MONGOREALM.user.functions.progressReportsGet(localStorage.getItem("session_id"), studentId).then((r) => {
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
}