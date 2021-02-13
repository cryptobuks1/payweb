/**
 * businessRegistration Model
 * businessRegistration is used for the get and verify otp with email and mobile id .
 * @package businessRegistration
 * @subpackage sources/services/model/businessRegistration
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu.
 */

"use strict";

const format = require('string-format');
import { DbConnMgr } from '../dbconfig/dbconfig';
import { Utils } from "../utility/utils";
import { sqlObj } from '../utility/sql';

const DbInstance = DbConnMgr.getInstance();
const util = new Utils();


const DASHBOARD_STATUS = {
  PENDING: 0,
  SUBMITTED: 1,
  VERIFIED: 2
}

export class BusinessRegistration {

  constructor() {
  }

  //this function is used for check company is exist in database or not
  checkUniqueCompany(application_id) {
    logger.info("checkUniqueCompany() initiated");
    return new Promise(function (resolve, reject) {
      let sql = sqlObj.BusinessRegistration.checkUniqueCompany;
      let sqlQuery = format(sql, application_id)
      DbInstance.doRead(sqlQuery).then(res => {
        logger.info('successfully executed');
        resolve(res);
      }).catch(err => {
        logger.error("execution failed");
        reject(err);
      })
    });
  }

  // this fnuction is used for get country code so we can check with KYB API
  getCountryCode(countryId) {
    logger.info("getCountryCode() initiated");
    return new Promise((resolve, reject) => {
      let sql = sqlObj.BusinessRegistration.getCountryCode;
      let sqlQuery = format(sql, countryId);
      DbInstance.doRead(sqlQuery).then(res => {
        logger.info('successfully executed ');
        resolve(res);
      }).catch(err => {
        logger.error(" execution failed");
        reject(err);
      });
    });
  }

  insertBusinessDetails(businessInfo) {
    logger.info("insertBusinessDeatils() initiated");
    return new Promise((resolve, reject) => {
      let timestamp = util.getGMT();
      let sql = sqlObj.BusinessRegistration.insertBusinessDetails;
      let sqlQuery = format(sql, businessInfo.applicant_id,businessInfo.country_of_incorporation,businessInfo.business_legal_name,
                            businessInfo.trading_name,businessInfo.registration_number,businessInfo.incorporation_date,
                            businessInfo.business_type,timestamp)
      DbInstance.doInsert(sqlQuery).then(res => {
        logger.info('successfully executed');
        resolve(res);
      }).catch(err => {
        logger.error(" execution failed");
        reject(err);
      });
    });
  }

  getBusinessDetails(businessInfo) {
    logger.info("insertBusinessDeatils() initiated");
    return new Promise((resolve, reject) => {
      let timestamp = util.getGMT();
      let sql = sqlObj.BusinessRegistration.getBusinessDetails;
      let sqlQuery = format(sql, businessInfo.applicant_id)
      DbInstance.doInsert(sqlQuery).then(res => {
        logger.info('successfully executed');
        resolve(res);
      }).catch(err => {
        logger.error(" execution failed");
        reject(err);
      });
    });
  }


  updateBusinesAddress(applicantId,countryId,addressTypeId,address_line1,address_line2, city,region,postal_code) {
    logger.info("updateBusinesAddress() initiated");
    return new Promise((resolve, reject) => {
      let timestamp = util.getGMT();
      let sql = sqlObj.BusinessRegistration.updateBusinessAddress;
      let sqlQuery = format(sql,applicantId,countryId,addressTypeId,address_line1,address_line2,city,postal_code,region,timestamp)
      DbInstance.doInsert(sqlQuery).then(res => {
        logger.info('successfully executed');
        resolve(res);
      }).catch(err => {      
        logger.error(" execution failed");
        reject(err);
      });
    });
  }

  getCompanyDetails(kyb_business_id, company_details) {
    logger.info(" getCompanyDetails() initiated");
    return new Promise((resolve, reject) => {
      let timestamp = util.getGMT();
      let sql = sqlObj.BusinessRegistration.get_Company_Details;
      let sqlQuery = format(sql, kyb_business_id, company_details, timestamp)
      DbInstance.doInsert(sqlQuery).then(res => {
        logger.info('successfully executed');
        resolve(res);
      }).catch(err => {
        logger.error(" execution failed");
        reject(err);
      });
    })
  }

  //for getting business type
  typeOfBusiness() {
    return new Promise((resolve, reject) => {
      logger.info('initiated');
      let sql = sqlObj.BusinessRegistration.typeOfBusiness;
      let sqlQuery = format(sql)
      DbInstance.doRead(sqlQuery)
        .then(result => {
          logger.info('execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.info('execution completed');
          reject(err);
        });
    })
  }

  //for geting business sectors.
  typeOfSector() {
    return new Promise((resolve, reject) => {
    logger.info('typeOfSector() initiated');  
    let sql = sqlObj.BusinessRegistration.typeOfSector;
    let sqlQuery = format(sql)
    DbInstance.doRead(sqlQuery)
    .then(result => {
    logger.info('execution completed');
       resolve(result);
    })
    .catch(err => {
    logger.info('execution completed');
        reject(err);
    });
    })
  }

  //for fetching the data related to business sector of an alresy registerd business.
  typeOfSectorAndIndustries(business_id) {
    let sql = sqlObj.BusinessRegistration.typeOfSectorAndIndustries;
    let sqlQuery = format(sql, business_id)
    return new Promise((resolve, reject) => {
      DbInstance.doRead(sqlQuery)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    })
  }

  //for geting business industries.
  typeOfIndustries() {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.BusinessRegistration.typeOfIndustries;
      let sqlQuery = format(sql);
      DbInstance.doRead(sqlQuery)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        })
    });
  }


  getBusinessId(applicant_Id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getBusinessId()');
      let sql = sqlObj.BusinessRegistration.get_Business_Id;
      let sqlQuery =format(sql,applicant_Id);
      DbInstance.doRead(sqlQuery).then(businessInfo => {
        logger.info('success in  getBusinessId() ');
        resolve(businessInfo);
      }).catch(err => {
        logger.error('error in  getBusinessId() ');
        reject(err);
      });
    });
  }

  getContactId(applicant_Id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getBusinessId()');
      let sql = sqlObj.BusinessRegistration.get_Contact_Id;
      let sqlQuery =format(sql,applicant_Id);
      DbInstance.doRead(sqlQuery).then(businessInfo => {
        logger.info('success in  getContactId() ');
        resolve(businessInfo);
      }).catch(err => {
        logger.error('error in  getContactId() ');
        reject(err);
      });
    });
  }

  //for inserting business_id,type_of_business,personal_profile,business_owner_details,business_address status
  postDashboardStatus(businessId) {
    return new Promise((resolve, reject) => {
      logger.info('postDashboardStatus() Initiated')
      let sql = `insert into kyb_business (business_id,type_of_business,personal_profile,business_owner_details,business_address, created_on)
               values (${businessId},'${DASHBOARD_STATUS.PENDING}','${DASHBOARD_STATUS.PENDING}','${DASHBOARD_STATUS.PENDING}','${DASHBOARD_STATUS.PENDING}', '${util.getGMT()}')`;
      DbInstance.executeQuery(sql)
        .then(result => {
          logger.info('postDashboardStatus() Exited Successfully')
          resolve(result);
        })
        .catch(err => {
          logger.error('postDashboardStatus() Error')
          reject(err);
        });
    })
  }


  // this fnuction is used fto insert address
  createAddress(applicantId, contactId, address_type_id, country_id, postal_code, address_line1,  city, region, createdOn) {
    logger.info('createAddress() initiated');
      return new Promise((resolve, reject) => {
        let sql = sqlObj.signUp.addAddress;
        let sqlQuery = format(sql, country_id, address_type_id, postal_code, address_line1,applicantId, city,region, contactId, createdOn)
          DbInstance.doInsert(sqlQuery).then(addressResult => {
            logger.info('createAddress() execution completed');
            esolve(addressResult);
          }).catch(err => {
            logger.error(err);
            logger.info('createAddress() execution completed');
            reject(new Error(err));
          })
      })
  }
}
