/**
 * signUpModel Model
 * signUpModel is used for the modeling of user registration purpose. An individual user has to give the required 
 * data to register himself in the payvoo app.
 * @package signUpModel
 * @subpackage sources/services/model/signUpModel
 * @author SEPA Cyber Technologies, Sekhara Suman Sahu.
 */

"use strict";

import { DbConnMgr } from '../dbconfig/dbconfig';
import { sqlObj } from '../utility/sql';
import { Utils } from '../utility/utils';
let utils = new Utils();
let format = require('string-format');
//import { logger } from 'handlebars';

const db = DbConnMgr.getInstance();

export class User {
  constructor() {

  }

  // // used for forgot password 
  forgotPassword(account_type, email) {
    logger.info('forgotPassword() intiated');
    return new Promise(function (resolve, reject) {
      let sql = sqlObj.passwordSettings.getUserId;
      let sqlQuery = format(sql, account_type, email);
      // var sql = `SELECT user_id FROM ${business_type} WHERE user_id  = "${email}"`
      db.doRead(sqlQuery).then(res => {
        // DbInstance.executeQuery(sql).then(res => {
        logger.info('forgotPassword() executed');
        resolve(res);
      }).catch(err => {
        logger.error('error while execute the query');
        reject(new Error(err));
      })
    });
  }

  getPassword(account_type, email) {
    logger.info('resetPassword() intiated');
    return new Promise(function (resolve, reject) {
      let sql = sqlObj.passwordSettings.getPassword;           
      let sqlQuery = format(sql, account_type, email);
      console.log("sqlQuery", sqlQuery);
      // let sql = `update ${business_type} set password = '${hashPassword.generate(password)}' where user_id = '${email}'`;
      db.doRead(sqlQuery).then(res => {
        // DbInstance.executeQuery(sql).then(res => {
        logger.info('resetPassword() executed');
        resolve(res);
      }).catch(err => {
        logger.error('error while execute the query');
        reject(new Error(err));
      })
    });
  }


  resetPassword(business_type,account_type, password, email) {
    logger.info('resetPassword() intiated');
    return new Promise(function (resolve, reject) {
      let sql = sqlObj.passwordSettings.resetpassword;
      let pwd = hashPassword.generate(password);
      let sqlQuery = format(sql, business_type, pwd, email,account_type, utils.getGMT());
      // let sql = `update ${business_type} set password = '${hashPassword.generate(password)}' where user_id = '${email}'`;
      db.doRead(sqlQuery).then(res => {
        // DbInstance.executeQuery(sql).then(res => {
        logger.info('resetPassword() executed');
        resolve(res);
      }).catch(err => {
        logger.error('error while execute the query');
        reject(new Error(err));
      })
    });
  }


  // used for reset password  not in beta 
  updatePassword(business_type, newPassword, code) {
    logger.info('updatePassword() intiated');
    return new Promise(function (resolve, reject) {
      let sql = sqlObj.passwordSettings.updatepassword;
      let newPwd = hashPassword.generate(newPassword);
      let sqlQuery = format(sql, business_type, newPwd, code, utils.getGMT());
      // let sql = `update ${business_type} set password = '${hashPassword.generate(newPassword)}' where user_id = '${code}'`
      // DbInstance.executeQuery(sql).then(res => {
      db.doRead(sqlQuery).then(res => {
        logger.info('updatePassword() executed');
        resolve(res);
      }).catch(err => {
        logger.error('error while execute the query');
        reject(new Error(err));
      })
    });
  }

  // used for change password from profile page   not in beta 
  changePassword(account_type, applicant_id) {
    logger.info('changePassword() intiated');
    return new Promise(function (resolve, reject) {
      let sql = sqlObj.passwordSettings.getapplicantId;
      let sqlQuery = format(sql, account_type, applicant_id);
      // var sql = `SELECT password FROM ${business_type} WHERE applicant_id = ${applicant_id}`
      //DbInstance.executeQuery(sql).then(res => {
      db.doRead(sqlQuery).then(res => {
        logger.info('changePassword() executed');
        resolve(res);
      }).catch(err => {
        logger.error('error while execute the query');
        reject(new Error(err));
      })
    });
  }
  

  changePin(account_type, applicant_id) {
    logger.info('changePassword() intiated');
    return new Promise(function (resolve, reject) {
      let sql = sqlObj.passwordSettings.getPin;
      let sqlQuery = format(sql, account_type, applicant_id);
      // var sql = `SELECT password FROM ${business_type} WHERE applicant_id = ${applicant_id}`
      //DbInstance.executeQuery(sql).then(res => {
      db.doRead(sqlQuery).then(res => {
        logger.info('changePassword() executed');
        resolve(res);
      }).catch(err => {
        logger.error('error while execute the query');
        reject(new Error(err));
      })
    });
  }

  // used for save password from profile page   not in beta 
  saveNewPassword(account_type, newPassword, applicant_id) {
    logger.info('saveNewPassword() intiated');
    return new Promise(function (resolve, reject) {
      let sql = sqlObj.passwordSettings.savenewPassword;
      let newPwd = hashPassword.generate(newPassword);
      let sqlQuery = format(sql, account_type, newPwd, applicant_id,utils.getGMT());
      //let sql = `update ${business_type} set password = '${hashPassword.generate(newPassword)}' where applicant_id = ${applicant_id}`;
      // DbInstance.executeQuery(sql).then(res => {
      db.doRead(sqlQuery).then(res => {
        logger.info('saveNewPassword() executed');
        resolve(res);
      }).catch(err => {
        logger.error('error while execute the query');
        reject(new Error(err));
      })
    })
  }

  saveNewPin(account_type, newPin, applicant_id) {
    logger.info('saveNewPassword() intiated');
    return new Promise(function (resolve, reject) {
      let sql = sqlObj.passwordSettings.savenewPin;
      let newPwd = hashPassword.generate(newPin);
      let sqlQuery = format(sql, account_type, newPwd, applicant_id,utils.getGMT());
      //let sql = `update ${business_type} set password = '${hashPassword.generate(newPassword)}' where applicant_id = ${applicant_id}`;
      // DbInstance.executeQuery(sql).then(res => {
      db.doRead(sqlQuery).then(res => {
        logger.info('saveNewPassword() executed');
        resolve(res);
      }).catch(err => {
        logger.error('error while execute the query');
        reject(new Error(err));
      })
    })
  }
}

