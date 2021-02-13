"use strict";
import { DbConnMgr } from "../dbconfig/dbconfig";
const dbInstance = DbConnMgr.getInstance();
import { sqlObj } from '../utility/sql';
import { Utils } from '../utility/utils';
let utils = new Utils();
const format = require('string-format');

const STATUS = {
  SUCCESS: 0,
  FAILURE: 1
}

const DASHBOARD_STATUS = {
  PENDING: 0,
  SUBMITTED: 1,
  VERIFIED: 2
}

export class DashboardModel {
  constructor() {

  }

  getDashboardStatus(businessId) {
    return new Promise((resolve, reject) => {
      logger.info('getDashboardStatus() Initiated')
      let sql = sqlObj.dashboardStatus.getDashboardStatus;
      let sqlQuery = format(sql, businessId);
      dbInstance.doRead(sqlQuery)
        .then(result => {
          logger.info('getDashboardStatus() Exited Successfully')
          resolve(result);
        })
        .catch(err => {
          logger.error('getDashboardStatus() Error')
          reject(err);
        });
    })
  }
  getApplicationStatus(businessId) {
    return new Promise((resolve, reject) => {
      logger.info('getApplicationStatus() Initiated')
      let sql = sqlObj.dashboardStatus.getApplicationStatus;
      let sqlQuery = format(sql, businessId);
      dbInstance.doRead(sqlQuery)
        .then(result => {
          logger.info('getApplicationStatus() Exited Successfully')
          resolve(result);
        })
        .catch(err => {
          logger.error('getApplicationStatus() Error')
          reject(err);
        });
    })
  }

  //for inserting business_id,type_of_business,personal_profile,business_owner_details,business_address status
  postDashboardStatus(businessId) {
    return new Promise((resolve, reject) => {
      logger.info('postDashboardStatus() Initiated')
      let sql = sqlObj.dashboardStatus.postDashboardStatus;
      let sqlQuery = format(sql, businessId, DASHBOARD_STATUS.PENDING, utils.getGMT())
      dbInstance.doInsert(sqlQuery)
        .then(result => {
          logger.info('postDashboardStatus() Exited Successfully')
          resolve(result);
        })
        .catch(err => {
          logger.error('postDashboardStatus() Error')
          reject(err);
        });
    })
  }

  // this method is used to get country list
  indexCountry() {
    return new Promise(function (resolve, reject) {
      logger.info('indexCountry() Initiated')
      let sql = sqlObj.dashboardStatus.indexCountry;
      dbInstance.doRead(sql)
        .then(result => {
          logger.info('indexCountry() Exited Successfully')
          resolve(result);
        })
        .catch(err => {
          logger.error('indexCountry() Error')
          reject(err);
        })
    })
  }


  getBusinessId(applicant_id) {
    return new Promise((resolve, reject) => {
      logger.info('getBusinessId() Initiated')
      let sql = sqlObj.dashboardStatus.getBusinessId;
      let sqlQuery = format(sql, applicant_id);
      dbInstance.doRead(sqlQuery)
        .then(result => {
          logger.info('getBusinessId() Exited Successfully')
          resolve(result);
        })
        .catch(err => {
          logger.error('getBusinessId() Error')
          reject(err);
        })
    })
  }

  getContactAndAddressDetails(businessId) {
    return new Promise((resolve, reject) => {
      logger.info('getContactAndAddressDetails() Initiated')
      let sql = sqlObj.dashboardStatus.getContactAndAddressDetails;
      let sqlQuery = format(sql, businessId)
      dbInstance.doRead(sqlQuery)
        .then(result => {
          logger.info('getContactAndAddressDetails() Exited Successfully')
          resolve(result);
        })
        .catch(err => {
          logger.error('getContactAndAddressDetails() Error')
          reject(err);
        })
    })
  }

  getCompanyDetails(businessId) {
    return new Promise((resolve, reject) => {
      logger.info('getCompanyDetails() Initiated')
      let sql = sqlObj.dashboardStatus.getCompanyDetails;
      let sqlQuery = format(sql, businessId)
      dbInstance.doRead(sqlQuery)
        .then(result => {
          logger.info('getCompanyDetails() Successfully Exited')
          resolve(result);
        })
        .catch(err => {
          logger.info('getCompanyDetails() Exited')
          reject(err);
        })
    })
  }

  patchDashboardStatus(column, status, businessId) {
    return new Promise((resolve, reject) => {
      logger.info('patchDashboardStatus() Initiated')
      let sql = sqlObj.dashboardStatus.patchDashboardStatus;
      let sqlQuery = format(sql, column, status, businessId, utils.getGMT())
      dbInstance.doUpdate(sqlQuery)
        .then(result => {
          logger.info('patchDashboardStatus() Exited Successfully')
          resolve(result);
        })
        .catch(err => {
          logger.error('patchDashboardStatus() Exited Error')
          reject(err);
        })
    })
  }
}