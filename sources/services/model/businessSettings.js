/**
 * businessSettings
 * This model is used to support business settings.
 * @package businessSettings
 * @subpackage model/businessSettings
 *  @author SEPA Cyber Technologies, Sekhara suman sahu
 */

import {
  sqlObj
} from '../utility/sql';
import {
  DbConnMgr
} from '../dbconfig/dbconfig';

let db = new DbConnMgr();


let format = require('string-format');

export class BusiSetting {
  constructor() {}

  //Method to insert default role in business_role_mapping table
  setBusinessRole(businessId, role, acl, timestamp) {
    return new Promise((resolve, reject) => {
      logger.info('setBusinessRole() called');
      let sql = sqlObj.businessSetting.insertDefaultRole;
      let sqlQuery = format(sql, businessId, role, acl, timestamp);
      db.doInsert(sqlQuery).then(result => {
        logger.info('setBusinessRole() execcution completed');
        resolve(result);
      }).catch(err => {
        logger.info('setBusinessRole() execcution completed');
        reject(new Error(err));
      });
    })
  }

  //Method for getting defined business roles
  getBusinessRole() {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.businessSetting.getRoles;
      let sqlQuery = format(sql);

      db.doRead(sqlQuery).then(result => {
        resolve(result);
      }).catch(err => {
        reject(new Error(err));
      })
    })
  }

  //Method for getting invited business roles
  getInvitedBusinessUsers() {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.businessSetting.getInvitedBusinessUsers;
      let sqlQuery = format(sql);

      db.doRead(sqlQuery).then(result => {
        resolve(result);
      }).catch(err => {
        reject(new Error(err));
      })
    })
  }

  //Method for getting the business_id based on applicant_id
  getBusinessId(applicantId) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.businessSetting.getBusinessId;
      let sqlQuery = format(sql, applicantId);

      db.doRead(sqlQuery).then(result => {
        resolve(result);
      }).catch(err => {
        reject(new Error(err));
      })
    })
  }

  //Get role id from role name
  getRoleId(roleName) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.businessSetting.getRoleId;
      let sqlQuery = format(sql, roleName);

      db.doRead(sqlQuery).then(result => {
        resolve(result);
      }).catch(err => {
        reject(new Error(err));
      })
    })
  }

  //Create role
  createRole(roleName, acl, timestamp) {
    return new Promise((resolve, reject) => {
      let sql = sqlObj.businessSetting.createRole;
      let sqlQuery = format(sql, roleName, acl, timestamp);

      db.doInsert(sqlQuery).then(result => {
        resolve(result);
      }).catch(err => {
        reject(new Error(err));
      })
    })
  }

  //Update role
  updateRole(businessId, role_id, acl, timeStamp){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.businessSetting.updateRole;
      let sqlQuery = format(sql, acl, timeStamp, businessId, role_id);

      db.doUpdate(sqlQuery).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(new Error(err));
      })
    })
  }

  //Delete role
  doDeleteRole(businessId, role_id){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.businessSetting.deleteRole;
      let sqlQuery = format(sql, businessId, role_id);

      db.doUpdate(sqlQuery).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(new Error (err));
      })
    })
  }

  //Activate/Deactivate business role
  activateRole(timestamp, businessId, roleId){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.businessSetting.actiavteRole;
      let sqlQuery = format(sql, timestamp,businessId, roleId);

      db.doRead(sqlQuery).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(new Error(err));
      })
    })
  }
  
  //map user to a business
  mapUserToBusiness(role_id, business_id, first_name, last_name, email, acl, timeStamp){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.businessSetting.insertBusinessUser;
      let sqlQuery = format(sql, role_id, business_id, first_name, last_name, email, acl, timeStamp);

      db.doInsert(sqlQuery).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(new Error(err));
      })
    })
  }

  //Is email already map to business
  isAlreayAdded(businessId){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.businessSetting.isBusinessIdAlreadyMap;
      let sqlQuery = format(sql, businessId);

      db.doRead(sqlQuery).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(err);
      })
    })
  }

  //Get mapped users
  getMappedUser(businessId){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.businessSetting.getMappedUser;
      let sqlQuery = format(sql, businessId);

      db.doRead(sqlQuery).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(new Error(err));
      })
    })
  }

  //Get applicant Id
  getApplicantId(email){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.businessSetting.getApplicantId;
      let sqlQuery = format(sql, email);

      db.doRead(sqlQuery).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(new Error(err));
      })
    })
  }


  saveAclInRole(role_id, acl) {
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.businessSetting.setAclInRole;
      let sqlQuery = format(sql, acl, role_id);

      db.doRead(sqlQuery).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(new Error(err));
      })
    })

  }

  //Get Business role id
  getBusinessRoleId(businessId, roleId){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.businessSetting.getBusinessRoleId;
      let sqlQuery = format(sql, businessId, roleId);

      db.doRead(sqlQuery).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(new Error(err));
      })
    })
  }

  //Get registering user details
  getRegisteringUser(applicantId){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.businessSetting.getUserData;
      let sqlQuery = format(sql, applicantId);

      db.doRead(sqlQuery).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(new Error(err));
      })
    })
  }
  
  //set budiness_role_user_mapping
  setDeafultAdmin(businessRoleId, businessId, firstName, lastName, email, roleId, status, createdOn){
    return new Promise((resolve, reject)=>{
      let sql = sqlObj.businessSetting.setDefaultAdminId;
      let sqlQuery = format(sql, businessRoleId, businessId, firstName, lastName, email, roleId, status, createdOn);

      db.doInsert(sqlQuery).then(result=>{
        resolve(result);
      }).catch(err=>{
        reject(new Error(err));
      })
    })
  }
}
