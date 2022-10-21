var __ = {
  config: {},
  routes: [],
  loaded: [],
  models: {},
  components: {},
  loading: 0,
  params: {},
  js: null,
  console: console,
  currentScript: document.currentScript,
  /*********************************************
      GET SCRIPT
      
      This is used to load external JS files
      onto the page.
  ******************************************** */
  getScript: function(url, cb) {
    var newScript = document.createElement("script");
    if (cb) {
      newScript.onerror = function() { cb(true, null) };
      newScript.onload = function() { cb(null, true) };
    }
    newScript.setAttribute("injected", true);
    this.currentScript.parentNode.insertBefore(newScript, this.currentScript);

    newScript.src = url + ((window.location.queryString("cachebuster") !== null) ? "?cachebuster=" + __.rndString(10, ["letters", "numbers"]) : "")
  },

  /*********************************************
      GET CONTENT

      Get content from an html page or text src
  ******************************************** */
  getContent: function(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4          
        cb(xhr.responseText, xhr.status);
      }
    };

    xhr.open("GET", url + ((window.location.queryString("cachebuster") !== null) ? "?cachebuster=" + __.rndString(10, ["letters", "numbers"]) : ""), true);
    xhr.send();
  },

  /*********************************************
      LOAD

      Loads up local js file that are used by
      your app like models or shared scripts.
  ******************************************** */
  load: function(files, cb, reload) {
    if (reload) {
      __.loaded = [];
    }

    var loading = 0;
    if (typeof files === "string") { files = [files]; }
    if (files) {
      loading += files.length;

      files.forEach(function(file) {
        if (file && file.length > 0 && __.loaded.indexOf(file) === -1) {
          __.getScript(((typeof __.config !== "undefined" && typeof __.config.origin !== "undefined") ? __.config.origin : window.location.origin) + file + ((__.config.use_min) ? __.config.use_min : "") + ".js", function() {
            __.loaded.push(file);
            loading--;
            if (loading <= 0) {
              if (cb) { cb(); }
            }
          });
        } else {
          loading--;
          if (loading <= 0) {
            if (cb) { cb(); }
          }
        }
      })
    }
  },

  /*********************************************
      CALL API
  ******************************************** */
  callAPI: function(url, p) {
    var request = new XMLHttpRequest();
    request.open(((p.method) ? p.method : "GET"), ((url.indexOf("http") === -1) ? this.config.base_api_url : "") + url, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    if (p.headers) {
      Object.keys(p.headers).forEach(function(key) {
        request.setRequestHeader(key, p.headers[key]);
      });
    }
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        var responseObject = this.response;
        try {
          responseObject = JSON.parse(this.response);
        } catch (e) {
          console.log(e, new Date());
        }
        p.response(null, responseObject, this.status);

      } else {
        console.log(this.response)

        try {
          p.response(JSON.parse(this.response), null, this.status);
        } catch (e) {
          p.response(this.response, null, this.status);
        }

      }
    };
    request.onerror = function(e) {
      p.response({ "error": this.statusText, "details": this.response.trim() }, null, this.status);
    };
    request.ontimeout = function(e) {
      p.response("timeout", null, this.status);
    };
    request.onabort = function(e) {
      p.response("abort", null, this.status);
    };
    request.send(((p.data) ? JSON.stringify(p.data) : null));
  },

  /*********************************************
      ROUTER

      Allows you to define your apps pages
      and their handlers
  ******************************************** */
  router: function(registerEventListener, silent, cb) {
    if (registerEventListener) { window.addEventListener('popstate', __.router); }
    var allRoutes = __.routes.slice();
    var location = ((window.location.pathname[[window.location.pathname.length - 1]] === "/") ? window.location.pathname.substr(0, window.location.pathname.length - 1) : window.location.pathname);

    function processRoute() {
      if (allRoutes.length > 0) {
        var route = allRoutes.shift();
        var routeRegex = "^";
        var routeParts = route[0].substr(1).split("/");
        var parameters = {};

        routeParts.forEach(function(p, i) {
          if (p.indexOf(":") === 0) {
            parameters[p.substr(1)] = location.substr(1).split("/")[i];
            routeRegex += '\\/?.*';
          } else {
            routeRegex += '\\/' + p;
          }
        });
        if (RegExp(routeRegex).test(location)) {  // && (location.substr(1).split("/").length <= routeParts.length)                    
          window.location.search.substr(1).split("&").forEach(function(qs) {
            if (qs && qs.indexOf("=") > 0) {
              parameters[qs.split("=")[0]] = qs.split("=")[1];
            }
          });

          if (silent) {
            __.params = parameters;
          } else {
            route[1](parameters, function() { processRoute(); });
          }
        } else {
          processRoute();
        }

      }
    }

    processRoute();
  },

  /*********************************************
      ROUTE TO
  ******************************************** */
  routeTo: function(url, includeQS) {
    if (url.indexOf("http") === 0) {
      window.location = url + ((includeQS) ? window.location.search : "");
    } else {
      window.history.pushState('', '', url + ((includeQS) ? window.location.search : ""));
      this.router();
    }
  },

  updateLocationBar: function(url, includeQS) {
    window.history.pushState('', '', url + ((includeQS) ? window.location.search : ""));
  },

  appendToLocation: function(val, includeQS) {
    window.history.pushState('', '', ((window.location.pathname.substr(window.location.pathname.length - 1) === "/") ? window.location.pathname.substr(0, window.location.pathname.length - 1) : window.location.pathname) + val + ((includeQS) ? window.location.search : ""));
  },

  /*********************************************
      RENDER SCREEN
  ******************************************** */
  renderScreen: function(screenId, p = {}) {
    if (!screenId) { screenId = window.location.pathname; }
    __.params = p;
    __.getContent(((typeof __.config !== "undefined" && typeof __.config.origin !== "undefined") ? __.config.origin : window.location.origin) + "/screens/" + screenId + "/" + "ui" + ((__.config.use_min) ? __.config.use_min : "") + ".html", (html) => {
      document.getElementById(((typeof __.config.screenDOMId !== "undefined") ? __.config.screenDOMId : "screen")).innerHTML = html;
      __.getScript(((typeof __.config !== "undefined" && typeof __.config.origin !== "undefined") ? __.config.origin : window.location.origin) + "/screens/" + screenId + "/" + "logic" + ((__.config.use_min) ? __.config.use_min : "") + ".js");
    });
  },

  /*********************************************
      PROCESS TEMPLATE
  ******************************************** */
  /*processTemplate:function(templateId, data){

      var html=((document.getElementById(templateId)) ? document.getElementById(templateId).innerHTML : templateId);
      Object.keys(data).forEach(function(k){
          var regex=new RegExp("{{"+k+"}}","g");
          html=html.replace(regex, data[k]);
      });
      return html;
  },*/
  processTemplate: function(html, data) {
    Object.keys(data).forEach(function(k) {
      var regex = new RegExp("{{" + k + "}}", "g");
      html = html.replace(regex, eval("data." + k));
    });
    return html;
  },

  /*********************************************
      LOAD COMPONENT
  ******************************************** */
  loadComponent: function(component, params, cb) {
    var that = this;
    var componentId = ((typeof component === "string") ? component : component[0]);

    this.components[componentId] = { "data": params };
    this.getContent(((typeof __.config !== "undefined" && typeof __.config.origin !== "undefined") ? __.config.origin : window.location.origin) + "/components/" + componentId.toLowerCase() + "/ui" + ((__.config.use_min) ? __.config.use_min : "") + ".html", function(html) {

      if (document.getElementById(componentId + "ComponentHolder")) {
        document.getElementById(componentId + "ComponentHolder").innerHTML = html;
      } else if (document.getElementById(component[1] + "ComponentHolder")) {
        document.getElementById(component[1] + "ComponentHolder").innerHTML = html;
      } else {
        document.getElementById(((typeof __.config.screenDOMId !== "undefined") ? __.config.screenDOMId : "screen")).innerHTML = document.getElementById(((typeof __.config.screenDOMId !== "undefined") ? __.config.screenDOMId : "screen")).innerHTML + html;
      }

      that.getScript(((typeof __.config !== "undefined" && typeof __.config.origin !== "undefined") ? __.config.origin : window.location.origin) + "/components/" + componentId.toLowerCase() + "/logic" + ((__.config.use_min) ? __.config.use_min : "") + ".js", function() {
        if (cb) {
          if (typeof __.components[componentId.toLowerCase()].js !== "undefined" && typeof __.components[componentId.toLowerCase()].js.callback !== "undefined") {
            __.components[componentId.toLowerCase()].js.callback = cb;
          } else {
            cb();
          }
          if (typeof __.components[componentId.toLowerCase()].js.onLoad !== "undefined") {
            __.components[componentId.toLowerCase()].js.onLoad();
          }
        }
      });
    });
  },

  /*********************************************
      RENDER LAYOUT
  ******************************************** */
  renderLayout: function(layout, cb) {
    this.getContent(((typeof __.config !== "undefined" && typeof __.config.origin !== "undefined") ? __.config.origin : window.location.origin) + "/layouts/" + layout.toLowerCase() + ((__.config.use_min) ? __.config.use_min : "") + ".html", function(html) {
      document.body.innerHTML = html;
      if (typeof cb === "function") { cb(); }
    });
  },

  shared: function(obj) {
    __.js = Object.assign(__.js, obj);
  },

  /*********************************************
      FORM VALIDATOR
  ******************************************** */
  validateFormData: function(id) {
    els = document.querySelectorAll("#" + id + " input, #" + id + " select, #" + id + " textarea, #" + id + " range");

    var isInvalid = false;
    function invalidFieldClass() { return ((__.config["invalid_field_class"]) ? __.config["invalid_field_class"] : "__is-invalid"); }

    els.forEach(function(el) {
      el.classList.remove(invalidFieldClass());
      if (el.getAttribute("required") !== null || el.getAttribute("required") === "required") {
        if (el.value.trim().length === 0) {
          el.classList.add(invalidFieldClass());
          isInvalid = true;
        } else {
          let regex = /./ig;
          let str = el.value.trim();

          switch (el.type) {
            case "email":
              regex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/ig;
              break;
            case "tel":
              str = str.replace(/[^0-9]/g, "");
              regex = /[0-9]{10}/;
              break;
            case "number":
              if ((el.getAttribute("min") !== null && Number(str) < Number(el.getAttribute("min"))) || (el.getAttribute("max") !== null && Number(str) > Number(el.getAttribute("max")))) {
                el.classList.add(invalidFieldClass());
                isInvalid = true;
              }
              break;
          }

          if (regex) {
            if (!regex.test(str)) {
              el.classList.add(invalidFieldClass());
              isInvalid = true;
            }
          }
        }
      }
    });

    return !isInvalid;
  },

  /*********************************************
      FORM FIELD
  ******************************************** */
  validateFormField: function(ids) {

    var isInvalid = false;

    function invalidFieldClass() { return ((__.config["invalid_field_class"]) ? __.config["invalid_field_class"] : "__is-invalid"); }

    if (typeof ids === "string") {
      ids = [ids];
    }

    ids.forEach(function(id) {
      el = document.getElementById(id);
      el.classList.remove(invalidFieldClass());

      if (el.getAttribute("required") !== null || el.getAttribute("required") === "required") {
        if (el.value.trim().length === 0) {
          el.classList.add(invalidFieldClass());
          isInvalid = true;
        } else if (el.type === "text" && (el.getAttribute("min") !== null || el.getAttribute("max") !== null)) {

          if (el.getAttribute("min") !== null && el.value.trim().length < Number(el.getAttribute("min"))) {
            el.classList.add(invalidFieldClass());
            isInvalid = true;
          }

          if (el.getAttribute("max") !== null && el.value.trim().length > Number(el.getAttribute("max"))) {
            el.classList.add(invalidFieldClass());
            isInvalid = true;
          }


        } else {
          let regex = /./ig;
          let str = el.value.trim();

          switch (el.type) {
            case "email":
              regex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/ig;
              break;
            case "tel":
              str = str.replace(/[^0-9]/g, "");
              regex = /[0-9]{10}/;
              break;
            case "number":
              if ((el.getAttribute("min") !== null && Number(str) < Number(el.getAttribute("min"))) || (el.getAttribute("max") !== null && Number(str) > Number(el.getAttribute("max")))) {
                el.classList.add(invalidFieldClass());
                isInvalid = true;
              }
              break;
          }

          if (regex) {
            if (!regex.test(str)) {
              el.classList.add(invalidFieldClass());
              isInvalid = true;
            }
          }
        }
      }

    });



    return !isInvalid;
  },

  getFormFile: function(el, cb) {

      let file = el.files[0];
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = function() {
        cb(null, fileReader.result);
      };
      fileReader.onerror = function() {
        cb(fileReader.error, null);
      };

  },
  /*********************************************
      GET FORM DATA
  ******************************************** */
  getFormData: function(id) {
    var dtr = {};
    document.querySelectorAll("#" + id + " input, #" + id + " select, #" + id + " textarea, #" + id + " range").forEach(function(el) {
      //el.value = el.value.trim();

      if (el.getAttribute("type") === "file") {
         dtr[el.name] = el;
      } else if ((el.getAttribute("type") !== "checkbox" && el.getAttribute("type") !== "radio") || (el.getAttribute("type") === "checkbox" && el.checked) || (el.getAttribute("type") === "radio" && el.checked)) {
        if (typeof dtr[el.name] === "undefined") {

          if (el.getAttribute("storeas") === "array") {
            dtr[el.name] = [el.value];
          } else if (el.getAttribute("storeas") === "number") {
            dtr[el.name] = Number([el.value]);
          } else if (el.getAttribute("storeas") === "string") {
            dtr[el.name] = [el.value].toString();
          } else if (el.getAttribute("storeas") === "bool") {
            if (el.value === "") {
              dtr[el.name] = null;
            } else {
              dtr[el.name] = (["true", "yes"].indexOf(el.value.toString().toLowerCase()) > -1) || (Number(el.value) === 1) || (el.value === true);
            }
          } else if (el.getAttribute("storeas") === "group") {

            if (el.name.indexOf("|") > 0) {
              let groupData = el.name.split("|");
              if (typeof dtr[groupData[0]] === "undefined") {
                dtr[groupData[0]] = {};
              }
              dtr[groupData[0]][groupData[1]] = ((el.type === "number") ? Number(el.value) : el.value);
            }

          } else if (el.type === "datetime-local") {
            if (el.value) {
              dtr[el.name] = new Date(el.value).toString();
            }
          } else if (el.type === "number") {
            if (el.value) {
              dtr[el.name] = Number(el.value);
            }
          } else {
            dtr[el.name] = el.value;
          }

        } else if (typeof dtr[el.name] === "object") {
          dtr[el.name].push(el.value);

        } else {
          dtr[el.name] = [dtr[el.name], el.value];
        }
      }


    });
    return dtr;
  },

  /*********************************************
      SET FORM DATA
  ******************************************** */
  setFormData: function(formId, data) {
    Object.keys(data).forEach(function(key) {

      document.querySelectorAll('#' + formId + ' [name="' + key + '"]').forEach(function(el) {
        switch (el.type) {
          case "checkbox":
          case "radio":
            if (data[key] === el.value) {
              el.checked = "checked";
            } else if (el.getAttribute("storeas") === "bool") {
              var fieldValue = (["true", "yes"].indexOf(el.value.toString().toLowerCase()) > -1) || (Number(el.value) === 1) || (el.value === true);
              if (data[key] === fieldValue) {
                el.checked = "checked";
              }
            }
            break;
          case "date":
            el.value = data[key].split("T")[0];
            break;
          default:
            el.value = data[key];
            break;
        }
      });

    });

  },

  /*********************************************
      RANDOM STRING
  ******************************************** */
  rndString: function(len, params) {
    if (!len) { len = 5; }
    var text = "", possible = "";
    if (!params) {
      params = ["letters", "uppercase", "numbers", "specials", "safespecials"];
    }

    if (params.indexOf("letters") > -1) { possible += "abcdefghijklmnopqrstuvwxyz"; }
    if (params.indexOf("uppercase") > -1) { possible += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; }
    if (params.indexOf("numbers") > -1) { possible += "0123456789"; }
    if (params.indexOf("specials") > -1) { possible += '!@#$%^&*()-_+=[]{}?'; }
    if (params.indexOf("safespecials") > -1) { possible += '!*-_'; }
    if (params.indexOf("exclude_confusing") > -1) { possible = possible.replace(/[o0il1]/ig, ""); }

    for (var i = 0; i < len; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },

  /*********************************************
      RANDOM NUMBER
  ******************************************** */
  rndNumber: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  /*********************************************
      GET COOKIE
  ******************************************** */
  getCookie: function(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
  },
  uuidv4: function() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  },
  ui: {
    loading: {
      dim: function(hide) {
        if (hide) {
          if (document.getElementById("ducttape-dim")) {
            document.body.removeChild(document.getElementById("ducttape-dim"));
          }
        } else if (!document.getElementById("ducttape-dim")) {
          var dimDiv = document.createElement('div');
          dimDiv.style.cssText = "width:100%; height:100%; position:fixed; top:0; left:0; background: rgba(0,0,0,0.5); z-index:999999;";
          dimDiv.id = "ducttape-dim"
          document.body.appendChild(dimDiv);
        }
      },
      body: function(hide) {
        this.dim(hide);
        if (hide) {
          if (document.getElementById("bodySpinner")) {
            document.body.removeChild(document.getElementById("bodySpinner"));
          }
        } else if (!document.getElementById("bodySpinner")) {
          var spinnerDiv = document.createElement('div');
          spinnerDiv.style.cssText = "position:fixed; top:30%; left:0; width:100%; text-align:center; z-index:99999999;";
          spinnerDiv.innerHTML = '<div class="spinner spinner-big" style="margin:0 auto;"></div>';
          spinnerDiv.id = "bodySpinner"
          document.body.appendChild(spinnerDiv);
        }

      },
      screen: function(hide) {
        this.dim(hide);
        this.section(((typeof __.config.screenDOMId !== "undefined") ? __.config.screenDOMId : "screen"), hide);
      },
      button: function(id, hide) {
        if (document.getElementById(id)) {
          if (hide) {
            if (document.getElementById(id + "Spinner")) {
              document.getElementById(id).removeChild(document.getElementById(id + "Spinner"));
            }
            document.getElementById(id).disabled = false;
          } else {
            document.getElementById(id).disabled = true;
            document.getElementById(id).innerHTML = '<div id="' + id + 'Spinner" class="spinner mr-1"></div>' + document.getElementById(id).innerHTML;
          }
        }
      },
      section: function(id, hide) {
        if (document.getElementById(id)) {
          if (hide) {
            if (document.getElementById(id + "Spinner")) {
              document.getElementById(id).removeChild(document.getElementById(id + "Spinner"));
            }
          } else {
            document.getElementById(id).innerHTML = document.getElementById(id).innerHTML + '<div id="' + id + 'Spinner" style="position:absolute; top:30%; left:0; width:100%; text-align:center; z-index:99999999;"><div class="spinner spinner-big" style="margin:0 auto;"></div></div>';
          }
        }
      }
    },
    $: {
      prependHtml: function(el, html) { if (document.getElementById(el)) { document.getElementById(el).innerHTML = html + document.getElementById(el).innerHTML; } },
      appendHtml: function(el, html) { if (document.getElementById(el)) { document.getElementById(el).innerHTML += html; } },
      html: function(el, html) { if (document.getElementById(el)) { document.getElementById(el).innerHTML = html; } },
      addClass: function(selector, className) {
        for (let el of document.querySelectorAll(selector)) {
          if (!el.classList.contains(className)) {
            el.classList.add(className);
          }
        }
      }
    }
  },
  toast: function(m, c) {

    if (document.getElementById("__toast")) {
      document.getElementById("__toast").parentNode.removeChild(document.getElementById("__toast"));
    }

    document.body.insertAdjacentHTML("beforeend", '<div id="__toast">' + m + '</div>');

    if (!c) {
      c = "showToast";
    } else {
      c += " showToast";
    }

    document.getElementById("__toast").className = c;
    setTimeout(function() { document.getElementById("__toast").className = document.getElementById("__toast").className.replace("showToast", ""); }, 3000);
  }

};

window.__toast = function(m, c) {

  if (document.getElementById("__toast")) {
    document.getElementById("__toast").parentNode.removeChild(document.getElementById("__toast"));
  }

  document.body.insertAdjacentHTML("beforeend", '<div id="__toast">' + m + '</div>');

  if (!c) {
    c = "showToast";
  } else {
    c += " showToast";
  }

  document.getElementById("__toast").className = c;
  setTimeout(function() { document.getElementById("__toast").className = document.getElementById("__toast").className.replace("showToast", ""); }, 3000);
}

window.isMobile = function() {
  let check = false;
  (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
window.isMobileOrTablet = function() {
  let check = false;
  (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
window.location.queryString = function(name) {
  var url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
String.prototype.maxLength = function(len) {
  if (this.length > len) {
    return this.slice(0, len) + " ...";
  } else {
    return this;
  }
};
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

if (!Array.prototype.some) { Array.prototype.some = function(fun, thisArg) { 'use strict'; if (this == null) { throw new TypeError('Array.prototype.some called on null or undefined'); } if (typeof fun !== 'function') { throw new TypeError(); } var t = Object(this); var len = t.length >>> 0; for (var i = 0; i < len; i++) { if (i in t && fun.call(thisArg, t[i], i, t)) { return true; } } return false; }; }

if (!Array.prototype.mode) {
  Array.prototype.mode = function() {
    var that = this; return this.sort((a, b) =>
      that.filter(v => v === a).length
      - that.filter(v => v === b).length
    ).pop();
  };
}

if (!Object.assign) {
  Object.assign = function(target, src) {
    Object.keys(src).forEach(function(srcKey) {
      target[srcKey] = src[srcKey];
    });
  }
}