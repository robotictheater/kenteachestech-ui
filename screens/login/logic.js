__.js = {
  step:null,
  
  verifyUsername: function() {
    w3.addClass("#sixDigitPasscodeContainer", "w3-hide");
    w3.addClass("#passwordContainer", "w3-hide");
    
    if(document.getElementById("username").value.trim().length>0){
      __.ui.loading.button("continueButton"); 
      if(document.getElementById("username").value.indexOf("@")>0){             
        __.models.logins.create({"email":document.getElementById("username").value}).then(()=>{
           w3.removeClass("#sixDigitPasscodeContainer", "w3-hide");
          __.toast("Email sent!  Check your inbox for your passcode.","w3-green");
          __.ui.loading.button("continueButton",true);
        }).catch((m)=>{
          console.log(m);
          __.toast(m,"w3-red");
          __.ui.loading.button("continueButton",true);
        });
        document.getElementById("continueButton").setAttribute("onclick","__.js.verifyLogin();");
      }else{
        __.ui.loading.button("continueButton",true);
        w3.removeClass("#passwordContainer", "w3-hide");
        document.getElementById("continueButton").setAttribute("onclick","__.js.verifyPassword();");
      }
    }      
  },

  verifyPassword:function(){
    __.models.accounts.verifyPassword({
      "username":document.getElementById("username").value.trim().toLowerCase(),
      "password":document.getElementById("password").value.trim().toLowerCase()
    }).then((r) => {});
  },

  
  verifyLogin:function(){
     __.models.logins.validate({
       "email":document.getElementById("username").value,
       "passcode":document.getElementById("passcode").value
     }).then(r => {
        if (r && r.session_id) {
          localStorage.setItem("session_id", r.session_id);
          __.routeTo("/classroom/")
        } else {
          __toast("There was an issue creating your session.", "w3-red");
            console.log(r);
        }
     }).catch(e => {
        __.toast(((e && e.details) ? e.details : "There was an error valiating your account."), "w3-red");
        __.ui.loading.button("registerButton", true);
        console.log(e);
    });
    console.log("Create Login");
  },
  
};

(function() {
  __.load(["/models/accounts","/models/logins"], function() {

  });
})()