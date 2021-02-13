/**
 * account Controller
 * account Controller is used for creating multy currency account.
 * @package account
 * @subpackage controller/account
 *  @author SEPA Cyber Technologies, krishnakanth.r, Sekhara suman sahu
 */

"use strict";

import {
  Account
} from '../model/account';
import {
  langEngConfig
} from '../utility/lang_eng'
let account = new Account();

const STATUS = {
  SUCCESS: 0,
  FAILURE: 1,
  DEACTIVE: 2
};


//Class for user currency account
export class UserAccountDetails {
  constructor() {}
}

/**
 * @desc Method for creating new currency account.
 * @method createAccount 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */
export const createAccount = (request, response) => {
  logger.info('createAccount() initiated');
  let applicantId = request.params.applicant_id;
  let currencyAccount = request.body.currency;
  logger.info('isCurrencyAccountExist() called');
  //check wheather the user already has the same currency account?
  account.isCurrencyAccountExist(currencyAccount, applicantId).then(isExistAccountRes => {

      if (isExistAccountRes.length == 0) {
        //If currency account does not exist, Create new one.
        account.createCurrencyAccount(currencyAccount, applicantId).then(result => {
            logger.info('createAccount() execution completed');
            response.send(ResponseHelper.buildSuccessResponse({
              account_id: result.insertId
            }, langEngConfig.message.insert.success, STATUS.SUCCESS));
          },
          err => {
            logger.info('createAccount() execution completed');
            response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
          });
      } else {
        //If currency account exist upsate the status to active.
        if (!isExistAccountRes[0].status) {
          logger.info('createAccount() execution completed');
          account.activateAccount(currencyAccount, applicantId).then(result => {
              response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.success, STATUS.SUCCESS));
            })
            .catch(err => {
              logger.info('createAccount() execution completed');
              response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
            })
        } else {
          logger.info('createAccount() execution completed');
          response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.insert.alredy_exist, STATUS.FAILURE));
        }
      }
    })
    .catch(err => {
      logger.info('createAccount() execution completed');
      logger.error(err);
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    })
};

/**
 * @desc Method for getting account by id.
 * @method getAccounts 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return account id.
 */
export const getAccounts = (request, response) => {
  logger.info('getAccounts() initiated');
  const applicantId = request.params.applicant_id;
  account.getAccount(applicantId) 
    .then(result => {
      if (result.length == 0) {
        logger.info('getAccounts() execution completed');
        response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.accountStatus.account_notfound)));
      } else {
        logger.info('getAccounts() execution completed');
        response.send(ResponseHelper.buildSuccessResponse({
          account: result
        }, langEngConfig.message.accountStatus.getAccount, STATUS.SUCCESS));
      }
    }, err => {
      logger.error(err);
      logger.info('getAccounts() execution completed');
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.accountStatus.fail)));
    });
}

/**
 * @desc Method for getting account by currency
 * @method getByCurrency 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return account for currency.
 */
export const getByCurrency = function (request, response) {
  logger.info('initiated');
  let applicantId = request.params.applicant_id;
  account.getByCurrency(applicantId)
    .then(result => {
      if (result.length > 0) {
        logger.info('execution completed');
        response.send(ResponseHelper.buildSuccessResponse({
          account: result
        }, langEngConfig.message.accountStatus.getAccount, STATUS.SUCCESS));
      } else {
        logger.info('execution completed');
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.accountStatus.fail, STATUS.FAILURE));
      }
    }).catch(err => {
      logger.info('execution completed');
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    });
}

/**
 * @desc Method for activate or deactivate an account 
 * @method updateAccountStatus
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code.
 */
export const updateAccountStatus = (request, response) => {
  logger.info('updateAccountStatus() initiated');
  let status = request.body.status;
  let currency = request.body.currency;
  let applicantId = request.params.applicant_id;

  //Restrict user from deleting EUR account
  if (currency == 'EUR' && status == 0) {
    response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.accountStatus.defultAccError, STATUS.FAILURE));
  } else {
    account.updateCurrencyAccount(status, applicantId, currency)
      .then(result => {
        if (result.affectedRows != 0) {
          if (status == 1) {
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.accountStatus.success1, STATUS.SUCCESS));
            logger.info('updateAccountStatus() execution completed');
          } else {
            logger.info('updateAccountStatus() execution completed');
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.accountStatus.success2, STATUS.SUCCESS));
          }
        } else {
          logger.info('updateAccountStatus() execution completed');
          response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.accountStatus.account_notfound, STATUS.FAILURE));
        }
      })
      .catch(err => {
        logger.info('updateAccountStatus() execution completed');
        response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
      })
  }
};