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
      __.load(["/models/accounts", "/models/courses"], function() {
        __.models.accounts.get().then(r => {
          if (r.locked) {
            __.routeTo("/accountlocked");
          } else {
            __.load(["/assets/js/site"], function() {
              __.renderLayout("classroom", function() {
                if (r.session.user_type === "parent") {
                  w3.removeClass(".parent-nav-item", "w3-hide");
                  w3.addClass(".student-nav-item", "w3-hide");
                }
                next();
              });
            });
          }

        }).catch(e => {
          localStorage.removeItem("session_id");
          __.config.onLoginRouteTo = window.location.pathname;
          __.routeTo("/login");
        });
      });

    }
  }],

  ["/classroom/?$", (p) => {
    __.renderScreen("classroom", p);
  }],

  ["/classroom/students/?$", (p) => {
    __.renderScreen("classroom/students", p);
  }],

  ["/classroom/students/details/:studentId/?$", (p) => {
    __.renderScreen("classroom/students/details", p);
  }],

  ["/classroom/students/details/?$", (p) => {
    __.renderScreen("classroom/students/details", p);
  }],

  ["/classroom/courses/?$", (p) => {
    __.renderScreen("classroom/courses", p);
  }],

  ["/classroom/course/details/:courseId/?$", (p) => {
    __.renderScreen("classroom/courses/details", p);
  }],

  ["/classroom/course/:courseId/:lessonId/?$", (p) => {
    __.renderScreen("classroom/courses/lesson", p);
  }],

  ["/classroom/course/:courseId/?$", (p) => {
    __.renderScreen("classroom/courses/lesson", p);
  }],



  ["/classroom/account/?$", (p) => {
    switch (__.models.accounts.data.session.user_type) {
      case "parent":
        __.renderScreen("classroom/account", p);
        break;
      default:
        __.renderScreen("classroom/students/details", p);
        break;
    }

  }],




  ["/login/?$", (p) => {
    if (!localStorage.getItem("session_id")) {
      __.renderLayout("login", function() {
        __.renderScreen("login", p);
      });

    } else {
      MONGOREALM.user.functions.sessionValidate(localStorage.getItem("session_id")).then((r) => {
        if (r && r.success) {
          __.routeTo(__.config.afterLogin);
        } else {
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
      __.models.sessions.delete().then(r => {
        localStorage.removeItem("session_id");
        __.routeTo("/login");
      }).catch(e => {
        __.toast(e, "w3-red");
      });

    });
  }],

  ["/accountlocked/?$", (p) => {
    __.renderLayout("login", function() {
      __.renderScreen("accountlocked", p);
    });
  }],

  [".*", (p) => {
    console.log("here")
    __.renderLayout("site", function() {
    });
  }]

];

(async () => {
  await MONGOREALM.load();
  __.router(true, 0, () => { });
})();

