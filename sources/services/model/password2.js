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
//import { logger } from 'handlebars';

const DbInstance = DbConnMgr.getInstance();

export class User {
  constructor() {

  }

  // // used for forgot password 
  forgotPassword(business_type, email) {
    logger.info('forgotPassword() intiated');
    return new Promise(function (resolve, reject) {
      var sql = `SELECT user_id FROM ${business_type} WHERE user_id  = "${email}"`
      DbInstance.executeQuery(sql).then(res => {
        logger.info('forgotPassword() executed');
        resolve(res);
      }).catch(err => {
        logger.error('error while execute the query');
        reject(err);
      })
    });
  }


  resetPassword(business_type, password, email) {
    logger.info('resetPassword() intiated');
    return new Promise(function (resolve, reject) {
      let sql = `update ${business_type} set password = '${hashPassword.generate(password)}' where user_id = '${email}'`;
      DbInstance.executeQuery(sql).then(res => {
        logger.info('resetPassword() executed');
        resolve(res);
      }).catch(err => {
        logger.error('error while execute the query');
        reject(err);
      })
    });
  }


  // used for reset password  not in beta 
  updatePassword(business_type, newPassword, code) {
    logger.info('updatePassword() intiated');
    return new Promise(function (resolve, reject) {
      let sql = `update ${business_type} set password = '${hashPassword.generate(newPassword)}' where user_id = '${code}'`
      DbInstance.executeQuery(sql).then(res => {
        logger.info('updatePassword() executed');
        resolve(res);
      }).catch(err => {
        logger.error('error while execute the query');
        reject(err);
      })
    });
  }

  // used for change password from profile page   not in beta 
  changePassword(business_type, applicant_id) {
    logger.info('changePassword() intiated');
    return new Promise(function (resolve, reject) {
      var sql = `SELECT password FROM ${business_type} WHERE applicant_id = ${applicant_id}`
      DbInstance.executeQuery(sql).then(res => {
        logger.info('changePassword() executed');
        resolve(res);
      }).catch(err => {
        logger.error('error while execute the query');
        reject(err);
      })
    });
  }

  // used for save password from profile page   not in beta 
  saveNewPassword(business_type, newPassword,applicant_id) {
    logger.info('saveNewPassword() intiated');
    return new Promise(function (resolve, reject) {
      let sql = `update ${business_type} set password = '${hashPassword.generate(newPassword)}' where applicant_id = ${applicant_id}`;
      DbInstance.executeQuery(sql).then(res => {
        logger.info('saveNewPassword() executed');
        resolve(res);
      }).catch(err => {
        logger.error('error while execute the query');
        reject(err);
      })
    })
  }


}

