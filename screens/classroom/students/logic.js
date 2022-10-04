__.js = {
  list: function() {
    let students = [];
    Object.keys(__.models.accounts.data.students).forEach((username) => {
      let dataToPush=__.models.accounts.data.students[username];
      dataToPush.username = username;
        
      students.push(dataToPush);
    });
    //console.log(students);
    w3.addClass("#noStudentsMessage", "w3-hide");
    w3.displayObject("studentsHolder", { "students": students });
    w3.removeClass("#studentGrid", "w3-hide");
  }

};

(function() {
  __.js.list();


})();