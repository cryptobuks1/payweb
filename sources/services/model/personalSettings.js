/**
 * personalSettings Model
 * personalSettings Model is used for fetching kyc status related functions.
 * @package personalSettings
 * @subpackage sources/services/model/personalSettings
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu,Tarangini dola
 */

let format = require('string-format');
import { DbConnMgr } from '../dbconfig/dbconfig';
import { sqlObj } from '../utility/sql';
import { Utils } from '../utility/utils';
let dateFormat = require('dateformat');
let utils = new Utils();
let db = DbConnMgr.getInstance();
export class SETTING {
  constructor() { }

  getPersonalSettingsInfo(applicantId) {
    return new Promise((resolve, reject) => {
      logger.info('getPersonalSettingsInfo() initiated');
      let sql = sqlObj.settings.getPersonalInfo;
      let sqlQuery = format(sql, applicantId);

      db.doRead(sqlQuery).then(personalInfo => {
        logger.info('getPersonalSettingsInfo() execution completed');
        resolve(personalInfo);
      })
        .catch(err => {
          logger.info('getPersonalSettingsInfo() execution error');
          reject(new Error());
        })
    })
  }

  getTransactionNumber(applicantId) {
    logger.info('getBusinessId() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.getTransactionNumber;
      let sqlquery = format(sql, applicantId);

      db.doRead(sqlquery).then(result => {
        logger.info('getBusinessId() execution completed');
        resolve(result);
      })
        .catch(err => {
          logger.info('getBusinessId() execution failed');
          reject(new Error(err));
        })
    })
  }

  //Method for getting businessId based on applicantId
  getBusinessId(applicantId) {
    logger.info('getBusinessId() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.getBusinessId;
      let sqlquery = format(sql, applicantId);

      db.doRead(sqlquery).then(result => {
        logger.info('getBusinessId() execution completed');
        resolve(result);
      })
        .catch(err => {
          logger.info('getBusinessId() execution failed');
          reject(new Error(err));
        })
    })
  }

  
  getCountryCode(nationality) {
    logger.info('getBusinessId() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.getCountryCode;
      let sqlquery = format(sql, nationality);

      db.doRead(sqlquery).then(result => {
        logger.info('getBusinessId() execution completed');
        resolve(result);
      })
        .catch(err => {
          logger.info('getBusinessId() execution failed');
          reject(new Error(err));
        })
    })
  }

  //Method for getting business profile details
  getBusinessProfile(businessId) {
    logger.info('getBusinessProfile() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.getBusinessProfile;
      let sqlQuery = format(sql, businessId);

      db.doRead(sqlQuery).then(result => {
        logger.info('getBusinessProfile() execution completed');
        resolve(result);
      })
        .catch(err => {
          logger.info('getBusinessProfile() execution error');
          reject(new Error(err));
        })
    })
  }

  //Method for getting business address
  getBusinessAddress(businessId) {
    logger.info('getBusinessAddress() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.getBusinessAddress;
      let sqlQuery = format(sql, businessId);
      db.doRead(sqlQuery).then(result => {
        logger.info('getBusinessAddress() execution completed');
        resolve(result);
      })
        .catch(err => {
          logger.info('getBusinessAddress() execution error');
          reject(new Error(err));
        })
    })
  }

  //Method for getting structure of business owners
  getBusinessStruct(businessId) {
    logger.info('getBusinessStruct() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.getBusinessStruct;
      let sqlQuery = format(sql, businessId);

      db.doRead(sqlQuery).then(result => {
        logger.info('getBusinessStruct() execution completed');
        resolve(result);
      })
        .catch(err => {
          logger.info('getBusinessStruct() execution error');
          reject(new Error(err));
        })
    })
  }

  //Method for getting password
  getPassWord(applicantId) {
    logger.info('getPassWord initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.getPassWord;
      let sqlQuery = format(sql, applicantId);

      db.doRead(sqlQuery).then(result => {
        logger.info('getPassWord() execution completed');
        resolve(result);
      })
        .catch(err => {
          logger.info('getPassWord() execution failed');
          reject(new Error(err));
        })
    })
  }

  //method for updating password
  updatePass(newPass, applicnatId) {
    logger.info('updatePass() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.update;
      let sqlQuery = format(sql, newPass, applicnatId, utils.getGMT());

      db.doRead(sqlQuery).then(result => {
        logger.info('updatePass() execution completed');
        resolve(result);
      })
        .catch(err => {
          logger.info('updatePass() execution failed');
          reject(new Error(err));
        })
    })
  }
  getPin(applicantId) {
    logger.info('getPin() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.getPin;
      let sqlQuery = format(sql, applicantId);
      db.doRead(sqlQuery).then(results => {
        logger.info('getPin() execution completed ');
        resolve(results);
      }).catch(err => {
        logger.info('error while executing getPin()');
        reject(new Error(err));
      })
    })
  }

  updatePin(newPin, applicantId) {
    logger.info('updatePin() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.updatePin;
      let sqlQuery = format(sql, newPin, applicantId, utils.getGMT());
      db.doRead(sqlQuery).then(results => {
        logger.info('updatePin() execution completed');
        resolve(results);
      }).catch(err => {
        logger.info(' error while executing updatePin()');
        reject(new Error(err));
      })
    })
  }

  //method for privacy Marketing notifications
  updatePrivacy(doEmailNotify, doPushNotify, isVisible, applicantId) {
    logger.info('updatePrivacy() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.patchPrivacy;
      let sqlQuery = format(sql, doEmailNotify, doPushNotify, isVisible, applicantId, utils.getGMT());
      db.doRead(sqlQuery).then(results => {
        logger.info('updatePrivacy() execution completed');
        resolve(results);
      })
        .catch(err => {
          logger.info('error while executing updatePrivacy()');
          reject(new Error(err));
        })
    })
  }

  //method for getting privacy Notifications
  getPrivacyNotify(applicantId) {
    logger.info('getPrivacyNotify() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.getPrivacy;
      let sqlQuery = format(sql, applicantId);
      db.doRead(sqlQuery).then(results => {
        logger.info('getPrivacyNotify() execution ompleted');
        resolve(results);
      }).catch(err => {
        logger.info('error while executing getPrivacyNotify()');
        reject(new Error(err));
      })
    })
  }

  //method for updating account status
  addAccountStatus(applicantId, status, account_type) {
    logger.info('addAccountSataus() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.addAccountStatus;
      let sqlQuery = format(sql, status, applicantId,account_type, utils.getGMT());
      db.doUpdate(sqlQuery).then(result => {
        logger.info('updatePass() execution completed');
        resolve(result);
      }).catch(err => {
        logger.info('updatePass() execution failed');
        reject(new Error(err));
      })
    })
  }

  changeCounterpartyStatus(applicantId) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.changeCounterpartyStatus;
      let sqlQuery = format(sql, applicantId, utils.getGMT());
      db.doUpdate(sqlQuery).then(result => {
        logger.info('updatePass() execution completed');
        resolve(result);
      }).catch(err => {
        logger.info('updatePass() execution failed');
        reject(new Error(err));
      })
    })
  }


  //method to nullify device status and device token
  nullifydevicestatusandtoken(applicantId) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.nullifydevicestatusandtoken;
      let sqlQuery = format(sql, applicantId, utils.getGMT());
      db.doUpdate(sqlQuery).then(result => {
        logger.info('updatePass() execution completed');
        resolve(result);
      }).catch(err => {
        logger.info('updatePass() execution failed');
        reject(new Error(err));
      })
    })
  }

  //method for update personal settings
  editPersonalSettingsInfo(applicantId, first_name, last_name, dob, address_line1, city, country_name, postal_code, region, town, address_line2, place_of_birth, nationality) {
    logger.info('UpdatePersonalStatus() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.updatePersonalSettings;
      let sqlQuery = format(sql, applicantId, first_name, last_name, dob, address_line1, city, country_name, postal_code, region, town, address_line2, place_of_birth, nationality, utils.getGMT());
      db.doUpdate(sqlQuery).then(result => {
        logger.info('updatePersonalSettings() execution completed');
        resolve(result);
      })
        .catch(err => {
          logger.info('updatePersonalSettings() execution failed');
          reject(new Error(err));
        })
    })
  }

  updateKycDetails(kycObj) {
    logger.info('Initiated updateKyc()');
    return new Promise((resolve, reject) => {
      var sql = sqlObj.kyc.updateKycData;
      let sqlQuery = format(sql, kycObj.transactionNumber, kycObj.kyc_vendor_id, kycObj.applicantId, utils.getGMT())
      db.doUpdate(sqlQuery).then(results => {
        logger.info('Updating kyc successfully');
        resolve(results);
      }).catch(err => {
        logger.error('Error while updating kyc');
        reject(err);
      })
    })
  }

  updateCounterParty(full_name, applicantId) {
    logger.info('updateCounterParty() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.updateCounterParty;
      let sqlQuery = format(sql, full_name, applicantId);
      db.doUpdate(sqlQuery).then(results => {
        logger.info('updateCounterParty() execution completed');
        resolve(results);
      }).catch(err => {
        logger.info(' error while executing updateCounterParty()');
        reject(new Error(err));
      })
    })
  }

  //method for plans
  pricePlan(applicantId) {
    logger.info('pricePlan() method intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.getPlans;
      let sqlQuery = format(sql, applicantId);
      db.doRead(sqlQuery).then(results => {
        logger.info('pricePlan() execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while executing priceplan()');
        reject(new Error(err));
      })
    })
  }

  // method for inserting plans
  newPlan(applicantId, plan_id) {
    logger.info('newPlan() method intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.insertPlans;
      let date = new Date();
      let date1 = date.setDate(date.getDate() + 30);
      let endDate = dateFormat(new Date(date1), 'yyyy-mm-dd hh:MM:ss');
      let sqlQuery = format(sql, applicantId, plan_id, utils.getGMT(), endDate,utils.getGMT());
      db.doInsert(sqlQuery).then(results => {
        logger.info('newPlan() execution completed');
        resolve(results);
      }).catch(err => {     
        logger.error('error while executing newPlan()');
        reject(new Error(err));
      })
    })
  }

  // metod for get plans
  getPlans(plan_id) {
    logger.info('getPlans() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.getPlan;
      let sqlQuery = format(sql, plan_id);
      db.doRead(sqlQuery).then(results => {
        logger.info('getPlans() execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while executing the getplans()');
        reject(new Error(err));
      })
    })

  }

  //method for transacational details
  transactionDetails(applicantId) {
    logger.info('transactionDetails() method intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.getTransactionDetails;
      let sqlQuery = format(sql, applicantId);
      db.doRead(sqlQuery).then(results => {
        logger.info('transactionDetails() execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while executing transactionDetails()');
        reject(new Error(err));
      })
    })
  }
  
  getInternationalTransactions(applicantId) {
    logger.info('transactionDetails() method intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.getInternationalTransfers;
      let sqlQuery = format(sql, applicantId);
      db.doRead(sqlQuery).then(results => {
        logger.info('transactionDetails() execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while executing transactionDetails()');
        reject(new Error(err));
      })
    })
  }
  updateAllowances(applicantId,plan_id,used_allowances){
    logger.info('updateAllowances() method intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.updateAllowance;
      let sqlQuery = format(sql, applicantId,plan_id,used_allowances,utils.getGMT());
      db.doRead(sqlQuery).then(results => {
        logger.info('updateAllowances() execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while executing updateAllowances()');
        reject(new Error(err));
      })
    })
  }

  getUsers(businessId){
    logger.info('getUsers() method intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.settings.getUsersList;
      let sqlQuery = format(sql,businessId);
      db.doRead(sqlQuery).then(results => {
        logger.info('getUsers() execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while executing getUsers()');
        reject(new Error(err));
      })
    })
  }
}
