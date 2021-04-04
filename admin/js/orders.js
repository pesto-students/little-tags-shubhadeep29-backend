function loadOrders(){
  var settings = {
    "url": apiUrl+"order/list",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Authorization": getCookie('token'),
      "Content-Type": "application/json"
    }
  };

  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      var html = "";
      if(response.items.length > 0){
        response.items.forEach((element, i) => {
          html += '<tr>\
                    <td>'+(i+1)+'</td>\
                    <td>'+element.paanShopName+'</td>\
                    <td>'+element.userName+'</td>\
                    <td>'+element.status+'</td>\
                    <td><a href="javascript: void(0);" data-toggle="modal" data-target="#viewOrder" onclick="selectOrder('+element.id+',`view`)">Details</a> <a href="javascript: void(0);" data-toggle="modal" data-target="#addUser" onclick="selectOrder('+element.id+')">Edit</a> <a href="javascript: void(0);" onclick="if(confirm(\'Are you sure?\')){deleteOrder('+element.id+')} ">Delete</a></td>\
                  </tr>';
          $("#userTable tbody").html(html)
        });
      } else {
        html = '<tr>\
                  <td colspan="6">No customers(s) found.</td>\
                </tr>';
        $("#userTable tbody").html(html)
      }
    } else {
      alert(response.message);
    }
  });
}

function getData(data){
  console.log(data)
  //remove all previous values
  $("#product option").each(function(){
    if($(this).attr('value') !== undefined){
      $(this).remove()
    }
  })
  $("#flavour option").each(function(){
    if($(this).attr('value') !== undefined){
      $(this).remove()
    }
  })
  var settings = {
    "url": apiUrl+"order/products-flavours",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Authorization": getCookie('token'),
      "Content-Type": "application/json"
    }
  };

  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      if(response.products.length > 0){
        var html = "";
        response.products.forEach((element, i) => {
          var selected = "";
          if(data != undefined && data.productId == element.id){
            selected = " selected ";
          };
          html += '<option value="'+element.id+'" data-price="'+element.price+'" '+selected+'>'+element.name+'</option>';
        });
        $("#product").append(html);
      }
      if(response.flavours.length > 0){
        var html = "";
        response.flavours.forEach((element, i) => {
          var selected = "";
          if(data != undefined && data.flavourId == element.id){
            selected = " selected ";
          };
          html += '<option value="'+element.id+'" '+selected+'>'+element.name+'</option>';
        });
        $("#flavour").append(html);
      } 
    } else {
      alert(response.message);
    }
  });
}

function calculatePrice(){
  var price = parseFloat($('#product option:selected').attr('data-price'));
  var quantity = parseInt($('#quantity').val());
  var discount = parseFloat($('#discount').val());
  
  var subTotal = price*quantity;
  $("#subTotal").text(subTotal);
  if(Number.isNaN(discount)){
    $("#total").text(subTotal);
  } else {
    $("#total").text(subTotal-discount);
  }
  
}

function selectOrder(id, viewType){
  $("#submitAddUser").text("Update");
  $('#id').val(id);
  var settings = {
    "url": apiUrl+"order/list",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Authorization": getCookie('token'),
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({id: id})
  };

  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      if(response.items.length > 0){
        if(viewType == "view"){
          $("#_userName").html(response.items[0].userName)
          $("#_customerName").html(response.items[0].paanShopName)
          $("#_productName").html(response.items[0].productName+" - "+response.items[0].flavourName)
          $("#_quantity").html(response.items[0].quantity)
          $("#_price").html(response.items[0].price)
          $("#_subTotal").html(response.items[0].price*response.items[0].quantity)
          $("#_discount").html(response.items[0].discount)
          $("#_total").html(response.items[0].total)
        } else {
          $("#paanShopName").val(response.items[0].paanShopName)
          $("#quantity").val(response.items[0].quantity)
          $("#discount").val(response.items[0].discount)
          $("#subTotal").html(response.items[0].price*response.items[0].quantity)
          $("#total").html(response.items[0].total)
          getData(response.items[0]);
        }
        
      } 
    } else {
      alert(response.message);
    }
  });
}

function addOrder(){
  var discount = parseFloat($('#discount').val());
  var settings = {
    "url": apiUrl+"order/create",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Authorization": getCookie('token'),
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({"customerId":parseInt($("#paanShopName").attr("data-customerid")), 
                            "productId":parseInt($("#product option:selected").attr("value")),
                            "price": parseFloat($("#product option:selected").attr("data-price")),
                            "flavourId":parseInt($("#flavour option:selected").attr("value")),
                            "quantity":parseInt($("#quantity").val()),
                            "discount":(Number.isNaN(discount))?0:discount
                          })
  };

  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      $(".modal-footer button").click();
      loadOrders();
      $('form')[0].reset();
      $('#addUser').modal('toggle');
      return false;
    } else {
      alert(response.message);
    }
  });
}

function getSuggestion(field){
  if($("#"+field).val() == ''){
    $(".bootstrap-autocomplete").remove();
    return;
  }
  var settings = {
    "url": apiUrl+"customer/suggestion",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Authorization": getCookie('token'),
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({[field]: $("#"+field).val()})
  };

  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      if(response.items.length > 0){
        var tmpResult = [];
        var results = '<div class="bootstrap-autocomplete dropdown-menu show" style="width: 100%;">';
        response.items.forEach(function(data){
          if(tmpResult.indexOf(data[field]) == -1){
            tmpResult.push(data[field])
            results += '<a class="dropdown-item" onclick="hideAutoComplete(`'+field+'`,`'+data[field]+'`,`'+data.id+'`)" style="overflow: hidden; text-overflow: ellipsis;">'+data.paanShopName+"<br>("+data.area+","+data.cityName+")"+'</a>'
          }
        });
        results += '</div>';
        $("#"+field).after(results);
        // $(".bootstrap-autocomplete").html(results);
        // $(".bootstrap-autocomplete").show();
      } else {
        $(".bootstrap-autocomplete").remove();
      }
    } 
  });
}

function hideAutoComplete(field, val, id){
  $(".bootstrap-autocomplete").remove();
  $("#"+field).attr("data-customerid", id)
  $("#"+field).val(val)
}

function deleteOrder(id){
  var settings = {
    "url": apiUrl+"order/delete",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Authorization": getCookie('token'),
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({"id": id}),
  };

  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      loadOrders();
    } else {
        alert(response.message);
    }
  });
}