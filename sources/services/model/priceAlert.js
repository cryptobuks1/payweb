'use strict';

import { DbConnMgr } from '../dbconfig/dbconfig';
import { sqlObj } from '../utility/sql';
import { Utils } from '../utility/utils';
let utils = new Utils();
const format = require('string-format');
const dbInstance = DbConnMgr.getInstance();

export class PriceAlert {
  constructor(user) {
    this.applicant_id = user.applicant_id;
    this.alert_id = user.price_alert_id;
    this.target_amount = user.target_amount;
    this.from_currency = _.toUpper(user.from_currency);
    this.to_currency = _.toUpper(user.to_currency);
    this.alert_status = user.alert_status;
  }
  checkAlertInfo(applicant_id, from_currency, to_currency, target_amount, status) {
    logger.info(' checkAlertInfo() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.priceAlert.checkAlertInfo;
      let sqlQuery = format(sql, from_currency, to_currency, status, target_amount, applicant_id)
      dbInstance.doRead(sqlQuery).then(res => {
        logger.info('execution completed');
        resolve(res);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }
  createPriceAlert(applicant_id, from_currency, to_currency, target_amount, status) {
    logger.info('createPriceAlert() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.priceAlert.createPriceAlert;
      let sqlQuery = format(sql, applicant_id, from_currency, to_currency, target_amount, status, utils.getGMT())
      dbInstance.doInsert(sqlQuery).then(res => {
        logger.info('execution completed');
        resolve(res);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }
  getAlertDetails(applicant_id, status) {
    logger.info(' getAlertDetails() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.priceAlert.getAlertDetails;
      let sqlQuery = format(sql, applicant_id, status)
      dbInstance.doRead(sqlQuery).then(res => {
        logger.info('execution completed');
        resolve(res);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }
  updateAlertDetails(applicant_id, alert_id, from_currency, to_currency, target_amount, status, timeStamp) {
    logger.info('  updateAlertDetails() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.priceAlert.updateAlertDetails;
      let sqlQuery = format(sql, from_currency, to_currency, target_amount, status, timeStamp, applicant_id, alert_id)
      dbInstance.doUpdate(sqlQuery).then(res => {
        logger.info('execution completed');
        resolve(res);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }
  deletePriceAlert(applicant_id, alert_id, status, timeStamp) {
    logger.info('deletePriceAlert() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.priceAlert.deletePriceAlert;
      let sqlQuery = format(sql, status, timeStamp, applicant_id, alert_id)
      dbInstance.doDelete(sqlQuery).then(res => {
        logger.info('execution completed');
        resolve(res);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }
  checkPriceAlertInfo(id, status) {
    logger.info('checkAlertInfo() intiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.priceAlert.checkPriceAlertInfo;
      let sqlQuery = format(sql, id, status)
      dbInstance.doRead(sqlQuery).then(res => {
        logger.info('execution completed');
        resolve(res);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })

  }
}
