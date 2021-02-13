/**
 * sendLink route
 * This is a route file, where the Kyc link related service is defined. This route will call its
 * respective controller method which will send a deep link from web to user mobile using which a user
 * can complete their KYC.
 * @package sendLink
 * @subpackage sources\services\router\sendLink
 * @author SEPA Cyper Technologies, Sujit Kumar.
 */
"use strict";
// import mailer from '../mailer/mail'
 var mailer = require('../mailer/mail');
 import { langEngConfig } from '../utility/lang_eng';
 import { configVariables } from '../utility/sendLink';
 import { Kyc } from '../model/kyc';

 const kyc = new Kyc();

 const STATUS={
   SUCCESS:0,
   FAIL:1
}
/**
 * @desc method is to send link 
 * @method sendLink 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns status message and status code
 **/
export const sendLink = (request,response)=>{
   mailer.sendLink(request).then(function (message) {
      response.send(ResponseHelper.buildSuccessResponse(message,configVariables.mail.linkSendMessage,STATUS.SUCCESS));
   }).catch(err => {
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)))
   })

}
/**
 * @desc method is to send Invitation to the user 
 * @method sendInvitation 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns status message and status code
 **/
export const sendInvitation = (request,response)=>{
   let applicant_id = request.params.applicant_id;
   mailer.sendInvitation(request).then(function (message) {     
   
      kyc.updateKycStatusForSendInvitation('NOT_INITIATED', applicant_id).then((results, err) => {          
             if (results) {               
              response.send(ResponseHelper.buildSuccessResponse({ 'kyc_status': 'NOT_INITIATED' }, `${configVariables.mail.linkSendMessage}`, STATUS.SUCCESS))
             }
             else {             
              response.send(ResponseHelper.buildSuccessResponse({ 'kyc_status': 'NOT_INITIATED' }, `${configVariables.mail.linkSendMessage}`, STATUS.SUCCESS))
             }           
         if (err) {
           logger.info('Return kyc success response , But failure ');
           response.send(ResponseHelper.buildFailureResponse(langEngConfig.message.kyc.operationError))
         }
       }).catch(err => {
        response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.internalError)))
       })    
   }).catch((err) =>  {
      response.send(ResponseHelper.buildSuccessResponse({}, configVariables.mail.linkSendError, STATUS.FAILED))
   })
}



module.exports = router;
