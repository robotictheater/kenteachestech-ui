__.js = {
  load: function() {

    let webCourseIds = ["intro-to-dev-tools", "html-css", "intro-to-programming", "intro-to-js", "advanced-web-apis"];

    let webCourses = [];
    webCourseIds.forEach(function(webCourseId) {
      webCourses.push(Object.assign({}, {
        "id": webCourseId,
        "hideIfEnrolled": (((__.models.accounts.currentStudent() && __.models.accounts.currentStudent().courses[webCourseId]) || __.models.accounts.type("parent")) ? " w3-hide" : ""),
        "showIfEnrolled": (((__.models.accounts.currentStudent() && __.models.accounts.currentStudent().courses[webCourseId]) && !__.models.accounts.type("parent")) ? "" : " w3-hide")
      }, __.models.courses.data[webCourseId]));
    });

    w3.displayObject("webCourseList", { "webCourses": webCourses });
    w3.removeClass("#webCourseList", "w3-hide");
  },

  enroll: function(courseId) {
    __.models.accounts.enrollStudent(courseId).then(() => {
      __toast("Successfully Enrolled. Redirecting Now.", "w3-green", function() {
        __.routeTo("/classroom/course/" + courseId);
      });
    }).catch(() => {
      __toast("There was an error enrolling in this course. Please re-login and try again.", "w3-red");
    });
  }
};

(function() {
  __.js.load();
})();