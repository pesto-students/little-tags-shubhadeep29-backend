/* globals Chart:false, feather:false */

(function () {
  'use strict'

  feather.replace()

  // Graphs
  var ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  
})()

function loadDashboard(){
  var settings = {
    "url": apiUrl+"dashboard/list",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Authorization": getCookie('token'),
      "Content-Type": "application/json"
    }
  };

  $.ajax(settings).done(function (response) {
    if(response.status == "success"){
      $("#totalCustomers").html(response.items.customers.total);
      $("#activeCustomers").html(response.items.customers.active);
      $("#deletedCustomers").html(response.items.customers.deleted);

      $("#totalOrders").html(response.items.orders.totalOrders);
      $("#paidOrders").html(response.items.orders.totalOrders-response.items.orders.unpaidOrders);
      $("#unpaidOrders").html(response.items.orders.unpaidOrders);

      if(response.items.orders.totalRevenue != null){
        $("#totalRevenue").html(response.items.orders.totalRevenue);
        $("#paidRevenue").html(response.items.orders.totalRevenue-response.items.orders.unpaidRevenue);
        $("#unpaidRevenue").html((response.items.orders.unpaidRevenue == null)?0:response.items.orders.unpaidRevenue);
      } else {
        $("#totalRevenue").html("0");
        $("#paidRevenue").html("0");
        $("#unpaidRevenue").html("0");
      }
    } else {
      alert(response.message);
    }
  });
}
