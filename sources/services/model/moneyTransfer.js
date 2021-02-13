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
	//Method for checking minimum balance of an account before transfering money
	checkMinimumBalance(accountNo) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.checkMinimumBalance;
			let sqlQuery = format(sql, accountNo)
			db.doRead(sqlQuery).then(results => {
				resolve(results);
			}).catch(err => {
				reject(err);
			});
		});
	}
	deductAmnt(fromAccount, deductBalance, conn) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.deductAmnt;			
			let sqlQuery = format(sql, fromAccount, deductBalance, utils.getGMT());
			db.doUpdate(sqlQuery).then(results => {
				resolve(results);
			}).catch(err => {
				reject(err);
			});
		})
	}

	addAmnt(toAmnt, toAccount, conn) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.addAmnt;
			let sqlQuery = format(sql, toAmnt, toAccount, utils.getGMT());
			conn.query(sqlQuery).then(result => {
				resolve(result);
			}).catch(err => {
				reject(err);
			})
		})
	}
	getFullName(accountNo) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getFullName;
			let sqlQuery = format(sql, accountNo);
			db.doRead(sqlQuery).then(results => {
				resolve(results);
			}).catch(err => {
				reject(err);
			});
		})
	}

	insertTransaction(applicantId, transnum, transtype, from_account, to_account, currency, fullname, transaction_operation,
		amount,desc, timestamp, conn, counterparty_mobile, counterparty_email, requested_currency) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.insertTransaction;
			let sqlQuery = format(sql, applicantId, transnum, transtype, from_account, to_account, currency, fullname, transaction_operation,
				amount,desc, timestamp, counterparty_mobile, counterparty_email, requested_currency)

				console.log("$$$$$$ insertTransaction"+sqlQuery)
				conn.query(sqlQuery).then(results => {
					console.log("successfully inserted", results);
				resolve(results);
			}).catch(err => {
				reject(err);
			});
		});
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

	getRequestedCurrencyType(transaction_number,recipientApplicantId) {
		return new Promise((resolve, reject) => {
			logger.info('getRecipientCurrencyAccount() initiated');
			let sql = sqlObj.webTransaction.getRequestedCurrencyType;
			let sqlQuery = format(sql, transaction_number,recipientApplicantId);
			db.doRead(sqlQuery).then(result => {
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

	getRecipientCurrencyAccount(toMobile,applicant_id, toCurrency) {
		return new Promise((resolve, reject) => {
			logger.info('getRecipientCurrencyAccount() initiated');
			let sql = sqlObj.webTransaction.getRecipientCurrencyAccount;
			let sqlQuery = format(sql, toMobile, toCurrency, applicant_id);
			console.log("sqlQuery", sqlQuery);
			db.doRead(sqlQuery).then(result => {
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

	getWebTransactionDetail_statement(applicantid, rangeDate, toDate) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getWebTranstatement;
			let sqlQuery = format(sql, applicantid, `${rangeDate}`, `${toDate}`);
			console.log("****** getWebTransactionDetailstatement "+sqlQuery)
			db.doRead(sqlQuery).then(result => {
				resolve(result);
			})
				.catch(err => {				
					reject(err);
				})
		})
	}

	getWebTransactionDetails(applicantid, rangeDate, currentDate) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getWebTrans;
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
			let sql = sqlObj.webTransaction.getWebTransByAcc;
			let sqlQuery = format(sql, accountNo, `${rangeDate}`, `${currentDate}`, accountNo, `${rangeDate}`, `${currentDate}`);

			db.doRead(sqlQuery).then(transRes => {
				resolve(transRes);
			})
				.catch(err => {
					reject(err);
				})
		})
	}

	getRecipientApplicantID(mobile) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getRecipientApplicantID;
			let sqlQuery = format(sql, mobile);
			db.doRead(sqlQuery).then(applicantID => {
				resolve(applicantID);
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	getDeviceInfoForApplicantID(receiver_applicant_id) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getDeviceInfo;
			let sqlQuery = format(sql, receiver_applicant_id);
			db.doRead(sqlQuery).then(deviceInfo => {
				resolve(deviceInfo);
			}).catch(err => {
				reject(err);
			});
		});
	}

	getRecipientDetailsByEmail(email) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getRecipientDetailsByEmail;
			let sqlQuery = format(sql, email);
			db.doRead(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});
	}

	insertNonPayvooTransaction(unique_payment_id, receiver_name, receiver_email, currency, receiver_mobile, amount, sender_name, sender_email, sender_applicant_id, is_money_received, transaction_operation) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.insertNonPayvooTransaction;
			let sqlQuery = format(sql, unique_payment_id, receiver_name, receiver_email, currency, receiver_mobile, amount, sender_name, sender_email, sender_applicant_id, is_money_received, transaction_operation)
			db.doInsert(sqlQuery).then(results => {
				resolve(results);
			}).catch(err => {			
				reject({err});
			});
		});
	}

	getAccountType(applicant_id) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getAccountType;
			let sqlQuery = format(sql, applicant_id);
			db.doRead(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});
	}

	getNonPayvooTransactionDetails(payment_id) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getNonPayvooTransactionDetails;
			let sqlQuery = format(sql, payment_id);
			db.doRead(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});
	}

	getNonPayvooTransactionsOfReceiverByEmail(email) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getNonPayvooTransactionsOfReceiver;
			let sqlQuery = format(sql, email);
			db.doRead(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});		
	}

	updateNonPayvooUser(email, mobile) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.updateNonPayvooUser;
			let sqlQuery = format(sql, email, mobile);
			db.doRead(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});		
	}

	updateUserCounterpaty(email, mobile) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.updateUserCounterpaty;
			let sqlQuery = format(sql, email, mobile);
			db.doRead(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});		
	}

	deleteNonPayvooTransactionsOfReceiverByEmail(email) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.deleteNonPayvooTransactionsOfReceiver;
			let sqlQuery = format(sql, email);
			db.doDelete(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});
	}

	checkIfTrasanctionExistsForApplicantId(applicant_id) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.checkIfApplicantIdExistsInTransaction;
			let sqlQuery = format(sql, applicant_id);
			db.doDelete(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});

	}

	checkNonPayvooUserPayments(email) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.checkNonPayvooUserPayments;
			let sqlQuery = format(sql, email);
			db.doDelete(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});
	}

	getBusinessDetails(applicant_id) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getBusinessDetails;
			let sqlQuery = format(sql, applicant_id);
			db.doRead(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});
	}

	getContactDetails(applicant_id) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.webTransaction.getContactDetails;
			let sqlQuery = format(sql, applicant_id);
			db.doRead(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});
	}
}