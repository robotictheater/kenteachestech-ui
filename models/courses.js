__.models.courses = {
  data: {
    "intro-to-dev-tools": {
      "name": "Introduction To Developer Tools",
      "description": "Learn about code editors, source control, hosting your projects and using the browsers developer console.",
      "icon": "",
      "lessons": [
        {
          "id": "browsers",
          "name": "Browsers"
        },
        {
          "id": "code-editors",
          "name": "Code Editors"
        },
        {
          "id": "source-control",
          "name": "Source Control"
        },
        {
          "id": "hosting",
          "name": "Hosting"
        }
      ]
    },
    "html-css": {
      "name": "HTML & CSS",
      "description": "Learn how to use HTML & CSS along with modern web design principles to develop effective user interfaces (UI).",
      "lessons": []

    },
    "intro-to-programming": {
      "name": "Introducton To Programming With Javascript",
      "icon": "",
      "description": "",
      "lessons": [
        {
          "id": "data-types",
          "name": "Data Types"
        },
        {
          "id": "variables",
          "name": "Variables"
        },
        {
          "id": "comparison-operators",
          "name": "Comparison Operators"
        },
        {
          "id": "conditionals",
          "name": "Conditionals"
        }
      ],
      "prereq": ["intro-to-dev-tools"]
    },
    "advanced-web-apis": {
      "name": "Advanced Web API's",
      "description": "Get experience using features like the Canvas, WebRTC and Media Capture APIs to develop advanced web applications.",
      "lessons": [],
      "prereq": ["intro-to-programming"]
    },
    "nodejs": {
      "name": "Backend Development With NodeJS",
      "description": "",
      "lessons": [],
      "prereq": ["intro-to-programming"]
    }
  },
  submitAssignment: function(dataToSave) {
    return new Promise(function(resolve, reject) {
      MONGOREALM.user.functions.assignmentSubmit(localStorage.getItem("session_id"), dataToSave).then((r) => {
        if (r) {
          if (r.success) {
            resolve();
          } else {
            reject(((r && r.details) ? r.details : ""));
          }
        }
      }).catch(reject);
    });
  }


}