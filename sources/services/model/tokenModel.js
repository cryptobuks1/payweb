/**
 * tokenModel
 * This model allows access to sandbox and production tokens with CRUD access. It also enables the controller to retrieve validTokens by using the current_timestamp in the db.
 * @package tokenModel
 * @subpackage model/tokenModel
 *  @author SEPA Cyper Technologies, sujit.kumar and Jan-Patrick Vöhrs
 */

"use strict";
var getLog = require('../utility/consoleLog');

import { DbConnMgr } from "../dbconfig/dbconfig";
const DbInstance = DbConnMgr.getInstance();

//init return current file location.
const obj = {
  'fileName': 'Controller.authentication.authentication'
};

/**
 * Get merchant by Id and api-key and return it. If the result is more or less than one, the result will be null, which means no merchant can be found with the details.
 */
obj.getSandboxMerchantByIdAndKey = function (memberId, key) {
  return new Promise(function (resolve, reject) {
    //To check the status
    getLog.getLogStatus(_.toLower(obj.fileName)).then(logRes => {
      //log
      (logRes.status) ? logger.info(`${obj.fileName}` + " : " + "model/tokenModel/getSandboxMerchantByIdAndKey() method initiated.") : "";
      //SQL query to get applicant_id
      DbInstance.executeQuery(`select applicant_id from sandbox where memberId = '${memberId}' && api_key = '${key}'`).then(data => {
        //log   
        (logRes.status) ? logger.info(`${obj.fileName}` + " : " + "applicant_id fetched from sandbox table.") : "";
        //log
        (logRes.status) ? logger.info(`${obj.fileName}` + " : " + "Response send to authentication controller.") : "";

        //Response
        resolve(data);
        //log    
        (logRes.status) ? logger.info(`${obj.fileName}` + " : " + "model/tokenModel/getSandboxMerchantByIdAndKey() method execution completed.") : "";
      }, (errResponse) => {
        //log
        (logRes.status) ? logger.debug(`${obj.fileName}` + " : " + "Error occured in catch block of model/tokenModel/getSandboxMerchantByIdAndKey() method at line number 37..") : "";

        reject(errResponse);
      })
    })
  })

}

/**
 * Create merchant token with a given token and an expirationDate. If it has been stored successfully the function returns true. If not, it returns false. 
 */
obj.createSandboxMerchantToken = function (applicant_id, memberId, token, expirationDate) {
  return new Promise(function (resolve, reject) {
    getLog.getLogStatus(_.toLower(obj.fileName)).then(logRes => {
      (logRes.status) ? logger.info(`${obj.fileName}` + " : " + "model/tokenModel/createSandboxMerchantToken() method initiated.") : "";
      DbInstance.executeQuery(`insert into sandbox_token_validator (applicant_id, member_token, member_id, expiry) values(${applicant_id},'${token}','${memberId}',${expirationDate})`).then(function (success) {
        (logRes.status) ? logger.info(`${obj.fileName}` + " : " + "applicant_id, member_token, member_id, expiry inserted into sandbox_token_validator table.") : "";
        (logRes.status) ? logger.info(`${obj.fileName}` + " : " + "Response send to authentication controller.") : "";
        resolve(true);
        (logRes.status) ? logger.info(`${obj.fileName}` + " : " + "model/tokenModel/createSandboxMerchantToken() method execution completed.") : "";
      }, (err) => {
        (logRes.status) ? logger.debug(`${obj.fileName}` + " : " + "Error occured in catch block of model/tokenModel/createSandboxMerchantToken() method at line number 62.") : "";
        reject(errResponse);
        reject(false)
      })
    })
  })
}

/**
 * Check whether the the given data resolves to a valid token or not. Function returns true, when a token, which is valid can be found, otherwise it's false.
 */
obj.isValidSandboxMerchantToken = function (memberId, token) {
  return new Promise(function (resolve, reject) {
    (logRes.status) ? logger.info("isValidSandboxMerchantToke() method initiated.") : "";
    getLog.getLogStatus(_.toLower(obj.fileName)).then(logRes => {
      (logRes.status) ? logger.info(`${obj.fileName}` + " : " + "model/tokenModel/isValidSandboxMerchantToke() method initiated.") : "";
      (logRes.status) ? logger.info(`${obj.fileName}` + " : " + "member_id, expiry, created_on fetched from sandbox_token_validator table.") : "";
      DbInstance.executeQuery(`select member_id, expiry, created_on from sandbox_token_validator where member_id = '${memberId}' and member_token = '${token}' ORDER BY created_on DESC `).then(data => {
        (logRes.status) ? logger.info(`${obj.fileName}` + " : " + "Response send to authentication controller.") : "";
        resolve(data)
      }, (err) => {
        (logRes.status) ? logger.info(`${obj.fileName}` + " : " + "Error occured in catch block of model/tokenModel/isValidSandboxMerchantToken() method at line number 92.") : "";
        reject({ status: 0 })
      })
    })
  })
}

/**
 * Get merchant by Id and api-key and return it. If the result is more or less than one, the result will be null, which means no merchant can be found with the details.
 */
obj.getMerchantByIdAndKey = function (memberId, key) {
  DbInstance.executeQuery(`select applicant_id from merchants where member_id = '${memberId}' && api_key = '${key}'`).then(data => {
    if (_.size(data) == 1) {
      return data;
    }
    return null;
  })
}

/**
 * Create merchant token with a given token and an expirationDate. If it has been stored successfully the function returns true. If not, it returns false. 
 */
obj.createMerchantToken = function (memberId, token, expirationDate) {
  DbInstance.executeQuery(`insert into merchant_tokens (member_id, token, expiry) values(${memberId},'${token}',${expirationDate})`).then(function (success) {
    return true;
  })
  //ToDo create error Log message
  return false;
}

/**
 * Check whether the the given data resolves to a valid token or not. Function returns true, when a token, which is valid can be found, otherwise it's false.
 */
obj.isValidMerchantToken = function (memberId, token) {
  DbInstance.executeQuery(`select member_id from merchant_tokens where member_id = '${memberId}' and token = '${token}' and expiry > CURRENT_TIMESTAMP`).then(data => {
    if (_.size(data) == 1) {
      return true;
    }
    return false;
  })
}


obj.getCustomerToken = function (memberId, Token) {
  //ToDo Implementation

}

obj.createCustomerToken = function (memberId, Token, expirationDate) {
  //ToDo Implementation

}

obj.getExpiredMerchantTokens = function () {
  //ToDo Implementation

}

obj.getExpiredCustomerTokens = function () {
  //ToDo Implementation

}


module.exports = {
  obj
}
