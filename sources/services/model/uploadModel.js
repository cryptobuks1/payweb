/**
 * uploadModel
 * This is using for to store the files as base64 format in database and get the data from database.
 * @package uploadModel
 * @subpackage model/uploadModel
 *  @author SEPA Cyper Technologies, krishnakanth.r
 */
"use strict";

import { DbConnMgr } from "../dbconfig/dbconfig";
import { sqlObj } from '../utility/sql';
import { Utils } from '../utility/utils';
const format = require('string-format');
const DbInstance = DbConnMgr.getInstance();
const utils = new Utils();
// This is for testing purpose save in database 

export class Upload {
    constructor(user) {
        this.id = user.applicant_id;
        this.file_content = user.file_content;
        this.doc_name = user.doc_name;
        this.file_name = user.file_name;
        this.file_type = user.file_type;
    }
    getBusinessId(id) {
        return new Promise((resolve, reject) => {
            logger.info("getBusinessId() initiated");
            let sql = sqlObj.upload.getBusinessId;
            let sqlQuery = format(sql, id)
            DbInstance.doRead(sqlQuery).then(docsId => {
                logger.info("sql query executed");
                resolve(docsId);
            }).catch(err => {
                logger.error("error while execute the query");
                reject(err);
            });

        })
    }

    getCustomerId(applicantId) {
        return new Promise((resolve, reject) => {
            logger.info("getBusinessId() initiated");
            let sql = sqlObj.upload.getCustomerId;
            let sqlQuery = format(sql, applicantId)
            DbInstance.doRead(sqlQuery).then(docsId => {
                logger.info("sql query executed");
                resolve(docsId);
            }).catch(err => {
                logger.error("error while execute the query");
                reject(err);
            });

        })
    }
    getBusinesDocsId(id, fileName) {
        return new Promise((resolve, reject) => {
            logger.info("getBusinessDocsId() initiated");
            let sql = sqlObj.upload.getBusinesDocsId;
            let sqlQuery = format(sql, id, fileName);
            DbInstance.doRead(sqlQuery).then(docsId => {
                logger.info("sql query executed");
                resolve(docsId);
            }).catch(err => {
                logger.error("error while execute the query");
                reject(err);
            });
        })
    }
    //insert the documents into database
    insertDocs(file_type, fileName, id, doc_name, file_name, document_status) {
        return new Promise((resolve, reject) => {
            logger.info("insertDocs() initiated");
            let sql= sqlObj.upload.insertDocs;
            let sqlQuery = format(sql,id,file_name, doc_name,file_type,fileName, utils.getGMT(), document_status);            
            DbInstance.doInsert(sqlQuery).then(result => {
                logger.info("sql query executed");
                resolve(result);
            }).catch(err => {
                logger.error("error while execute the query");
                reject(err);
            });
        })
    }
    //update the documents 
    updateDocs(file_type, fileName, id, file_name) {
        return new Promise((resolve, reject) => {
            logger.info("updateDocs() initiated");
            let sql=sqlObj.upload.updateDocs;
            let sqlQuery = format(sql,file_type,fileName,id,file_name, utils.getGMT(), '1')
            console.log("sqlQuery", sqlQuery);
            DbInstance.doUpdate(sqlQuery).then(result => {
                logger.info("sql query executed");
                resolve(result);
            }).catch(err => {
                logger.error("error while execute the query");
                reject(err);
            });
        })
    }
    //get the files of respective business
    getFileDetails(docId) {       
        return new Promise((resolve, reject) => {
            logger.info("getFileDetails() initiated");
            let sql= sqlObj.upload.getFileDetails;
            let sqlQuery = format(sql,docId);            
            DbInstance.doRead(sqlQuery).then(result => {
                logger.info("sql query executed");
                resolve(result);
            }).catch(err => {
                logger.error("error while execute the query");
                reject(err);
            });
        })
    }
    getDocStatus(docId) {       
        return new Promise((resolve, reject) => {
            logger.info("getFileDetails() initiated");
            let sql= sqlObj.upload.getDocStatus;
            let sqlQuery = format(sql,docId);            
            DbInstance.doRead(sqlQuery).then(result => {
                logger.info("sql query executed");
                resolve(result);
            }).catch(err => {
                logger.error("error while execute the query");
                reject(err);
            });
        })
    }
}
