/**
 * loginController Controller
 * loginController is used for authentication of user to allow to enter into payvoo app.
 * it will go to  validate  the user email and password then only it will allow into payvoo
 * @package passwordController
 * @subpackage controller/password/passwordController
 * @author SEPA Cyper Technologies, shekhar
 */

"use strict";

import {
  User
} from '../model/password';
import {
  sendEmail
} from '../mailer/mail';
import {
  configVariable
} from '../utility/password';
import {
  loginConfig
} from '../utility/loginConfig';
import {
  langEngConfig
} from '../utility/lang_eng';
import {
  forgotStatus
} from '../mailer/mail';
import {
  __getOtp
} from '../controller/otp';
import { Utils } from '../utility/utils';
import {
  OtpModel
} from '../model/otp';
import {
  configVariable as otpUtil
} from '../utility/otp';
//import { logger } from 'handlebars';
const crypto = require('crypto');
const user = new User();
let util = new Utils();
let otpModel = new OtpModel();

const STATUS = {
  FAILED: 1,
  SUCCESS: 0
};

const EXPIRE = {
  FAILED: 1,
  SUCCESS: 0
}

class UserRequest {
  constructor(userRequest) {
    this.business_type = 'applicant';//(userRequest.body.account_type === 'business' || userRequest.body.account_type === 'sandbox') ? `business_users` : `user_login`;
    this.email = userRequest.body.email;
    this.account_type = _.toLower(userRequest.body.account_type);
    this.Update_business_type = (_.toLower(userRequest.params.type) === 'business' || _.toLower(userRequest.params.type) === 'sandbox') ? `business_users` : `user_login`;
    this.code = userRequest.params.code;
    this.newPassword = userRequest.body.newPassword;
    this.newPin = userRequest.body.newPin;
    this.applicant_id = userRequest.params.applicant_id ? userRequest.params.applicant_id : userRequest.body.applicant_id;
    this.password = userRequest.body.password;
    this.id = userRequest.body.id;
  }
  /**
 * @desc This method used for validating OTP
 * @method isValidOTPRequest
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
  isValidOTPRequest(businessType) {
    if (Utils.isEmptyObject(businessType)) {
      return false;
    }
    return true;
  }
}
/**
 * @desc Method for set the forgotPassword
 * @method forgotPassword 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */

export const forgotPassword = async (req, res) => {
  try{
  logger.info('forgotPassword() intiated');
  const userRequest = new UserRequest(req);
  let otp = __getOtp();
  let createdOn = util.getGMT();
  if (userRequest.account_type == "" || userRequest.email == "") {
    res.send(ResponseHelper.buildSuccessResponse({}, `${loginConfig.message.invalidAccountType} or ${loginConfig.message.invalid_email}`, STATUS.FAILED));
  } else {
    var userInfo = await user.forgotPassword(_.toLower(userRequest.account_type), userRequest.email) 
      logger.info(' response of user.forgotPassword()');
      if (userInfo.length == 0) {
        logger.warn('userInfo.length must be equal to zero');
        res.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.errorInSendEmail, EXPIRE.FAILED));
      } else {
    //    let user_info = _encrypt(userInfo[0].user_id);
    //   await sendResetLink(userRequest.email, _.toLower(userRequest.account_type), user_info)
       logger.info('OTP for email is [' + otp + ']');
       logger.info('Email sent with OTP for varification');
       await otpModel.saveOtp(userRequest.email, otp, createdOn);
       await sendEmail(userRequest.email, `${otp}`);
       res.send(ResponseHelper.buildSuccessResponse({}, otpUtil.message.emailOtpSent, STATUS.SUCCESS));
        logger.info('user.sendResetLink() intiated');
     //   res.send(ResponseHelper.buildSuccessResponse({}, `Email sent to ${req.body.email},${configVariable.message.infoResetPassword}`, STATUS.SUCCESS));
      }
    }
  } catch (err) {   
    logger.info('error while user.sendResetLink()');
    res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}

/**
 * @desc Method for update the Password
 * @method updatePassword 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
export const updatePassword = async (req, res) => {
  try {
    logger.info('updatePassword intiated');
    const userRequest = new UserRequest(req);
    var info = await user.updatePassword(userRequest.Update_business_type, userRequest.newPassword, _decrypt(userRequest.code))
    logger.info('user.updatePassword() executed');
    res.send(ResponseHelper.buildSuccessResponse(info, configVariable.message.passwordUpdated, STATUS.SUCCESS));
  } catch (err) {
    logger.error('error in user.updatePassword()');
    res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}


/**
 * @desc Method for change the Password
 * @method changePassword 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
export const changePassword = async (req, res) => {
  try{
  logger.info('changePassword() intiated');
  const userRequest = new UserRequest(req);
 var password = await  user.changePassword(_.toLower(userRequest.account_type), userRequest.applicant_id)
    logger.info('user.changePassword() start');

    if (hashPassword.verify(req.body.oldPassword, password[0].password)) {
      logger.warn('password must be verify');
     await user.saveNewPassword(_.toLower(userRequest.account_type), userRequest.newPassword, userRequest.applicant_id)
      logger.info(' Response of user.saveNewPassword()');
      res.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.passwordChange, STATUS.SUCCESS));
    } else {
      logger.error('error while password verification');
      res.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.oldPasswordNotValid, STATUS.FAILED));
    }
  } catch (err) {
    logger.error('error in user.changePassword()');
    res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}


export const resetPin = async (req, res) => {
  try{
  logger.info('changePassword() intiated');
  const userRequest = new UserRequest(req);
 var oldPin = await  user.changePin(_.toLower(userRequest.account_type), userRequest.applicant_id)
    logger.info('user.changePassword() start');
    if (!hashPassword.verify(userRequest.newPin, oldPin[0].passcode_pin)) {
      logger.warn('password must be verify');
     await user.saveNewPin(_.toLower(userRequest.account_type), userRequest.newPin, userRequest.applicant_id)
      logger.info(' Response of user.saveNewPin()');
      res.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.pinReset, STATUS.SUCCESS));
    } else {
      logger.error('error while password verification');
      res.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.oldPinNotValid, STATUS.FAILED));
    }
  } catch (err) {
    logger.error('error in user.changePassword()');
    res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}

/**
 * @desc Method for reset the Password
 * @method resetPassword 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
export const resetPassword = async (req, res) => {
  try {
    logger.info('resetPassword() intiated');
    const userRequest = new UserRequest(req);
    let email = userRequest.email;
   const data = await user.getPassword(userRequest.account_type, email);
   if(data && data[0] && data[0].password) {
   var flagPassword = hashPassword.verify(userRequest.password, data[0].password);
   }
   if(flagPassword == false) {
   await user.resetPassword(userRequest.business_type, userRequest.account_type, userRequest.password, email)
    logger.info('response of user.resetPassword()');
    res.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.passwordChangeSuccessfully, STATUS.SUCCESS));
   } else {
    res.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.previousPassword, STATUS.FAILED));
   }
  } catch (err) {   
    logger.error('error while user.password()');
    res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }

}
var _encrypt = (text) => {
  var cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq')
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

var _decrypt = (text) => {
  var decipher = crypto.createDecipher('aes-256-cbc', 'd6F3Efeq')
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}


/**
 * @desc This method used for reset link
 * @method sendResetLink
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
const sendResetLink = async (email, accountType, userId) => {
  logger.info('sendResetLink() intiated');
  return new Promise(function (resolve, reject) {
    if(accountType == 'sandbox') {
      var link = `http://${process.env.WEB_LOGIN_URL}/${accountType}/forgot/${userId}`
    } else {
      var link = `http://${process.env.FORGOT_PASSWORD_URL}/${accountType}/forgot/${userId}`
    }
    forgotStatus(email, link, accountType).then(function (data) {
      logger.info('sendResetLink() executed');
      resolve(data)
    }, function (err) {
      logger.error('error in sendResetLink()');
      reject(err)
    })
  })
}
