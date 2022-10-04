__.js = {

  /***********************************************************************
    LOAD -- if there's a student id, then show their details
  ***********************************************************************/
  load: function() {
    if (__.params && __.params.studentId) {
      if (__.models.accounts.data.students[__.params.studentId]) {        
        __.setFormData("studentDetails",Object.assign({},__.models.accounts.data.students[__.params.studentId],{"username":__.params.studentId})); 
        document.getElementById("username").setAttribute("disabled","disabled");
      }
    }
  },


  /***********************************************************************
    SAVE
  ***********************************************************************/
  save: function() {
    let formId="studentDetails";
    
    if (__.validateFormData(formId)) {
      __.ui.loading.button("saveButton");
      let formData = __.getFormData(formId); 
      formData.username = formData.username.toLowerCase().replace(/[^a-z0-9_-]/ig,"");
      if (__.params && __.params.studentId) {
          //Updating existing student
          this.updateStudent(formData);
      } else {
          //Adding new student
          this.addStudent(formData);
      }
    }
  },

  /***********************************************************************
    ADD STUDENT
  ***********************************************************************/
  addStudent:function(formData){
    if(formData.password.length>0 && formData.password.trim()===formData.confirm_password.trim()){
      
      __.models.accounts.addStudent(formData).then((r) => {
        __toast("Student added successfully","w3-green");
        __.appendToLocation("/"+formData.username);
        document.getElementById("username").setAttribute("disabled","disabled");
        document.getElementById("password").value="";
        document.getElementById("confirm_password").value="";
        __.ui.loading.button("saveButton",true);
      }).catch(e=>{
        __toast(e,"w3-red");
        __.ui.loading.button("saveButton",true);
      });
      
    }else{
        __toast("Passwords do not match. Please correct and try again!","w3-red");
        __.ui.loading.button("saveButton",true);
      }
  },


  /***********************************************************************
    UPDATE STUDENT
  ***********************************************************************/
  updateStudent:function(formData){
    if(formData.password.length>0 && formData.password.trim()!==formData.confirm_password.trim()){
      __toast("Passwords do not match. Please correct and try again!","w3-red");
      __.ui.loading.button("saveButton",true);
    }else{
      __.models.accounts.accountUpdateStudent(formData).then((r) => {
        __toast("Student information updated successfully","w3-green");
        __.ui.loading.button("saveButton",true);
      }).catch(e=>{
        __toast(e,"w3-red");
        __.ui.loading.button("saveButton",true);
      });
    }
      
      
      
  },

  
  /***********************************************************************
    CHECK USERNAME
  ***********************************************************************/

  checkUsername: function() {
    document.getElementById("username").value=document.getElementById("username").value.toLowerCase().replace(/[^a-z0-9_-]/ig,"");
    
    document.getElementById("saveButton").setAttribute("disabled","disabled");
    __.models.accounts.checkUsername(document.getElementById("username").value).then((r) => {
      w3.removeClass("#username", "__is-invalid");
      document.getElementById("saveButton").removeAttribute("disabled");
    }).catch((e) => {
      __toast("This username is already in use. Please try another.","w3-red");
      document.getElementById("saveButton").setAttribute("disabled","disabled");
       w3.addClass("#username", "__is-invalid");
    });

  }

};

(function() {
  __.js.load();
})();