__.js = {
  page_title: {},
  cards: {},
  getLessonStudentIsOn: function() {
    __.models.accounts.data.students[__.models.accounts.data.session.username].courses[__.params.courseId].lessons

    __.models.courses.data[__.params.courseId].lessons.some(lesson => {
      if (__.models.accounts.data.students[__.models.accounts.data.session.username].courses[__.params.courseId].lessons.indexOf(lesson) < 0) {
        __.params.lessonId = lesson.id;
        return true;
      }
    })

  },

  loadLesson: function() {
    __.load([`/assets/data/lessons/${__.params.courseId}/${__.params.lessonId}/cards`], function() {
      __.js.displayPageHeading();
      __.js.displayCards();
    });
  },

  /********************************************************
    DISPLAY PAGE HEADING
  *********************************************************/
  displayPageHeading: function() {
    document.getElementById("courseHeading").innerHTML = __.models.courses.data[__.params.courseId].name;
  },

  /********************************************************
    Display LESSON LISt
  *********************************************************/
  displayLessonList: function() {
    let lessons = [];
    __.models.courses.data[__.params.courseId].lessons.forEach(lesson => {
      let courseColor = "w3-white";
      if (__.models.accounts.currentStudent().courses[__.params.courseId].lessons.indexOf(lesson.id) >= 0) {
        courseColor = "w3-pale-green";
      }
      lessons.push(Object.assign({ "course_id": __.params.courseId, "course_color": courseColor }, lesson))
    });
    w3.displayObject("lessonList", { "lessons": lessons });
  },

  /********************************************************
    DISPLAY LESSON CARDS
  *********************************************************/
  displayCards: function() {

    let currentLessonIndex = _.findIndex(__.models.courses.data[__.params.courseId].lessons, { "id": __.params.lessonId });

    document.getElementById("previousLesson").removeAttribute("disabled");
    document.getElementById("nextLesson").removeAttribute("disabled");

    if (currentLessonIndex === 0) {
      document.getElementById("previousLesson").setAttribute("disabled", "disabled");
    }

    if (currentLessonIndex === (__.models.courses.data[__.params.courseId].lessons.length - 1)) {
      document.getElementById("nextLesson").setAttribute("disabled", "disabled");
    }

    if (__.js.cards[__.params.lessonId]) {

      let html = `<h2>${__.js.page_title[__.params.lessonId]}</h2>`;
      let assignmentColor = "";
      __.js.cards[__.params.lessonId].forEach(card => {

        //Assignment indicator
        assignmentColor = " w3-pale-red";
        assignmentComplete = false;
        assignmentFeedback = "";

        if (card.type === "assignment"
          && card.id
          && typeof __.models.accounts.currentStudent().courses[__.params.courseId] !== "undefined"
          && typeof __.models.accounts.currentStudent().courses[__.params.courseId].assignments[card.id] !== "undefined") {
          //This is an assignment and completed. Set to green
          assignmentColor = " w3-pale-green";
          assignmentComplete = true;
          assignmentFeedback = __.models.accounts.currentStudent().courses[__.params.courseId].assignments[card.id].feedback;
        }

        html += `<div class="w3-card __p-2 __my-3${((card.type === "assignment") ? assignmentColor : (card.type === "try") ? " w3-sand" : "")}" id="${card.id}">`;

        if (card.heading) {
          html += `<h3 class="__m-0">${card.heading}</h3>`;
        }
        if (card.text) {
          html += card.text;
        }
        if (card.code) {
          html += `<div class="w3-code ${((card.code.lang === "js") ? "jsHigh" : "cssHigh")} notranslate">${card.code.src}</div>`;
        }

        if (card.type === "assignment" && !assignmentComplete) {

          card.inputs.forEach(i => {
            let inputHtml = "";
            switch (i.type) {
              case "textarea":
                inputHtml = `<label><b>${i.label}</b></label><textarea rows="6" class="w3-input" name="${i.id}"></textarea>`;
                break;
              default:
                inputHtml = `<label><b>${i.label}</b></label><input type="${i.type}" class="w3-input" name="${i.id}">`;
                break;
            }

            html += `<div class="__my-2">${inputHtml}</div>`;
          });


          html += `<div class="w3-center"><button class="w3-button w3-red" id="${card.id}Submit" onclick="__.js.submitAssignment('${card.id}');">Submit</button></div>`;
        } else if (card.type === "assignment" && assignmentComplete && assignmentFeedback) {
          html += `<div class="__my-3 __p-2 w3-border w3-white"><b>Ken's Feedback:</b><br>${assignmentFeedback}</div>`
        }

        html += "</div>";
      });

      document.getElementById("lessonHolder").innerHTML = html;
      w3CodeColor();
      window.scroll(0, 0);
    } else {

    }

  },

  submitAssignment: function(assignmentId) {
    __.ui.loading.button(assignmentId + "Submit");

    __.models.courses.submitAssignment(Object.assign({ "assignment_id": assignmentId }, __.getFormData(assignmentId))).then(() => {
      __.toast("Your answers have been sent", "w3-green");
      __.ui.loading.button(assignmentId + "Submit", true);
      document.getElementById(assignmentId + "Submit").setAttribute("disabled", "disabled");
    }).catch((e) => {
      console.log("submitAssignment Threw Error:", e);
      __.toast("There was an error submitting your answers. Please refresh the page and try again", "w3-red");
    });


  },

  nextLesson: function() {
    let currentLessonIndex = _.findIndex(__.models.courses.data[__.params.courseId].lessons, { "id": __.params.lessonId });
    let nextLessonRecord = __.models.courses.data[__.params.courseId].lessons[currentLessonIndex + 1];
    if (nextLessonRecord) {
      __.params.lessonId = nextLessonRecord.id;
      __.updateLocationBar(`/classroom/course/${__.params.courseId}/${__.params.lessonId}`);
      __.js.loadLesson();
    }
  },

  previousLesson: function() {
    let currentLessonIndex = _.findIndex(__.models.courses.data[__.params.courseId].lessons, { "id": __.params.lessonId });
    let previousLessonRecord = __.models.courses.data[__.params.courseId].lessons[currentLessonIndex - 1];
    if (previousLessonRecord) {
      __.params.lessonId = previousLessonRecord.id;
      __.updateLocationBar(`/classroom/course/${__.params.courseId}/${__.params.lessonId}`);
      __.js.loadLesson();
    }
  },

  goToLessonList: function() {
    __.routeTo("/classroom/course/" + __.params.courseId);
  }
};


(function() {

  __.load(["/models/courses"], function() {
    if (!__.params.lessonId) {
      document.getElementById("lessonHolder").classList.add("w3-hide");
      document.getElementById("lessonList").classList.remove("w3-hide");
      __.js.displayPageHeading();
      __.js.displayLessonList();
    } else {
      document.getElementById("lessonList").classList.add("w3-hide");
      document.getElementById("lessonHolder").classList.remove("w3-hide");
      document.getElementById("lessonNav").classList.remove("w3-hide");
      __.js.loadLesson();
    }
  });

})();