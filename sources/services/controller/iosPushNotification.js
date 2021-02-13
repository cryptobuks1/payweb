var apn = require('apn');



 var options = {
    token: {
      key: "./AuthKey_73TSJVPY99.p8",
      keyId: "73TSJVPY99",
      teamId: "QC8N4Z86R5"
    },
    production: false
  };
  


// send messages to iOS devices
export const sendIos = async (devicetoken,notificationMsg, receiverAccountType, count) => {


    return new Promise((resolve, reject) => {

        //let connection = new apns.Connection(options);
      var apnProvider = new apn.Provider(options);
      var note = new apn.Notification();
      note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.   
      note.badge = count;
      note.sound = "ping.aiff";
      note.alert = notificationMsg;
      note.payload = {'messageFrom': 'John Appleseed'};
      console.log("receiverAccountType", receiverAccountType);
      if(receiverAccountType == "personal") {
      note.topic = "com.sepamuse.ewallet";
      } else if(receiverAccountType == "business"){
      note.topic = "com.sepamuse.ewalletbusiness";
      }

      console.log("Before sending *****"+devicetoken)
      apnProvider.send(note, devicetoken).then( (result) => {
          // see documentation for an explanation of result
          console.log(JSON.stringify(result))
          resolve(result);
        }).catch(err => {
          reject(err);
        });
      
    })
   
}