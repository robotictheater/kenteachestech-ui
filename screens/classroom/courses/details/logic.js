__.js = {};

__.load(["/models/courses"], function() {
  if (!__.params.courseId) {
    __.routeTo("/classroom");
  } else {
    __.ui.loading.screen();
    __.getContent(`/assets/data/course_details/${__.params.courseId}.html`, function(html) {
      document.getElementById("courseDetails").innerHTML = html;
      __.ui.loading.screen(true);
    })
  }
});