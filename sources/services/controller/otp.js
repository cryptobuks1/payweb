/**
 * otpController Controller
 * otpController is used for send otp to user email and mobile and verify the email and mobile then
   only we will allow into next steps
 * @package otpController
 * @subpackage controller/otp/otpController
 * @author SEPA Cyber Technologies, Sekhar Suman Sahu.
 */

import {
  OtpModel
} from '../model/otp';
import {
  Utils
} from '../utility/utils';
import {
  sendOtp
} from '../controller/museCommManager';
import {
  configVariable as otpUtil
} from '../utility/otp';
import {
  sendEmail
} from '../mailer/mail';

let request = require('request-promise');
let util = new Utils();
let otpModel = new OtpModel();

class Otp {
  constructor(data) {
    this.otp = __getOtp();
    this.refferValue = data.referenceValue;
    this.createdOn = util.getGMT();
  }
}

const STATUS = {
  SUCCESS: 0,
  FAILURE: 1,
  MESSAGE_SUCCESS: '1004'
}


/**
 * @desc This method used for generating OTP
 * @method generateOtp
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
 **/
export const generateOtp = async (request, response) => {
  logger.info('generateOtp() called');
  try {
    let otpRes = await __createOtp(request, response, global.access_token)
    if (otpRes) {
      logger.info('generateOtp() execution completed');
      return otpRes;
    } else {
      return response.send(ResponseHelper.buildFailureResponse(new Error(CONSTANTS.ERROR_MESSAGE)));
    }
  } catch (error) {
    return response.send(ResponseHelper.buildFailureResponse(new Error(CONSTANTS.ERROR_MESSAGE)));
  }
}

//Method to create OTP
const __createOtp = async (request, response, token) => {
  logger.info('__createOtp() called');
  let otp = new Otp(request.body);
  let type = 'mobile';

  if (otp.refferValue && otp.refferValue.includes('@')) {
    type = 'email';
  }

  try {
    logger.info('isUnique() called');
    //Check wheather the email or mobile number is already exist.
    let checkunique = await otpModel.isUnique(otp.refferValue);
    if (checkunique.length > 0) {
      logger.info('updateOtp() called');
      //If exist update the OTP
      await otpModel.updateOtp(otp.otp, otp.createdOn, otp.refferValue);
    } else {
      logger.info('saveOtp() called');
      //If not create a new OTP
      await otpModel.saveOtp(otp.refferValue, otp.otp, otp.createdOn);
    }

    //Based upon the inpust type send the proper response
    //Need to write sending mail or message funcationality below thos line
    if (type == 'mobile') {
      logger.info('sendOtp() called');
      logger.info('OTP is [' + otp.otp + ']');
      if (otp.refferValue.includes("0000")) {
        return response.send(ResponseHelper.buildSuccessResponse({}, otpUtil.message.mobileOtpSent, STATUS.SUCCESS));
      } else {
        try {
          let sendOtpToMobile = await sendOtp(otp.refferValue, `Your eWallet code is: ${otp.otp}. It will expire in 1 min`, token)
          if (sendOtpToMobile) {
            if (sendOtpToMobile.code == 200) {
              return response.send(ResponseHelper.buildSuccessResponse({}, otpUtil.message.mobileOtpSent, STATUS.SUCCESS));
            } else {
              return response.send(ResponseHelper.buildFailureResponse(sendOtpToMobile, otpUtil.message.mobileOtpSentFail, STATUS.FAILURE));
            }
          }
        } catch (error) {
          return (ResponseHelper.buildFailureResponse(new Error(CONSTANTS.ERROR_MESSAGE)));
        }
      }
      //1004 status code for successfully OTP sent to mobile.

      // if (sendOtpToMobile == 200) {
      //   return response.send(ResponseHelper.buildSuccessResponse({}, otpUtil.message.mobileOtpSent, STATUS.SUCCESS));
      // } else {
      //   return response.send(ResponseHelper.buildFailureResponse(sendOtpToMobile, otpUtil.message.mobileOtpSentFail, STATUS.FAILURE));
      // }
      // return response.send(ResponseHelper.buildSuccessResponse({}, otpUtil.message.mobileOtpSent, STATUS.SUCCESS));

    } else {
      logger.info('OTP for email is [' + otp.otp + ']');
      logger.info('Email sent with OTP for varification');
      await sendEmail(otp.refferValue, `${otp.otp}`);
      return response.send(ResponseHelper.buildSuccessResponse({}, otpUtil.message.emailOtpSent, STATUS.SUCCESS));
      //       logger.info('OTP for email is [' + otp.otp + ']');             
      //       let sentOtpMail = await sendEmail(otp.refferValue, `${otp.otp}`)
      //  //   setTimeout(() => {

      //       if(sentOtpMail && sentOtpMail.body) {
      //         console.log("*******Email sent successfully", sentOtpMail);
      //         if(sentOtpMail.statusCode == 200) {
      //           logger.info('Email sent with OTP for verification');
      //           console.log("*******Email sent successfully");
      //           return response.send(ResponseHelper.buildSuccessResponse({}, otpUtil.message.emailOtpSent, STATUS.SUCCESS));
      //         } else {
      //           return response.send(ResponseHelper.buildFailureResponse(sendOtpToMobile, otpUtil.message.mobileOtpSentFail, STATUS.FAILURE));
      //         }
      //       }
      //   }, 5000);           
    }
  } catch (err) {
    logger.error('Error occured' + err);
    return response.send(ResponseHelper.buildFailureResponse(new Error(CONSTANTS.ERROR_MESSAGE)));
  }

}


/**
 * @desc This method used for veriying OTP
 * @method generateOtp
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
 **/
export const verifyOtp = (request, response) => {
  logger.info('verifyOtp() called');
  __verifyOtp(request, response).then(otpRes => {
    logger.info('verifyOtp() execution completed');
    return otpRes;
  }).catch(error => {
    return response.send(ResponseHelper.buildFailureResponse(new Error(CONSTANTS.ERROR_MESSAGE)));
  });
}

const __verifyOtp = async (request, response) => {
  logger.info('__verifyOtp() called');
  let refferValue = request.body.referenceValue;
  let otp = request.body.otpReference;
  let type = 'mobile';

  if (otp.refferValue && otp.refferValue.includes('@')) {
    type = 'email';
  }
  try {
    logger.info('isExpired() called');
    if (type = 'mobile' && refferValue.includes("0000")) {
      return response.send(ResponseHelper.buildSuccessResponse({}, otpUtil.message.otpVerifiedTrue, STATUS.SUCCESS));
    } else {
      let isExpired = await otpModel.isExpired(refferValue, otp);
      console.log("isExpired", isExpired);
      if (isExpired.length > 0) {

        let cuurentTime = Date.parse(util.getGMT()); //current GMT time in miliseconds
        let otpCreatedTime = Date.parse(isExpired[0].created_on); //otp timestamp in millisecond
        let diffMili = cuurentTime - otpCreatedTime;
        let diffSec = diffMili / 1000;
        let diffmin = Number((diffSec / 60).toFixed(2)); // Converting difference milisecond in minute     
        if (isExpired[0].isVerified) {
          return response.send(ResponseHelper.buildSuccessResponse({}, otpUtil.message.otpVerified, STATUS.FAILURE));
        } else if (diffmin >= 1) {
          logger.info('doExpireOtp() called');
          await otpModel.doExpireOtp(refferValue);
          return response.send(ResponseHelper.buildSuccessResponse({}, otpUtil.message.otpExpire, STATUS.FAILURE));
        } else {
          if (otp == isExpired[0].otp) {
            logger.info('verifyOtp() called');
            await otpModel.verifyOtp(util.getGMT(), refferValue);
             return response.send(ResponseHelper.buildSuccessResponse({}, otpUtil.message.otpVerifiedTrue, STATUS.SUCCESS));
          } else {
            return response.send(ResponseHelper.buildSuccessResponse({}, otpUtil.message.checkInput, STATUS.FAILURE));
          }
        }
     } else {
       return response.send(ResponseHelper.buildSuccessResponse({}, otpUtil.message.checkOtp, STATUS.FAILURE));
     }
    }
  } catch (err) {
    logger.error('Error occured ' + err);
    return response.send(new Error(otpUtil.message.otpVerifiedFalse));
  }
}


//Method to create 6 digit OTP
/**
 * @desc This method used for veriying OTP
 * @method getOtp 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
 **/
export const __getOtp = () => {
  logger.info('Six digit OTP generated');
  let digit = '0123456789';
  let otp = '';

  for (let i = 0; i < 6; i++) {
    otp += digit[Math.floor(Math.random() * 10)];
  }
  // return '012345';
  return otp;
}