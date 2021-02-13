/**
 * businessModel
 * this is used for the insert  the business details of person in database and get the data from database
 * @package businessModel
 * @subpackage model/businessModel
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */
"use strict";
const format = require('string-format');

import { DbConnMgr } from '../dbconfig/dbconfig';
import { Utils } from "../utility/utils";
const util = new Utils();

import { sqlObj } from '../utility/sql';

const dbInstance = DbConnMgr.getInstance();

const STATUS = {
  SUCCESS: 0,
  FAILURE: 1
}

export class BusinessDetails {
  constructor() {

  }

  //for storing sector,website,industries and services related data.
  saveBusinesDetails(businessId, businessSectorId, rangeOfService, website, restrictedBusiness, selectedIndustries){    
  return new Promise((resolve, reject) => {
    let timestamp = util.getGMT();
    let sql = sqlObj.businessDetails.saveBusinesDetails;
    let sqlQuery = format(sql, timestamp, businessId, businessSectorId, rangeOfService, website, restrictedBusiness, selectedIndustries )
  dbInstance.doInsert(sqlQuery)
  .then(result=>{
    resolve(result);
  })
  .catch(err=>{
    reject(err);
  });
  })
  }

  //method for checking is restricted business
  isRestrictedBusiness(selectedIndustries){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.businessDetails.isRestrictedBusiness;
      let sqlQuery = format(sql, selectedIndustries);
      dbInstance.doRead(sqlQuery)
      .then(result=>{
        resolve(result);
      })
      .catch(err=>{
        reject(err);
      })
    })
  }

  //method for updating business sectore details table
  setBusinessSectorDetails(restrictedBusiness, businessId){
    return new Promise((resolve, reject)=>{
      let timestamp = util.getGMT();
      let sql = sqlObj.businessDetails.setBusinessSectorDetails;
      let sqlQuery = format(sql,timestamp,restrictedBusiness,businessId);
      dbInstance.doUpdate(sqlQuery)
      .then(result=>{
        resolve(result);
      })
      .catch(err=>{
        reject(err);
      })
    })
  }



  //method for updating kyb business table
  setkybBusiness(businessId){
    return new Promise((resolve, reject)=>{
      let timestamp = util.getGMT();
      let sql = sqlObj.businessDetails.setkybBusiness;
      let sqlQuery = format(sql, timestamp, businessId);
      dbInstance.doUpdate(sqlQuery)
      .then(result=>{
        resolve(result);
      })
      .catch(err=>{
        reject(err);
      })
    })
  }

  updateBusinessDetails(column, value, business_id) {
  return new Promise((resolve, reject) => {
    let timestamp = util.getGMT();
    let sql = sqlObj.businessDetails.updateBusinessDetails;
    let sqlQuery = format(sql, column, value, business_id, timestamp)
    dbInstance.doUpdate(sqlQuery)
  .then(result=>{
    resolve(result);
  })
  .catch(err=>{
    reject(err);
  })
  })
  }

  getBusinessDetails(businessId){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.businessDetails.getBusinessDetails;
      let sqlQuery = format(sql, businessId);
      dbInstance.doRead(sqlQuery)
      .then(result=>{
        resolve(result);
      })
      .catch(err=>{
        reject(err);
      })
    })
  }

}            
