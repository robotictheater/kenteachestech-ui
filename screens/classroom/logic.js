__.js={};

(function() {
  __.load(["/models/accounts"], function() {
    __.models.accounts.get().then(r=>{ console.log({r});}).catch(e=>{console.log(e)})
  });
})()