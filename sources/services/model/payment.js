/**
 * payment Model
 * payment Model is used for fetching kyc status related functions.
 * @package kyc
 * @subpackage sources/services/model/payment
 * @author SEPA Cyper Technologies, Satyanarayana G.
 */

'use strict';

import { DbConnMgr } from '../dbconfig/dbconfig';
import { langEngConfig } from '../utility/lang_eng';
import { Utils } from '../utility/utils';
import { sqlObj } from '../utility/sql';
let utils = new Utils();
const format = require('string-format');
const DbInstance = DbConnMgr.getInstance();

export class Payment {
  constructor() {
    this.ERROR_CODES = {
      SUCCESS: 0,
      FAIL: 1
    }
  }

  updateCurrencyInAccounts(selectedFromCurreny,applicant_id, account_no) {
    return new Promise((resolve, reject) => {
      logger.info('Initialize  getUserCardDetails()');      
      let sql = sqlObj.payments.updateCurrencyInAccounts;
      let sqlQuery = format(sql, selectedFromCurreny,applicant_id, account_no)     
      console.log("sqlQuery", sqlQuery);
      DbInstance.doRead(sqlQuery).then(res => {
        logger.info('getUserCardDetails successfully retrived');      
        resolve(res);
      }).catch(err => {    
        logger.error('Error while getUserCardDetails Fail');
        reject(err);
      })
    })
  }

  updateTransactions(selectedFromCurreny,toAmount, transaction_id,status,transactiontype, transaction_operation, from_account, to_account, transaction_time) {
    return new Promise((resolve, reject) => {
      logger.info('Initialize  getUserCardDetails()');      
      let sql = sqlObj.payments.updateTransactions;
      let sqlQuery = format(sql, transaction_id,status,transactiontype, transaction_operation, '', selectedFromCurreny, toAmount, from_account, to_account, transaction_time)     
      console.log("sqlQuery", sqlQuery);
      DbInstance.doRead(sqlQuery).then(res => {
        logger.info('getUserCardDetails successfully retrived');      
        resolve(res);
      }).catch(err => {    
        logger.error('Error while getUserCardDetails Fail');
        reject(err);
      })
    })
  }

  updateReceiveTransactions(transaction_number,status,transactiontype, transaction_operation, to_account, requested_currency, transaction_time) {
    return new Promise((resolve, reject) => {
      logger.info('Initialize  getUserCardDetails()');      
      let sql = sqlObj.payments.updateReceiveTransactions;
      let sqlQuery = format(sql,transaction_number, status,transaction_operation, transactiontype, '', to_account, requested_currency, transaction_time)     
      DbInstance.doRead(sqlQuery).then(res => {
        logger.info('getUserCardDetails successfully retrived');      
        resolve(res);
      }).catch(err => {    
        logger.error('Error while getUserCardDetails Fail');
        reject(err);
      })
    })
  }
  getUserCardDetails(applicant_id, payment_cards_id, account_id) {
    return new Promise((resolve, reject) => {
      logger.info('Initialize  getUserCardDetails()');      
      let sql = sqlObj.payments.getUserCardDetails;
      let sqlQuery = format(sql, applicant_id, payment_cards_id, account_id)     
      DbInstance.doRead(sqlQuery).then(res => {
        logger.info('getUserCardDetails successfully retrived');      
        resolve(res);
      }).catch(err => {    
        logger.error('Error while getUserCardDetails Fail');
        reject(err);
      })
    })
  }

  insertPayment(responseData) {
    return new Promise((resolve, reject) => {
      logger.info('Initialize  insertPayment()');
      let timestamp = utils.getGMT();
      let sql = sqlObj.payments.insertPayment;
      let sqlQuery = format(sql, responseData.applicant_id, responseData.paymentId, responseData.status, responseData.paymentBrand, responseData.paymentMode, responseData.firstName, responseData.lastName, responseData.amount, responseData.currency, responseData.descriptor, responseData.result, responseData.card, responseData.customer, responseData.transaction_details, responseData.timestamp, responseData.merchantTransactionId, responseData.remark, responseData.transactionStatus, responseData.tmpl_amount,
        responseData.tmpl_currency, responseData.eci, responseData.checksum, responseData.orderDescription, responseData.companyName, responseData.merchantContact, timestamp);
      
        DbInstance.doInsert(sqlQuery).then(res => {
        logger.info('insertPayment successfully retrived');
        resolve({ status: 1, message: langEngConfig.message.payment.modelsuccess });
      }).catch(err => {
        logger.error('Error while insertPayment fail');
        reject({ status: 0, message: langEngConfig.message.payment.modelfail });
      })
    })
  }

  getFullName(accountNo) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getFullName;
			let sqlQuery = format(sql, accountNo);
			DbInstance.doRead(sqlQuery).then(results => {
				resolve(results);
			}).catch(err => {
				reject(err);
			});
		})
  }

  getBusinessDetails(applicantId) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getBusinessDetails;
      let sqlQuery = format(sql, applicantId);
			DbInstance.doRead(sqlQuery).then(results => {
				resolve(results);
			}).catch(err => {
				reject(err);
			});
		})
  }
  
  getRecipientCurrencyAccount(toMobile,applicant_id, toCurrency) {
		return new Promise((resolve, reject) => {
			logger.info('getRecipientCurrencyAccount() initiated');
			let sql = sqlObj.webTransaction.getRecipientCurrencyAccount;
			let sqlQuery = format(sql, toMobile, toCurrency, applicant_id);
			DbInstance.doRead(sqlQuery).then(result => {
				logger.info('getRecipientCurrencyAccount() execution completed');				
				resolve(result);
			})
				.catch(err => {
					logger.error(err);
					logger.info('getRecipientCurrencyAccount() execution completed');
					reject(err);
				})
		})
  }

  getTransactionOperation(transaction_number,transaction_id) {
    return new Promise((resolve, reject) => {
			logger.info('getRecipientCurrencyAccount() initiated');
			let sql = sqlObj.webTransaction.getTransactionOperation;
			let sqlQuery = format(sql, transaction_number,transaction_id);
			DbInstance.doRead(sqlQuery).then(result => {
				logger.info('getRecipientCurrencyAccount() execution completed');
				resolve(result);
			})
				.catch(err => {
					logger.error(err);
					logger.info('getRecipientCurrencyAccount() execution completed');
					reject(err);
				})
		})
  }
  
  insertTransaction(applicantId, transnum, transtype, from_account, to_account, currency, fullname, transaction_operation,
		amount,desc,receiverMobile,requestedByEmail, timestamp, conn, requested_currency) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.insertTransaction;
			let sqlQuery = format(sql, applicantId, transnum, transtype, from_account, to_account, currency, fullname, transaction_operation,
        amount,desc, timestamp, receiverMobile,requestedByEmail, requested_currency)
			conn.query(sqlQuery).then(results => {
				resolve(results);
			}).catch(err => {
				reject(err);
			});
		});
  }
  
  
  updateRequestTransaction(status, transactiontype, transactionNumber, transaction_operation, description, transaction_time) {
    return new Promise((resolve, reject) => {
			let sql = sqlObj.payments.updateDecline;
			let sqlQuery = format(sql,status, transactiontype, transactionNumber, transaction_operation, description, transaction_time);
			DbInstance.doDelete(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});
  }

  getEmailId(applicant_id) {
    return new Promise((resolve, reject) => {
      logger.info('Initialize  getUserCardDetails()');      
      let sql = sqlObj.payments.getEmail;
      let sqlQuery = format(sql, applicant_id)     
      DbInstance.doRead(sqlQuery).then(res => {
        logger.info('getUserCardDetails successfully retrived');      
        resolve(res);
      }).catch(err => {    
        logger.error('Error while getUserCardDetails Fail');
        reject(err);
      })
    })
  }
  updateAccountDetails(applicantId, account_number, currency, role, paymentReference, paymentAmount) {
    let accountData = {};

    accountData.applicantId = applicantId;
    accountData.accountNumber = account_number;
    accountData.paymentAmount = paymentAmount;
    accountData.currency = currency;
    accountData.role = role;
    accountData.amount = paymentReference.amount;
    accountData.paymentObj = paymentReference;

    return new Promise(function (resolve, reject) {
      let timestamp = utils.getGMT();
      logger.info('Initialize  updateAccountDetails()');
      let sql_select = sqlObj.payments.updateAccountDetails.sql_select;
      let sqlQuery_select = format(sql_select, accountData.applicantId, accountData.paymentObj.paymentId);
      DbInstance.doRead(sqlQuery_select).then(function (paymentObject) {
        let sql_update = sqlObj.payments.updateAccountDetails.sql_update;
        let sqlQuery_update = format(sql_update, accountData.paymentAmount, accountData.applicantId, accountData.accountNumber, timestamp)
        DbInstance.doUpdate(sqlQuery_update).then(function (accountObject) {
          logger.info('updateAccountDetails() success');          
          resolve({ 'status': 1, 'message': 'account updated successfully', 'paymentObject': paymentObject[0], 'accountObject': accountObject })
        }, function (err) {
          logger.info('updateAccountDetails() failure');
          reject({ 'status': 0, 'message': langEngConfig.message.payment.accounterror })
        }
        )
      }, function (err) {
        logger.info('selection fail while , updateAccountDetails()');
        reject({ 'status': 0, 'message': langEngConfig.message.payment.accounterror2 })
      }
      )
    })
  }

  insertTransactionDetails(paymentsid, applicant_id, transactionHolderName, account_id, amount, inputCurrency, transactionObj, transaction_time) {
    let transactionDetailObj = {};

    transactionDetailObj.payments_id = paymentsid;
    transactionDetailObj.applicant_id = applicant_id;
    transactionDetailObj.transactionHolderName = transactionHolderName;
    transactionDetailObj.amount = amount;
    transactionDetailObj.account_id = account_id;
    transactionDetailObj.inputCurrency = inputCurrency;
    transactionDetailObj.paymentType = (transactionObj.paymentType == 'DB') ? 'DB' : 'CR';
    transactionDetailObj.paymentBrand = transactionObj.paymentBrand;   
    return new Promise((resolve, reject) => {
      logger.info('Initialize  insertPayment()');
      let sql = sqlObj.payments.insertTransactionDetails;
      let sqlQuery = format(sql, transactionDetailObj.applicant_id, transactionDetailObj.payments_id, transactionDetailObj.account_id, transactionDetailObj.inputCurrency, transactionDetailObj.transactionHolderName, transactionDetailObj.paymentBrand, 
        transactionDetailObj.paymentType, transactionDetailObj.amount, transaction_time, '')
      DbInstance.doInsert(sqlQuery).then(res => {
        logger.info('insertPayment successfully retrived');
        resolve({ "status": 1, "message": `${transactionDetailObj.inputCurrency} ${transactionDetailObj.amount} added to wallet successfully` });
      }).catch(err => {
        logger.error('Error while insertPayment fail');
        reject({ "status": 0, "message": langEngConfig.message.payment.walleterror });
      })
    })
  }

}
