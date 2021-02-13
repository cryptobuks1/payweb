import { DbConnMgr } from '../dbconfig/dbconfig';
const DbInstance = DbConnMgr.getInstance();
import { sqlObj } from '../utility/sql';
import {langEngConfig} from '../utility/lang_eng';
import {Utils} from '../utility/utils';
let format = require('string-format');
let utils = new Utils();
const util = new Utils();
const dbInstance = DbConnMgr.getInstance();
const db = DbConnMgr.getInstance();
export class Sandbox {
  constructor() {

  }
  
  insertKey(id,applicantId,key) {
    logger.info('insertKey() initiated');
    return new Promise((resolve, reject) => {
      let timestamp = util.getCurrentTimeStamp();
      let sql = sqlObj.Card.insertKey;
      let sqlQuery = format(sql, id,applicantId,key,timestamp);     
      dbInstance.doInsert(sqlQuery)
        .then(result => {
          logger.info('insertKey() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.debug("error while exection the insertKey()");
          reject(err);
        });
    });
  }



  getSandboxDetails(sandboxDetails){
    return new Promise((resolve,reject)=>{
      let sql = `select redirect_url,applicant_id from sandbox where memberId='${sandboxDetails.memberId}' AND api_key='${sandboxDetails.apiKey}'`;
      DbInstance.executeQuery(sql).then(sandboxdetailsresult=>{
        resolve(sandboxdetailsresult);
      }).catch(err=>{
        reject(err);
      })
    })
  }

  saveSandboxOrder(sandboxDetails,applicant_id,order_id){
    return new Promise((resolve,reject)=>{
      let sql =`insert into sandbox_order_details (order_id,applicant_id,success_url,failure_url,amount,currency) values('${order_id}','${applicant_id}','${sandboxDetails.successUrl}','${sandboxDetails.failureUrl}','${sandboxDetails.amount}','${sandboxDetails.currency}')`;
      DbInstance.executeQuery(sql).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(err);
      })
    })
  }
  getOrderDetails(orderId){
    return new Promise((resolve,reject)=>{
      let sql = `select order_id,success_url,failure_url,amount,applicant_id,currency from sandbox_order_details where order_id='${orderId}'`;
      DbInstance.executeQuery(sql).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(err);
      })
    })
  }

  getContactDetails(applicant_id){
    return new Promise((resolve,reject)=>{
      let sql = `select mobile from applicant where applicant_id='${applicant_id}'`;
      DbInstance.executeQuery(sql).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(err);
      })
    })
  }



   //Method for checking duplicate card.
   isDuplicatCard(cardnum, applicantId) {
    logger.info('isDuplicatCard() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.Card.isDuplicatCard;     
      let sqlQuery = format(sql, cardnum, applicantId)
      dbInstance.doRead(sqlQuery)
        .then((result) => {
          logger.info('isDuplicatCard() execution completed');
          resolve(result);
        })
        .catch((err) => {
          logger.debug("error while exection the isDuplicateCard()");
          reject(err);
        });
    });
  };


  //Method to update card status
  deleteCard(cardId, enableOrDisable) {
    logger.info(' deleteCard() initiated');
    return new Promise((resolve, reject) => {
      let timestamp = util.getCurrentTimeStamp();
      let sql = sqlObj.Card.deleteCard;
      let sqlQuery = format(sql, enableOrDisable,timestamp,cardId);
      dbInstance.doUpdate(sqlQuery)
        .then(result => {
          logger.info(' deleteCard() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.debug("error while exection the  deleteCard()");
          reject(err);
        });
    });
  }


   //Method to check number of card.
   isFirstCard(applicantId) {
    logger.info('isFirstCard() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.Card.isFirstCard;
      let sqlQuery = format(sql, applicantId);
      dbInstance.doRead(sqlQuery)
        .then(result => {
          logger.info('isFirstCard() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.debug("error while exection the isFirstCard()");
          reject(err);
        });
    });
  }



   //Method for inserting card details in payment_cards table
   insertCardData(applicantId, cardType, nameOnCard, cardNumber, cardCvv, cardMonth, CardYear,encryptedNum,encryptedkey, status, defaultCard) {
    logger.info('insertCardData() initiated');
    return new Promise((resolve, reject) => {
      let timestamp = util.getCurrentTimeStamp();
      let sql = sqlObj.Card.insertCardData;
      let sqlQuery = format(sql, applicantId,cardType,nameOnCard,cardNumber,cardCvv,cardMonth,CardYear, status, defaultCard,timestamp,encryptedNum,encryptedkey);
      dbInstance.doInsert(sqlQuery)
        .then(result => {
          logger.info(' insertCardData() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.debug("error while exection the  insertCardData()");
          reject(err);
        });
    });
  }



    getSecretKey(id,applicantId) {
      logger.info(' getSecretKey() initiated');
      return new Promise((resolve, reject) => {     
        let sql = sqlObj.Card.getSecretKey;
        let sqlQuery = format(sql, id,applicantId);    
        dbInstance.doRead(sqlQuery)
          .then(result => {
            logger.info(' getSecretKey() execution completed');
            resolve(result);
          })
          .catch(err => {
            logger.debug("error while exection the getSecretKey()");
            reject(err);
          });
      });
    }

  //Method to get all the cards saved by an user
  getAllCards(applicantId,active) {
    logger.info(' getAllCards() initiated');
    return new Promise((resolve, reject) => {
      let sql = sqlObj.Card.getAllCards;
      let sqlQuery = format(sql, applicantId,active);
      dbInstance.doRead(sqlQuery)
        .then(result => {
          logger.info(' getAllCards() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.debug("error while exection the  getAllCards()");
          reject(err);
        });
    });
  }
/*==================================================================================================*/



isCurrencyAccountExist(currency,applicantId) {
  return new Promise((resolve, reject) => {
    logger.info('isCurrencyAccountExist() initiated');
    // let { currency, balance, status, role } = userAccount
    let sql = `SELECT currency,status FROM accounts WHERE currency="${currency}" AND applicant_id=${applicantId}`;
    DbInstance.executeQuery(sql).then(result => {
      logger.info('isCurrencyAccountExist() execution completed');
      //resolve(_.filter(result, { status: 1 }))
      resolve(result);
    }, err => {
      logger.info('isCurrencyAccountExist() execution completed');
      logger.error(err);
      reject(err)
    });
  });
}







createCurrencyAccount(currency,applicantId) {
  return new Promise((resolve, reject) => {
    logger.info('createCurrencyAccount() initiated');
    //let { currency, balance, status, role } = userAccount
    let sql = `INSERT INTO accounts (currency,applicant_id) VALUES("${currency}",${applicantId})`;
    DbInstance.executeQuery(sql).then(result => {
      logger.info('createCurrencyAccount() execution completed');
      //resolve(_.filter(result, { status: 1 }))
      resolve(result);
    }, err => {
      logger.info('createCurrencyAccount() initiated');
      logger.error(err);
      reject(err)
    });
  });
}





activateAccount(currency, applicantId) {
  return new Promise((resolve, reject) => {
    logger.info('activateAccount() initiated');
    let sql = `UPDATE accounts SET status= 1 WHERE applicant_id=${applicantId} AND currency="${currency}"`;
    DbInstance.executeQuery(sql)
      .then((result) => {
        logger.info('activateAccount() execution completed');
        resolve(result);
      }, err => {
        logger.error(err);
        reject(err);
      });
  });
}


getAccount(applicantId) {
  return new Promise((resolve, reject) => {
    logger.info('getAccount() initiated');
    let sql = `select account_no,currency,status,balance from accounts where applicant_id= ${applicantId}`;
    DbInstance.executeQuery(sql)
      .then(result => {
        logger.info('getAccount() execution completed');
        resolve(result)
      }, err => {
        logger.error(err);
        logger.info('getAccount() execution completed');
        reject(err)
      });
  });
}

getCurrencyAccount(applicantId,currency){
  return new Promise((resolve,reject)=>{
    let sql =`select account_no,currency,status,balance from accounts where applicant_id=${applicantId} AND currency='${currency}'`;
    DbInstance.executeQuery(sql)
    .then(result => {
      logger.info('getCurrencyAccount() execution completed');
      resolve(result)
    }, err => {
      logger.error(err);
      logger.info('getCurrencyAccount() execution completed');
      reject(err)
    });
})
}



getByCurrency(applicantId,currency) {
  return new Promise((resolve, reject) => {
    DbInstance.executeQuery(`select account_no,currency,status,role_id,balance from accounts where applicant_id=${applicantId} AND currency='${currency}' `).then((res) => {
      resolve(res)
    }, err => {
      reject({ err });
    });
  });
}






updateCurrencyAccount(status,applicantId,currency) {
  return new Promise((resolve, reject) => {
    logger.info('updateCurrencyAccount() initiated');
    let sql = `UPDATE accounts SET status=${status} WHERE currency="${currency}" AND applicant_id=${applicantId}`;
    DbInstance.executeQuery(sql).then(result => {
      logger.info('updateCurrencyAccount() execution completed');
      resolve(result);
    }, err => {
      logger.error(err);
      logger.info('updateCurrencyAccount() execution completed');
      reject(err)
    });
  });
}




/*=================================================================================================*/


getFromCurrencyAccountno(currencytype , applicantid){
  return new Promise((resolve, reject)=>{
    logger.info('getFromCurrencyAccountno() initiated');
     let sql = `select account_no from accounts where applicant_id = ${applicantid} AND currency = '${currencytype}'`;
     DbInstance.executeQuery(sql).then(result =>{
       logger.info('getFromCurrencyAccountno() execution completed');
       resolve(result);
     }).catch(err=>{
       logger.error(err);
       logger.info('getFromCurrencyAccountno() execution completed');
       reject(err);
     })
  })
}




getRecipientCurrencyAccount(toMobile, toCurrency){
  return new Promise((resolve, reject)=>{
    logger.info('getRecipientCurrencyAccount() initiated');
     let sql = `select accounts.account_no, accounts.applicant_id from accounts JOIN 
                contact On contact.applicant_id = accounts.applicant_id
                WHERE contact.mobile = '${toMobile}' AND accounts.currency = '${toCurrency}'`;					 
      DbInstance.executeQuery(sql).then(result=>{
      logger.info('getRecipientCurrencyAccount() execution completed');
      resolve(result);
    })
    .catch(err=>{
      logger.error(err);
      logger.info('getRecipientCurrencyAccount() execution completed');
      reject(err);
    })
  })
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



checkMunimumBalance(accountNo) {
  return new Promise((resolve, reject) => {
    let sql = `select balance,status from accounts where account_no = ${accountNo}`;
    DbInstance.executeQuery(sql).then(results => {
      resolve(results);
    }).catch(err => {
      reject(err);
    });
  });
}



deductAmnt(fromAccount, deductBalance, conn) {
  return new Promise((resolve,reject) => {
  let sql = `update accounts set balance = ${deductBalance} where account_no = ${fromAccount}`;
  conn.query(sql).then(results => {
      resolve(results);
  }).catch(err => {
      reject(err);
    });
  })
}



getFullName(accountNo) {
  return new Promise((resolve,reject) => {
    let sql = `select  contact.first_name,contact.last_name, accounts.currency from contact
               JOIN  accounts on contact.applicant_id = accounts.applicant_id
               where accounts.account_no = ${accountNo}`;
               DbInstance.executeQuery(sql).then(results => {
      resolve(results);
    }).catch(err => {
      reject(err);
    });
  })
}


insertTransaction(applicantId, transnum,transtype,from_account,to_account,currency, fullname,account_type,
	amount,timestamp ,conn) {
		return new Promise((resolve,reject) => {
		let sql = `insert into sandbox_transactions (applicant_id,transaction_number,transaction_type,from_account,to_account,currency_type,counterparty,account_type,amount, created_on)
               values (${applicantId},'${transnum}','${transtype}',${from_account},${to_account},'${currency}','${fullname}','${account_type}',${amount}, '${timestamp}')`;
    conn.query(sql).then(results => {
        resolve(results);
		}).catch(err => {
					reject(err);
				});
			});	
  }




  addAmnt(toAmnt, toAccount, conn){
    return new Promise((resolve, reject)=>{
      let sql = `update accounts set balance = balance + ${toAmnt}  where account_no = ${toAccount}`;

      conn.query(sql).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(err);
      })
    })
  }

  getTransactionDetails(applicantId) {
    return new Promise((resolve,reject) => {
     let sql=`SELECT transaction_id,transaction_number, transaction_type, from_account ,to_account, counterparty , account_type, amount, created_on FROM sandbox_transactions 
      WHERE applicant_id = ${applicantId} ORDER BY created_on DESC`;
      DbInstance.executeQuery(sql).then(results => {
        resolve(results);
      }).catch(err => {
        reject(err);
      });
    });	
}

getWebTransactionDetails(applicantid , rangeDate , currentDate){
	return new Promise((resolve, reject)=>{
		let sql = sqlObj.webTransaction.getSandBoxWebTrans;
		let sqlQuery =  format(sql, applicantid , `\'${rangeDate}\'` , `\'${currentDate}\'`);

		db.doRead(sqlQuery).then(result=>{
			resolve(result);
		})
		.catch(err=>{
			reject(err);
		})
	})
 }



 getWebTransByAccount(accountNo , rangeDate, currentDate){
  return new Promise((resolve, reject)=>{
   let sql = sqlObj.webTransaction.getWebSandboxTransByAcc;
   let sqlQuery = format(sql, accountNo, `\'${rangeDate}\'`, `\'${currentDate}\'`, accountNo, `\'${rangeDate}\'`, `\'${currentDate}\'`);

   db.doRead(sqlQuery).then(transRes=>{
     resolve(transRes);
   })
   .catch(err=>{
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
    let sql = `INSERT INTO payments (applicant_id,paymentsid,status,payment_Brand,payment_Mode,first_Name,last_Name,amount,currency,description,result,card,customer,transaction_details,created
      ,merchant_Transaction_Id,remark,trans_Status,tmpl_amount,tmpl_currency,eci,checksum,order_Description,company_Name,merchant_contact) 
      VALUES (${responseData.applicant_id}, ${responseData.paymentId}, '${responseData.status}', '${responseData.paymentBrand}', '${responseData.paymentMode}', '${responseData.firstName}', '${responseData.lastName}',
        ${responseData.amount}, '${responseData.currency}', '${responseData.descriptor}', '${responseData.result}', '${responseData.card}', '${responseData.customer}', '${responseData.transaction_details}',
        '${responseData.timestamp}', '${responseData.merchantTransactionId}', '${responseData.remark}', '${responseData.transactionStatus}', ${responseData.tmpl_amount},
        '${responseData.tmpl_currency}', '${responseData.eci}', '${responseData.checksum}', '${responseData.orderDescription}', '${responseData.companyName}', '${responseData.merchantContact}')`;

        DbInstance.executeQuery(sql).then(res => {
      logger.info('insertPayment successfully retrived');
      resolve({ status: 1, message: langEngConfig.message.payment.modelsuccess });
    }).catch(err => {
      logger.error('Error while insertPayment fail');
      reject({ status: 0, message: langEngConfig.message.payment.modelfail });
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
    logger.info('Initialize  updateAccountDetails()');
    let sql_select = `SELECT paymentsid , applicant_id , status ,payment_Brand,  payment_Mode , amount, currency , transaction_details FROM payments WHERE applicant_id = ${accountData.applicantId} AND paymentsid = ${accountData.paymentObj.paymentId} `
    DbInstance.executeQuery(sql_select).then(function (paymentObject) {
      let sql_update = `UPDATE accounts SET balance = balance + ${accountData.paymentAmount} WHERE applicant_id = ${accountData.applicantId} AND account_no = ${accountData.accountNumber}`;
      DbInstance.executeQuery(sql_update).then(function (accountObject) {
        logger.info('updateAccountDetails() success');
        resolve({ 'status': 1, 'message': 'account updated successfully', 'paymentObject': paymentObject[0], 'accountObject': accountObject })
      }, function (err) {
        logger.info('updateAccountDetails() failure');
        reject({ 'status': 0, 'message': langEngConfig.message.payment.accounterror })
      }
      )
    }, function (err) {
      logger.info('selection fail while , updateAccountDetails()');
      reject({ 'status': 0, 'message': langEngConfig.message.payment.accounterror2  })
    }
    )
  })
}


insertTransactionDetails(paymentsid, applicant_id, transactionHolderName, account_id, amount, inputCurrency, transactionObj) {
  let transactionDetailObj = {};

  transactionDetailObj.payments_id = paymentsid;
  transactionDetailObj.applicant_id = applicant_id;
  transactionDetailObj.transactionHolderName = transactionHolderName;
  transactionDetailObj.amount = amount;
  transactionDetailObj.account_id = account_id;
  transactionDetailObj.inputCurrency = inputCurrency;
  transactionDetailObj.paymentType = (transactionObj.paymentType == 'DB') ? 'CR' : 'DB';
  transactionDetailObj.paymentBrand = transactionObj.paymentBrand;
  return new Promise((resolve, reject) => {
    logger.info('Initialize  insertPayment()');
    let sql = `INSERT INTO sandbox_transactions (applicant_id,transaction_number,from_account,to_account,currency_type,counterparty,account_type,transaction_type,amount,created_on) VALUES (${transactionDetailObj.applicant_id}, ${transactionDetailObj.payments_id}, ${transactionDetailObj.account_id}, ${transactionDetailObj.account_id},'${transactionDetailObj.inputCurrency}', '${transactionDetailObj.transactionHolderName}', '${transactionDetailObj.paymentBrand}', '${transactionDetailObj.paymentType}', ${transactionDetailObj.amount},'${utils.getCurrentTimeStamp()}')`;
    DbInstance.executeQuery(sql).then(res => {
      logger.info('insertPayment successfully retrived');
      resolve({ "status": 1, "message": `${transactionDetailObj.amount} ${transactionDetailObj.inputCurrency}s added to wallet successfully` });
    }).catch(err => {
      logger.error('Error while insertPayment fail');
      reject({ "status": 0, "message": langEngConfig.message.payment.walleterror }); 
    })
  })
}

getTransactions(applicantId){
  return new Promise((resolve,reject)=>{
    let sql =`select transaction_id,
    transaction_number,
    transaction_type,
    from_account,
    to_account,
    currency_type,
    counterparty,
    account_type,
    amount
    from sandbox_transactions where applicant_id=${applicantId}`;
    DbInstance.executeQuery(sql).then(res => {
      logger.info('getTransactions successfully retrived');
      resolve(res);
    }).catch(err => {     
      logger.error('Error while getTransactions fail');
      reject(err); 
    })
  })
}



  }










