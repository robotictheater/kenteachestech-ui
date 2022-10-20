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
      lessons.push(Object.assign({ "course_id": __.params.courseId }, lesson))
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
        if (card.type === "assignment"
          && card.id
          && typeof __.models.accounts.currentStudent().courses[__.params.courseId] !== "undefined"
          && typeof __.models.accounts.currentStudent().courses[__.params.courseId].assignments[card.id] !== "undefined") {
          //This is an assignment and completed. Set to green
          assignmentColor = " w3-pale-green";
        }

        html += `<div class="w3-card __p-2 __my-3${((card.type === "assignment") ? assignmentColor : (card.type === "try") ? " w3-sand" : "")}">`;
        if (card.heading) {
          html += `<h3 class="__m-0">${card.heading}</h3>`;
        }
        if (card.text) {
          html += card.text;
        }
        if (card.code) {
          html += `<div class="w3-code ${((card.code.lang === "js") ? "jsHigh" : "cssHigh")} notranslate">${card.code.src}</div>`;
        }

        html += "</div>";
      });

      document.getElementById("lessonHolder").innerHTML = html;
      w3CodeColor();
      window.scroll(0, 0);
    } else {

    }

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