/**
 * personalSettings
 * This controller contains the service required in personall settings page.
 * @package personalSettings
 * @subpackage controller/personalSettings
 * @author SEPA Cyber Technologies Sekhara Suman Sahu,Tarangini dola
 */
const {
  validationResult
} = require("express-validator");
import {
  langEngConfig
} from '../utility/lang_eng';
import {
  SETTING
} from '../model/personalSettings';
import {
  ACL
} from '../utility/AccessControleList';
import {
  Utils
} from '../utility/utils';
import {
  Kyc
} from '../model/kyc';
import dateformat from 'dateformat'
import { country } from '../model/country';
import {
  _requestForIdentId, prepareKycPayload,
  callPepAuthServiceAndUpdateKyc
} from '../controller/kycIdentity.js'

import {
  _callIdentityService,
  requestForKycStatus
} from './museCommManager'

let utils = new Utils();

let setting = new SETTING();

const kyc = new Kyc();

let countries = null;

const STATUS = {
  SUCCESS: 0,
  FAILURE: 1
}
const EXTRAAMOUNT = {
  LOCALTRANSFERSEXTRAAMOUNT: 0.5,
  INTERNATIONALTRANSFERSEXTRAAMOUNT: 7,
  REALRATE: 20000,
  RATEEXTRAAMOUNT: (4 / 100),
  TEAMMEMBERSEXTRAAMOUNT: 10
}
const PLANCOUNT = 4;

/**
 * @desc This method used for  support of service/settings/personalInfo
 * @method getPersonaProfile
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const getPersonaProfile = (request, response) => {
  logger.info('getPersonalInfo() called');
  __getPersonalData(request, response).then(personalRes => {
    logger.info('getPersonalInfo() execution completed');
    return personalRes;
  }).catch(err => {
    logger.error(`Something went wrong , While inserting payments details`);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.internalError)))
  });
}


/**
 * @desc This method used for fetching personal data to show in personal setting page.
 * @method __getPersonalData
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
const __getPersonalData = async (request, response) => {
  let applicantId = request.params.applicant_id;

  try {
    logger.info('getPersonalSettingsInfo() called');
    if(countries == null) {
      countries = await new country({country_id: '', country_name: '', calling_code: '', country_code:''}).getCountriesList();
    }
    let personalInfo = await setting.getPersonalSettingsInfo(applicantId);
    if (personalInfo.length > 0) {
      personalInfo[0].first_name = (personalInfo[0].first_name == "" || personalInfo[0].first_name === null || personalInfo[0].first_name === "null") ? "" : personalInfo[0].first_name;
      personalInfo[0].last_name = (personalInfo[0].last_name == "" || personalInfo[0].last_name === null || personalInfo[0].last_name === "null") ? "" : personalInfo[0].last_name;
      personalInfo[0].gender = (personalInfo[0].gender == "" || personalInfo[0].gender === null || personalInfo[0].gender === "null") ? "" : personalInfo[0].gender;
      personalInfo[0].region = (personalInfo[0].region == "" || personalInfo[0].region === null || personalInfo[0].region === "null") ? "" : personalInfo[0].region;
      personalInfo[0].postal_code = (personalInfo[0].postal_code == "" || personalInfo[0].postal_code === null || personalInfo[0].postal_code === "null") ? "" : personalInfo[0].postal_code;
      personalInfo[0].address_line1 = (personalInfo[0].address_line1 == "" || personalInfo[0].address_line1 === null || personalInfo[0].address_line1 === "null") ? "" : personalInfo[0].address_line1;
      personalInfo[0].address_line2 = (personalInfo[0].address_line2 == "" || personalInfo[0].address_line2 === null || personalInfo[0].address_line2 === "null") ? "" : personalInfo[0].address_line2;
      personalInfo[0].city = (personalInfo[0].city == "" || personalInfo[0].city === null || personalInfo[0].city === "null") ? "" : personalInfo[0].city;
      //creting address key to combine postal code, address_lane, city, country
      personalInfo[0]['address'] = personalInfo[0].postal_code + ',' + personalInfo[0].address_line1 + ',' + personalInfo[0].address_line2 + ',' + personalInfo[0].city + ',' + personalInfo[0].region + ',' + personalInfo[0].country_name;
      if (personalInfo[0].dob != "" && personalInfo[0].dob != null && personalInfo[0].dob != '0000-00-00') {
        const dob = personalInfo[0].dob;
        let [yyyy, mm, dd] = dob.split('-');
        personalInfo[0]['dob'] = `${dd}/${mm}/${yyyy}`;
      } else {
        personalInfo[0]['dob'] = ``;
      }
      personalInfo[0]['name'] = personalInfo[0].first_name + ' ' + personalInfo[0].last_name;
      personalInfo[0]['acl'] = (personalInfo[0].role_id == null || personalInfo[0].role_id == '') ? '' : ACL[(personalInfo[0].role_id) - 1];
      //personalInfo[0]['acl'] = ACL[0];
      personalInfo[0]['mobile'] = (personalInfo[0].mobile == "" || personalInfo[0].mobile === null || personalInfo[0].mobile === "null") ? "" : personalInfo[0].mobile;
      personalInfo[0]['place_of_birth'] = (personalInfo[0].place_of_birth == "" || personalInfo[0].place_of_birth === null || personalInfo[0].place_of_birth === "null") ? "" : personalInfo[0].place_of_birth;
      personalInfo[0]['nationality'] = (personalInfo[0].nationality == "" || personalInfo[0].nationality === null || personalInfo[0].nationality === "null") ? "" : personalInfo[0].nationality;
      response.send(ResponseHelper.buildSuccessResponse(personalInfo[0], langEngConfig.message.setting.data_found, STATUS.SUCCESS));
    } else {
      response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.no_personal_data, STATUS.FAILURE));
    }
  } catch (err) {
    logger.error('Error occured : ' + err);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}


/**
 * @desc This method used  to handle getBuinessProfile service
 * @method getBusinessProfile 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const getBusinessProfile = (request, response) => {
  logger.info('getBusinessProfile() called');
  __getBusinessData(request, response).then(businessData => {
    logger.info('getBusinessProfile() execution completed');
    return businessData;
  }).catch(err => {
    logger.error(`Something went wrong , While inserting payments details`);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.internalError)))
  });
}



/**
 * @desc This method used for getting business profile data
 * @method _getBusinessData1
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
const __getBusinessData1 = async (request, response) => {
  let applicantId = request.params.applicant_id;

  try {
    logger.info('getBusinessId() called');
    let businessIdRes = await setting.getBusinessId(applicantId);
    if (businessIdRes.length > 0) {
      let businessId = businessIdRes[0].business_id;
      logger.info('getBusinessProfile() called');
      let businessProfileRes = await setting.getBusinessProfile(businessId);
      logger.info('getBusinessAddress() called');
      let businessAddRes = await setting.getBusinessAddress(applicantId);
      logger.info('getBusinessStruct() called');
      let structOfBusi = await setting.getBusinessStruct(businessId);
      logger.info('__setBusinessProfile() called');
      let busiProfile = await __setBusinessProfile(businessProfileRes[0], businessAddRes, structOfBusi);

      response.send(ResponseHelper.buildSuccessResponse(busiProfile, langEngConfig.message.setting.businessProfileSucc, STATUS.SUCCESS))


    } else {
      logger.info('No registered business found');
      return response.send(ResponseHelper.buildSuccessResponse({
        businessIdRes
      }, langEngConfig.message.setting.businessNotFound, STATUS.FAILURE));
    }


  } catch (err) {
    logger.error('Error occured ' + err);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}

/**
 * @desc This method used for getting business profile data
 * @method __getBusinessData
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
const __getBusinessData = async (request, response) => {
  let applicantId = request.params.applicant_id;

  try {
    logger.info('getBusinessId() called');
    let businessIdRes = await setting.getBusinessId(applicantId);
    let busiProfile
    if (businessIdRes.length > 0) {
      let businessId = businessIdRes[0].business_id;
      logger.info('getBusinessProfile() called');
      let businessProfileRes = await setting.getBusinessProfile(businessId);
      if (businessProfileRes.length > 0) {
        logger.info('getBusinessAddress() called');
        let businessAddRes = await setting.getBusinessAddress(applicantId);
        if (businessAddRes.length > 0) {
          logger.info('getBusinessStruct() called');
          let structOfBusi = await setting.getBusinessStruct(businessId);
          if (structOfBusi.length > 0) {
            logger.info('__setBusinessProfile() called');
            busiProfile = await __setBusinessProfile(businessProfileRes[0], businessAddRes, structOfBusi);
          } else {
            logger.info('No registered business found');
            return response.send(ResponseHelper.buildSuccessResponse({

            }, langEngConfig.message.setting.businessProfileNotFound, STATUS.FAILURE));
          }

        } else {
          logger.info('No registered business found');
          return response.send(ResponseHelper.buildSuccessResponse({

          }, langEngConfig.message.setting.businessAddressNotFound, STATUS.FAILURE));
        }

      } else {
        logger.info('No registered business found');
        return response.send(ResponseHelper.buildSuccessResponse({

        }, langEngConfig.message.setting.businessProfileNotFound, STATUS.FAILURE));
      }

      response.send(ResponseHelper.buildSuccessResponse(busiProfile, langEngConfig.message.setting.businessProfileSucc, STATUS.SUCCESS))


    } else {
      logger.info('No registered business found');
      return response.send(ResponseHelper.buildSuccessResponse({
        businessIdRes
      }, langEngConfig.message.setting.businessNotFound, STATUS.FAILURE));
    }


  } catch (err) {
    logger.error('Error occured ' + err);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}


/**
 * @desc This method used for  creating business profile object
 * @method _setBusinessProfile 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
const __setBusinessProfile = async (profile, address, busiStruct) => {
  logger.info('__setBusinessProfile() called');
  //Business Address
  let businessAdrs = '';
  let operatingAdrs = '';
  let adrs = [];
  //Itterating objects
  for (let i = 0; i < address.length; i++) {
    if (address[i].address_type_id == 2 || address[i].address_type_id == 3) {
      adrs.push(address[i]);
    }
  }

  //Initializing the business and operating address
  
  for (let i = 0; i < adrs.length; i++) {
    if (adrs[i].address_type_id == 2) {
      businessAdrs = adrs[i].postal_code + ',' + adrs[i].address_line1 + ',' + adrs[i].city + ',' + adrs[i].region + ',' + adrs[i].country_name;
    } else {
      operatingAdrs = adrs[i].postal_code + ',' + adrs[i].address_line1 + ',' + adrs[i].city + ',' + adrs[i].region + ',' + adrs[i].country_name;
    }
  }

  //Structure of business
  let numOfDir = 0;
  let numOfOwn = 0;

  //Initializing number of directors ad business owners
  for (let i = 0; i < busiStruct.length; i++) {
    if (busiStruct[i].type == 'director') {
      numOfDir = busiStruct[i].total;
    } else {
      numOfOwn = busiStruct[i].total;
    }
  }

  //Creating response object
  let businessProfile = {
    incorporation: {
      country_of_incorporation: profile.country_name,
      legal_name: profile.business_legal_name,
      registration_number: profile.registration_number,
      date_of_incorporation: profile.incorporation_date,
      business_type: profile.business_type_name
    },
    business_profile: {
      trading_name: profile.trading_name,
      registered_address: businessAdrs,
      operating_address: operatingAdrs
    },
    nature_of_business: {
      business_sector: profile.business_sector_name,
      nature_of_business: profile.range_of_service,
      website: profile.website
    },
    structure_of_business: {
      num_of_directors: numOfDir,
      num_of_businessowners: numOfOwn,
      info: 'call /service/businessOwners/all with x-auth-token in headers to get the detail info.'
    }
  }

  logger.info('__setBusinessProfile() execution compelted');
  return businessProfile;

}


/**
 * @desc This method used for change password in setting profile
 * @method settingChangePass
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const settingChangePass = (request, response) => {
  logger.info('settingChangePass() initiated');
  __changePassword(request, response).then(changePassRes => {
    logger.info('settingChangePass() execution completed');
    return changePassRes;
  }).catch(err => {
    logger.error(`Something went wrong , While inserting payments details`);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.internalError)))
  });
}
/**
 * @desc This method used for change password in setting profile
 * @method __changePassword
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
const __changePassword = async (request, response) => {
  logger.info('__changePassword() initiated');
  let applicantId = request.params.applicant_id;
  let oldPass = request.body.old_password;
  let newPass = hashPassword.generate(request.body.new_password);
  try {
    logger.info('getPassWord called');
    let pass = await setting.getPassWord(applicantId);
    if (pass.length > 0) {
      let isValid = hashPassword.verify(oldPass, pass[0].password);
      if (isValid) {
        logger.info('getPassWord called');
        await setting.updatePass(newPass, applicantId);
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.passSucc, STATUS.SUCCESS));
      } else {
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.passMismatch, STATUS.FAILURE));
      }
    } else {
      response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.data_found, STATUS.FAILURE));
    }
  } catch (error) {
    logger.error('Error occured ' + err);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}


/**
 * @desc This method used for privacy marketing notifications
 * @method privacy
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const privacy = (request, response) => {
  logger.info('privacy() initiated');
  __privacyNotify(request, response).then(privacyNotifications => {
    logger.info('privacy() execution completed');
    return privacyNotifications;
  }).catch(err => {
    logger.error(`Something went wrong , While inserting payments details`);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.internalError)))
  });
}
/**
 * @desc This method used for privacy marketing notifications
 * @method __privacyNotify 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
const __privacyNotify = async (request, response) => {
  logger.info('__privacyNotify() intiated');

  let applicantId = request.params.applicant_id;
  let doEmailNotify = request.body.doEmailNotify;
  let doPushNotify = request.body.doPushNotify;
  let isVisible = request.body.isVisible;
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.send(ResponseHelper.buildSuccessResponse({}, errors.array()[0].msg, STATUS.FAILURE));
  }
  try {
    logger.info('updatePrivacy() intiated');
    let privacyNotify = await setting.updatePrivacy(doEmailNotify, doPushNotify, isVisible, applicantId);
    if (privacyNotify.affectedRows > 0) {
      logger.warn('privacyNotify length must be greater than zero');
      response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.privacySuccess, STATUS.SUCCESS));
    } else {
      logger.error('error while executing updatePrivacy()')
      response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.privacyFail, STATUS.FAILURE));
    }
  } catch (error) {
    logger.error('Error occured ');
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }

}


/**
 * @desc This method used for privacy marketing notifications
 * @method getPrivacy 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const getPrivacy = (request, response) => {
  logger.info('getPrivacy() initiated');
  __getprivacyNotifications(request, response).then(privacyNotification => {
    logger.info('getPrivacy() execution completed');
    return privacyNotification;
  }).catch(err => {
    logger.error(`Something went wrong , While inserting payments details`);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.internalError)))
  });
}
/**
 * @desc This method used for privacy marketing notifications
 * @method __getprivacyNotifications
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
const __getprivacyNotifications = async (request, response) => {
  logger.info('__getprivacyNotifications() intiated');
  let applicantId = request.params.applicant_id;
  try {
    let notifications = await setting.getPrivacyNotify(applicantId);
    if (notifications.length > 0) {
      logger.info('getting all the notifications in turn on default mode');
      response.send(ResponseHelper.buildSuccessResponse(notifications[0], langEngConfig.message.setting.getPrivacySuccess, STATUS.SUCCESS));
    } else {
      response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.getPrivacyFail, STATUS.FAILURE));
    }
  } catch (error) {
    logger.error('Error occured');
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}


/**
 * @desc This method used for Account activation  or deactivation in setting profile
 * @method accActivateOrDeactivate
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const accActivateOrDeactivate = (request, response) => {
  logger.info('accActivateOrDeactivate() initiated');
  __accActivateOrDeactivate(request, response).then(accStatusRes => {
    logger.info('accActivateOrDeactivate() execution completed');
    return accStatusRes;
  }).catch(err => {
    logger.error(`Something went wrong , While inserting payments details`);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.internalError)))
  });
}
const __accActivateOrDeactivate = async (request, response) => {
  let applicant_id = request.params.applicant_id;
  let status = request.body.status;
  let account_type = request.body.account_type;
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.send(ResponseHelper.buildSuccessResponse({}, errors.array()[0].msg, STATUS.FAILURE));
  }
  try {
    logger.info('__accActivateOrDeactivate() initiated');
    await setting.addAccountStatus(applicant_id, status, account_type);
    await setting.changeCounterpartyStatus(applicant_id);
    await setting.nullifydevicestatusandtoken(applicant_id);
    if (status == 0) {
      return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.deactiveStatus, STATUS.SUCCESS));
    } else {
      return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.activeStatus, STATUS.SUCCESS));
    }
  } catch (err) {
    logger.error('Error occured');
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}

/**
 * @desc This method used to support service/settings/editPersonalInfo
 * @method editPersonalProfile
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const editPersonalProfile = (request, response) => {
  logger.info('editPersonalInfo() called');
  __editPersonalData(request, response).then(editPersonalRes => {
    logger.info('editPersonalInfo() execution completed');
    return editPersonalRes;
  }).catch(err => {
    logger.error(`Something went wrong , While inserting payments details`);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.internalError)))
  });
}


/**
 * @desc This method used for update personal date in personal settings to support service/settings/editPersonalInfo
 * @method editPersonalData 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
const __editPersonalData = async (request, response) => {
  let applicantId = request.params.applicant_id;
  let first_name = request.body.first_name;
  let last_name = request.body.last_name;
  let dob;
  if (request.body.dob != "" && request.body.dob != null && request.body.dob != '0000-00-00') {
  let [dd, mm, yyyy] = request.body.dob.split('/');
    dob = `${yyyy}-${mm}-${dd}`;
  } else {
    dob = ``;
  }
  let place_of_birth = request.body.place_of_birth;
  let nationality = request.body.nationality;
  let address_line1 = request.body.address_line1;
  let address_line2 = request.body.address_line2;
  let city = request.body.city;
  let country_name = request.body.country_name;
  let postal_code = request.body.postal_code;
  let region = request.body.region;
  let town = request.body.town;

  const errors = await validationResult(request);

  if ((errors.errors.length == 0)) {
   // response.send(ResponseHelper.buildSuccessResponse({}, 'validated successfully', STATUS.SUCCESS));
   try {
    let personalInfo = await setting.getPersonalSettingsInfo(applicantId);
    let result = await setting.getTransactionNumber(applicantId);
    let reTriggerKyc = false;
    if (personalInfo.length > 0) {
      if(personalInfo[0].first_name != first_name || personalInfo[0].last_name != last_name || personalInfo[0].place_of_birth != place_of_birth ||
        personalInfo[0].nationality != nationality) {
        reTriggerKyc = true;
        let full_name = first_name + " " + last_name; 
        setting.updateCounterParty(full_name, applicantId);
        }
        let transactionNumber = result[0].kyc_transaction_id;
        let results = await kyc.getUserByApplicant(applicantId);

          if (results && results.length > 0) {
        let externalTransactionId = "Trans-" + Math.floor((Math.random() * 1000) + 4) + results[0].customerId;
        results[0]['first_name'] = first_name;
        results[0]['last_name'] = last_name;
        results[0]['birth_place'] = place_of_birth;
        let country = await setting.getCountryCode(nationality);
        results[0]['nationality'] = country[0].country_code;
        let identInfo = prepareKycPayload(results[0], externalTransactionId, process.env.CLIENT_ID);
     //   await _requestForIdentId(identInfo, applicantId, global.access_token, results[0], request, response)        
        let identityResponse = await _callIdentityService(identInfo, request, global.access_token, applicantId);
             if(identityResponse && identityResponse.data) {
              let identId = identityResponse.data ? identityResponse.data.id : ''
              let updateKycModel = {              
                "kyc_vendor_id": identityResponse.data['id'],             
                "transactionNumber": identInfo.data.externalTransactionId,
                "id": "",
                "applicantId": identInfo.data.applicant_id
              };
              let kycUpdate = await setting.updateKycDetails(updateKycModel)
              const statusResponse = await requestForKycStatus(identId, global.access_token, applicantId);
              if(statusResponse && statusResponse.data && statusResponse.data.status) {
                let identityStatus = statusResponse.data.status;
               await kyc.checkSuccessKyc(identityStatus, updateKycModel.transactionNumber);
              }
    let editPersonalInfo = await setting.editPersonalSettingsInfo(applicantId, first_name, last_name, dob, address_line1, city,
      country_name, postal_code, region, town, address_line2, place_of_birth, nationality);
    if (editPersonalInfo && editPersonalInfo.affectedRows > 0) {
      response.send(ResponseHelper.buildSuccessResponse({data: identityResponse.data, reTriggerKyc : reTriggerKyc}, langEngConfig.message.setting.update_personalSetting, STATUS.SUCCESS));
    } else {
     response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.update_personalSettingFail, STATUS.FAILURE));
    }
 }
 }
  
}
  } catch (err) {
    logger.error('Error occured : ' + err);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
  } else if (Object.keys(request.body).length > 10) {
    return response.send((ResponseHelper.buildSuccessResponse({}, 'JSON keys must be equal to 10', STATUS.FAILURE)))
  }
  
}


/**
 * @desc This method used change pin in setting profile
 * @method updatePasscode
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const updatePasscode = (request, response) => {
  logger.info('settingChangePin() initiated');
  __changePin(request, response).then(changePinRes => {
    logger.info('settingChangePin() execution completed');
    return changePinRes;
  }).catch(err => {
    logger.error(`Something went wrong , While inserting payments details`);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.internalError)))
  });
}
/**
 * @desc This method used change pin in setting profile
 * @method changePin
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
const __changePin = async (request, response) => {
  logger.info('__changePin() initiated');
  let applicantId = request.params.applicant_id;
  let oldPin = request.body.old_passcode;
  let newPin = hashPassword.generate(request.body.new_passcode);
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.send(ResponseHelper.buildSuccessResponse({}, errors.array()[0].msg, STATUS.FAILURE));
  }
  try {
    logger.info('getPin called');
    let passcode_pin = await setting.getPin(applicantId);
    if (passcode_pin.length > 0) {
      let isPinValid = hashPassword.verify(oldPin, passcode_pin[0].passcode_pin);
      if (isPinValid) {        
        logger.info('updatePin() called');
        await setting.updatePin(newPin, applicantId);
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.updatePin_success, STATUS.SUCCESS));
      } else {
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.pinMismatch, STATUS.FAILURE));
      }
    } else {
      response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.updatePin_fail, STATUS.FAILURE));
    }
  } catch (error) {
    logger.error('Error occured ');
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }

}


/**
 * @desc This method used for get user plans
 * @method plans
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const plans = (request, response) => {
  logger.info('plans() intiated');
  __getPlans(request, response).then(getPlansRes => {
    logger.info('getPlans() intiated');
    return getPlansRes;
  }).catch(err => {
    logger.error(`Something went wrong , While inserting payments details`);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.internalError)))
  });
}

const __getPlans = async (request, response) => {
  global.currencyList = ["BGN", "HRK", "CZK", "DKK", "EUR", "HUF", "PLN", "RON", "SEK", "GBP", "USD", "CHF", "ISK", "NOK"];

  global.obj = {};
  global.obj["features"] = [];
  global.localAmount = 0;
  global.internationalAmount = 0;
  global.localTransfersTotal = 0;
  global.internationalTransfersTotal = 0;
  global.rateTotal = 0;
  global.teamMembersTotal = 0;
  logger.info('getPlans() intiated');
  let applicantId = request.params.applicant_id;
  try {
    logger.info('getPlans() called');
    let plans = await setting.pricePlan(applicantId);
    for (let i = 0; i < plans.length; i++) {
      if (plans[i].plan_features == 'Team members') {
        let businessId = await setting.getBusinessId(applicantId)
        let getBusinessUsers = await setting.getUsers(businessId)
       await setting.updateAllowances(applicantId, plans[i].plan_id, getBusinessUsers[0].totalUsers)
        let planDetails = await setting.getPlans(plans[i].plan_id);
        if (getBusinessUsers[0].totalUsers > planDetails[0].free_allowances) {
          let tax = getBusinessUsers[0].totalUsers - planDetails[0].free_allowances;
          let teamMembersTotal = tax * EXTRAAMOUNT.TEAMMEMBERSEXTRAAMOUNT
          let feature_obj = {};
          feature_obj["free_allowances"] = planDetails[0].free_allowances;
          feature_obj["used_allowances"] = getBusinessUsers[0].totalUsers;
          feature_obj["spent"] = 'EUR ' + teamMembersTotal;
          feature_obj["plan_id"] = plans[i].plan_id;
          feature_obj["plan_features"] = plans[i].plan_features;
          feature_obj["description"] = 'EUR ' + planDetails[0].amount_charge + ' per user per month above free allowances';
          obj["features"].push(feature_obj);
        } else {
          let feature_obj = {};
          teamMembersTotal = 0;
          feature_obj["free_allowances"] = planDetails[0].free_allowances;
          feature_obj["used_allowances"] = getBusinessUsers[0].totalUsers;
          feature_obj["spent"] = 'EUR ' + teamMembersTotal;
          feature_obj["plan_id"] = plans[i].plan_id;
          feature_obj["plan_features"] = plans[i].plan_features;
          feature_obj["description"] = 'EUR ' + planDetails[0].amount_charge + ' per user per month above free allowances';
          obj["features"].push(feature_obj);
        }

      }

      if (plans[i].plan_features == 'Local transfers') {
        let localTransactions = await setting.transactionDetails(applicantId);
        await setting.updateAllowances(applicantId, plans[i].plan_id, localTransactions[0].totalTransactions)
        let localAmount = localTransactions[0].totalAmount;
        let planDetails = await setting.getPlans(plans[i].plan_id);
        if (localTransactions[0].totalTransactions > planDetails[0].free_allowances) {
          let tax = localTransactions[0].totalTransactions - planDetails[0].free_allowances;
        //  let localTransfersTotal = tax * EXTRAAMOUNT.LOCALTRANSFERSEXTRAAMOUNT;
          let feature_obj = {};
          feature_obj["free_allowances"] = planDetails[0].free_allowances;
          feature_obj["used_allowances"] = localTransactions[0].totalTransactions;
          feature_obj["spent"] = 'EUR ' + localAmount;
          feature_obj["plan_id"] = plans[i].plan_id;
          feature_obj["plan_features"] = plans[i].plan_features;
          feature_obj["description"] = 'EUR ' + planDetails[0].amount_charge + ' per transfer above free allowances';
          obj["features"].push(feature_obj);
        }
        else {
          let localTransfersTotal = 0;
          let feature_obj = {};
          feature_obj["free_allowances"] = planDetails[0].free_allowances;
          feature_obj["used_allowances"] = localTransactions[0].totalTransactions;
          feature_obj["spent"] = 'EUR ' + localTransfersTotal;
          feature_obj["plan_id"] = plans[i].plan_id;
          feature_obj["plan_features"] = plans[i].plan_features;
          feature_obj["description"] = 'EUR ' + planDetails[0].amount_charge + ' per transfer above free allowances';
          obj["features"].push(feature_obj);
        }
      }
      if (plans[i].plan_features == 'International transfers') {
        let internationalTransactions = await setting.getInternationalTransactions(applicantId)
      //  let updatedAllowances = await setting.updateAllowances(applicantId, plans[i].plan_id, internationalTransactions[0].totalTransactions)
        let internationalAmount = internationalTransactions[0].totalAmount;
        let planDetailsTotal = await setting.getPlans(plans[i].plan_id);
        if (internationalTransactions[0].totalTransactions > planDetailsTotal[0].free_allowances) {
          let tax = internationalTransactions[0].totalTransactions - planDetailsTotal[0].free_allowances;
        //  let internationalTransfersTotal = tax * EXTRAAMOUNT.INTERNATIONALTRANSFERSEXTRAAMOUNT;
          let feature_obj = {};
          feature_obj["free_allowances"] = planDetailsTotal[0].free_allowances;
          feature_obj["used_allowances"] = internationalTransactions[0].totalTransactions;
          feature_obj["spent"] = 'EUR ' + internationalAmount;
          feature_obj["plan_id"] = plans[i].plan_id;
          feature_obj["plan_features"] = plans[i].plan_features;
          feature_obj["description"] = planDetailsTotal[0].amount_charge + ' per transfer above free allowances';
          obj["features"].push(feature_obj);
        }
        else {
          internationalTransfersTotal = 0;
          let feature_obj = {};
          feature_obj["free_allowances"] = planDetailsTotal[0].free_allowances;
          feature_obj["used_allowances"] = internationalTransactions[0].totalTransactions;
          feature_obj["spent"] = 'EUR ' + internationalTransfersTotal;
          feature_obj["plan_id"] = plans[i].plan_id;
          feature_obj["plan_features"] = plans[i].plan_features;
          feature_obj["description"] = 'EUR ' + planDetailsTotal[0].amount_charge + ' per transfer above free allowances';
          obj["features"].push(feature_obj);
        }
      }
      if (plans[i].plan_features == 'FX at the real rate') {
        let rateAmount = localAmount + internationalAmount;
     //   let updatedAllowances = await setting.updateAllowances(applicantId, plans[i].plan_id, rateAmount)
        if (rateAmount > EXTRAAMOUNT.REALRATE) {
          let tax = rateAmount - EXTRAAMOUNT.REALRATE;
          let rateTotal = tax * RATEEXTRAAMOUNT;
          let spent = localTransfersTotal + internationalTransfersTotal + rateTotal;
          let feature_obj = {};
          feature_obj["free_allowances"] = plans[i].free_allowances;
          feature_obj["used_allowances"] = rateAmount;
          feature_obj["spent"] = 'EUR ' + spent;
          feature_obj["plan_id"] = plans[i].plan_id;
          feature_obj["plan_features"] = plans[i].plan_features;
          feature_obj["description"] = plans[i].amount_charge + '% markup on FX transfer above free allowances';
          obj["features"].push(feature_obj);
        } else {
          let feature_obj = {};
          let spent = 0;
          feature_obj["free_allowances"] = plans[i].free_allowances;
          feature_obj["used_allowances"] = rateAmount;
          feature_obj["spent"] = 'EUR ' + spent;
          feature_obj["plan_id"] = plans[i].plan_id;
          feature_obj["plan_features"] = plans[i].plan_features;
          feature_obj["description"] = plans[i].amount_charge + '% markup on FX transfer above free allowances';
          obj["features"].push(feature_obj);
        }
      }
    }
    if (plans.length > 0) {
      obj["plan_type"] = plans[0].plan_type;
      obj["plan_image"] = plans[0].plan_image;
      let endDate = plans[0].plan_endDate;
      let date = endDate.split(' ')[0];
      let formattedDate = dateformat(date, "fullDate");
      let dates = formattedDate.split(',')
      let dayFormatted = dates[1].split(' ');
      let month = dayFormatted[2] + ' ' + dayFormatted[1].slice(0, 3) + dates[2]
      obj["plan_endDate"] = 'Next payment on ' + month;
      obj["subscription"] = {
        "title": "Plan subscription",
        "Spent": 'EUR ' + plans[0].plan_subscription,
        "description": langEngConfig.message.setting.description
      };
      obj["total"] = {
        "footer": "Total spent so far this month",
        "total": 'EUR ' + (localTransfersTotal + internationalTransfersTotal + rateTotal + plans[0].plan_subscription)
      };
      logger.info('pricePlan() execution completed');
      response.send(ResponseHelper.buildSuccessResponse(obj, langEngConfig.message.setting.plan_success, STATUS.SUCCESS));
    }
    else {
      logger.info('fail to fetch user plans');
      response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.plan_fail, STATUS.FAILURE));
    }
  } catch (error) {
    logger.error('error while executing getPlans');
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}



/**
 * @desc This method used for insert plans
 * @method createPlans
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const createPlans = (request, response) => {
  logger.info('createPlans() intiated');
  __insertPlans(request, response).then(insertPlansRes => {
    logger.info('insertPlans() intiated');
    return insertPlansRes;
  }).catch(err => {
    logger.error(`Something went wrong , While inserting payments details`);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.internalError)))
  });
}

const __insertPlans = async (request, response) => {
  logger.info('insertPlans() intiated');
  let applicantId = request.params.applicant_id;
  let plan_id = request.body;
  try {
    logger.info('insertPlans() called');
    let dataResultSet = [];
    let planArr = [];
    for (let i = 0; i < plan_id.length; i++) {
      let planDetails = await setting.getPlans(plan_id[i].plan_id);
      if (planDetails.length > 0) {
        planArr.push(plan_id[i].plan_id);
      }
    }
    if (planArr.length == PLANCOUNT) {
      for (let j = 0; j < planArr.length; j++) {
        let plan = await setting.newPlan(applicantId, plan_id[j].plan_id);
        dataResultSet.push(plan);
      }
    }
    if (dataResultSet.length > 0) {
      logger.info('newPlan() execution completed');
      response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.newPlan_success, STATUS.SUCCESS));
    } else {
      logger.error('error while executing the newPlan()');
      response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.setting.newPlan_fail, STATUS.SUCCESS));
    }
  } catch (err) {
    logger.error('error while executing insertPlans() ');
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}