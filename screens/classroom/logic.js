__.js = {
  load: function() {
    this.displayMyCourses();


  },

  displayMyCourses: function() {
    let courses = [];
    Object.keys(__.models.accounts.data.students[__.models.accounts.data.session.username].courses).forEach(courseId => {
      courses.push(Object.assign({}, { "course_id": courseId }, __.models.courses.data[courseId]))
    });
    if (courses.length > 0) {
      w3.displayObject("courseList", { "courses": courses });
      w3.addClass("#noCourses", "w3-hide");
      w3.removeClass("#courseList", "w3-hide");
    } else {
      w3.addClass("#courseList", "w3-hide");
      w3.removeClass("#noCourses", "w3-hide");
    }
  },

};


(function() {
  __.js.load();
})()