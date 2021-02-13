import {
  Kyc
} from '../model/kyc';
import {
  Applicant
} from '../model/applicant';
import {
  SETTING
} from '../model/personalSettings';
import {
  BusinessRegistration
} from '../model/businessRegistration';
import {
  UserModel
} from '../model/signUp';
import {
  langEngConfig
} from '../utility/lang_eng';
import {
  _callPepAutheticateService,
  _callIdentityService,
  requestForKycStatus
} from './museCommManager'


const kyc = new Kyc();
let setting = new SETTING();
const applicant = new Applicant();
const businessRegistration = new BusinessRegistration();
const userModel = new UserModel();

const STATUS = {
  FAILED: 1,
  SUCCESS: 0,
  VALID: 2,
  UN_AUTHORIZED: 403,
  UN_AUTHORIZED_TOKEN: 401,
  INVALID: 'INVALID_LOGIN_TOKEN'
};

const SANCTION = "Success"
const KYC_SUCCESS = ['SUCCESS', 'SUCCESSFUL', 'SUCCESS_DATA_CHANGED'] //,'OBJECT_NOT_FOUND', 'FRAUD_SUSPICION_CONFIRMED', 'REVIEW_PENDING', 'FRAUD_SUSPICION_PENDING', 'FINISH']

class ValidateKycData {
  constructor(kycRequest) {
    this.kycApplicantId = kycRequest.applicant_id;
  }
}

/**
 * This function is used to Initiate controller for triggering kyc identity 
 * @method createIdentity 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */

export const createIdentity = function (request, response) {
  logger.info('initialize createIdentity()');
  const validateKycData = new ValidateKycData(request.body);
  let applicant_id = validateKycData.kycApplicantId ? validateKycData.kycApplicantId : request.params.applicant_id;
  logger.info('Proceed for _fetchUserKycDetails()');
  return _fetchUserKycDetails(applicant_id, global.access_token, request, response);
}

/**
 * This function is used to fetching kyc related information based on the applicantId
 * @method _fetchUserKycDetails 
 * @param {Integer} applicant_id - Used for fetching user details for identity
 * @param {Object}  req - It is Request object
 * @param {Object}  res - It is Response object
 */



const _fetchUserKycDetails = (applicant_id, access_token, req, res) => {
  logger.info('Initiated _fetchUserKycDetails() for applicantId', applicant_id);
  let applicantDetail;

  // 1. Check if the applicant exists
  applicant.getApplicantById(applicant_id).then(data => {
    applicantDetail = data[0];
    if(applicantDetail == null) {
      res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.signUp.applicant_notFound, STATUS.FAILED));
    }
  }).catch(err => {
    logger.error(err);
    res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.signUp.applicant_notFound, STATUS.FAILED));
  });

  // 2. Check if the account type if "Business"
  if (_.toLower(req.body.account_type) == "business" && applicant_id) {
    logger.info("getBusinessId() Business flow")
    let identInfo;
    businessRegistration.getContactId(applicant_id).then(result => {
      if (_.size(result) > 0) {
        kyc.getIndividualApplicant(result[0].contact_id).then(results => {
          if (results.length > 0) {
            userModel.getApplicantContact(results[0].applicant_id)
              .then(contact => {
                logger.info('getApplicantContact() success');
                if (contact[0] && contact[0].applicant_id && _.size(contact) > 0) {
                  kyc.getUserByApplicant(contact[0].applicant_id).then(results => {
                    if (results.length > 0) {
                      logger.info('Successfully fetched getUserByApplicant()');
                      let externalTransactionId = "Trans-" + Math.floor((Math.random() * 1000) + 4) + results[0].customerId;
                      setting.getCountryCode(results[0].nationality).then(country => {
                        results[0]['nationality'] = country[0].country_code;
                        identInfo = prepareKycPayload(results[0], externalTransactionId, process.env.CLIENT_ID);
                                           
                      
                      kyc.checkUser(results[0].applicant_id).then(response => {
                        if (!response.res[0].TransactionNumber || !response.res[0].id) {
                          logger.info("Requesting for IdentId as there is no transaction number")
                          return _requestForIdentId(identInfo, applicant_id, access_token, results[0], req, res)
                        } else {
                          if (response.res[0].kyc_status == "SUCCESS" || response.res[0].kyc_status == "SUCCESSFUL_WITH_CHANGES") {
                            logger.info("Status is Success so, identid is not called")
                            res.send(ResponseHelper.buildSuccessResponse(response.res[0], langEngConfig.message.ident.success, STATUS.FAILED))
                          } else if (response.res[0].kyc_status.includes("PENDING") || response.res[0].kyc_status.includes("FRAUD_SUSPICION")) {
                            logger.info("Status is pending or fraud so, identid is not called")
                            res.send(ResponseHelper.buildSuccessResponse(response.res[0], langEngConfig.message.ident.kycInProcess, STATUS.FAILED))
                          } else {
                            logger.info("Requesting for identId")
                            return _requestForIdentId(identInfo, applicant_id, access_token, results[0], req, res)
                          }
                        }
                      }).catch(err => {
                        logger.error(err)
                        res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.ident.userNotFound)));
                      });
                    }).catch(err => {
                      logger.error(err)
                      res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.ident.userNotFound)));
                    }); 
                    } else {
                      res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.ident.noDataError)));
                    }
                  }).catch(err => {
                    logger.error(err);
                    res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.ident.internalError)));
                  })
                } else {
                  res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.signUp.applicant_notFound, STATUS.FAILED));
                }
              }).catch(err => {
                logger.error(err);
                res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.signUp.contactError)));
              })
          } else {
            res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.businessdetails.applicant_notFound, STATUS.FAILED));
          }
        }).catch(error => {
          logger.error(error)
          res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
        })
      } else {
        logger.info('Business Id not found');
        res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.businessdetails.businessId_notFound, STATUS.FAILED));
      }
    }).catch(error => {
      logger.error(error)
      res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    })
  } else { // KYC for personal
    let identInfo;
    kyc.getUserByApplicant(applicant_id).then(results => {
      if (results.length > 0) {
        logger.info('Successfully fetched getUserByApplicant()');
        let externalTransactionId = "Trans-" + Math.floor((Math.random() * 1000) + 4) + results[0].customerId;
        setting.getCountryCode(results[0].nationality).then(country => {
          if(country && country.length > 0) {
            console.log("country", country);
          results[0]['nationality'] = country[0].country_code;
          identInfo = prepareKycPayload(results[0], externalTransactionId, process.env.CLIENT_ID);
          }
        
        console.log("results[0]", results[0]);       
        kyc.checkUser(results[0].applicant_id).then(response => {
          if (!response.res[0].TransactionNumber || !response.res[0].id) {
            logger.info("Requesting for IdentId as there is no transaction number")
            return _requestForIdentId(identInfo, applicant_id, access_token, results[0], req, res)
          } else {
            if (response.res[0].kyc_status == "SUCCESS" || response.res[0].kyc_status == "SUCCESSFUL_WITH_CHANGES") {
              logger.info("Status is Success so, identid is not called")
              res.send(ResponseHelper.buildSuccessResponse(response.res[0], langEngConfig.message.ident.success, STATUS.FAILED))
            } else if (response.res[0].kyc_status.includes("PENDING") || response.res[0].kyc_status.includes("FRAUD_SUSPICION")) {
              logger.info("Status is pending or fraud so, identid is not called")
              res.send(ResponseHelper.buildSuccessResponse(response.res[0], langEngConfig.message.ident.kycInProcess, STATUS.FAILED))
            } else {
              logger.info("Requesting for identId")
              return _requestForIdentId(identInfo, applicant_id, access_token, results[0], req, res)
            }
          }
        }).catch(err => {
          logger.error('Something went wrong , While verifying user')
          res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.ident.userNotFound)));
        });
      }).catch(err => {
        logger.error(err)
        res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.ident.userNotFound)));
      });
      } else {
        logger.debug('User not found')
        res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.ident.noDataError)));
      }
    }).catch(err => {
      res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.ident.internalError)));
    })
  }
}

/**
 * This function is used to request identity and update status of application user
 * @method _requestForIdentId 
 * @param {Object} identObj - Used for request identity with ident data .
 * @param {Object} kycInfo - Used for update kyc details
 * @param {Object}  res - It is Response object
 * @param {Object}  access_token - Used for access_token
 */

export let _requestForIdentId = async (identObj, applicantId, access_token, identInfo, req, res) => {
  logger.info("Process:: _requestForIdentId for applicantId", applicantId);
  let response = await _callIdentityService(identObj, req, access_token, applicantId);
  if (response && !response.error) {
    // get the updated status from idnow
    let identId = response.data ? response.data.id : ''
    const statusResponse = await requestForKycStatus(identId, global.access_token, applicantId);
    console.log("statusResponse",statusResponse);
    response.data['kyc_status'] = statusResponse;
    await callPepAuthServiceAndUpdateKyc(response, identObj, req, res, identInfo);
  } else {
    res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.serverResponseError)));
  }
}

export let callPepAuthServiceAndUpdateKyc = async (response, identObj, req, res, identInfo) => {
  response.data['transactionId'] = identObj.data.externalTransactionId;
  response.data['sepaKycEnvironment'] = process.env.SEPA_KYC_ENVIRONMENT
  let pepPayload = preparePepPayload(identInfo, process.env.CLIENT_ID);
  let pepResponse = await _callPepAutheticateService(pepPayload, req, global.access_token, identObj.data.applicant_id)
  if (pepResponse && !pepResponse.error) {
    let updateKycModel = {
      "sanctions_status": pepResponse.data.SIS,
      "kyc_vendor_id": response.data['id'],
      "pep_status": pepResponse.data.PEP,
      "transactionNumber": response.data['transactionId'],
      "id": "",
      "applicantId": identObj.data.applicant_id
    };
    let results = await kyc.updateKycDetails(updateKycModel)
    let identityStatus = 'NOT_INITIATED';
      if (_.size(results) > 0) {
        if(response.data && response.data.kyc_status) {
        identityStatus = response.data.kyc_status.data ? response.data.kyc_status.data.status : 'NOT_INITIATED';
        }
        await kyc.checkSuccessKyc(identityStatus, updateKycModel.transactionNumber)
        res.send(ResponseHelper.buildSuccessResponse(response.data, langEngConfig.message.ident.successIdent, STATUS.SUCCESS))
      }
    // }, err => {
    //   logger.error(err)
    //   res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.ident.internalError)));
    // })
  } else {
    res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.serverResponseError)));
  }
}

/**
 * This function is used prepare payload  for trigger kyc
 * @method prepareKycPayload
 * @param {Object} user - userInfo
 * @param {Object} applicant - applicantInfo
 */


export function prepareKycPayload(user, external_transaction_id, member_id) {
  let birthDate = (user.dob).slice(0, 10);
  let payload = {
    "memberId": member_id,
    "type": "creditcard",
    "data": {
      "externalTransactionId": external_transaction_id,
      "birth_date": birthDate,
      "birth_place": user.place_of_birth,
      "city": user.city,
      "code": (user.country_name != 'UK') ? user.country_name : 'GB',
      "customer_id": user.customerId,
      "first_name": user.first_name,
      "email": user.email,
      "last_name": user.last_name,
      "gender": user.gender,
      "mobile_number": user.mobile,
      "nationality": user.nationality,
      "street": user.address_line1,
      "street_number": user.address_line1,
      "zip": user.postal_code,
      "applicant_id": user.applicant_id
    }
  }
  return payload;
}

/**
 * This function is used prepare payload  for PeP
 * @method preparePepPayload
 * @param {Object} user - userInfo
 * @param {Object} member_id - memberId
 */

function preparePepPayload(user, member_id) {
  let dateObj = new Date(user.dob);
  let name = user.first_name + " " + user.last_name;
  let payload = {
    "memberId": member_id,
    "data": {
      "name": name,
      "dayOfBirth": dateObj.getDate(),
      "monthOfBirth": dateObj.getMonth(),
      "yearOfBirth": dateObj.getFullYear()
    }
  }
  return payload;
}