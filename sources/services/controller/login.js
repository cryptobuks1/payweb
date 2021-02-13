/**
 * login Controller
 * login is used for authenticating user into payvoo app.
 * @package login
 * @subpackage controller/login
 * @author SEPA Cyber Technologies, Sekhara Suman Sahu.
 */


/* This file is modified version of current login process, With changed database structure and use of async/await
   concept in Node.js. */

import {
  Login
} from '../model/login';
import {
  loginConfig
} from '../utility/loginConfig';
import {
  TokenModel
} from '../model/tokenManager';
import {
  langEngConfig
} from '../utility/lang_eng';

let tokemodel = new TokenModel();
const loginModel = new Login();


const STATUS = {
  SUCCESS: 0,
  FAILURE: 1
}


/**
 * This function is used to handle request from login route
 * @method loginUser 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return login details.
 */
export const loginUser = (request, response) => {
  logger.info('loginUser() called');
  __authenticateUser(request, response).then(authRes => {
    logger.info('loginUser() completed');
    return authRes;
  }).catch(err => {
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.signUp.contactError)));
  })
}



/**
 * This function is used to authenticate an user.
 * @method __authenticateUser
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return user details.
 */
const __authenticateUser = async (request, response) => {

  let userId = request.body.userId;
  let password = request.body.password;
  let accountType = _.toLower(request.body.account_type);
  let token = uuidv1() + Math.floor(new Date() / 1000);// x-auth-token

  let devicetype = 0;
  let devicetoken = '';
  if ((request.body.devicetype == null) || 
      (request.body.devicetype == '') || 
      (request.body.devicetoken == null) || 
      (request.body.devicetoken == ''))  {
      devicetype = 0;
      devicetoken = '';
  } else {
    devicetype = request.body.devicetype;
    devicetoken = request.body.devicetoken;
  }



  let typeOfUserId = 'mobile';
  let typeOfpassword = 'password';
  let business_id = -1;

  if (userId.includes('@')) {
    typeOfUserId = 'user_id';
  }

  if (userId.includes('PV-')) {
    typeOfUserId = 'customerId';
  }

  if (password.length == 4) {
    typeOfpassword = 'passcode_pin';
  }

 
  try {
    logger.info('authenticate() called');
    let authRes = await loginModel.authenticate(typeOfpassword, typeOfUserId, userId, accountType,business_id);
    if (authRes.length > 0) {
      //If status is 0
      if(authRes[0].status == STATUS.SUCCESS){
        return response.send(ResponseHelper.buildSuccessResponse({}, loginConfig.message.accountDeactivate, STATUS.FAILURE));
      }
      //Authenticate for password
      if (typeOfpassword == 'password' && hashPassword.verify(password, authRes[0].password) || (typeOfpassword == 'passcode_pin' && hashPassword.verify(password, authRes[0].passcode_pin))) {
        let loginResponse = await __loginResObject(authRes[0].applicant_id, token,accountType);
        
        //Save the token
        let saveToken = await tokemodel.saveLoginToken(authRes[0].applicant_id, token);

        // Update the deviceid and device token for the applicantID
        let updateDeviceInfo = await loginModel.updateApplicantDeviceInfo(authRes[0].applicant_id,devicetype,devicetoken);
       

        if(saveToken && updateDeviceInfo) {
          return response.send(ResponseHelper.buildSuccessResponse(loginResponse, loginConfig.message.loginSuccess, STATUS.SUCCESS));
        } else {
          return response.send(ResponseHelper.buildSuccessResponse({}, loginConfig.message.invalidMapin, STATUS.FAILURE));
        }

      } else {
        //return proper message based on request type.
        if (typeOfpassword == 'password'){
          return response.send(ResponseHelper.buildSuccessResponse({}, loginConfig.message.passwordInvalid, STATUS.FAILURE));
        } else {
          return response.send(ResponseHelper.buildSuccessResponse({}, loginConfig.message.invalidMapin, STATUS.FAILURE));
        }
      }

    } else {
      //if no data found.
      return response.send(ResponseHelper.buildSuccessResponse({}, loginConfig.message.userNotFound, STATUS.FAILURE));
    }
  } catch (err) {
    logger.error('Error occured '+ err);
    return response.send(ResponseHelper.buildFailureResponse(new Error(CONSTANTS.ERROR_MESSAGE)));
  }
}


/**
 * This function is used to generating login response
 * @method __loginResObject
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return 
 */
const __loginResObject = async (applicantId, token,accountType) => {

  let isBusiness = false;
  let userData = await loginModel.getUserData(applicantId);
  userData[0].applicant_id = applicantId;
  let kybStatus = await loginModel.getKybStatus(applicantId);
  
let loginRes={};
if(accountType=='sandbox'){
  let sandboxData = await loginModel.getSandboxDetails(applicantId);
  loginRes = {
    Token: jwt.sign({
      email: userData[0].user_id
    }, process.env.PASSWORD_CONFIG),
    client_auth: jwt.sign({
      email: userData[0].user_id
    }, process.env.PASSWORD_CONFIG1, {
      expiresIn: 60 * 30
    }),
    member_id: process.env.SANDBOX_CLIENT_ID,
    api_access_key: process.env.SANDBOX_API_KEY,
    message: "login successfully",
    'x-auth-token': token,
    'userInfo': {
      "email": null,
      "gender": null,
      "mobile": null,
      "phone" : null,
      "first_name": null,
      "last_name": null,
      "account_type": null,
      "kycStatus": null,
      "country_id": 0,
      "country_name" : null,
      "address_line1" : null,
      "address_line2" : null,
      "city" : null,
      "postal_code" : null,
      "isBusiness": isBusiness,
      "business_country_of_incorporation": null,
      "business_legal_name": null,
      "initialPayment": true
    },
    'sandBoxInfo':{
      "memberId":sandboxData[0].memberId,
      "api_key":sandboxData[0].api_key,
      "url":sandboxData[0].url,
      "api_doc_url":sandboxData[0].api_doc_url,
      "redirect_url":sandboxData[0].redirect_url
    }
  }
}


else if(accountType=='business'){
  let sandboxData = await loginModel.getSandboxDetails(applicantId);
  let merchantData = await loginModel.getMerchantDetails(applicantId);
  loginRes = {
    Token: jwt.sign({
      email: userData[0].user_id
    }, process.env.PASSWORD_CONFIG),
    client_auth: jwt.sign({
      email: userData[0].user_id
    }, process.env.PASSWORD_CONFIG1, {
      expiresIn: 60 * 30
    }),
    member_id: process.env.CLIENT_ID,
    api_access_key: process.env.API_KEY,
    message: "login successfully",
    'x-auth-token': token,
    'userInfo': {
      "email": null,
      "gender": null,
      "mobile": null,
      "phone" : null,
      "first_name": null,
      "last_name": null,
      "account_type": null,
      "kycStatus": null,
      "country_id": 0,
      "country_name" : null,
      "address_line1" : null,
      "address_line2" : null,
      "city" : null,
      "postal_code" : null,
      "isBusiness": isBusiness,
      "business_country_of_incorporation": null,
      "business_legal_name": null,
      "initialPayment": true,
      "kyb_status": null,
      "applicant_id": null
    },
    'sandBoxInfo':{
      "memberId":sandboxData[0].memberId,
      "api_key":sandboxData[0].api_key,
      "url":sandboxData[0].url,
      "api_doc_url":sandboxData[0].api_doc_url,
      "redirect_url":sandboxData[0].redirect_url
    },
    'merchantInfo':{
      "memberId":merchantData[0].memberId,
      "api_key":merchantData[0].api_key,
      "url":merchantData[0].url,
      "api_doc_url":merchantData[0].api_doc_url    }
  }
}
else{
  loginRes = {
    Token: jwt.sign({
      email: userData[0].user_id
    }, process.env.PASSWORD_CONFIG),
    client_auth: jwt.sign({
      email: userData[0].user_id
    }, process.env.PASSWORD_CONFIG1, {
      expiresIn: 60 * 30
    }),
    member_id: process.env.CLIENT_ID,
    api_access_key: process.env.API_KEY,
    message: "login successfully",
    'x-auth-token': token,
    'devicetype':userData[0].devicetype,
    'devicetoken':userData[0].devicetoken,
    'userInfo': {
      "email": null,
      "gender": null,
      "mobile": null,
      "phone" : null,
      "first_name": null,
      "last_name": null,
      "account_type": null,
      "kycStatus": null,
      "country_id": 0,
      "country_name" : null,
      "address_line1" : null,
      "address_line2" : null,
      "city" : null,
      "postal_code" : null,
      "isBusiness": isBusiness,
      "business_country_of_incorporation": null,
      "business_legal_name": null,
      "initialPayment": true,
      "applicant_id": null
    }
  }
}
 

  let getCompanyData = await loginModel.getCompanyDetail(applicantId);

  if (getCompanyData.length > 0) {
    isBusiness = true;

    loginRes.userInfo.business_country_of_incorporation = getCompanyData[0].country_of_incorporation;
      loginRes.userInfo.business_legal_name = getCompanyData[0].business_legal_name
  } else {
    loginRes.userInfo.business_country_of_incorporation = null;
      loginRes.userInfo.business_legal_name = null
  }

  let isInitialPayment = await loginModel.checkInitialPayment(applicantId);
  if (isInitialPayment.length > 0) {
    loginRes.userInfo.initialPayment = true;
  } else {
    loginRes.userInfo.initialPayment = false;
  }

  if (_.toLower(userData[0].account_type) == 'personal') {
    loginRes.userInfo.email = userData[0].user_id;
      loginRes.userInfo.gender = userData[0].gender;
      loginRes.userInfo.mobile = userData[0].mobile;
      loginRes.userInfo.phone = userData[0].phone;
      loginRes.userInfo.first_name = userData[0].first_name;
      loginRes.userInfo.last_name = userData[0].last_name;
      loginRes.userInfo.region = userData[0].region;
      loginRes.userInfo.account_type = _.toLower(userData[0].account_type);
      loginRes.userInfo.kycStatus = userData[0].kyc_status;
      loginRes.userInfo.country_id = userData[0].country_id;
      loginRes.userInfo.country_name = userData[0].country_name;
      loginRes.userInfo.address_line1 = userData[0].address_line1;
      loginRes.userInfo.address_line2 = userData[0].address_line2;
      loginRes.userInfo.city = userData[0].city;
      loginRes.userInfo.postal_code = userData[0].postal_code;
      loginRes.userInfo.applicant_id = userData[0].applicant_id

  } else {
    loginRes.userInfo.email = userData[0].user_id;
      loginRes.userInfo.gender = userData[0].gender;
      loginRes.userInfo.mobile = userData[0].mobile;
      loginRes.userInfo.phone = userData[0].phone;
      loginRes.userInfo.first_name = userData[0].first_name;
      loginRes.userInfo.last_name = userData[0].last_name;
      loginRes.userInfo.account_type = _.toLower(userData[0].account_type);
      loginRes.userInfo.kycStatus = userData[0].kyc_status;
      loginRes.userInfo.country_id = userData[0].country_id;
      loginRes.userInfo.country_name = userData[0].country_name;
      loginRes.userInfo.isBusiness = isBusiness;
      loginRes.userInfo.kyb_status = kybStatus[0] ? kybStatus[0].kyb_status : '';
      loginRes.userInfo.applicant_id = userData[0].applicant_id
  }

  return loginRes;
}
