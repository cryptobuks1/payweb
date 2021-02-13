/**
 * @desc This function is used to insert country transactions
 * @method pushNotification
 * @param {Object}  request  - It is request Object
 * @param {Object}  response - It is response Object
 * @return return status message and status code 
 */

import { sendIos } from '../controller/iosPushNotification';
import { sendAndriod } from './andriodPushNotifications';


export function pushNotification (request, response) {

    let devicetoken = request.body.devicetoken
    //sendIos (devicetoken)
    //sendAndriod(devicetoken)
    
}
