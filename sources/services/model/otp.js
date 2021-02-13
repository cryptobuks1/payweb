/**
 * otpModel Model
 * otpModel is used for the get and verify otp with email and mobile id .
 * @package otpModel
 * @subpackage sources/services/model/otpModel
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu.
 */

import { sqlObj } from '../utility/sql';
import { Utils} from '../utility/utils';
const utils = new Utils();
import { DbConnMgr } from '../dbconfig/dbconfig';
let db = DbConnMgr.getInstance();
let format = require('string-format');

export class OtpModel {
  constructor() { }

  //method to store OTP in database
  saveOtp(emailOrmobile, otp, createdOn) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.otp.saveOtp;
      let sqlQuery = format(sql, emailOrmobile, otp, createdOn);

      db.doRead(sqlQuery).then(result => {
        resolve(result);
      })
        .catch(err => {
          reject(new Error(err));
        })
    })
  }

  //method to update OTP is refference value is already exist
  updateOtp(otp, createdOn, emailOrmobile) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.otp.updateOtp;
      let sqlQuery = format(sql, otp, createdOn, emailOrmobile);

      db.doUpdate(sqlQuery).then(result => {
        resolve(result);
      })
        .catch(err => {
          reject(new Error(err));
        })
    })
  }

  //Check wheather the given value is exist or not
  isUnique(emailOrmobile) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.otp.isExist;
      let sqlQuery = format(sql, emailOrmobile);

      db.doRead(sqlQuery).then(result => {
        resolve(result);
      })
        .catch(err => {
          reject(new Error(err));
        })
    })
  }

  //Method to check wheather the OTP is expired or verified
  isExpired(emailOrmobile, otp) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.otp.isExpire;
      let sqlQuery = format(sql, emailOrmobile, otp);

      db.doRead(sqlQuery).then(result => {
        resolve(result);
      })
        .catch(err => {
          reject(new Error(err));
        })
    })
  }

  //Method for VerifyOtp
  verifyOtp(updatedOn, emailOrmobile) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.otp.verifyOtp;
      let sqlQuery = format(sql, updatedOn, emailOrmobile);

      db.doRead(sqlQuery, updatedOn, emailOrmobile).then(result => {
        resolve(result);
      })
        .catch(err => {
          reject(new Error(err));
        })
    })
  }

  //Do expire OTP
  doExpireOtp(emailOrmobile) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.otp.doExpireOtp;
      let sqlQuery = format(sql, emailOrmobile, utils.getGMT());

      db.doRead(sqlQuery).then(result => {
        resolve(result);
      })
        .catch(err => {
          reject(new Error(err));
        })
    })
  }
}