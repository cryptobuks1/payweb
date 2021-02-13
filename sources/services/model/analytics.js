/**
 * moneyTransfer
 * This model contains all the methods to support a successful money transfer from one currency account
 * to another.
 * @package moneyTransfer
 * @subpackage model/moneyTransfer
 * @author SEPA Cyber Technologies Sekhara Suman Sahu
 */

import { DbConnMgr } from '../dbconfig/dbconfig';
import { Utils } from '../utility/utils';
let utils = new Utils();
import { sqlObj } from '../utility/sql';
let format = require('string-format');

const dbInstance = DbConnMgr.getInstance();
const db = DbConnMgr.getInstance();

const STATUS = {
	SUCCESS: 0,
	FAILURE: 1
}

export class MoneyTransfer {
	constructor(transDetail) {
		this.applicant_id = transDetail.applicant_id;
		this.from_currency = transDetail.from_currency;
		this.to_currency = transDetail.to_currency;
		this.to_mobile = transDetail.to_mobile;
		this.amount = transDetail.amount;
		this.currency_type = transDetail.currency_type;
		this.device_type = transDetail.device_type;
		this.account_type = transDetail.account_type;
		this.receiver_applicant_id = transDetail.receiver_applicant_id;
		this.transaction_time = transDetail.transaction_time;
	}

	getTransactionDetails(applicantId) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getTransactionDetails;
			let sqlQuery = format(sql, applicantId);
			console.log("**** getTransactionDetails SQL Query "+sqlQuery)
			db.doRead(sqlQuery).then(results => {
				resolve(results);
			}).catch(err => {
				reject(err);
			});
		});
	}

	transactionDetailsByAccount(account, currency) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.transactionDetailsByAccount;
			let sqlQuery = format(sql, account, currency);
			db.doRead(sqlQuery).then(results => {
				resolve(results);
			}).catch(err => {
				reject(err);
			});
		});
	}

	//Method for getting currency account number.
	getFromCurrencyAccountno(currencytype, applicantid) {
		return new Promise((resolve, reject) => {
			logger.info('getFromCurrencyAccountno() initiated');
			let sql = sqlObj.webTransaction.getFromCurrencyAccountno;
			let sqlQuery = format(sql, currencytype, applicantid)
			db.doRead(sqlQuery).then(result => {
				logger.info('getFromCurrencyAccountno() execution completed');
				resolve(result);
			}).catch(err => {
				logger.error(err);
				logger.info('getFromCurrencyAccountno() execution completed');
				reject(err);
			})
		})
	}

	getWebTransactionDetails(applicantid, rangeDate, currentDate) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getWebTranstatement;
			let sqlQuery = format(sql, applicantid, `${rangeDate}`, `${currentDate}`);
			console.log("****** getWebTransactionDetails "+sqlQuery)
			db.doRead(sqlQuery).then(result => {
				resolve(result);
			})
				.catch(err => {				
					reject(err);
				})
		})
	}

	getWebTransByAccount(accountNo, rangeDate, currentDate) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getWebTransByDB;
			let sqlQuery = format(sql, accountNo, `${rangeDate}`, `${currentDate}`);

			db.doRead(sqlQuery).then(transRes => {
				resolve(transRes);
			})
				.catch(err => {
					reject(err);
				})
		})
	}



}