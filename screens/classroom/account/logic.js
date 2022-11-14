__.js = {
  state: {},
  init: function() {
    document.getElementById("firstName").value = __.models.accounts.data.first_name;
    document.getElementById("lastName").value = __.models.accounts.data.last_name;
    document.getElementById("email").value = __.models.accounts.data.email;
  },

  saveChanges: function() {
    let formId = "accountDetails";
    let buttonId = "saveButton";
    let relogin = false;

    if (__.validateFormData(formId)) {
      let formData = __.getFormData(formId);
      formData.email = formData.email.toLowerCase();
      formData.confirm_email = formData.confirm_email.toLowerCase();

      if (formData.confirm_email && formData.confirm_email !== __.models.accounts.data.email && formData.email !== formData.confirm_email) {
        __.toast("Emails don't match. Please check your form and try again.", "w3-red");
        __.ui.loading.button(buttonId, true);
        return false;
      } else if (formData.confirm_email !== __.models.accounts.data.email && !formData.confirm_email) {
        __.toast("Please confirm your email change and try again.", "w3-red");
        __.ui.loading.button(buttonId, true);
        return false;
      } else if (formData.confirm_email && formData.confirm_email !== __.models.accounts.data.email && formData.email === formData.confirm_email) {
        relogin = true;
        delete formData.confirm_email;
      }

      __.models.accounts.update(formData).then((r) => {
        if (relogin) {
          __.toast("Changes saved. You will now be logged out.", "w3-green");
          setTimeout(function() {
            __.routeTo("/logout");
          }, 3000);
        } else {
          __.toast("Changes saved.", "w3-green");
        }

      }).catch((e) => {
        console.log(e)
        __.toast(e.details, "w3-red");
      });

    } else {
      __.toast("Name and email are required", "w3-red");
    }
  }
};

(function() {
  __.js.init();

})();