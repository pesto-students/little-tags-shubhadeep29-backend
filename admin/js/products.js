function load(){
  var settings = {
    "url": apiUrl+"product",
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
                    <td>'+element.name+'</td>\
                    <td>'+element.price+'</td>\
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

function listCategory(){
  var settings = {
    "url": apiUrl+"category",
    "method": "GET",
    "timeout": 0,
  };

  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      if(response.items){
        let categories = '<option value="">Select Category</option>';
        categories += response.items.map((category) => {
          return '<option value="'+category.id+'">'+category.name+'</option>'
        })
        $("#category").html(categories);
      } 
    } else {
      alert(response.message);
    }
  });
}

function getSubCategory(id){
  var settings = {
    "url": apiUrl+"subcategory/"+id,
    "method": "GET",
    "timeout": 0,
  };

  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      if(response.items){
        let subcategories = '<option value="">Select SubCategory</option>';
        subcategories += response.items.map((subcategory) => {
          return '<option value="'+subcategory.id+'">'+subcategory.name+'</option>'
        })
        $("#subcategory").html(subcategories);
      } 
    } else {
      alert(response.message);
    }
  });
}

function add(){
  const productId = $("#productId").val();
  let data = {
    "categoryId":$("#category").val(), 
    "subcategoryId":$("#subcategory").val(),
    "name":$("#name").val(),
    "description":$("#description").val(),
    "price":$("#price").val(),
    "attributes": JSON.stringify({
      brand: $("#brand").val(),
      maxQuantity: $("#maxQuantity").val(),
      size: $("#size").val(),
      color: $("#color").val(),
    })
  };
  if(productId){
    data.id = productId
  } 
  
  var settings = {
    "url": apiUrl+"product",
    "method": "PUT",
    "timeout": 0,
    "headers": {
      "Authorization": "Bearer "+getCookie('token'),
      "Content-Type": "application/json"
    },
    "data": JSON.stringify(data)                              
  };
  
  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      $(".modal-title button").click();
      load();
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
