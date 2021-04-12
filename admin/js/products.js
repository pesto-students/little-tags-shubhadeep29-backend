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
                    <td><a href="javascript: void(0);" data-toggle="modal" data-target="#addUser" onclick="selectUser(`'+element.id+'`)">Edit</a> <a href="javascript: void(0);" onclick="if(confirm(\'Are you sure?\')){remove(`'+element.id+'`)} ">Delete</a></td>\
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

function uploadImage(image) {
  let form = new FormData();
  form.append("product", image.files[0], image.files[0].name);

  const settings = {
    "url": apiUrl+"product/images",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Authorization": "Bearer "+getCookie('token')
    },
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form
  };

  $.ajax(settings).done(function (response) {
    //setTimeout(() => {
    //  alert(JSON.parse(response).status)
    //}, 500);
    response = JSON.parse(response);
    if(response.status == "success"){
      const images = $("#images").val();
      let imageSplit = [];
      imageSplit = images.split("##");
      imageSplit.push(response.url);
      $("#images").val(imageSplit.join("##"));

      const input = $("#productImages");
      input.replaceWith(input.val('').clone(true));

      $("#productImagesDiv").append('<img src="'+response.url+'" height="100" width="100" />')
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
    "images":$("#images").val(),
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
      $('#addUser').modal('toggle');
      load();
      return false;
    } else {
      alert(response.message);
    }
  });
}

function remove(id){
  var settings = {
    "url": apiUrl+"product/"+id,
    "method": "DELETE",
    "timeout": 0,
    "headers": {
      "Authorization": "Bearer "+getCookie('token')
    }
  };

  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      load();
    } else {
      alert(response.message);
    }
  });
}
