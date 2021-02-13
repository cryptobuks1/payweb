/**
 * kyc Model
 * kyc Model is used for fetching kyc status related functions.
 * @package kyc
 * @subpackage sources/services/model/kyc
 * @author SEPA Cyper Technologies, Satyanarayana G.
 */

"use strict";

import { DbConnMgr } from '../dbconfig/dbconfig';
import { langEngConfig } from '../utility/lang_eng'
const DbInstance = DbConnMgr.getInstance();
const format = require('string-format');
import { sqlObj } from '../utility/sql';
import { Utils } from '../utility/utils';
let utils = new Utils();

export class Kyc {
  constructor() {
    this.ERROR_CODES = {
      SUCCESS: 0,
      FAIL: 1
    }
  }
  async getKycByApplicant(kycApplicantId) {
    return new Promise((resolve, reject) => {
      logger.info('Initialize  getKycByApplicant()');
      let sql = sqlObj.kyc.getKycByApplicant;
      let sqlQuery = format(sql, kycApplicantId)
      DbInstance.doRead(sqlQuery).then(res => {
        logger.info('Kyc details by applicantId retrived');
        resolve(res);
      }).catch(err => {
        logger.error('Error while getting kyc information');
        reject(err);
      })
    })
  }
  async checkSuccessKyc(identityStatus, transactionNumber) {
    logger.info('initiated checkSuccessKyc');
    return new Promise ((resolve, reject) => {
      let sql = sqlObj.kyc.checkSuccessKyc;    
      let sqlQuery = format(sql, identityStatus, transactionNumber, utils.getGMT())
      DbInstance.doUpdate(sqlQuery).then((results) => {
        resolve(results);
      }).catch(err => {
        logger.error('Error while getting checkSuccessKyc');
        reject(err);
      })
    })
  }



  checkFailureKyc(messageData, applicantId) {
    logger.info('initiated checkFailureKyc');
    return new Promise((resolve, reject) => {
      var sql = sqlObj.kyc.checkFailureKyc;
      let sqlQuery = format(sql, messageData, applicantId, utils.getGMT())
      DbInstance.doUpdate(sqlQuery).then(results => {
        resolve(results);
      }).catch(err => {
        logger.error('Error while getting checkFailureKyc');
        reject(err);
      })
    })
  }
  updateKycStatusForSendInvitation(kyc_status, applicant_id) {
    logger.info('initiated update kyc');
    return new Promise((resolve, reject) => {
      var sql = sqlObj.kyc.updateKycStatusForSendInvitation;
      let sqlQuery = format(sql, kyc_status, applicant_id, utils.getGMT())
      DbInstance.doUpdate(sqlQuery).then(results => {       
        resolve(results);
      }).catch(err => {
        logger.error('Error while getting updating Kyc Status');
        reject(err);
      })
    })
  }
  checkPayVooKycStatus(applicantId) {
    logger.info('initiated checkPayVooKycStatus()');
    return new Promise((resolve, reject) => {
      var sql = sqlObj.kyc.checkPayVooKycStatus;
      let sqlQuery = format(sql, applicantId)
      DbInstance.doRead(sqlQuery).then((results) => {
        resolve(results);
      }).catch(err => {
        logger.error('Error while getting checkPayVooKycStatus');
        reject(err);
      })
    })
  }
  async getBusinessKycApplicant(kyc_vendor_id) {
    logger.info('initiated getBusinessKycApplicant()');
    return new Promise((resolve, reject) => {
      var sql = sqlObj.kyc.getBusinessKycApplicant;
      let sqlQuery = format(sql, kyc_vendor_id);
      DbInstance.doRead(sqlQuery).then(results => {
        resolve(results);
      }).catch(err => {
        logger.error('Error while getting getBusinessKycApplicant');
        reject(err);
      }
      )
    })
  }
  getUserByApplicant(kycApplicantId) {
    return new Promise((resolve, reject) => {
      logger.info('Initialize  getUserByApplicant()');
      let sql = sqlObj.kyc.getUserByApplicant;
      let sqlQuery = format(sql, kycApplicantId);      
      DbInstance.doRead(sqlQuery).then(res => {
        logger.info('User details by applicantId retrived');
        resolve(res);
      }).catch(err => {
        logger.error('Error while getting User information');
        reject(err);
      })
    })
  }

  getApplicantByBusiness(business_id) {
    return new Promise((resolve, reject) => {
      logger.info('Initialize  getApplicantByBusiness()');
      let sql = sqlObj.kyc.getApplicantByBusiness;
      let sqlQuery = format(sql, business_id);
      DbInstance.doRead(sqlQuery).then(res => {
        logger.info('ApplicantId by business_id retrived');
        resolve(res);
      }).catch(err => {
        logger.error('Error while getting Applicant id');
        reject(err);
      })
    })
  }

  getIndividualApplicant(contact_id) {
    return new Promise((resolve, reject) => {
      logger.info('Initialize  getIndividualApplicant()');
      let sql = sqlObj.kyc.getIndividualApplicant;
      let sqlQuery = format(sql, contact_id);
      DbInstance.doRead(sqlQuery).then(res => {
        logger.info('User details: getIndividualApplicant() success ');
        resolve(res);
      }).catch(err => {
        logger.error('Error while getting getIndividualApplicant()');
        reject(err);
      })
    })
  }

  checkUser(applicantId) {
    logger.info('Initiated checkUser()');
    return new Promise((resolve, reject) => {
      var sql = sqlObj.kyc.checkUser;
      let sqlQuery = format(sql, applicantId)
      DbInstance.doRead(sqlQuery).then(results => {
        logger.info('User details by applicantId retrived');
        resolve({ status: 1, message: langEngConfig.message.kycEntry.modelsuccess, res: results });
      }).catch(err => {
        logger.error('Error while getting user details');
        reject({ status: 0, message: langEngConfig.message.kycEntry.error });
      })
    })
  }
  updateKycDetails(kycObj) {
    logger.info('Initiated updateKyc()');
    return new Promise((resolve, reject) => {
      var sql = sqlObj.kyc.updateKycDetails;
      let sqlQuery = format(sql, kycObj.transactionNumber, kycObj.kyc_vendor_id, kycObj.pep_status, kycObj.sanctions_status, kycObj.applicantId, utils.getGMT())
      DbInstance.doUpdate(sqlQuery).then(results => {
        logger.info('Updating kyc successfully');
        resolve(results);
      }).catch(err => {
        logger.error('Error while updating kyc');
        reject(err);
      })
    })
  }
  updateKycStatus(kycObj) {
    logger.info('Initiated updateKycStatus()');
    return new Promise((resolve, reject) => {
      var sql = sqlObj.kyc.updateKycStatus;
      let sqlQuery = format(sql, kycObj.status, kycObj.transactionNumber, kycObj.id, utils.getGMT())
      DbInstance.doUpdate(sqlQuery).then(results => {
        logger.info('Updating kyc status successfully');
        resolve(results);
      }).catch(err => {
        logger.error('Error while updating kyc status');
        reject(err);
      })
    })
  }

  getApplicantBusinessId(applicantId) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getApplicantBusinessId() ');
      let sql = sqlObj.kyc.getApplicantBusinessId;
      let sqlQuery = format(sql, applicantId);
      DbInstance.doRead(sqlQuery).then(businessInfo => {
        logger.info('success in  getApplicantBusinessId() ');
        resolve(businessInfo);
      }).catch(err => {
        logger.error('error in  getApplicantBusinessId() ');
        reject(new Error(err));
      });
    });
  }

  getIndividualApplicantBusinessId(applicantId) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getApplicantBusinessId() ');
      let sql = sqlObj.kyc.getIndividualApplicantBusinessId;
      let sqlQuery = format(sql, applicantId);    
      DbInstance.doRead(sqlQuery).then(businessInfo => {
        logger.info('success in  getApplicantBusinessId()', businessInfo);
        resolve(businessInfo);
      }).catch(err => {
        logger.error('error in  getApplicantBusinessId() ');
        reject(new Error(err));
      });
    });
  }

  updateDashboardKycStatus(flag, business_id, column) {
    return new Promise((resolve, reject) => {
      logger.info('Status inserted for submited successfully Initiated')
      let sql = sqlObj.kyc.updateDashboardKycStatus;
      let sqlQuery = format(sql, column, flag, utils.getGMT(), business_id);
      DbInstance.doUpdate(sqlQuery)
        .then(result => {
          logger.info('status updated successfully')
          resolve(result);
        })
        .catch(err => {
          logger.error('status updation failure')
          reject(err);
        })
    });
  }

  shareHolderApplicants(business_id) {
    return new Promise((resolve, reject) => {
      logger.info('shareHolderApplicants() fetch details')
      let sql =
        `SELECT c.applicant_id FROM contact c 
      INNER JOIN kyc k  
            ON k.applicant_id = c.applicant_id AND k.kyc_status NOT IN ('SUCCESS','SUCCESSFUL_WITH_CHANGES','FRAUD_SUSPICION_CONFIRMED','FRAUD_SUSPICION_PENDING')
      INNER JOIN kyb_business_owner kbo
            ON c.email = kbo.email AND  kbo.business_id = ${business_id}  AND kbo.type = 'shareholder'`;
      DbInstance.executeQuery(sql)
        .then(result => {
          logger.info('shareHolderApplicants() fetch details success')
          resolve(result);
        })
        .catch(err => {
          logger.info('shareHolderApplicants() fetch details error')
          reject(new Error(err));
        })
    });
  }

  directorApplicants(business_id) {
    return new Promise((resolve, reject) => {
      logger.info('directorApplicants() fetch details')
      let sql =
        `SELECT c.applicant_id FROM contact c 
      INNER JOIN kyc k  
            ON k.applicant_id = c.applicant_id AND k.kyc_status NOT IN ('SUCCESS','SUCCESSFUL_WITH_CHANGES','FRAUD_SUSPICION_CONFIRMED','FRAUD_SUSPICION_PENDING')
      INNER JOIN kyb_business_owner kbo
            ON c.email = kbo.email AND  kbo.business_id = ${business_id}  AND kbo.type = 'director'`;
      DbInstance.executeQuery(sql)
        .then(result => {
          logger.info('directorApplicants() fetch details success')
          resolve(result);
        })
        .catch(err => {
          logger.info('directorApplicants() fetch details error')
          reject(new Error(err));
        })
    });
  }
}
