/**
 * login Model
 * login model contains all the Db interacting methods in support of login controller.
 * @package login
 * @subpackage model/login
 * @author SEPA Cyber Technologies, Sekhara Suman Sahu.
 */


/* This file is modified version of current login process, With changed database structure and use of async/await
   concept in Node.js. */
import {
  sqlObj
} from '../utility/sql';
import { configVariable } from '../utility/country';
import {
  DbConnMgr
} from '../dbconfig/dbconfig';

let format = require('string-format');
const db = DbConnMgr.getInstance();

//Method to authenticate the user
export class Login {
  constructor() {}

  //Method to authenticate the user
  authenticate(typeOfPw, typeOfUserId, userId, accountType, business_id) {
    logger.info('authenticate() method initiated');

    return new Promise((resolve, reject) => {
      let sql = sqlObj.login.authenticateQuery;
      let sqlQuery = format(sql, typeOfPw, typeOfUserId, userId, accountType,business_id);
      db.doRead(sqlQuery).then(result => {
          logger.info('authenticate() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.info('authenticate() execution completed');
          logger.error('Error occured :' + err);
          reject(new Error(err));
        })
    })
  }

  //Method to get user data based on applicant_id
  getUserData(applicantId) {
    return new Promise((resolve, reject) => {
      logger.info('getUserData() method initiated');

      let sql = sqlObj.login.getUserData;
      let sqlQuery = format(sql, applicantId);

      db.doRead(sqlQuery).then(result => {
          logger.info('getUserData() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.error('Error occured : ' + err);
          logger.info('getUserData() execution completed');
          reject(new Error(err));
        })
    })
  }


  getKybStatus(applicantId) {
    return new Promise((resolve, reject) => {
      logger.info('getUserData() method initiated');

      let sql = sqlObj.login.getKybStatus;
      let sqlQuery = format(sql, applicantId);

      db.doRead(sqlQuery).then(result => {
          logger.info('getUserData() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.error('Error occured : ' + err);
          logger.info('getUserData() execution completed');
          reject(new Error(err));
        })
    })
  }

  //Method to get company data id logging in user has registered.
  getCompanyDetail(applicantId) {
    return new Promise((resolve, reject) => {
      logger.info('getCompanyDetail() method initiated');

      let sql = sqlObj.login.getCompanyData;
      let sqlQuery = format(sql, applicantId);

      db.doRead(sqlQuery).then(result => {
          logger.info('getCompanyDetail() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.error('Error occured : ' + err);
          logger.info('getCompanyDetail() execution completed');
          reject(new Error(err));
        })
    })
  }

  //Method to check wheather the user has done any transactions or not
  checkInitialPayment(applicantId) {
    return new Promise((resolve, reject) => {
      logger.info('checkInitialPayment() method initiated');

      let sql = sqlObj.login.checkInitialPayment;
      let sqlQuery = format(sql, applicantId);

      db.doRead(sqlQuery).then(result => {
          logger.info('checkInitialPayment() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.error('Error occured : ' + err);
          reject(new Error(err));
        })
    })
  }

  	//Method for getting global country list
	getGlobalCountryList(){
		return new Promise((resolve, reject)=>{
			logger.info('getGlobalCountryList() initiated');
			let sql = configVariable.sql.getGlobalCountry;

			db.doRead(sql).then(result=>{
				logger.info('getGlobalCountryList() execution completed');
				resolve(result);
			}).catch(err=>{
				logger.error('Error occured '+ err);
				reject(new Error(err));
			})
		})
  }
  
getSandboxDetails(applicant_id){
  return new Promise((resolve, reject) => {
    logger.info('getSandboxDetails() method initiated');

    let sql = sqlObj.login.getSandbox;
    let sqlQuery = format(sql, applicant_id);

    db.doRead(sqlQuery).then(result => {
        logger.info('getSandboxDetails() execution completed');
        resolve(result);
      })
      .catch(err => {
        logger.error('Error occured : ' + err);
        reject(new Error(err));
      })
  })
}

getMerchantDetails(applicant_id){
  return new Promise((resolve, reject) => {
    logger.info('getMerchantDetails() method initiated');

    let sql = sqlObj.login.getMerchant;
    let sqlQuery = format(sql, applicant_id);

    db.doRead(sqlQuery).then(result => {
        logger.info('getMerchantDetails() execution completed');
        resolve(result);
      })
      .catch(err => {
        logger.error('Error occured : ' + err);
        reject(new Error(err));
      })
  })
}

updateApplicantDeviceInfo(applicant_id, devicetype, devicetoken){

  return new Promise((resolve, reject) => {

    let sql = sqlObj.login.updateDeviceInfo;
    let sqlQuery = format(sql, applicant_id,devicetype,devicetoken)

    db.doRead(sqlQuery).then(result => {
      logger.info('updateApplicantDeviceInfo() execution completed');
      resolve(result);
    })
    .catch(err => {
      logger.error('Error occured in updateApplicantDeviceInfo: ' + err);
      reject(new Error(err));
    })

  })
}



}