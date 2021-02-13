/**
 * signUpModel Model
 * signUpModel is used for the modeling of user registration purpose. An individual user has to give the required 
 * data to register himself in the payvoo app.
 * @package signUpModel
 * @subpackage sources/services/model/signUpModel
 * @author SEPA Cyber Technologies, Sekhara Suman Sahu.
 */

"use strict";

import {
	DbConnMgr
} from '../dbconfig/dbconfig';

const DbInstance = DbConnMgr.getInstance();
const db = DbConnMgr.getInstance();
import { sqlObj } from '../utility/sql';
import { Utils } from '../utility/utils';
let utils = new Utils();
const format = require('string-format');

export class UserModel {
	constructor() {

	}

	checkUniqueId(user_id, mobile, accountType) {
		logger.info('checkUniqueId() initiated');
		return new Promise((resolve, reject) => {
			let sql = sqlObj.signUp.checkUniqueId;
			let sqlQuery = format(sql, user_id, mobile, accountType)
			db.doRead(sqlQuery).then(userData => {
				logger.debug(sql);
				logger.info('checkUniqueId() execution completed');
				resolve(userData);
			}).catch(err => {
				logger.error(err);
				logger.info('checkUniqueId() execution completed');
				reject(new Error(err));
			});
		})
	}

    sendEmailTosandboxUser(applicantId) {
        logger.info('sendEmailTosandboxUser() initiated');
        return new Promise((resolve, reject) => {
            let sql = `SELECT ps.memberId, ps.api_key, ps.url,bu.user_id
                                 FROM sandbox ps
                                 INNER JOIN applicant bu
                                 ON ps.applicant_id = bu.applicant_id AND bu.applicant_id = ${applicantId}`;

            DbInstance.executeQuery(sql)
                .then(result => {
                    logger.info('sendEmailTosandboxUser() execution');
                    resolve(result);
                })
                .catch(err => {
                    logger.error(err);
                    logger.info('sendEmailTosandboxUser() execution');
                    reject(err);
                })
        })
    }

        

	createApplicant(conn, accountType, custid, userId, password, passcodePin, mobile, roleId, status, devicetype,devicetoken, createdOn) {
		return new Promise((resolve, reject) => {
			logger.info('createApplicant() initiated');
			let sql = sqlObj.signUp.createApplicant;
			let sqlQuery = format(sql, accountType, custid, userId, password, passcodePin, mobile, roleId, status, devicetype,devicetoken,createdOn)
			conn.query(sqlQuery).then(res => {
				logger.info('createApplicant() execution completed');
				resolve(res);
			}).catch(err => {
				logger.error(err);
				logger.info('createApplicant() execution completed');
				reject(new Error(err));
			});
		})
	}

	createMerchantUser(conn, applicantId, memberId, apiKey, url, api_doc_url, redirect_url) {
		logger.info('createMerchantUser() initiated');
		return new Promise((resolve, reject) => {
			let sql = sqlObj.signUp.createMerchantUser;
			let sqlQuery = format(sql,applicantId, memberId,apiKey,url,api_doc_url,redirect_url, utils.getCurrentTimeStamp())
			conn.query(sqlQuery).then(userResult => {
				logger.info('createMerchantUser() execution completed');
				resolve(userResult);
			}).catch(err => {
				logger.error(err);
				logger.info('createMerchantUser() execution completed');
				reject(new Error(err));
			})
		})
	}



	getApplicantContact(contactId) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.signUp.getApplicantContact;
			let sqlQuery = format(sql, contactId)			
			DbInstance.doRead(sqlQuery).then(contact => {
				resolve(contact);
			}).catch(err => {
				reject(err);
			});
		})
	}

	addCount(applicant_id, count) {
		return new Promise((resolve, reject) => {
			logger.info("addcount() initiated");
			let sql = sqlObj.signUp.addCount;
			let sqlQuery = format(sql, applicant_id, count);
			db.doUpdate(sqlQuery)
			  .then(userData => {
				logger.info("addcount() execution completed");
				resolve(userData);
			  })
			  .catch(err => {
				logger.error(err);
				logger.info("addcount() execution completed");
				reject(err);
			  });
			});
	}

	createContact(conn, applicantId, first_name, middle_name, last_name, email, gender, dob, telephone, mobile, phone,place_of_origin,nationality, createdOn) {
		logger.info('createContact() initiated');
		return new Promise((resolve, reject) => {
			let sql = sqlObj.signUp.createContact;
			let sqlQuery = format(sql, applicantId, first_name, middle_name, last_name, email, gender, dob, telephone, mobile, phone,
				place_of_origin,nationality, createdOn)
			conn.query(sqlQuery).then(contactResult => {
				logger.info('createContact() execution completed');
				resolve(contactResult);
			}).catch(err => {
				logger.info('createContact() execution completed');
				reject(new Error(err));
			})
		})
	}


	createAddress(conn, applicantId, contactId, address_type_id, country_id, postal_code, address_line1, address_line2, city, town, region, createdOn) {
		logger.info('createAddress() initiated');
		return new Promise((resolve, reject) => {
			let sql = sqlObj.signUp.createAddress;
			let sqlQuery = format(sql, country_id, address_type_id, postal_code, address_line1, address_line2, applicantId, city, town, region, contactId, createdOn)
			conn.query(sqlQuery).then(addressResult => {
				logger.info('createAddress() execution completed');
				resolve(addressResult);
			}).catch(err => {
				logger.error(err);
				logger.info('createAddress() execution completed');
				reject(new Error(err));
			})
		})
	}

	createKyc(conn, applicantId) {
		logger.info('insertKycDetails() initiated');
		return new Promise((resolve, reject) => {
			let sql = sqlObj.signUp.createKyc;
			let sqlQuery = format(sql,applicantId, utils.getGMT());
			conn.query(sqlQuery).then(kycResult => {
				logger.info('insertKycDetails() execution completed');
				resolve(kycResult);
			}).catch(err => {
				logger.error(err);
				logger.info('insertKycDetails() execution completed');
				reject(new Error(err));
			})
		})
	}

	createCurrencyAccount(conn, applicantId, roleId) {
		logger.info('insertKycDetails() initiated');
		return new Promise((resolve, reject) => {
			let sql = sqlObj.signUp.createCurrencyAccount;
			let sqlQuery = format(sql,applicantId,roleId, utils.getGMT())
			conn.query(sqlQuery).then(accountResult => {
				logger.info('insertKycDetails() execution completed');
				resolve(accountResult);
			}).catch(err => {
				logger.error(err);
				logger.info('insertKycDetails() execution completed');
				reject(new Error(err));
			})
		})
	}

	createCurrencyExchangeAccount(conn, rowItems) {
		return new Promise((resolve, reject) => {
			let sql = `insert check_rates (applicant_id,from_currency,to_currency,isConvert) values (?,?,?,?)`;
			conn.batch(sql, rowItems)
				.then(result => {
					logger.info('sendEmailTosandboxUser() execution');
					resolve(result);
				})
				.catch(err => {
					logger.error(err);
					logger.info('sendEmailTosandboxUser() execution');
					reject(new Error(err));
				})
		})
	}

	
	createSandboxUser(conn, applicantId, memberId, apiKey, url, api_doc_url, redirect_url) {
		logger.info('createSandboxUser() initiated');
		return new Promise((resolve, reject) => {
			let sql = sqlObj.signUp.createSandboxUser;
			let sqlQuery = format(sql,applicantId, memberId,apiKey,url,api_doc_url,redirect_url, utils.getGMT())
			conn.query(sqlQuery).then(userResult => {
				logger.info('createSandboxUser() execution completed');
				resolve(userResult);
			}).catch(err => {
				logger.error(err);
				logger.info('createSandboxUser() execution completed');
				reject(new Error(err));
			})
		})
	}

	createPrivacy(conn, applicantId) {
		logger.info('createPrivacy() initiated');
		return new Promise((resolve, reject) => {
			let sql =sqlObj.signUp.createPrivacy ;
			let sqlQuery = format(sql,applicantId, utils.getGMT());
			conn.query(sqlQuery).then(privacyResult => {
				logger.info('createPrivacy() execution completed');
				resolve(privacyResult);
			}).catch(err => {
				logger.error(err);
				logger.info('createPrivacy() execution completed');
				reject(new Error(err));
			})
		})
	}

	isUserExists(value, type, account_type) {
		logger.info('isUserExists() initiated');
		return new Promise((resolve, reject) => {
			let sql =sqlObj.signUp.isUserExists ;
			let sqlQuery = format(sql,type,value, account_type)
			db.doRead(sqlQuery).then(userData => {
				logger.debug(sql);
				logger.info('isUserExists() execution completed');
				resolve(userData);
			}).catch(err => {
				logger.error(err);
				logger.info('isUserExists() execution completed');
				reject(err);
			});
		})
	}

	userLogout(applicant_id) {
		return new Promise((resolve, reject) => {
		  logger.info("userLogout() initiated");
		  let sql = sqlObj.signUp.userLogout;
		  let sqlQuery = format(sql, applicant_id);
		  db.doDelete(sqlQuery)
			.then(userData => {
			  logger.info("userLogout() execution completed");
			  resolve(userData);
			})
			.catch(err => {
			  logger.error(err);
			  logger.info("userLogout() execution completed");
			  reject(err);
			});
		});
		
	  }
	  nullifyDeviceDetails(applicant_id){
		return new Promise((resolve, reject) => {
			logger.info("userLogout() initiated");
			let sql = sqlObj.signUp.nullifyDevice;
			let sqlQuery = format(sql, applicant_id);
			db.doUpdate(sqlQuery)
			  .then(userData => {
				logger.info("userLogout() execution completed");
				resolve(userData);
			  })
			  .catch(err => {
				logger.error(err);
				logger.info("userLogout() execution completed");
				reject(err);
			  });
			});
	  }

	  resetPushNotificationsCount(applicant_id, count) {
		return new Promise((resolve, reject) => {
			logger.info("addcount() initiated");
			let sql = sqlObj.signUp.resetCount;
			let sqlQuery = format(sql, applicant_id, count);
			db.doUpdate(sqlQuery)
			  .then(userData => {
				logger.info("addcount() execution completed");
				resolve(userData);
			  })
			  .catch(err => {
				logger.error(err);
				logger.info("addcount() execution completed");
				reject(err);
			  });
			});
	  }
	
}