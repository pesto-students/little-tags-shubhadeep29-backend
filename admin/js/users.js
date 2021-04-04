/* users.html functions */
function loadUsers(){
  var settings = {
    "url": apiUrl+"user/admin/list",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": "Bearer "+getCookie('token'),
      "Content-Type": "application/json"
    }
  };

  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      var html = "";
      if(response.items.length > 0){
        response.items.forEach(element => {
          html += '<tr>\
                    <td>'+element.firstName+" "+element.lastName+'</td>\
                    <td>'+element.email+'</td>\
                    <td>'+element.mobile+'</td>\
                    <td>'+element.status+'</td>\
                    <td><a href="javascript: void(0);" data-toggle="modal" data-target="#addUser" onclick="selectUser(`'+element.id+'`)">Edit</a> <a href="javascript: void(0);" onclick="if(confirm(\'Are you sure?\')){deleteUser(`'+element.id+'`)} ">Delete</a></td>\
                  </tr>';
          $("#userTable tbody").html(html)
        });
      } else {
        html = '<tr>\
                  <td colspan="6">No user(s) found.</td>\
                </tr>';
        $("#userTable tbody").html(html)
      }
    } else {
      alert(response.message);
    }
  });
}

function selectUser(id){
  $(".modal-title").html("Update User")
  $("#submitAddUser").text("Update");
  $('#userId').val(id);
  var settings = {
    "url": apiUrl+"user/admin/"+id,
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": "Bearer "+getCookie('token'),
      "Content-Type": "application/json"
    }
  };

  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      if(response.items){
        $("#firstName").val(response.items.firstName)
        $("#lastName").val(response.items.lastName)
        $("#email").val(response.items.email)
        $("#phoneNumber").val(response.items.mobile)
      } 
    } else {
      alert(response.message);
    }
  });
}

function addUser(){
  if($("#userId").val()){
    var settings = {
      "url": apiUrl+"user/admin/"+$("#userId").val(),
      "method": "PUT",
      "timeout": 0,
      "headers": {
        "Authorization": "Bearer "+getCookie('token'),
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
        "firstName":$("#firstName").val(), 
        "lastName":$("#lastName").val(), 
        "email":$("#email").val(),
        "mobile":$("#mobile").val(),
    })                              
    };
  } else {
    var settings = {
      "url": apiUrl+"user/create",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Authorization": "Bearer "+getCookie('token'),
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({"name":$("#name").val(), 
                              "email":$("#email").val(),
                              "phoneNumber":$("#phoneNumber").val(),
                              "password":$("#password").val(),
                              "id":$("#userId").val()}),
    };
  }
  
  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      $(".modal-footer button").click();
      loadUsers();
      return false;
    } else {
      alert(response.message);
    }
  });
}

function deleteUser(id){
  var settings = {
    "url": apiUrl+"user/admin/"+id,
    "method": "DELETE",
    "timeout": 0,
    "headers": {
      "Authorization": "Bearer "+getCookie('token'),
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({"id": id}),
  };

  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      loadUsers();
    } else {
      alert(response.message);
    }
  });
}
/* users.html functions ends here */