/**
 * transactionModel
 * This api is used for to send or receive payments from bussiness app and also 
 * used for set volume of business transations.
 * @package transactionModel
 * @subpackage model/transactionModel
 *  @author SEPA Cyper Technologies, Satyanarayana G,Krishnakanth R
 */

// import mariadb from '../dbconfig/dbconfig';
"use strict"
const config = require('../dbconfig/connection').config;
// var sqlConfig = require('../utility/sqlService');
import { sqlConfig } from '../utility/sqlService';
import mariadb from 'mariadb';
import { DbConnMgr } from "../dbconfig/dbconfig";
import { Utils } from "../utility/utils";
const DbInstance = DbConnMgr.getInstance();
import util from 'util';
const format = require('string-format');

export class Transaction {
  constructor() {

  }

  transactionPayment(rowItems) {
    return new Promise((resolve, reject) => {
      logger.info('transactionPayment() initiated');
      mariadb.createConnection(config).then(conn => {
        conn.batch(sqlConfig.transactionSql.insertCountry, rowItems).then(res => {
          logger.info('transactionPayment() exited');
          conn.close();
          resolve(res);
        }).catch(err => {
          conn.close();
          logger.error('transactionPayment() Error', err);
          reject(err);
        })
      }).catch(err => {
        conn.close();
        logger.error('transactionPayment() Error', err);
        reject(err);
      })
    })
  }

  getTransaction(id) {
    return new Promise((resolve, reject) => {
      logger.info('getTransaction() initiated');
      let sql = util.format(sqlConfig.transactionSql.select_transaction_country, id);
      DbInstance.executeQuery(sql).then(res => {
        logger.info('getTransaction() exited');
        resolve(res);
      }).catch(err => {
        logger.error('getTransaction() Error', err);
        reject(err);
      })
    })
  }

  updateTransaction(country_id,business_description,transaction_type, id) {
    return new Promise((resolve, reject) => {
      const util = new Utils(); 
      logger.info('getTransaction() initiated');      
      let sql = format(sqlConfig.transactionSql.update_transcation_country, id,country_id,business_description,transaction_type, util.getGMT());      
      DbInstance.doUpdate(sql).then(res => {
        logger.info('getTransaction() exited');
        resolve(res);
      }).catch(err => {
        logger.error('getTransaction() Error', err);
        reject(err);
      })
    })
  }

  transactionVolume(transaction) {
    return new Promise((resolve, reject) => {
      logger.info('transactionVolume() initiated');
      let sql = util.format(sqlConfig.transactionSql.insertQuery, transaction.business_id, transaction.monthy_transfer_amount, transaction.no_payments_per_month, transaction.max_value_of_payment);
      DbInstance.executeQuery(sql).then(res => {
        logger.info('transactionVolume() exited');
        resolve(res);
      }).catch(err => {
        logger.error('transactionVolume() Error', err);
        reject(err);
      })
    })
  }

  getTransactionVolume(business_id) {
    return new Promise((resolve, reject) => {
      logger.info('gettransactionVolume() initiated');
      let sql = util.format(sqlConfig.transactionSql.select_transaction_volume, business_id);
      DbInstance.doRead(sql).then(res => {
        logger.info('gettransactionVolume() exited');
        resolve(res);
      }).catch(err => {
        logger.error('gettransactionVolume() Error', err);
        reject(err);
      })
    })
  }

  getBusinessId(applicant_Id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getBusinessId() ');
      let sql = sqlConfig.transactionSql.getBusinessId;
      let sqlQuery = format(sql, applicant_Id);
      DbInstance.doRead(sqlQuery).then(businessInfo => {
        logger.info('success in  getBusinessId() ');
        resolve(businessInfo);
      }).catch(err => {
        logger.error('error in  getBusinessId() ');
        reject(err);
      });
    });
  }

}
