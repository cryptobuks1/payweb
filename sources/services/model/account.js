/**
 * account
 * This model is used to support the account controller methods.
 * @package account
 * @subpackage model/account
 *  @author SEPA Cyber Technologies, krishnakanth.r, Sekhara suman sahu
 */
"use strict";

import { DbConnMgr } from "../dbconfig/dbconfig";
import {sqlObj} from '../utility/sql';
import { Utils } from "../utility/utils";
const util = new Utils()
let timestamp = util.getGMT();
const format = require('string-format');
const dbInstance = DbConnMgr.getInstance();


export class Account {
  constructor() { }

  isCurrencyAccountExist(currency,applicantId) {
    return new Promise((resolve, reject) => {
      logger.info('isCurrencyAccountExist() initiated');
      // let { currency, balance, status, role } = userAccount
      let sql = sqlObj.account.isCurrencyAccountExist;
      let sqlQuery = format(sql,currency,applicantId)
      dbInstance.doRead(sqlQuery).then(result => {
        logger.info('isCurrencyAccountExist() execution completed');
        //resolve(_.filter(result, { status: 1 }))
        resolve(result);
      }).catch(err => {
        logger.info('isCurrencyAccountExist() execution completed');
        logger.error(err);
        reject(err)
      });
    });
  }

  updateCurrencyAccount(status,applicantId,currency) {
    return new Promise((resolve, reject) => {
      logger.info('updateCurrencyAccount() initiated');
      let sql = sqlObj.account.updateCurrencyAccount;
      let sqlQuery = format(sql, status, timestamp, currency,applicantId)
      dbInstance.doUpdate(sqlQuery).then(result => {
        logger.info('updateCurrencyAccount() execution completed');
        resolve(result);
      }).catch(err => {
        logger.error(err);
        logger.info('updateCurrencyAccount() execution completed');
        reject(err)
      });
    });
  }

  createCurrencyAccount(currency,applicantId) {
    return new Promise((resolve, reject) => {
      logger.info('createCurrencyAccount() initiated');
      // let timestamp = util.getGMT();
      let sql = sqlObj.account.createCurrencyAccount;
      let sqlQuery = format(sql, currency, applicantId,  timestamp)
      console.log("****createCurrencyAccount sqlQuery", sqlQuery);
      dbInstance.doInsert(sqlQuery).then(result => {
        logger.info('createCurrencyAccount() execution completed');
        //resolve(_.filter(result, { status: 1 }))
        resolve(result);
      }).catch(err => {
        logger.info('createCurrencyAccount() initiated');
        logger.error(err);
        reject(err)
      });
    });
  }

  getAccount(applicantId) {
    return new Promise((resolve, reject) => {
      logger.info('getAccount() initiated');
      let sql = sqlObj.account.getAccount;
      let sqlQuery = format(sql, applicantId);
      dbInstance.doRead(sqlQuery)
        .then(result => {
          logger.info('getAccount() execution completed');
          resolve(result)
        }).catch(err => {
          logger.error(err);
          logger.info('getAccount() execution completed');
          reject(err)
        });
    });
  }

  getByCurrency(applicantId) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.account.getByCurrency;
      let sqlQuery = format(sql, applicantId);
      dbInstance.doRead(sqlQuery).then((res) => {
        resolve(res)
      }).catch(err => {
        reject({ err });
      });
    });
  }

  //method for activate or deactivate account
  activateAccount(currency, applicantId) {
    return new Promise((resolve, reject) => {
      logger.info('activateAccount() initiated');
      let sqlQuery = format(sql, timestamp, applicantId, currency);
      dbInstance.doUpdate(sqlQuery)
        .then((result) => {
          logger.info('activateAccount() execution completed');
          resolve(result);
        }).catch(err => {
          logger.error(err);
          reject(err);
        });
    });
  }
}
