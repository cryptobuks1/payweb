  function emailResendLink() {
    document.getElementById("emailResendLink").style.color = "green";
  }
  function mobileResendLink() {
    document.getElementById("mobileResendLink").style.color = "green";
  }
  function showPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  function hidePassword() {
    var x = document.getElementById("password");
    if (x.type === "text") {
      x.type = "password";
    } else {
      x.type = "text";
    }
  }
  function AvoidSpace(event) {
  var k = event ? event.which : window.event.keyCode;
  if (k == 32) return false;
   }
  
   function cameraIdentification(){
    navigator.getMedia = ( navigator.getUserMedia || // use the proper vendor prefix
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia);
 
  
 
 navigator.getMedia({video: true}, function() {
   sessionStorage.setItem('isCamera','yes')
 }, function() {
 sessionStorage.setItem('isCamera','no')
 });
     }
