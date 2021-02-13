/**
 * currencyExchange
 * This model is used to support the currencyExchange methods.
 * @subpackage model/currencyExchangeModel
 *  @author SEPA Cyber Technologies, Tarangini Dola
 */
'use strict';
import { DbConnMgr } from '../dbconfig/dbconfig';
const dbInstance = DbConnMgr.getInstance();
const format = require('string-format');
import { sqlObj } from '../utility/sql';

export class CurrencyNotify {
  constructor(user) {
    this.applicant_id = user.applicant_id;
    this.auto_exchange_id = user.auto_exchange_id;
    this.amount = user.amount;
    this.target_amount = user.target_amount;
    this.from_currency = _.toUpper(user.from_currency);
    this.to_currency = _.toUpper(user.to_currency);
    this.exchange_status = user.exchange_status;

  }
  //This method is used in insertCurrencyExchangeInfo method
  CurrencyExchangeInfo(account_no, from_currency, to_currency, amount, target_amount, status) {
    logger.info('currencyExchangeInfo() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.currencyExchange.CurrencyExchangeInfo;
      let sqlQuery = format(sql, account_no, from_currency, to_currency, amount, target_amount, status)
      dbInstance.doRead(sqlQuery).then(res => {
        logger.info('execution completed');
        resolve(res)
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }

  // This method is used for insert the CurrencyExchange details in currencyExchange table
  insertCurrencyExchangeInfo(applicant_id, account_no, from_currency, to_currency, amount, target_amount, status, timeStamp) {
    logger.info('insertCurrencyExchangeInfo() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.currencyExchange.insertCurrencyExchangeInfo;
      let sqlQuery = format(sql, applicant_id, account_no, from_currency, to_currency, amount, target_amount, status,timeStamp)
      dbInstance.doInsert(sqlQuery).then(res => {
        logger.info('execution completed');
        resolve(res);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }

  // This method is used for get all the data from currency exchange
  getCurrencyExchange(applicant_id, status) {
    logger.info('getCurrencyExchange() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.currencyExchange.getCurrencyExchange;
      let sqlQuery = format(sql, applicant_id, status)
      dbInstance.doRead(sqlQuery).then((data) => {
        logger.info('query executed');
        resolve(data);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }

  // This method is used for delete the data from currency exchange
  deleteCurrencyExchange(auto_exchange_id, status, timestamp) {
    logger.info('deleteCurrencyExchange() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.currencyExchange.deleteCurrencyExchange;
      let sqlQuery = format(sql, auto_exchange_id, status, timestamp)
      dbInstance.doUpdate(sqlQuery).then(data => {
        logger.info('execution completed');
        resolve(data);
      }).catch(err => {
        logger.error('error while execute the query');
        reject(err);
      })
    });
  }

  // This method is used for update the data from currency exchange
  updateCurrencyExchange(amount, target_amount, from_currency, to_currency, status, auto_exchange_id, timestamp) {
    logger.info('updateCurrencyExchange() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.currencyExchange.updateCurrencyExchange;
      let sqlQuery = format(sql, amount, target_amount, from_currency, to_currency, status, auto_exchange_id, timestamp)
      dbInstance.doUpdate(sqlQuery).then((data) => {
        logger.info('execution completed');
        resolve(data);
      }).catch(err => {
        logger.error('error while execute the query')
        reject(err);

      })
    })
  }
  getAccountNumber(applicantId, currency,active) {
    logger.info("getAccountNumber() initiated")
    return new Promise((resolve, reject) => {
      let sql = sqlObj.currencyExchange.getAccountNumber;
      let sqlQuery = format(sql, applicantId, currency,active)
      dbInstance.doRead(sqlQuery).then((data) => {
        logger.info('execution completed');
        resolve(data);
      }).catch(err => {
        logger.error('error while execute the query')
        reject(err);
      })
    })
  }
  checkExchangeInfo(id, status) {
    logger.info("checkExchangeInfo() initiated")
    return new Promise((resolve, reject) => {
      let sql = sqlObj.currencyExchange.checkExchangeInfo;
      let sqlQuery = format(sql, id, status)
      dbInstance.doRead(sqlQuery).then((data) => {
        logger.info('execution completed');
        resolve(data);
      }).catch(err => {
        logger.error('error while execute the query')
        reject(err);
      })
    })

  }
}
