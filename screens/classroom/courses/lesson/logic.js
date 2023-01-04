__.js = {
  blockly: {},
  /***********************************
    GET LESSON STUDENT IS ON
  ***********************************/
  getLessonStudentIsOn: function() {
    __.models.accounts.data.students[__.models.accounts.data.session.username].courses[__.params.courseId].lessons

    __.models.courses.data[__.params.courseId].lessons.some(lesson => {
      if (__.models.accounts.data.students[__.models.accounts.data.session.username].courses[__.params.courseId].lessons.indexOf(lesson) < 0) {
        __.params.lessonId = lesson.id;
        return true;
      }
    });

  },

  /***********************************
    LOAD LESSON
  ***********************************/
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

    __.ui.$.removeAttribute(".previousLesson", "disabled");
    __.ui.$.removeAttribute(".nextLesson", "disabled");

    if (currentLessonIndex === 0) {
      __.ui.$.setAttribute(".previousLesson", "disabled", "disabled");
    }

    if (currentLessonIndex === (__.models.courses.data[__.params.courseId].lessons.length - 1)) {
      __.ui.$.setAttribute(".nextLesson", "disabled", "disabled");
    }

    if (__.data.cards[__.params.lessonId]) {

      let html = `<h2>${__.data.page_title[__.params.lessonId]}</h2>`;
      let assignmentColor = "";
      let blocklyCards = [];

      __.data.cards[__.params.lessonId].forEach(card => {

        //Assignment indicator
        assignmentColor = " w3-pale-red";
        assignmentComplete = false;
        let assignment = null;

        if (card.type === "assignment"
          && card.id
          && typeof __.models.accounts.currentStudent().courses[__.params.courseId] !== "undefined"
          && typeof __.models.accounts.currentStudent().courses[__.params.courseId].assignments[card.id] !== "undefined") {
          //This is an assignment and completed. Set to green

          assignmentComplete = true;
          assignment = __.models.accounts.currentStudent().courses[__.params.courseId].assignments[card.id];

          if (assignment === null) {
            assignmentColor = " w3-light-grey";
          } else {
            switch (assignment.grade) {
              case 1:
                assignmentColor = " w3-pale-yellow";
                break;
              case 2:
                assignmentColor = " w3-pale-blue";
                break;
              case 3:
                assignmentColor = " w3-pale-green";
                break;
            }
          }

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

          if (card.inputs) {
            card.inputs.forEach(i => {
              let inputHtml = "";

              switch (i.type) {
                case "textarea":
                  inputHtml = `<label><b>${i.label}</b></label><textarea rows="6" class="w3-input" name="${i.id}"></textarea>`;
                  break;
                case "blockly":
                  inputHtml = `<label><b>${i.label}</b></label>
                  <div class="w3-row">
                  <div class="w3-col m9"><div id="blocklyDiv${card.id}" style="height: 480px; width: 100%;"></div></div>
                  <div class="w3-col m3"><div id="blocklyOutputDiv${card.id}" class="blocklyOutput"></div></div>
                  </div> <button class="w3-button w3-dark-grey w3-block" onclick="__.js.runBlockly('${card.id}')">Run Code</button>`;
                  blocklyCards.push(card.id);
                  break;
                default:
                  inputHtml = `<label><b>${i.label}</b></label><input type="${i.type}" class="w3-input" name="${i.id}">`;
                  break;
              }

              html += `<div class="__my-2">${inputHtml}</div>`;
            });


            html += `<div class="w3-center"><button class="w3-button w3-red" id="${card.id}Submit" onclick="__.js.submitAssignment('${card.id}');">Submit</button></div>`;
          }
        } else if (card.type === "assignment" && assignmentComplete && assignment === null) {
          html += `<div class="__my-3 __p-2 w3-border w3-white"><b>This challenge has been submitted and is pending review.</b></div>`
        } else if (card.type === "assignment" && assignmentComplete && assignment.feedback) {
          html += `<div class="__my-3 __p-2 w3-border w3-white"><b>Ken's Feedback:</b><br>${assignment.feedback}</div>`
        }

        html += "</div>";
      });

      document.getElementById("lessonHolder").innerHTML = html;
      __.js.injectBlocklyJS(blocklyCards);
      w3CodeColor();

      window.scroll(0, 0);
    } else {

    }

  },

  injectBlocklyJS: function(cards) {
    let toolbox = {
      "kind": "categoryToolbox",
      "contents": [
        {
          "kind": "category",
          "name": "Data",

          "contents": [
            {
              "kind": "block",
              "type": "text"
            },
            {
              "kind": "block",
              "type": "math_number"
            },
            {
              "kind": "block",
              "type": "logic_boolean"
            },
            {
              "kind": "block",
              "type": "logic_null"
            },
            {
              "kind": "block",
              "type": "lists_create_with"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Arrays",
          "contents": [
            {
              "kind": "block",
              "type": "lists_length"
            },
            {
              "kind": "block",
              "type": "lists_isEmpty"
            },
            {
              "kind": "block",
              "type": "lists_indexOf"
            },
            {
              "kind": "block",
              "type": "lists_getIndex"
            },
          ]
        },
        {
          "kind": "category",
          "name": "Variables",
          "custom": "VARIABLE"
        },

        {
          "kind": "category",
          "name": "Conditionals",
          "contents": [
            {
              "kind": "block",
              "type": "controls_if"
            },
            {
              "kind": "block",
              "type": "logic_compare"
            },
            {
              "kind": "block",
              "type": "logic_operation"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Loops",
          "contents": [
            {
              "kind": "block",
              "type": "controls_for"
            },
            {
              "kind": "block",
              "type": "controls_forEach"
            },
            {
              "kind": "block",
              "type": "controls_repeat_ext"
            },
            {
              "kind": "block",
              "type": "controls_flow_statements"
            },
            {
              "kind": "block",
              "type": "controls_whileUntil"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Functions",
          "custom": "PROCEDURE"
        },
        {
          "kind": "category",
          "name": "Output",

          "contents": [
            {
              "kind": "block",
              "type": "outputlog"
            }
          ]
        }
      ]
    };

    cards.forEach(cardId => {

      __.js.blockly[cardId] = Blockly.inject('blocklyDiv' + cardId, {
        toolbox: toolbox,
        trashcan: true,
        renderer: "thrasos",
        "cardId": cardId
      });

    });


    //Blockly.JavaScript.workspaceToCode(__.js.blockly['browser-console-inspect'])
    //Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(__.js.blockly))

  },

  runBlockly: function(cardId) {
    __.js.blocklyOutputTarget = "blocklyOutputDiv" + cardId;
    document.getElementById(__.js.blocklyOutputTarget).innerHTML = "";
    eval(Blockly.JavaScript.workspaceToCode(__.js.blockly[cardId]))
  },

  /***********************************
    SUBMIT ASSIGNMENT
  ***********************************/
  submitAssignment: function(assignmentId) {
    __.ui.loading.button(assignmentId + "Submit");

    let workspaces = {};

    Object.keys(__.js.blockly).forEach(function(w) {
      workspaces[w] = btoa(Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(__.js.blockly[w])));
    });

    __.models.courses.submitAssignment(Object.assign({ "assignment_id": assignmentId }, Object.assign(workspaces, __.getFormData(assignmentId), { "course_id": __.params.courseId }))).then(() => {
      __toast("Your answers have been sent", "w3-green");
      __.ui.loading.button(assignmentId + "Submit", true);
      document.getElementById(assignmentId + "Submit").setAttribute("disabled", "disabled");

      __.models.accounts.data.students[__.models.accounts.data.session.username].courses[__.params.courseId].assignments[assignmentId]=null;
      
    }).catch((e) => {
      console.log("submitAssignment Threw Error:", e);
      __.ui.loading.button(assignmentId + "Submit", true);
      __toast("There was an error submitting your answers. Please refresh the page and try again", "w3-red");
    });

  },

  /***********************************
    NEXT LESSON
  ***********************************/
  nextLesson: function() {
    let currentLessonIndex = _.findIndex(__.models.courses.data[__.params.courseId].lessons, { "id": __.params.lessonId });
    let nextLessonRecord = __.models.courses.data[__.params.courseId].lessons[currentLessonIndex + 1];
    if (nextLessonRecord) {
      __.params.lessonId = nextLessonRecord.id;
      __.updateLocationBar(`/classroom/course/${__.params.courseId}/${__.params.lessonId}`);
      __.js.loadLesson();
    }
  },

  /***********************************
    PREVIOUS LESSON
  ***********************************/
  previousLesson: function() {
    let currentLessonIndex = _.findIndex(__.models.courses.data[__.params.courseId].lessons, { "id": __.params.lessonId });
    let previousLessonRecord = __.models.courses.data[__.params.courseId].lessons[currentLessonIndex - 1];
    if (previousLessonRecord) {
      __.params.lessonId = previousLessonRecord.id;
      __.updateLocationBar(`/classroom/course/${__.params.courseId}/${__.params.lessonId}`);
      __.js.loadLesson();
    }
  },

  /***********************************
    GOTO LESSON LIST
  ***********************************/
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
      __.ui.$.removeClass(".lessonNav", "w3-hide");
      __.js.loadLesson();
    }
  });

})();