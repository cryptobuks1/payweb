/**
 * currencyRateModel
 * this is used for the check the current currency rates and also show the convertamount with multiple Currency
 * @package currencyRateModel
 * @subpackage model/currencyRateModel
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */
"use strict";
import { DbConnMgr } from '../dbconfig/dbconfig';
const DbInstance = DbConnMgr.getInstance();
import { sqlObj } from '../utility/sql';
import {Utils} from '../utility/utils';
let util = new Utils();
const format = require('string-format');
export class CurrencyRate {
    constructor(user) {
        this.isConvert = user.isConvert;
        this.from_currency = user.from_currency;
        this.amount = user.amount;
        this.check_rates_id = user.check_rates_id;
        this.to_currency = user.to_currency;
    }
    currencyRate(applicantId, isConvert) {
        return new Promise((resolve, reject) => {
            logger.info("currencyRate() initiated");
            let sql = sqlObj.currencyRate.currencyRate;
            let sqlQuery = format(sql, applicantId, isConvert)
            DbInstance.doRead(sqlQuery).then(result => {
                logger.info("query executed");
                resolve(result);
            }).catch(err => {
                logger.error("error while  execute the query");
                reject(err);
            });
        })
    }
    convertionAmount(applicantId, isConvert) {
        return new Promise((resolve, reject) => {
            logger.info("currencyRate() initiated");
            let sql = sqlObj.currencyRate.convertionAmount ;
            let sqlQuery = format(sql,applicantId, isConvert)
            DbInstance.doRead(sqlQuery).then(result => {
                logger.info("query executed");
                resolve(result);
            }).catch(err => {
                logger.error("error while  execute the query");
                reject(err);
            });
        })
    }
    deleteCurrencyRate(id) {
        return new Promise((resolve, reject) => {
            logger.info("currencyRate() initiated");
            let sql = sqlObj.currencyRate.deleteCurrencyRate;
            let sqlQuery = format(sql,id);
            DbInstance.doDelete(sqlQuery).then(result => {
                logger.info("query executed");
                resolve(result);
            }).catch(err => {
                logger.error("error while  execute the query");
                reject(err);
            });
        })
    }
    selectRate(applicant_id, from_currency, to_currency, isConvert) {
        return new Promise((resolve, reject) => {
            let sql = sqlObj.currencyRate.selectRate;
            let sqlQuery = format(sql,applicant_id, from_currency,isConvert,to_currency);
            DbInstance.doRead(sqlQuery)
                .then(results => {
                    resolve(results);
                })
                .catch(err => {
                    reject(err);
                });
        })
    }
    addRate(applicant_id, from_currency, to_currency, isConvert, created_on) {
        return new Promise((resolve, reject) => {
            let sql = sqlObj.currencyRate.addRate;
            let sqlQuery = format(sql,applicant_id, from_currency, to_currency, isConvert,util.getGMT() )
            DbInstance.doInsert(sqlQuery)
                .then(checkRateRes => {
                    resolve(checkRateRes);
                })
                .catch(err => {
                    reject({ err });
                });
        })
    }
}