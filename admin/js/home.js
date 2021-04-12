function loadDashboard(){
  var settings = {
    "url": apiUrl+"order/admin/dashboard",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Authorization": "Bearer "+getCookie('token'),
    }
  };

  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      $("#totalRevenue").html("₹ "+response.stats.totalRevenue);
      $("#totalOrders").html(response.stats.totalOrders);
      $("#totalCustomers").html(response.stats.totalUsers);  
    } else {
      alert(response.message);
    }
  });
}
