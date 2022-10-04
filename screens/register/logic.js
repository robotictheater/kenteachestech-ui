__.js = {

  /*************************************************
   REGISTER
    ***********************************************/
  register: function() {
    const formId = "registerForm";

    //If we're in part 1 of the registration
    if (document.getElementById("registerButton").innerHTML === "Register") {

      //validate the form
      if (__.validateFormData(formId)) {
        __.ui.loading.button("registerButton");
        let formData = __.getFormData(formId);
        formData.email = formData.email.toLowerCase();
        formData.confirm_email = formData.confirm_email.toLowerCase();

        if (formData.email !== formData.confirm_email) {
          __.toast("Emails don't match. Please check your form and try again.", "w3-red");
          __.ui.loading.button("registerButton", true);
        } else {
          formData.time_diff = ((new Date().getTimezoneOffset() * -1) / 60) + 4;
          delete formData.confirm_email;
          __.models.accounts.create(formData).then((r) => {
            __.ui.loading.button("registerButton", true);
            w3.removeClass("#sixDigitPasscodeContainer", "w3-hide");
            document.getElementById("registerButton").innerHTML = "Continue To Your Account"
          }).catch((e) => {
            __.toast(((e && e.details) ? e.details : "There was an error creating your account."), "w3-red");
            __.ui.loading.button("registerButton", true);
            console.log(e);
          });
        }

      } else {
        __.toast("Please complete the form. All fields are required.", "w3-red")
      }

    } else {
      __.ui.loading.button("registerButton");
      let formData = __.getFormData(formId);
      if (formData.passcode.trim().length === 6) {
        __.models.logins.validate(formData).then(r => {
          if (r && r.session_id) {
            localStorage.setItem("session_id", r.session_id);
            __.routeTo("/classroom")
          } else {
            __toast("There was an issue creating your session.", "w3-red");
            console.log(r);
          }
        }).catch(e => {
          __.toast(((e && e.details) ? e.details : "There was an error valiating your account."), "w3-red");
          __.ui.loading.button("registerButton", true);
          console.log(e);
        });
      }

    }


  }
};

(function() {
  __.load(["/models/accounts", "/models/logins"], function() {

  });
})()