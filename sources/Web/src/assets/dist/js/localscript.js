'use strict'

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

//Business Login Personal Settings

function showPassword1() {
  var x = document.getElementById("new_password");
  if (x.type === "new_password") {
    x.type = "text";
  } else {
    x.type = "new_password";
  }
}
function hidePassword1() {
  var x = document.getElementById("new_password");
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

function cameraIdentification() {


  //     navigator.getMedia = ( navigator.getUserMedia || // use the proper vendor prefix
  //                         navigator.webkitGetUserMedia ||
  //                         navigator.mozGetUserMedia ||
  //                         navigator.msGetUserMedia);



  //  navigator.getMedia({video: true}, function() {
  //    sessionStorage.setItem('isCamera','yes')
  //  }, function() {
  //  sessionStorage.setItem('isCamera','no')
  //  });


  navigator.getUserMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );

  if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
    navigator.getUserMedia({
      audio: false, video: true
    }, streamHandler, errorHandler);
  } else {
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(streamHandler => {
      sessionStorage.setItem('isCamera', 'yes');
      console.log(streamHandler)

    }).catch(errorHandler => {
      sessionStorage.setItem('isCamera', 'no');
      console.log(errorHandler);
    });
  }



}


function checkcamera() {
  navigator.getUserMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );

  if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
    navigator.getUserMedia({
      audio: false, video: true
    }, streamHandler, errorHandler);
  } else {
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(streamHandler => {
      sessionStorage.setItem('isCamera', 'yes');
      console.log(streamHandler)

    }).catch(errorHandler => {
      sessionStorage.setItem('isCamera', 'no');
      console.log(errorHandler);
    });
  }

  // var camera = new checkcamera();


}
// var camera = new checkcamera();
// export camera;
