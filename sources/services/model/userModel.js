/**
 * signUpModel Model
 * signUpModel is used for the modeling of user registration purpose. An individual user has to give the required 
 * data to register himself in the payvoo app.
 * @package signUpModel
 * @subpackage sources/services/model/signUpModel
 * @author SEPA Cyber Technologies, Sekhara Suman Sahu.
 */

"use strict";

import { DbConnMgr } from "../dbconfig/dbconfig";
import { sqlObj } from '../utility/sql';
import { Utils } from '../utility/utils';
const utils = new Utils();
const format = require('string-format');
const DbInstance = DbConnMgr.getInstance();

export class UserModel {
	constructor() {

	}
	//Method for check duplicate user data
	getContactId(email, mobile, accountType) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.userModel.getContactId;
			let sqlQuery = format(sql, accountType, email, mobile)
			DbInstance.doRead(sqlQuery).then(userData => {
				resolve(userData);
			}).catch(err => {
				reject(err);
			});
		})
	}

	//Method for cheking existing email id or mobile number
	isUserExists(value) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.userModel.isUserExists;
			let sqlQuery = format(sql, type, value)
			DbInstance.doRead(sqlQuery).then(userData => {
				resolve(userData);
			}).catch(err => {
				reject(err);
			});
		})
	}
	createApplicant(conn, account_type, next_step) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.userModel.createApplicant;
			let sqlQuery = format(sql, account_type, next_step, utils.getGMT())
			conn.query(sqlQuery).then(applicantRes => {
				resolve(applicantRes)
			}).catch(err => {
				reject(err);
			})
		})
	}
	createContact(conn, applicantId, first_name, middle_name, last_name, email, gender, dob, telephone, mobile, phone) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.userModel.createContact;
			let sqlQuery = format(sql, applicantId, first_name, middle_name, last_name, email, gender, dob, telephone, mobile, phone, utils.getGMT());
			conn.query(sqlQuery).then(contactResult => {
				resolve(contactResult);
			}).catch(err => {
				reject(err);
			})
		})
	}

	createAddress(conn, applicantId, contactId, address_type_id, country_id, postal_code, address_line1, address_line2, city, town, region) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.userModel.createAddress;
			let sqlQuery = format(sql, country_id, address_type_id, postal_code, address_line1, address_line2, applicantId, city, town, region, contactId, utils.getGMT());
			conn.query(sqlQuery).then(addressResult => {
				resolve(addressResult);
			}).catch(err => {
				reject(err);
			})
		})
	}
	createUser(userLoginTable, conn, email, applicantId, password, passcode_pin, roleId) {
		return new Promise((resolve, reject) => {
			//let sql=`"insert into user_login (user_id,applicant_id,password,passcode_pin,role_id,email_verified,mobile_verified) values ('${email}','${applicantId}','${password}','${passcode_pin}','${roleId}',1,1)"`;
			conn.query(userLoginTable, [email, applicantId, password, passcode_pin, roleId, 1, 1]).then(userResult => {
				resolve(userResult);
			}).catch(err => {
				reject(err);
			})
		})

	}
	insertKycDetails(conn, applicantId) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.userModel.insertKycDetails;
			let sqlQuery = format(sql,applicantId,utils.getGMT())
			conn.query(sqlQuery).then(kycResult => {
				resolve(kycResult);
			}).catch(err => {
				reject(err);
			})
		})
	}
	createCurrencyAccount(conn, applicantId, roleId) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.userModel.createCurrencyAccount;
			let sqlQuery = format(sql,applicantId,roleId,utils.getGMT() )
			conn.query(sqlQuery).then(accountResult => {
				resolve(accountResult);
			}).catch(err => {
				reject(err);
			})
		})

	}
	createSandboxUser(conn, applicantId, memberId, apiKey, url, api_doc_url, redirect_url) {
		return new Promise((resolve, reject) => {
			let sql = sqlObj.userModel.createSandboxUser;
			let sqlQuery = format(sql,applicantId,memberId,apiKey,url,api_doc_url,redirect_url, utils.getGMT())
			conn.query(sqlQuery).then(userResult => {
				resolve(userResult);
			}).catch(err => {
				reject(err);
			})
		})

	}

	//select the password for the login 
	loginUser(email, table, role) {
		logger.info('loginUser initiated at userModel')
		return new Promise(function (resolve, reject) {
			let sql = sqlObj.userModel.loginUser ;
			let sqlQuery = format(sql,table,email,role)
			DbInstance.doRead(sqlQuery).then(res => {
				logger.info('Fetched Login response at userModel')
				resolve(res);
			}).catch(err => {
				logger.error('Error while fetching loginUser response')
				reject(`${err}`);
			})
		})
	}


	//this is for the check the intialpayment status
	checkInitialPayment(applicant_id) {
		return new Promise(function (resolve, reject) {
			logger.info('checkInitialPayment initiated at userModel')
			let sql =  sqlObj.userModel.checkInitialPayment;
			let sqlQuery = format(sql, applicant_id);
			DbInstance.doRead(sqlQuery).then(result => {
				logger.info('Fetched checkInitialPayment info at userModel')
				resolve(result);
			}).catch(err => {
				logger.error('Error while fetching checkInitialPayment info at userModel')
				reject(`${err}`);
			})
		})
	}

	// // this function is used for create response and send back 

	// used for get business id and append in the response of signup/ login
	getBusinessId(applicant_id) {
		return new Promise(function (resolve, reject) {
			let sql = sqlObj.userModel.getBusinessId;
			let sqlQuery = format(sql, applicant_id)
			DbInstance.doRead(sqlQuery).then((result) => {
				resolve(result);
			}).catch((err) => {
				reject(`${err}`);
			})

		});
	}
	//this is for the get the pin
	getPin(table, email) {
		return new Promise(function (resolve, reject) {
			let sql = sqlObj.userModel.getPin;
			let sqlQuery= format(sql,table,email);
			DbInstance.doRead(sqlQuery).then(res => {
				resolve(res);
			})
		})
	}
	getSandboxDetails(applicant_id) {
		return new Promise(function (resolve, reject) {
			let sql = sqlObj.userModel.getSandboxDetails;
			let sqlQuery = format(sql, applicant_id);
			DbInstance.doRead(sqlQuery).then((res) => {
				resolve(res);
			}).catch(err => {
				reject(`${err}`);
			})
		})
	}

	//Get user data from decrypted mobile number
	getDecryptData(value){
		return new Promise((resolve, reject)=>{
			let sql = sqlObj.userModel.getUserData;
			let sqlQuery = format(sql, value);

			DbInstance.doRead(sqlQuery).then(result=>{
				resolve(result);
			}).catch(err=>{
				reject(new Error(err));
			})
		})
	}

	//Get kyb_business_owner table data based on email
	getKybBusiOwnerData(email){
		return new Promise((resolve, reject)=>{
			let sql = sqlObj.userModel.getKybBusinessData;
			let sqlQuery = format(sql, email);

			DbInstance.doRead(sqlQuery).then(result=>{
				resolve(result);
			}).catch(err=>{
				reject(new Error(err));
			})
		})
	}

		//Get kyb_business_owner table data based on email
		getKybBusinessDataForLink(email , fullName){
			return new Promise((resolve, reject)=>{
				let sql = sqlObj.userModel.getKybBusinessDataForLink;
				let sqlQuery = format(sql, email ,fullName);
	
				DbInstance.doRead(sqlQuery).then(result=>{
					resolve(result);
				}).catch(err=>{
					reject(new Error(err));
				})
			})
		}

		getKycBusinessStatus(email){
			return new Promise((resolve, reject)=>{
				let sql = sqlObj.userModel.getKycStatus;
				let sqlQuery = format(sql, email);
				DbInstance.doRead(sqlQuery).then(result=>{
					resolve(result);
				}).catch(err=>{
					reject(new Error(err));
				})
			})
		}

	

}
