/**
* applicant
* This model is used to support the applicant  methods.
* @package applicant
* @subpackage model/applicant
*  @author SEPA Cyber Technologies, krishnakanth.r, Sekhara suman sahu
*/
"use strict";

import { DbConnMgr } from "../dbconfig/dbconfig";
import { Utils } from "../utility/utils";
const util = new Utils()
let timestamp = util.getGMT();
const format = require('string-format');
const dbInstance = DbConnMgr.getInstance();


export class Applicant {
  constructor() { }
  
  getApplicantById(applicantId) {
    return new Promise((resolve, reject) => {
      let sql =`select * from applicant where applicant_id=${applicantId}`;
      let sqlQuery = format(sql);
      dbInstance.doRead(sqlQuery).then((res) => {
        resolve(res)
      }).catch(err => {
        reject({ err });
      });
    })
  }
  
}
