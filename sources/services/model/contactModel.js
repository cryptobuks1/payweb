/**
 * contactModel
 * this is used for the insert  the contact details of person in database and get the data from database
 * @package contactModel
 * @subpackage model/contactModel
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */
"use strict";
const format = require('string-format');

import { sqlConfig } from '../utility/sqlService';
import { Utils } from "../utility/utils";
import { DbConnMgr } from '../dbconfig/dbconfig';

const DbInstance = DbConnMgr.getInstance();
const util = new Utils();

export class Contact {
  constructor(user) {   
    this.first_name = user.first_name;
    this.middle_name = user.middle_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.gender = user.gender;
    this.dob = user.dob;
    this.telephone = user.telephone;
    this.mobile = user.mobile;
    this.place_of_birth = user.place_of_birth;
    this.nationality = user.nationality;
  }
  getContactId(id) {
    return new Promise((resolve, reject) => {
      logger.info("getContactId() initiated");
      let sql = sqlConfig.Contact_sql.get_Contact_Id;
      let sqlQuery = format(sql, id);
      DbInstance.doRead(sqlQuery).then(result => {
        logger.info("query executed");
        resolve(result);
      }).catch(err => {
        logger.error("error while  execute the query");
        reject(err);
      });
    })
  }


  addContact(applicant_id, first_name, middle_name, last_name, email, gender, dob, telephone, mobile,place_of_birth,nationality) {
    return new Promise((resolve, reject) => {
      logger.info("addContact() initiated");
      let timestamp = util.getGMT();
      let sql = sqlConfig.Contact_sql.add_Contact;
      let sqlQuery = format(sql, applicant_id,first_name,middle_name,last_name,email,gender,dob,telephone,mobile,timestamp,place_of_birth,nationality)
      DbInstance.doInsert(sqlQuery).then(result => {
        logger.info("query executed");
        resolve(result);
      }).catch(err => {
        logger.error("error while  execute the query");
        reject(err);
      });
    })
  }
  updateContact(first_name, middle_name, last_name, email, gender, dob, telephone, mobile, applicant_id, place_of_birth,nationality) {
    return new Promise((resolve, reject) => {
      logger.info("updateContact() initiated");
      let timestamp = util.getGMT();
      let sql = sqlConfig.Contact_sql.update_Contact;
      let sqlQuery = format(sql,first_name,middle_name,last_name,email,gender,dob,telephone,mobile,timestamp,applicant_id,place_of_birth,nationality)
      console.log(sqlQuery);
      DbInstance.doUpdate(sqlQuery).then(result => {
        logger.info("query executed");
        resolve(result);
      }).catch(err => {
        logger.error("error while  execute the query");
        reject(err);
      });
    })
  }
  getConatctDetails(id) {
    return new Promise((resolve, reject) => {
      logger.info("getConatctDetails() initiated");
      let sql = sqlConfig.Contact_sql.get_Conatct_Details;
      let sqlQuery =format(sql,id);
      DbInstance.doRead(sqlQuery).then(result => {
        logger.info("query executed");
        resolve(result);
      }).catch(err => {
        logger.error("error while  execute the query");
        reject(err);
      });
    })
  }

  
}

export  class Peer {
  constructor() {}
  getPeerContact(applicantId) {
    return new Promise((resolve, reject) => {
      logger.info("getPeerContact() initiiated");
      let sql = sqlConfig.contactSql.get_peer_contact;
      let sqlQuery = format(sql, applicantId);
      DbInstance.doRead(sqlQuery).then(result => {
        logger.info("getPeerContact() executed completed");
        resolve(result);
      }).catch(err => {
        logger.info("getPeerContact() executed completed");
        reject(err);
      })
    })
  }
  selectPeerContact(applicantId) {
    return new Promise((resolve, reject) => {
      logger.info("selectPeerContact() initiiated");
      let sql = sqlConfig.contactSql.select_peer_contact;
      let sqlQuery = format(sql, applicantId);
      DbInstance.doRead(sqlQuery).then(result => {
        logger.info("selectPeerContact() executed completed");
        resolve(result);
      }).catch(err => {
        logger.info("selectPeerContact() executed completed");
        reject(err);
      })
    })
  }
  getAllContact() {
    return new Promise((resolve, reject) => {
      logger.info('getAllContact() called');
      let sql = sqlConfig.contactSql.get_all_contact;
      let sqlQuery = format(sql);
      DbInstance.doRead(sqlQuery).then(result => {
        logger.info('getAllContact() executed completed');
        resolve(result);
      }).catch(err => {
        logger.info("getPeerContact() executed completed");
        reject(err);
      })
    })
  }
  insertPeerContact(applicantid, applicant_id, moblie, phone,name) {
    return new Promise((resolve, reject) => {
      logger.info('insertPeerContact() called');
      let timestamp = util.getGMT();
      let sql = sqlConfig.contactSql.insert_peer_contact;
      let sqlQuery = format(sql, applicantid, applicant_id, moblie, phone, name,timestamp)
      DbInstance.doRead(sqlQuery).then(result => {
        logger.info('insertPeerContact() executed completed');
        resolve(result);
      }).catch(err => {
        logger.info("insertPeerContact() executed completed");
        reject(err);
      })

    })
  }
}

