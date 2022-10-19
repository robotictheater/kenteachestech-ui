__.models.courses = {
  data: {
    "intro-to-dev-tools": {
      "name": "Introduction To Developer Tools",
      "description": "Learn about code editors, source control, hosting your projects and using the browsers developer console.",
      "icon": "",
      "lessons": [
        {
          "id": "browsers",
          "name": "Browsers",
          "cards": [
            {
              "type": "info",
              "text": "<p>The purpose of most every program written is to do something with data. To do something with data you need to accept, store, manipulate and display it back out to the user.</p>"
            },
            {
              "type": "info",
              "heading": "Numbers",
              "text": `<p>The first data type we're going to talk about is <b>Numbers</b>. `
            },
            {
              "id": "browser-console-inspect",
              "type": "assignment",
              "heading": "Inspect A Site Using The Developer console",
              "text": `<p>Using your browsers developer console, inspect the javascript on following page:</p>
              <p class="w3-center"><a href="">https://kenteachestech.com/demos/intro-to-dev-tools/browser</a></p>
              <p>Change the heading text and style, then take a screenshot and email it to assignments@kenteachestech.com</p>
              `
            },
          ]
        },
        {
          "id": "editor",
          "name": "Code Editor"
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
  }



}