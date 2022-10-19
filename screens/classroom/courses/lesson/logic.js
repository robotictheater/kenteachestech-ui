__.js = {
  getLessonStudentIsOn: function() {
    __.models.accounts.data.students[__.models.accounts.data.session.username].courses[__.params.courseId].lessons

    __.models.courses.data[__.params.courseId].lessons.some(lesson => {
      if (__.models.accounts.data.students[__.models.accounts.data.session.username].courses[__.params.courseId].lessons.indexOf(lesson) < 0) {
        __.params.lessonId = lesson.id;
        return true;
      }
    })

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
    console.log("display lesson list")
  },

  /********************************************************
    DISPLAY LESSON CARDS
  *********************************************************/
  displayCards: function() {
    if (__.js.cards) {
      let html = `<h2>${__.js.page_title}</h2>`;

      __.js.cards.forEach(card => {
        html += `<div class="w3-card __p-2 __my-3${((card.type === "assignment") ? " w3-pale-red" : (card.type === "try") ? " w3-sand" : "")}">`;
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
        // html += `<div class="w3-center __mt-1"><button class="w3-button w3-blue">Listen</button></div></div>`
      });


      document.getElementById("lessonHolder").innerHTML = html;
      w3CodeColor();
    } else {

    }

  }
};


(function() {

  __.load(["/models/courses"], function() {
    if (!__.params.lessonId) {
      __.js.displayPageHeading();
      __.js.displayLessonList();
    } else {
      __.load([`/assets/data/lessons/${__.params.courseId}/${__.params.lessonId}/cards`], function() {
        __.js.displayPageHeading();
        __.js.displayCards();
      })
    }
  });

})();