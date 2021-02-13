/**
 * signUpController Controller
 * signUpController is used for the user registration purpose. An individual user has to give the required 
 * data to register himself in the payvoo app.
 * @package signUpController
 * @subpackage controller/signUP/signUpController
 * @author SEPA Cyber Technologies, Sekhara Suman Sahu.
 */


/* This file is modified version of current signup process, With changed database structure and use of async/await
   concept in Node.js. */



"use strict";
/**
 * Required file import.
 */
import {
  UserModel
} from '../model/signUp';
import {
  signupConfig
} from '../utility/signUp';
import {
  decrypt
} from '../utility/validate';
import {
  DbConnMgr
} from '../dbconfig/dbconfig';
import {
  Utils
} from '../utility/utils';
import {
  TokenModel
} from '../model/tokenManager';
import {
  langEngConfig
} from '../utility/lang_eng';
import {
  loginConfig
} from '../utility/loginConfig';
import {
  UserModel as UserData
} from '../model/userModel';
let user = new UserData();


const tokenModel = new TokenModel();
/** Require Module import*/
const alphaChar = require('randomstring');
const uuidAPIKey = require('uuid-apikey');
const crypto = require('crypto');
var mailer = require('../mailer/mail');

/**Object initialization of required file*/
const userModel = new UserModel();
const util = new Utils();
let db = DbConnMgr.getInstance();
// const conn = db.getConnObject();

/** Status Object for success or failure case*/
const STATUS = {
  SUCCESS: 0,
  FAILURE: 1
}

/** user Class for User data initialization */
class USER {
  constructor(userdata) {
    this.applicant = {
      'account_type': _.toLower(userdata.account_type),
      'user_id': userdata.email,
      'password': hashPassword.generate(userdata.password),
      'passcode_pin': (userdata.passcode_pin == null) ? hashPassword.generate("1234") : hashPassword.generate(userdata.passcode_pin),
      'role_id': userdata.role_id,
      'email_verified': userdata.email_verified,
      'mobile_verified': userdata.mobile_verified,
      'devicetype':userdata.devicetype,
      'devicetoken':userdata.devicetoken,
      'created_on': util.getGMT()
    };
    this.contact = {
      'first_name': userdata.first_name,
      'middle_name': userdata.middle_name,
      'last_name': userdata.last_name,
      'email': userdata.email,
      'gender': userdata.gender,
      'dob': (userdata.dob == "" || userdata.dob === null || userdata.dob === "null") ? '0000-00-00' : userdata.dob,
      'telephone': userdata.telephone,
      'mobile': userdata.mobile,
      'phone': userdata.phone ? userdata.phone : '',
      'place_of_birth': userdata.place_of_birth ? userdata.place_of_birth: '',
      'nationality': userdata.nationality ? userdata.nationality : ''
    };
    this.address = {
      'country_id': userdata.country_id,
      'postal_code': userdata.postal_code,
      'address_line1': userdata.address_line1,
      'address_line2': userdata.address_line2,
      'city': userdata.city,
      'town': userdata.town,
      'region': userdata.region
    };
    this.applicant_id = userdata.applicant_id;
    this.token = uuidv1() + Math.floor(new Date() / 1000);
  }
}

/**
 * This function defined to handle http request from /userRegistraion service. 
 * @method registerUser 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @description This method call the private methods used in user registrtaion.
 */
export const registerUser = (request, response) => {
  logger.info('registerUser() initiated');
  __userSignUp(request, response).then(resgistrationRes => {

    logger.info('registerUser() execution completed');
    response.send(resgistrationRes);
  }).catch(err => {
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.signUp.signUpError)));
  })
};

/**
 * This function defined to register users. 
 * @method __userSignUp 
 * @param {Object} request - It is Request object
 * @description This method call the private methods used in user registrtaion.
 */
const __userSignUp = async (request, response) => {
  logger.info('__userSignUp() initiated');

  let apiKey = uuidAPIKey.create();
  let memberId = crypto.randomBytes(6).toString('hex');
  const url = process.env.SANDBOX_URL;
  const api_doc_url = process.env.SANDBOX_API_DOC_URL;
  const redirect_url = process.env.SANDBOX_REDIRECT_URL;
  let merchant_apiKey = uuidAPIKey.create();
  let merchant_memberId = crypto.randomBytes(6).toString('hex');
  const merchant_url = process.env.MERCHANT_URL;
  const merchant_api_doc_url = process.env.MERCHANT_API_DOC_URL;
  const merchant_redirect_url = process.env.MERCHANT_REDIRECT_URL;

  let user = new USER(request.body);
  // user.devicetype=1
  // user.devicetoken = '7d9f0ad2a993f4f68826e569963b2a48f36a56c9a09588c60aef757aca5b95af'

  logger.info('isValidRegRequest() called');
  let isValidRegReq = {
    status: 0
  };
  //let isValidRegReq = await util.isValidRegRequest1(user);
  if (isValidRegReq.status == 0) {

    let roleId = 1;
    let addressTypeId = 1;
    if (_.toLower(user.applicant.account_type) === "personal") {
      roleId = 1;
    }

    if (_.toLower(user.applicant.account_type) === "business") {
      roleId = 1;
    }

    let conn = await db.getConnObject();
    console.log("***** getConnObject *****"+conn);
    try {
      logger.info('checkUniqueId() called');
      
        let custId = await __generateCustId();
        logger.info('transaction initiated');
        console.log("***** __generateCustId *****"+custId);

        await conn.beginTransaction();

        console.log("***** beginTransaction *****");
        logger.info('createApplicant() called');
        let applicantRes = await userModel.createApplicant(conn, _.toLower(user.applicant.account_type), custId, user.contact.email,
          user.applicant.password, user.applicant.passcode_pin, user.contact.mobile, roleId,
          STATUS.FAILURE, user.applicant.devicetype, user.applicant.devicetoken,user.applicant.created_on);

        if (applicantRes) {
          logger.info('createContact() called');
          let contactRes = await userModel.createContact(conn, applicantRes.insertId, user.contact.first_name, user.contact.middle_name,
            user.contact.last_name, user.contact.email, user.contact.gender, user.contact.dob, user.contact.telephone,
            user.contact.mobile, user.contact.phone,user.contact.place_of_birth, user.contact.nationality, user.applicant.created_on);
          if (contactRes) {
            logger.info('createAddress() called');
            let addressRes = await userModel.createAddress(conn, applicantRes.insertId, contactRes.insertId, addressTypeId, user.address.country_id, user.address.postal_code,
              user.address.address_line1, user.address.address_line2, user.address.city, user.address.town,
              user.address.region, user.applicant.created_on);
            if (addressRes) {
              logger.info('createKyc() called');
              let kycRes = await userModel.createKyc(conn, applicantRes.insertId);
              //Create record in privacy table wih default value
              await userModel.createPrivacy(conn, applicantRes.insertId);
              if (kycRes) {
                logger.info('createCurrencyAccount() called');
                await userModel.createCurrencyAccount(conn, applicantRes.insertId, roleId);
                let rowItems = [
                  [applicantRes.insertId, "EUR", "EUR", 1],
                  [applicantRes.insertId, "USD", "USD", 1],
                  [applicantRes.insertId, "GBP", "GBP", 1]
                ];
                logger.info('createCurrencyExchangeAccount() called');
                await userModel.createCurrencyExchangeAccount(conn, rowItems);
                logger.info('createCurrencyExchangeAccount() called');
                let data = {}
                if (user.applicant.account_type == 'sandbox') {
                  //Authentication parameters
                  data = {
                    Token: jwt.sign({
                      email: user.contact.email
                    }, process.env.PASSWORD_CONFIG),
                    status: STATUS.SUCCESS,
                    message: signupConfig.message.signUp.success,
                    client_auth: jwt.sign({
                      email: user.contact.email
                    }, process.env.PASSWORD_CONFIG1),
                    member_id: process.env.SANDBOX_CLIENT_ID,
                    api_access_key: process.env.SANDBOX_API_KEY,
                    'x-auth-token': user.token
                  };
                } else {
                  //Authentication parameters
                  data = {
                    Token: jwt.sign({
                      email: user.contact.email
                    }, process.env.PASSWORD_CONFIG),
                    status: STATUS.SUCCESS,
                    message: signupConfig.message.signUp.success,
                    client_auth: jwt.sign({
                      email: user.contact.email
                    }, process.env.PASSWORD_CONFIG1),
                    member_id: process.env.CLIENT_ID,
                    api_access_key: process.env.API_KEY,
                    'x-auth-token': user.token
                  };
                }

                if (user.applicant.account_type == 'business' || user.applicant.account_type == 'sandbox') {
                  if (user.applicant.account_type == 'business') {
                    logger.info('createMerchant() called');
                    let merchantRes = await userModel.createMerchantUser(conn, applicantRes.insertId, merchant_memberId, merchant_apiKey.apiKey, merchant_url, merchant_api_doc_url, merchant_redirect_url);
                    if (merchantRes && user.applicant.account_type == 'sandbox') {
                      logger.info('signupMail() called');
                      await mailer.signupMerchantMail(user.contact.email, user.contact.first_name, user.contact.last_name);
                      logger.info('__signUpResObject() called');
                    }
                    await mailer.signupMail(user.contact.email, user.contact.first_name, user.contact.last_name, user.applicant.account_type);
                  }
                  logger.info('createSandboxUser() called');
                  let isUnique = await userModel.checkUniqueId(user.contact.email, user.contact.mobile, user.applicant.account_type);
                  if (isUnique.length == 0) {
                  let sandBoxRes = await userModel.createSandboxUser(conn, applicantRes.insertId, memberId, apiKey.apiKey, url, api_doc_url, redirect_url);
                  if (user.applicant.account_type == 'sandbox' && sandBoxRes) {
                    logger.info('signupMail() called');
                    await mailer.signupMail(user.contact.email, user.contact.first_name, user.contact.last_name, user.applicant.account_type);
                  }
                } else {
                  logger.info('checking for duplicate email and phone numbers');
                  //Check for duplicate email mobile and generate propper response.
                  if (isUnique[0].user_id == user.contact.email && isUnique[0].mobile == user.contact.mobile) {
                    return response.send(ResponseHelper.buildSuccessResponse({}, signupConfig.message.signUp.emailAndMobileExist, STATUS.FAILURE));
                  } else if (isUnique[0].user_id == user.contact.email) {
                    return response.send(ResponseHelper.buildSuccessResponse({}, signupConfig.message.signUp.emailExist, STATUS.FAILURE));
                  } else {
                    return response.send(ResponseHelper.buildSuccessResponse({}, signupConfig.message.signUp.mobileExist, STATUS.FAILURE));
                  }
                }
                  logger.info('__signUpResObject() called');
                  let regData = await __signUpResObject(data, user.contact, user.address, user.applicant, applicantRes.insertId);
                  if (regData) {
                    logger.info('__userSignUp() execution completed');
                    conn.commit();
                    conn.release();
                    await tokenModel.saveLoginToken(applicantRes.insertId, user.token);
                    response.send(ResponseHelper.buildSuccessResponse(regData, signupConfig.message.signUp.success, STATUS.SUCCESS));
                  }

                } else {
                  logger.info('signupMail() called');
                  await mailer.signupMail(user.contact.email, user.contact.first_name, user.contact.last_name);
                  logger.info('__signUpResObject() called');
                  let regData = await __signUpResObject(data, user.contact, user.address, user.applicant, applicantRes.insertId);
                  if (regData) {
                    logger.info('__userSignUp() execution completed');
                    conn.commit();
                    conn.release();
                    await tokenModel.saveLoginToken(applicantRes.insertId, user.token);
                    response.send(ResponseHelper.buildSuccessResponse(regData, signupConfig.message.signUp.success, STATUS.SUCCESS));
                  }
                }
              }
            }
          }
        }   
    } catch (err) {
      logger.error('Error occured : ' + err);
      console.log("***** Error occured *****"+err)
      conn.rollback();
      conn.release();
      console.log("***** Sending error message back ****");
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.signUp.signUpError)));
    }
  } else {
    logger.info('__userSignUp() execution completed');
    response.send(ResponseHelper.buildSuccessResponse(isValidRegReq, '', STATUS.FAILURE));
  }
}

//Method to create response onject during user signup.
/**
 * @desc method is to create response onject during user signup.
 * @method signUpResObject 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns status message and status code
 **/
const __signUpResObject = async (data, contact, address, applicant, applicant_id) => {
  logger.info('__signUpResObject() initiated');
  let isBusiness = false;
  data.userInfo = {
    first_name: contact.first_name,
    last_name: contact.last_name,
    email: contact.email,
    country_id: address.country_id,
    gender: contact.gender,
    mobile: contact.mobile,
    phone: contact.phone,
    account_type: _.toLower(applicant.account_type),
    kycStatus: "NOT_INITIATED",
    initialPayment: false,
    isBusiness: isBusiness,
    applicant_id: applicant_id
  }
  if (_.toLower(applicant.account_type) === "personal") {
    data.userInfo.address_line1 = address.address_line1;
    data.userInfo.address_line2 = address.address_line2;
    data.userInfo.phone = contact.phone;
    data.userInfo.city = address.city;
    data.userInfo.postal_code = address.postal_code;
    data.userInfo.region = address.region;
    data.userInfo.town = address.town;
  }
  logger.info('__signUpResObject() execution completed');
  return data;
}

//Method to generate each CustomerId for each user
/**
 * @desc method is to generate each CustomerId for each user
 * @method generateCustId 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns status message and status code
 **/
const __generateCustId = async () => {
  //Initial 2 random characters
  const shortidChar1 = alphaChar.generate({
    length: 2,
    charset: 'alphabetic',
    capitalization: 'uppercase'
  });
  //Last 2 random characters
  const shortidChar2 = alphaChar.generate({
    length: 2,
    charset: 'alphabetic',
    capitalization: 'uppercase'
  });

  //Four digit random number
  const fourDigit = () => {
    let shortidInt = '0123456789';
    let digit = '';
    for (let i = 0; i < 4; i++) {
      digit += shortidInt[Math.floor(Math.random() * 10)];
    }
    return digit;
  }

  let numValue = fourDigit();

  //Generate id with initial 'PV'. ex- PV-AB1234YZ
  const generateId = () => {
    return 'PV' + '-' + shortidChar1 + numValue + shortidChar2;
  }
  let id = generateId();

  return id;
}

//Method for cheking existing email id or mobile number
/**
 * @desc method is used for cheking existing email id or mobile number
 * @method sUserExists
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns status message and status code
 **/
export const isUserExists = async (request, response) => {
  logger.info('isUserExists() initiated');
  const value = request.body.userId;

  let type = 'mobile';

  if (_.includes(value, "@")) {
    type = 'user_id';
  }

  try {
    let isUniqueUser = await userModel.isUserExists(value, type);

    if (_.size(isUniqueUser) > 0) {
      if (type === 'user_id') {
        logger.info('isUserExists() execution completed');
        response.send(ResponseHelper.buildSuccessResponse({}, signupConfig.message.signUp.emailExist, STATUS.FAILURE));
      } else {
        logger.info('isUserExists() ecxecution completed');
        response.send(ResponseHelper.buildSuccessResponse({}, signupConfig.message.signUp.mobileExist, STATUS.FAILURE));
      }
    } else {
      logger.info('isUserExists() ecxecution completed');
      response.send(ResponseHelper.buildSuccessResponse({}, signupConfig.message.signUp.valueDoesntAExist, STATUS.SUCCESS));
    }
  } catch (err) {
    logger.error(err);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.signUp.signUpError)));
  }
}


/**
 * This function is used to get country details by country name 
 * @method sendSandboxDetails 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @description This method used for sending sandbox details in mail.
 */
//Method for sending email send box user
export const sendSandboxDetails = (request, response) => {
  const email = request.body.email;
  const applicant_id = request.params.applicant_id;

  if (!Utils.isEmptyObject(email)) {
    userModel.sendEmailTosandboxUser(applicant_id)
      .then(result => {
        if (result.length > 0) {
          mailer.sandBoxInfo(email, result[0], process.env.SANDBOX_API_DOC_URL)
            .then(emailRes => {
              if (emailRes.status == 1) {
                response.send(ResponseHelper.buildSuccessResponse({}, `${loginConfig.message.emailSuccess} : ${email}`, STATUS.SUCCESS));
              }
            })
            .catch(err => {
              response.send(ResponseHelper.buildFailureResponse(new Error(loginConfig.message.emailFail)));
            })
        } else {
          response.send(ResponseHelper.buildFailureResponse(loginConfig.message.emailFail));
        }
      })
      .catch(err => {
        response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.signUp.signUpError)));
      })
  } else {
    response.send(ResponseHelper.buildFailureResponse(loginConfig.message.invalid_email));
  }
}
/**
 * @desc method is used to get kyc details
 * @method kycEntry
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns status message and status code
 **/
export const kycEntry = (request, response) => {
  logger.info('kycEntry() intiated');
  let user_id = request.body.user_id;
  userModel.getApplicantContact(user_id)
    .then(contact => {
      logger.info('getApplicantContact() success');
      if (contact[0] && contact[0].applicant_id && _.size(contact) > 0) {
        userModel.kycEntry(contact[0].applicant_id).then(result => {
          logger.info('Response of kycEntry()');
          if (result.affectedRows > 0) {
            logger.warn('result.affectedRows must be graterthan zero');
            response.send(ResponseHelper.buildSuccessResponse({}, signupConfig.message.signUp.kycEntryInsert_success, STATUS.SUCCESS));
          } else {
            logger.error('result.affectedRows < 0');
            response.send(ResponseHelper.buildFailureResponse(signupConfig.message.signUp.kycEntryInsert_fail, STATUS.FAILURE));
          }
        }).catch(err => {
          logger.error('error in kycEntry()');
          response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.signUp.signUpError)));
        })
      } else {
        logger.info('Applicant not found');
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.signUp.applicant_notFound, STATUS.FAILED));
      }
    }).catch(err => {
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.signUp.contactError)));
    })
}

/**
 * This function is used to get user details from encrypted token by username 
 * @method getUserDataFromToken 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @description This function is used to get user details from encrypted token by username .
 */

//Method for getting user data from encrypted token
export const getUserDataFromToken = (request, response) => {
  logger.info('getUserDataFromToken() called');
  let token = request.params.token;

  __getDecryptUserData1(token).then(result => {
    logger.info('getUserDataFromToken() execution completed');
    response.send(result);
  }).catch(err => {
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.signUp.contactError)));
  })
}

//Method to support get user data.
/**
 * This function is used to get user details from decrypted data
 * @method getDecryptUserData1 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @description This function is used to get user details from decrypted data
 */
const __getDecryptUserData1 = async (token) => {
  logger.info('__getDecryptUserData() called');
  try {
    let value = await decrypt(token);
    let parameter = value.split(' ');
    if (parameter.length < 11) {
      let cuurentTime = Date.parse(util.getGMT());
      let diffMili = cuurentTime - parseInt(parameter[9], 10);

      let diffSec = diffMili / 1000;
      let diffmin = Math.floor(diffSec / 60)
      if (diffmin < 31) {
        let kycStatus = await user.getKycBusinessStatus(parameter[0]);
        let kybData = await user.getKybBusinessDataForLink(parameter[0], parameter[1]);
        if (kybData.length > 0) {
          let tag = false;
          if (kycStatus.length > 0) {
            tag = false;
          } else {
            tag = true;
          }
          if (tag) {
            let tokenDeatils = (kybData && kybData[0] && kybData[0].name) ? (kybData[0].name).split(',') : [];
            let email = (kybData && kybData[0] && kybData[0].email) ? kybData[0].email : '';
            let type = (kybData && kybData[0] && kybData[0].type) ? kybData[0].type : '';
            let kybBoId = (kybData && kybData[0] && kybData[0].kyb_bo_id) ? kybData[0].kyb_bo_id : '';
            let data = {};
            data.userInfo = {};
            data.userInfo.first_name = tokenDeatils[0] ? tokenDeatils[0] : '';
            data.userInfo.last_name = tokenDeatils[1] ? tokenDeatils[1] : '';
            data.userInfo.email = email;
            data.userInfo.kybBoId = kybBoId;
            data.userInfo.isKyc = (parameter[2].toLowerCase() == 'true' || parameter[2] == 1) ? true : false;
            data.userInfo.access_token = parameter[4];
            data.userInfo.member_id = parameter[6];
            data.userInfo.api_access_key = parameter[5];
            data.userInfo.token = parameter[7];
            data.userInfo.client_auth = parameter[8];
            data.userInfo.type = type;
            data.userInfo.account_type = 'business';
            return ResponseHelper.buildSuccessResponse(data, langEngConfig.message.userDetailsMessage.success, STATUS.SUCCESS);
          } else {
            logger.info('__getDecryptUserData() execution completed');
            return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.userDetailsMessage.kycDoneAlready, STATUS.FAILURE);
          }
        } else {
          logger.info('__getDecryptUserData() execution completed');
          return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.userDetailsMessage.fail, STATUS.FAILURE);
        }
      } else {
        logger.info('__getDecryptUserData() Link Expired');
        return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.userDetailsMessage.linkExpire, STATUS.FAILURE);
      }
    } else {
      logger.info('__getDecryptUserData() execution completed');
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.userDetailsMessage.fail, STATUS.FAILURE);
    }
  } catch (err) {
    logger.error('Error occured ' + err);
  }
}

export const userLogout = (request, response) => {
  __userLogout(request, response).then(userLogoutRes => {
    return userLogoutRes;
  }).catch(err => {
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.signUp.contactError)));
  })
}

const __userLogout = async (request, response) => {
  const applicant_id = request.params.applicant_id;
  try {
    let logoutStatus = await userModel.userLogout(applicant_id);
    console.log("logout status", logoutStatus)
    if (logoutStatus.affectedRows > 0) {
      let deviceStatus = await userModel.nullifyDeviceDetails(applicant_id)
      
      return response.send(ResponseHelper.buildSuccessResponse({}, signupConfig.message.signUp.userLogout, STATUS.SUCCESS));
    }
  } catch (err) {
    return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.signUp.contactError)));
  }
}