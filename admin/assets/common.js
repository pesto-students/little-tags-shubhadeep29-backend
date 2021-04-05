var apiUrl = getApiPath();

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var user = getCookie("username");
  if (user != "") {
    return true;
  } else {
    return false;
  }
}

function getApiPath(){
  if(location.hostname === 'localhost'){
    return "http://localhost:3000/"  
  }
  return "https://mt6bjbo9yi.execute-api.ap-south-1.amazonaws.com/v1/"
}

function leftMenuActive(){
  //remove active class from all a tag
  $("#userRoleMenu a").removeClass("active")
  var pageName = location.href.split('/');
  $('a[href="'+pageName[pageName.length - 1]+'"]').addClass("active")

  //load user table
  if(pageName[pageName.length - 1] == 'home.html'){
    loadDashboard();
  }

  //load user table
  if(pageName[pageName.length - 1] == 'users.html'){
    loadUsers();
  }

  //load orders table
  if(pageName[pageName.length - 1] == 'orders.html'){
    loadOrders();
  }

  //load products table
  if(pageName[pageName.length - 1] == 'customers.html'){
    loadCustomers();
  }

}

function loadPageFunction(){
  //if cookie not set then redirect to login 
  var token = getCookie('token');
  if(token == ''){
    location.href = "index.html"
  }

  //load left menu based on role
  var role = getCookie('role');
  $("#userRoleMenu").load("includes/left-menu.html", function(){
    leftMenuActive();
  }); 

  //load common header
  $("#commonHeader").load("includes/header.html"); 
}
