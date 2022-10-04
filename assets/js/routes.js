__.config.afterLogin = "/classroom";
__.config.base_api_url = "http://127.0.0.1:8080";

__.routes = [
  [".*", function(p, next) {
    if (!localStorage.getItem("device_id")) {
      localStorage.setItem("device_id", __.rndString(32, ["letters", "uppercase", "numbers"]));
    }

    next();
  }],

  ["/classroom/*", function(p, next) {
    if (!localStorage.getItem("session_id")) {
      __.config.onLoginRouteTo = window.location.pathname;
      __.routeTo("/login");
    } else {
      __.load(["/models/accounts"], function() {
        __.models.accounts.get().then(r=>{
        __.load(["/assets/js/site"],function(){
          next();
        }); 
      }).catch(e=>{
        localStorage.removeItem("session_id");
        __.config.onLoginRouteTo = window.location.pathname;
        __.routeTo("/login");
      });
      });
      
    }
  }],

  ["/classroom/?$", (p) => {
    __.renderLayout("classroom", function() {
      __.renderScreen("classroom", p);
    });
  }],

  ["/classroom/students/?$", (p) => {
    __.renderLayout("classroom", function() {
      __.renderScreen("classroom/students", p);
    });
  }],

  ["/classroom/students/details/:studentId/?$", (p) => {
    __.renderLayout("classroom", function() {
      __.renderScreen("classroom/students/details", p);
    });
  }],

  ["/classroom/students/details/?$", (p) => {
    __.renderLayout("classroom", function() {
      __.renderScreen("classroom/students/details", p);
    });
  }],
  
  ["/login/?$", (p) => {
    if (!localStorage.getItem("session_id")) {
      __.renderLayout("login", function() {
        __.renderScreen("login", p);
      });

    } else {
      MONGOREALM.user.functions.sessionValidate(localStorage.getItem("session_id")).then((r) => {
        if(r && r.success){
          __.routeTo(__.config.afterLogin);
        }else{
          localStorage.removeItem("session_id");
        }
      });    
    }
  }],



  ["/register/?$", (p) => {
    __.renderLayout("login", function() {
      __.renderScreen("register", p);
    });
  }],

  ["/logout/?$", (p) => {
    __.load(["/models/sessions"], function() {
      __.models.sessions.delete(function(err, res) {
        localStorage.removeItem("session_id");
        __.routeTo("/login");
      });

    });
  }],


  [".*", (p) => {
    __.renderLayout("site", function() {
    });
  }]

];

(async () => {
  await MONGOREALM.load();
  __.router(true, 0, () => { });
})();
