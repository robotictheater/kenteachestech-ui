__.js = {
  load: function() {

    let webCourseIds = ["intro-to-dev-tools", "html-css", "intro-to-programming", "advanced-web-apis"];

    let webCourses = [];
    webCourseIds.forEach(function(webCourseId) {
      webCourses.push(Object.assign({}, { "id": webCourseId, "hideIfEnrolled": ((__.models.accounts.currentStudent().courses[webCourseId]) ? " w3-hide" : "") }, __.models.courses.data[webCourseId]));
    });

    w3.displayObject("webCourseList", { "webCourses": webCourses });
  },

  enroll: function(courseId) {
    __.models.accounts.enrollStudent(courseId).then(() => {
      __toast("Successfully Enrolled", "w3-green");
      __.routeTo("/classroom/course/" + courseId);
    }).catch(() => {
      __toast("There was an error enrolling in this course. Please re-login and try again.", "w3-red");
    });
  }
};

(function() {
  __.js.load();
})();