/**
 * scheduleTranfer Model
 * scheduleTranfer is used for performing all scheduled transactions .
 * @package scheduleTranfer
 * @subpackage sources/services/model/scheduleTranfer
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu.
 */
import {
  sqlObj
} from '../utility/sql';
import {
  DbConnMgr
} from '../dbconfig/dbconfig';
let db = DbConnMgr.getInstance();
let format = require('string-format');
//ScheduleMoneyTransfer Class

export class ScheduleTransfer {
  constructor() {}

  //Method for storing bulk transfer in schedule transfer table
  setScheduleTransfer(id, senderId, transTime, fromCurr, arrayOfTrans, totalAmt, notify, createdOn) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.scheduleTransfer.saveScheduleTransfer;
      let sqlQuery = format(sql, id, senderId, transTime, fromCurr, arrayOfTrans, totalAmt, notify, createdOn);

      db.doInsert(sqlQuery).then(setTransRes => {
          resolve(setTransRes);
        })
        .catch(err => {
          reject(new Error(err));
        })
    })
  }
  //Method to check wheather the receipient is added as counterparty for sender
  isAddedCounterParty(applicantId, mobile) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.walletTransfer.isAddedCounterparty;
      let sqlQuery = format(sql, applicantId, mobile);

      db.doRead(sqlQuery).then(isAddedRes => {
          resolve(isAddedRes);
        })
        .catch(err => {
          reject(new Error(err));
        })
    })
  }


  //Method to get list of trans for transfer
  getScheduleTrans(fromTiime, limitTime) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.scheduleTransfer.getListOfTrans;
      let sqlQuery = format(sql, fromTiime, limitTime);

      db.doRead(sqlQuery).then(listTrans => {
        resolve(listTrans);
      }).catch(err => {
        reject(new Error(err));
      })
    })
  }

  //This method is to store history of bulk transfer transactions
  insertTransHistory(applicantId, exeTime, totalTrans, totalAmt, fromCurrency, transactions, succTrans, succtranslist, failTrans, failTransList, createdOn) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.scheduleTransfer.insertHistory;
      let sqlQuery = format(sql, applicantId, exeTime, totalTrans, totalAmt, fromCurrency, transactions, succTrans, succtranslist, failTrans, failTransList, createdOn);

      db.doInsert(sqlQuery).then(transHis => {
        resolve(transHis);
      }).catch(err => {
        reject(new Error(err));
      })
    })
  }

  //Method to update schedule transfer status
  updateScheduleTrans(updatedOn, id) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.scheduleTransfer.updateStatusSchedule;
      let sqlQuery = format(sql, updatedOn, id);

      db.doUpdate(sqlQuery).then(transRes => {
        resolve(transRes);
      }).catch(err => {
        reject(new Error(err));
      })
    })
  }

  //Method to get list of trans for transfer
  getTransTotalAmt(fromTiime, limitTime) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.scheduleTransfer.getTransTotalAmt;
      let sqlQuery = format(sql, fromTiime, limitTime);

      db.doRead(sqlQuery).then(listTrans => {
        resolve(listTrans);
      }).catch(err => {
        reject(new Error(err));
      })
    })
  }

  //Method for checking balance before performing the bulk transfer
  checkBalance(applicantId, currency) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.scheduleTransfer.checkMinimumBal;
      let sqlQuery = format(sql, applicantId, currency);

      db.doRead(sqlQuery).then(res => {
        resolve(res);
      }).catch(err => {
        reject(new Error(err));
      })
    })
  }

  //Get full name of sender
  getFullName(applicantId) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.scheduleTransfer.getFullName;
      let sqlQuery = format(sql, applicantId);
      db.doRead(sqlQuery).then(results => {
        resolve(results);
      }).catch(err => {
        reject(new Error(err));
      });
    })
  }

  //Method to get receipient e-mail id
  getReceipientMail(mobileNo){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.scheduleTransfer.getReceipientEmail;
      let sqlQuery = format(sql, mobileNo);

      db.doRead(sqlQuery).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(new Error(err));
      })
    })
  }

  //Get schedule transfer by applicant id
  getScheduleTransByUser(applicantId){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.scheduleTransfer.getScheduleTransById;
      let sqlQuery = format(sql, applicantId);

      db.doRead(sqlQuery).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(new Error(err));
      })
    })
  }

  //Delete schedule transfer
  deleteScheduleTransfer(updatedOn, id){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.scheduleTransfer.deleteScheduleTransfer;
      let sqlQuery = format(sql, updatedOn, id);

      db.doDelete(sqlQuery).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(new Error(err));
      })
    })
  }


}
