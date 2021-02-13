/**
 * @kyc Controller
 * @description It will get kyc (IDNow) status of a user.
 * @fires It serves status for the PayVoo user from IdNow.
 * @author SEPA Cyber Technologies , Satyanarayana G .
 */


import {
  Kyc
} from '../model/kyc';
import {
  Utils
} from '../utility/utils';
import {
  sendKycStatus
} from '../mailer/mail';
import {
  langEngConfig
} from '../utility/lang_eng';
import {
  requestForKycStatus
} from './museCommManager'
import {
  MoneyTransfer
} from '../model/moneyTransfer';
import {
  payNewlyRegisteredUserWithNonPayvooPayments
} from './moneyTransfer';


// var AsyncLock = require('async-lock');
// var lock = new AsyncLock()


const kyc = new Kyc();

const STATUS = {
  FAILED: 1,
  SUCCESS: 0,
  VALID: 2
};

const KYC_SUCCESS_STATUS = ['SUCCESS', 'SUCCESSFUL_WITH_CHANGES'];
const KYC_INITIAL_STATUS = 'NOT_INITIATED';

class ValidateKycData {
  constructor(kycRequest) {
    this.kycApplicantId = kycRequest.applicant_id;
    this.applicantId = kycRequest.id;
  }
  /**
   * @function isValidKYCRequest
   * @desc this function is to validate user kycApplicantId
   * @param None
   * @return True if request is valid kycApplicantId. False if request is invalid
   * 
   */
  isValidKYCRequest() {
    if (Utils.isEmptyObject(this.kycApplicantId)) {
      return true;
    }
    return false;
  }
}

/**
 * @desc This function is used to triggering kyc status
 * @method kycCurrentStatus 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
export const kycCurrentStatus = async (request, response) => {
  logger.info('initialize kycCurrentStatus()');
  if (request.body && request.body.identityId) {
    try {
      let result = await kyc.getBusinessKycApplicant(request.body.identityId)
      if (_.size(result) > 0) {
        return await _fetchUserDetails(result[0].applicant_id, request, response);
      }
    } catch (error) {
      logger.error('getbusiness applicant  error')
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    }
  } else {
    return await _fetchUserDetails(request.params.applicant_id, request, response);
  }
}
/**
 * @desc This function is used to triggering kyc status
 * @method kycShareholderStatus  
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
export const kycShareholderStatus = async (request, response) => {
  logger.info('initialize kycCurrentStatus()');
  if (request.params && request.params.id) {
    try {
      let result = await kyc.getBusinessKycApplicant(request.params.id)
      if (_.size(result) > 0) {
        return await _fetchUserDetails(result[0].applicant_id, request, response);
      }
    } catch (error) {
      logger.error('getbusiness applicant  error')
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    }
  } else {
    return await _fetchUserDetails(request.params.applicant_id, request, response);
  }
}


/**
 * @desc This function is used to sending email && mobile messages for kyc status
 * @method notifyKycStatus 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
export const notifyKycStatus = function (request, response) {
  logger.info('initialize notifyKycStatus()');
  return _notifyKycStatus(request.params.email, request.params.mobileNumber, request.params.status, response);
}


/**
 * @desc This function is used to verify kyc with applicantId
 * @method verifyKyc 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
export const verifyKyc = function (request, response) {
  logger.info('initialize verifyKyc()');
  const validateKycData = new ValidateKycData(request.params);
  logger.info('Procced for _verifyKyc()');
  return _verifyKyc(validateKycData.kycApplicantId, response);
}

/**
 * @desc This function is used to update the kyc status with respect to identity verification
 * @method updateKycStatus 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */

export const updateKycStatus = function (request, response) {
  logger.info('initialize updateKycStatus()');
  const validateKycData = new ValidateKycData(request.params);
  logger.info('Procced for updateKycStatus()');
  return _updateKycStatus(validateKycData.kycApplicantId, request, response);
}


/**
 * @desc This function is used to update kyc status
 * @method _updateKycStatus 
 * @param {Integer} applicant_id - Used for fetching user details 
 * @param {Object}  req - It is Request object
 * @param {Object}  res - It is Response object
 * @return
 */

const _updateKycStatus = (applicant_id, req, res) => {
  let kycObject = {};
  kycObject.applicantId = applicant_id;
  kycObject.transactionNumber = req.body.transactionNumber;
  kycObject.id = req.body.identId;
  kycObject.status = req.body.status;
  return kyc.updateKycStatus(kycObject).then(results => {
    if (results.affectedRows) {
      logger.info('kyc status updated')
      res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.kyc.updateSuccess, STATUS.SUCCESS))
    } else {
      logger.error('Identity response failure , while updating')
      res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.kyc.updateFail, STATUS.FAILED))
    }
  }).catch(err => {
    logger.error('Identity response failure , while updating')
    res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.kyc.updateFail, STATUS.FAILED))
  })
}



/**
 * @desc This function is used to fetch user details for kyc
 * @method _fetchUserDetails 
 * @param {Integer} applicant_id - Used for fetching user details 
 * @param {Object}  req - It is Request object
 * @param {Object}  res - It is Response object
 * @return
 */

const _fetchUserDetails = async (applicant_id, req, res) => {
  logger.info('initiated _fetchUserDetails()');
  try {
    let transaction_time = req.body.transaction_time;
    let results = await kyc.getKycByApplicant(applicant_id)
    if (results && results.length > 0) {
      let applicantId = results[0].applicant_id,
        transactionNumber = results[0].kyc_transaction_id,
        identId = results[0].kyc_vendor_id,
        kycCurrentStatus = results[0].kyc_status,
        mobile = results[0].mobile,
        email = results[0].email,
        token = global.access_token

      if (!KYC_SUCCESS_STATUS.includes(kycCurrentStatus)) {
        if (transactionNumber) {
          logger.info('proceed for kyc if transation no exist');

          console.log("Taking out lock from here");
     //     lock.acquire(applicant_id, async function () {
      //      console.log("Lock acquired by applicant_id " + applicant_id + " ");
            let response = await _processKycStatus(applicantId,kycCurrentStatus, 1)
            console.log("Lock acquired by applicant_id " + applicant_id + " response of proceed kyc status ", response);
            if (response) {
              res.send(response);
            } else {
              res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.internalError)));
            }
          // }, async function (err, ret) {
          //   console.log("Lock released by on applicant [", applicant_id + "]");
          //   console.log(applicant_id + " Freeing lock", ret)
          // }, {})
        } else {
          res.send(ResponseHelper.buildSuccessResponse({
            'kyc_status': 'NOT_INITIATED'
          }, langEngConfig.message.kyc.statusMessage, STATUS.SUCCESS))
        }
      } else {
        await payNewlyRegisteredUserWithNonPayvooPayments(email, applicant_id, mobile, transaction_time);
        res.send(ResponseHelper.buildSuccessResponse({
          'kyc_status': kycCurrentStatus
        }, langEngConfig.message.kyc.statusMessage, STATUS.SUCCESS))
      }
    } else {
      logger.debug('No kyc data found with applicant id');
      res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.noDataError)));
    }
  } catch (error) {
    logger.error('Somthing went wrong while getting response ---2222' + error);
    res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.serverResponseError)));
  }
}


/**
 * @desc This function is used to handle kyc status success response from museService 
 * @method kycStatusSuccess 
 * @param {String} email - It is used for sending email notifications using smtp
 * @param {String} mobile - It is used for sending mobile notifications using mobica
 * @param {String} identityStatus - It is used for reference to status of applicant
 * @param {Object} identityReason - It is used for reference to identityReason for identityStatus
 * @return 
 */
export const kycStatusSuccess = async (applicant_id, email, mobile, identityStatus, transactionNumber, token) => {
  logger.info('Storing kyc success response in the database for applicantId',applicant_id);
//  return new Promise(async (resolve, reject) => {
    try {
      let result = await kyc.checkSuccessKyc(identityStatus, transactionNumber)
      if (result) {
        logger.info('Updated kyc status in the database for applicantId',applicant_id);
        try {          
          let emailResponse = await sendKycStatus(email, mobile, `${identityStatus}`, true, token, applicant_id)
          if(emailResponse) {
          logger.info('Sent email and otp on kyc Success for applicantId', applicant_id);
          return ("Success");
          }
        } catch (err) {
          console.log("Exception in sendKycStatus ***" + err)
          return (err)
        }
      }
    } catch (err) {
      logger.info('Return kyc success response , But failure ');
      reject(langEngConfig.message.kyc.dbError)
    }
  // }).catch(err => {
  //   console.log(err);
  //   reject(langEngConfig.message.kyc.dbError)
  // })
}


/**
 * @desc This function is used to handle kyc status failure response from museService 
 * @method kycStatusError 
 * @param {String}  email - It is used for sending email notifications using smtp
 * @param {Integer} applicantId  - It is used for sending email notifications using smtp
 * @param {String}  mobile - It is used for sending mobile notifications using mobica
 * @param {Array}   identityError - It is used for reference to status of applicant while identityError
 * @return
 */
const kycStatusError = function (email, mobile, applicantId, identityError) {
  logger.info('Capturing kyc error response');
  return new Promise((resolve, reject) => {
    if ((typeof identityError[0].cause === 'string' || identityError[0].cause instanceof String) && (identityError[0].cause).includes('FRAUD_SUSPICION')) {
      logger.info('Sending emil in kyc implementation Fail');

    }
    let messageData = identityError[0].cause;
    kyc.checkFailureKyc(messageData, applicantId).then((results, err) => {
      if (!err && results) {
        logger.info('Return kyc fail response');
        resolve(ResponseHelper.buildSuccessResponse({
          'serverResponse': identityError
        }, `${(identityError[0].cause == 'OBJECT_NOT_FOUND') ? identityError[0].cause : langEngConfig.message.kyc.apiError}`, STATUS.VALID))
      } else {
        logger.info('Return kyc fail response');
        resolve(ResponseHelper.buildSuccessResponse({
          kyc_status: langEngConfig.message.kyc.noDataError
        }, langEngConfig.message.kyc.noDataError, STATUS.FAILED))
      }
    }).catch(err => {
      reject(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.internalError)))
    })
  });
}

/**
 * @desc This function is used to check kyc with applicantId
 * @method _verifyKyc 
 * @param {Integer} applicantId  - It is used for getting applicant kyc status
 * @param {Object}  res - It is response object
 * @return
 */
const _verifyKyc = function (applicantId, res) {
  logger.info(`Initiated _checkPayVooKyc`);
  kyc.checkPayVooKycStatus(applicantId)
    .then((results, err) => {
      if (!err && results.length == 0) {
        logger.debug(`No records found with applicantId`);
        res.send(ResponseHelper.buildSuccessResponse({
          'kyc_status': langEngConfig.message.kyc.noDataError
        }, langEngConfig.message.kyc.noDataError, STATUS.SUCCESS))
      } else {
        logger.info(`successfully return kyc details`);
        res.send(ResponseHelper.buildSuccessResponse({
          'kyc_status': results[0].kyc_status
        }, langEngConfig.message.kyc.successKyc, STATUS.SUCCESS))
      }
    })
    .catch(err => {
      logger.error(`successfully return kyc details`);
      res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.internalError)))
    });
}

/**
 * @desc This function is used to sending email && mobile messages for kyc status
 * @method _notifyKycStatus 
 * @param {String}  email - It is used for sending email notifications using smtp
 * @param {String}  mobile - It is used for sending mobile notifications using mobica
 * @param {String}  status  - It is used for sending kyc status
 * @param {Object}  res - It is response Object
 * @return
 */
const _notifyKycStatus = function (email, mobile, status, res) {
  logger.info(`Initiated sendKycStatus`);
  sendKycStatus(email, mobile, ` ${status}`, false, token).then((data) => {
    res.send(ResponseHelper.buildSuccessResponse({}, data.message, STATUS.SUCCESS))
  }).catch((error) => {
    res.send(ResponseHelper.buildSuccessResponse({}, error.message, STATUS.FAILED))
  }).catch((error) => {
    logger.error(`Sending kyc status failure at sendKycStatus`);
    res.send(ResponseHelper.buildFailureResponse(new Error(`${error.message ? error.message : langEngConfig.message.notification.internalError}`)))
  });
}

/**
 * @desc This function is used to sending email && mobile messages for kyc status
 * @method kycShareholderStatusSuccess 
 * @param {String}  email - It is used for sending email notifications using smtp
 * @param {String}  mobile - It is used for sending mobile notifications using mobica
 * @param {number} applicantId - It contains applicant id
 * @param {String}  identityStatus  - It is used for sending kyc status
 * @param {number}  transactionNumber- It is used for sending transaction number
 * @param {number}  token- It isused for sending token
 * @return
 */
const kycShareholderStatusSuccess = function (applicant_id, email, mobile, identityStatus, transactionNumber, token) {
  logger.info('Capturing kyc success response');
  return new Promise((resolve, reject) => {
    kyc.getIndividualApplicantBusinessId(applicant_id).then(results => {
      if (results.length > 0 || results.length == 0) {
        kyc.checkSuccessKyc(identityStatus, transactionNumber).then((result, err) => {
          if (!err && identityStatus == 'CANCELED') {
            logger.info('Return kyc success response');
            logger.info('Sending emil in kyc implementation Success');
            resolve(ResponseHelper.buildSuccessResponse({
              'kyc_status': identityStatus,
              'reason': identityReason
            }, `${langEngConfig.message.kyc.pending}${identityStatus}`, STATUS.SUCCESS))
          }
          if (!err) {
            logger.info('Return kyc success response');
            logger.info('Sending email in kyc implementation Success');
            sendKycStatus(email, mobile, ` ${identityStatus}`, true, token).then(message => {
              resolve(ResponseHelper.buildSuccessResponse({
                'kyc_status': identityStatus
              }, `${langEngConfig.message.kyc.pending}${identityStatus}`, STATUS.SUCCESS))
            }).catch(err => {
              reject(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.internalError)))
            })
          }
          if (err) {
            logger.info('Return kyc success response , But failure ');
            reject(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.operationError)))
          }
        }).catch(err => {
          reject(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.internalError)))
        })
      }
    }).catch(err => {
      reject(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.dashboardError)))
    })
  });
}

/**
 * @desc This function is used to sending email && mobile messages for kyc status
 * @method kycShareholderStatusSuccess 
 * @param {String}  email - It is used for sending email notifications using smtp
 * @param {String}  mobile - It is used for sending mobile notifications using mobica
 * @param {number} applicantId - It contains applicant id
 * @param {String}  identityError  - It is used for sending kyc status
 * @return
 */
const kycShareholderStatusError = function (email, mobile, applicantId, identityError) {
  logger.info('Capturing kyc error response');
  return new Promise((resolve, reject) => {
    if ((typeof identityError[0].cause === 'string' || identityError[0].cause instanceof String) && (identityError[0].cause).includes('FRAUD_SUSPICION')) {
      logger.info('Sending emil in kyc implementation Fail');
      //sendKycStatus(email, mobile, `${langEngConfig.message.email.messageFraud} `, false).then((message) => { }, (error) => { })
    }
    let messageData = identityError[0].cause;
    kyc.checkFailureKyc(messageData, applicantId).then((results, err) => {
      if (!err && results) {
        logger.info('Return kyc fail response');
        resolve(ResponseHelper.buildSuccessResponse({
          'serverResponse': identityError
        }, `${(identityError[0].cause == 'OBJECT_NOT_FOUND') ? identityError[0].cause : langEngConfig.message.kyc.apiError}`, STATUS.VALID))
      } else {
        logger.info('Return kyc fail response');
        resolve(ResponseHelper.buildSuccessResponse({
          kyc_status: langEngConfig.message.kyc.noDataError
        }, langEngConfig.message.kyc.noDataError, STATUS.FAILED))
      }
    }).catch(err => {
      reject(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.internalError)))
    })
  });
}





/**
 * @desc This function is used to process kycStatus of a given user based on a given set of parameters
 * @method _processKycStatus  
 * @param {String}  email - It is used for sending email notifications using smtp
 * @param {String}  mobile - It is used for sending mobile notifications using mobica
 * @param {number} applicantId - It contains applicant id
 * @param {String} kyc_currentStatus - It is used for sending kyc status
 *  @param {number}  transactionNumber- It is used for sending transaction number
 * @param {number}  token- It isused for sending token
 * @return
 */
export let _processKycStatus = async (applicant_id,kyc_currentStatus, who) => {

  let applicantId, transactionNumber, identId, mobile, email, token, results, kyc_status;
  console.log("***** _processKycStatus by who [" + who + "] on applicant_id [" + applicant_id + "]");

  try {

    results = await kyc.getKycByApplicant(applicant_id)
    if (results.length > 0) {
      applicantId = results[0].applicant_id,
        transactionNumber = results[0].kyc_transaction_id,
        identId = results[0].kyc_vendor_id,     
        mobile = results[0].mobile,
        email = results[0].email,
        token = global.access_token
    } else {
      console.log("***** Here ")
    }

  } catch (error) {
    console.log("***** getKycByApplicant" + error)
  }
  let response;
  try {
    if (identId) {
      response = await requestForKycStatus(identId, global.access_token, applicantId);
    } else {
      return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.internalKYCError))
    }
  } catch (error) {
    return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.serverResponseError))
  }

  if (response && response.data) {
    if (response.data && (response.data.status || response.data.kyc_status)) {
      console.log("response.data", response.data);
      kyc_status = response.data.status ? response.data.status : response.data.kyc_status;
    } else if (response.data && (response.data.identificationprocess && response.data.identificationprocess.result)) {
      kyc_status = response.data.identificationprocess.result
    }
  } else {
    logger.info('Something went wrong while getting response - 1111, applicant_id' + applicant_id);
    return (ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.serverResponseError)));
  }

  console.log("applicant_id " + applicant_id + " processKycStatus by who [" + who + "] kyc_currentStatus [" + kyc_currentStatus + "] kyc_status [" + kyc_status + "]")

  
  if((kyc_currentStatus == "CHECK_PENDING" || kyc_currentStatus == "PENDING") && kyc_status == "FRAUD_SUSPICION") {
    kyc_status = kyc_currentStatus
  }
  if((kyc_currentStatus == "CHECK_PENDING" || kyc_currentStatus == "PENDING") && kyc_status == "NOT_FOUND") {
    kyc_status = kyc_currentStatus
  }
  if (kyc_currentStatus != kyc_status) {

    logger.info("STATUS Change from Current Status [" + kyc_currentStatus + "] to New Status [" + kyc_status + "]"+ "applicantId"+ applicant_id);
    
    try {
      let kycResponse = await kycStatusSuccess(applicant_id, email, mobile, kyc_status, transactionNumber, global.access_token)
      if (kycResponse == "Success") {
        kyc_currentStatus = kyc_status
      }
    } catch (err) {
      return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.internalError))
    }
  }

  if (kyc_currentStatus == "SUCCESS" || kyc_currentStatus == "SUCCESSFUL_WITH_CHANGES") {
    await payNewlyRegisteredUserWithNonPayvooPayments(email, applicant_id, mobile, transaction_time);
    return (ResponseHelper.buildSuccessResponse({
      'kyc_status': kyc_currentStatus
    }, `${langEngConfig.message.kyc.successStatus}`, STATUS.SUCCESS));
  } else if (kyc_currentStatus.includes("PENDING") || kyc_currentStatus.includes("FRAUD_SUSPICION")) {
    kyc_currentStatus = "PENDING";
    return (ResponseHelper.buildSuccessResponse({
      'kyc_status': kyc_currentStatus
    }, `${langEngConfig.message.kyc.pending}`, STATUS.SUCCESS));
  } else if (kyc_currentStatus.includes("ABORTED")) {
    return (ResponseHelper.buildSuccessResponse({
      'kyc_status': kyc_currentStatus
    }, `${langEngConfig.message.kyc.abort}`, STATUS.SUCCESS));
  } else if (kyc_currentStatus.includes("NOT_FOUND")) {
    return (ResponseHelper.buildSuccessResponse({
      'kyc_status': kyc_currentStatus
    }, `${langEngConfig.message.kyc.abort}`, STATUS.SUCCESS));
  } else {
    return (ResponseHelper.buildSuccessResponse({
      'kyc_status': kyc_currentStatus
    }, `${langEngConfig.message.kyc.failedStatus}`, STATUS.SUCCESS));
  } 
}