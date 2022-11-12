__.js = {
  load: function() {
    document.getElementById("lockedMessage").innerHTML = __.models.accounts.data.locked;
  }
};

(function() {
  __.load(["/models/accounts"], function() {
    __.models.accounts.get().then(r => {
      if (!__.models.accounts.data.locked) {
        __.routeTo("/classroom");
      } else {
        __.js.load();
      }
    }).catch(e => {
      __.routeTo("/login");
    })

  });
})();