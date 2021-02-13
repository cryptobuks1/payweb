/**
 * counterPartyModel
 * this is used for the create the counterParty and get the counterParties with in wallet and get the users list in payvoo
 * @package counterPartyModel
 * @subpackage model/counterPartyModel
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */
"use strict";
let format = require('string-format');
import { DbConnMgr } from '../dbconfig/dbconfig';
const DbInstance = DbConnMgr.getInstance();
import { sqlObj } from '../utility/sql';
import { Utils } from "../utility/utils";
const util = new Utils();
export class Beneficiary {
  constructor(user) {
    this.name = user.name;
    this.mobile = user.mobile;
    this.fullName = user.full_name;
    this.country = user.country;
    this.counterparty_id = user.counterparty_id;
    this.limit = user.limit;
    this.email = user.email;
  }
  beneficiarysSearch(name, personal, business, active, start, end, id) {
    logger.info(' beneficiarysSearch() intiated');
    return new Promise((resolve, reject) => {     
      let sql = sqlObj.counterparty.globalSearch;
      let sqlQuery = format(sql, name, personal, business, active, start, end, id);
      DbInstance.doRead(sqlQuery).then(results => {
        logger.info('execution completed');        
        resolve(results);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }
  createBenificary(fullName, mobile, email, country, applicant_id, counterparty_id, date, status, non_payvoo_user) {
    logger.info(' createBenificary() intiated');
    return new Promise((resolve, reject) => {   
      let sql = sqlObj.counterparty.createBeneficiary;
      let sqlQuery = format(sql, applicant_id, counterparty_id, fullName, mobile, email, country, status, date, non_payvoo_user);
      DbInstance.doInsert(sqlQuery).then(results => {
        logger.info('execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }
  getapplicantId(mobile, email) {
    logger.info(' getCouterpartyId() intiated');
    return new Promise((resolve, reject) => {  
      let sql = sqlObj.counterparty.getApplicantId;
      let sqlQuery = format(sql, mobile, email);
      DbInstance.doRead(sqlQuery).then(results => {
        logger.info('execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }

  checkData(mobile, email, active, id) {
    logger.info('checkData() intiated');
    return new Promise((resolve, reject) => {
      let sql;
      let sqlQuery;
      if (email.length == 0) {
        sql = sqlObj.counterparty.checkData;
        sqlQuery = format(sql, mobile, active, id);
      } else {
        sql = sqlObj.counterparty.checkDataWithEmail;
        sqlQuery = format(sql, email, active, id);
      }
      DbInstance.doRead(sqlQuery).then(results => {
        logger.info('execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }
  checkEmail(email, active, id) {
    logger.info('checkData() intiated');
    return new Promise((resolve, reject) => {
      let sql;
      let sqlQuery;    
        sql = sqlObj.counterparty.checkDataWithEmailApplicant;
        sqlQuery = format(sql, email, active, id);
        console.log("sqlQuery",sqlQuery);      
      DbInstance.doRead(sqlQuery).then(results => {
        logger.info('execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }

  checkEmailBusiness(email, active, id) {
    logger.info('checkData() intiated');
    return new Promise((resolve, reject) => {
      let sql;
      let sqlQuery;    
        sql = sqlObj.counterparty.checkDataWithEmailBusiness;
        sqlQuery = format(sql, email, active, id);
        console.log("sqlQuery",sqlQuery);      
      DbInstance.doRead(sqlQuery).then(results => {
        logger.info('execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }
  counterPartyInfo(name, active, currency, id, start, end) {
    logger.info('countryPartyInfo() intiated');
    return new Promise((resolve, reject) => {     
      let sql = sqlObj.counterparty.counterPartyInfo;
      let sqlQuery = format(sql, name, active, currency, id, start, end);
      DbInstance.doRead(sqlQuery).then(results => {
        logger.info('execution completed');      
        resolve(results);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }

  getNonPayvooCounterParties(userId) {
    logger.info('getNonPayvooCounterParties() intiated');
    return new Promise((resolve, reject) => {     
      let sql = sqlObj.counterparty.getNonPayvooCounterParties;
      let sqlQuery = format(sql, userId, 1);
      DbInstance.doRead(sqlQuery).then(results => {
        logger.info('execution completed');      
        resolve(results);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      });
    });
  }


  deleteCounterParty(id, user_id, timestamp, deactive) {
    logger.info(' deleteCounterParty() intiated');
    return new Promise((resolve, reject) => {   
      let sql = sqlObj.counterparty.deleteCounterParty;
      let sqlQuery = format(sql, id, user_id, util.getGMT(), deactive);
      DbInstance.doUpdate(sqlQuery).then(results => {
        logger.info('execution completed');     
        resolve(results);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }
  getCounterpartyId(id, user_id, active) {
    logger.info(' deleteCounterParty() intiated');
    return new Promise((resolve, reject) => {      
      let sql = sqlObj.counterparty.getCounterparty_id;
      let sqlQuery = format(sql, id, user_id, active);
      DbInstance.doRead(sqlQuery).then(results => {
        logger.info('execution completed');     
        resolve(results);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }
  counterPartyList(id, currency, active) {
    logger.info('countryPartyInfo() intiated');
    return new Promise((resolve, reject) => {    
      let sql = sqlObj.counterparty.counterpartyList;
      let sqlQuery = format(sql, id, currency, active);
      DbInstance.doRead(sqlQuery).then(results => {
        logger.info('execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }
  getCounterPartyid(id, active) {
    logger.info('checkData() intiated');
    return new Promise((resolve, reject) => {   
      let sql = sqlObj.counterparty.getCounterPartyId;
      let sqlQuery = format(sql, id, active);
      DbInstance.doRead(sqlQuery).then(results => {
        logger.info('execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }
  checkCounterParty(id, mobile, active) {
    logger.info('checkCounterParty() intiated');
    return new Promise((resolve, reject) => {   
      let sql = sqlObj.counterparty.checkCounterParty;
      let sqlQuery = format(sql, id, mobile, active);
      DbInstance.doRead(sqlQuery).then(results => {
        logger.info('execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }
  getAccounts(id, active) {
    logger.info(' getAccounts() intiated');
    return new Promise((resolve, reject) => {    
      let sql = sqlObj.counterparty.getAccounts;
      let sqlQuery = format(sql, id, active);
      DbInstance.doRead(sqlQuery).then(results => {
        logger.info('execution completed');
        resolve(results);
      }).catch(err => {
        logger.error('error while  execute the query');
        reject(err);
      })
    })
  }

  deleteNonPayvooCounterParty(email) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.counterparty.deleteNonPayvooCounterParties;
			let sqlQuery = format(sql, email);
			DbInstance.doDelete(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});    
  }

  changeToPayvooCounterParty(email, applicant_id,recipientApplicantId, country, full_name){
    return new Promise((resolve, reject) => {
			let sql = sqlObj.counterparty.changeToNonPayvooCounterParties;
      let sqlQuery = format(sql, email,applicant_id,recipientApplicantId, country, full_name);
      console.log("sqlQuery", sqlQuery);
			DbInstance.doUpdate(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});  
  }

  getCountryId(countryCode) {
    return new Promise((resolve, reject) => {
			let sql = sqlObj.counterparty.getCountryId;
      let sqlQuery = format(sql, countryCode);
			DbInstance.doUpdate(sqlQuery).then(details => {
				resolve(details);
			}).catch(err => {
				reject(err);
			});
		});  
  }
}
