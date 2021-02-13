var FCM = require('fcm-node');


export const sendAndriod = async (devicetoken,notificationMsg) => {

    return new Promise((resolve, reject) => {

        try {

            var serverKey = 'AAAAhCTkHSU:APA91bE5SeeZ9CZc9Se649Ms3MYkQWgBnOy5e4GEnCpylcMHLn8hbJxMN7X17HecgsVb3v2p46drIu-hmdkda-n8kJV0cAYXDHQ8vv9cmaLbg7fVFfCm0nKUyhEixdMX3T-4Y-FuvWMD';
            var fcm = new FCM(serverKey);

           
            var message = { 
                to: devicetoken, 
                priority : 'normal',
                // notification payload, it will be handled by system tray when 
                // your app entering into background

               
                notification: {
                    title: 'Send funds', 
                    body: notificationMsg 
                },
                
                // data payload, the biggest different between notification      
                // payload and data payload is, you can handle payload yourself
                // when your app entering background
                data: {  
                    my_key: 'my value',
                    my_another_key: 'my another value'
                }
            };
            
            fcm.send(message, function(err, response){
                if (err) {
                    console.log("Can't send FCM Message.");
                    reject(err)
                } else {
                    console.log("Successfully sent with response: ", response);
                    resolve(response);
                }
            });

        }catch(error) {
            return reject(error)
        }


    })
}