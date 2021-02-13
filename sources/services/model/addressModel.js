/**
 * addressModel
 * this is used for the insert  the address details of person in database and get the data from database
 * @package addressModel
 * @subpackage model/addressModel
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */
"use strict";
const format = require('string-format');
import { DbConnMgr } from '../dbconfig/dbconfig';
import { sqlObj } from "../utility/sql";
import { sqlConfig } from '../utility/sqlService';
const DbInstance = DbConnMgr.getInstance();

export class AddressModel {
	constructor(user) {	
		this.address_type_id = user.address_type_id;
		this.country_id = user.country_id;
		this.postal_code = user.postal_code;
		this.address_line1 = user.address_line1;
		this.address_line2 = user.address_line2;
		this.city = user.city;
		this.country = user.country;
		this.region = user.region;
		this.email = user.email;
		this.user_id = user.user_id;
	}
	//this is for getting contact_id;
	getContactId(applicantId) {
		return new Promise((resolve, reject) => {
			logger.info('getContactId() initiated');
			let sql =sqlObj.addressModel.getContactId;
			let sqlQuery = format(sql,applicantId);
			DbInstance.doRead(sqlQuery).then(result => {
				logger.info("query executed");
				resolve(result);
			}).catch(err => {
				logger.error("error while  execute the query");
				reject(err);
			});
		});
	}
	//this is method for getting  address_type_id
	getAddressTypeId(applicantId, contactId, addressTypeID) {
		return new Promise((resolve, reject) => {
			logger.info('getAddressTypeId() initiated');
			let sql = sqlObj.addressModel.getAddressTypeId;
			let sqlQuery = format(sql, applicantId,contactId,addressTypeID);
			DbInstance.doRead(sqlQuery).then(result => {
				logger.info("query executed");
				resolve(result);
			}).catch(err => {
				logger.error("error while  execute the query");
				reject(err);
			});
		});
	}
	//this is for the insert address details in database
	insertAddress(applicantId, addressTypeId, contactId, countryId, postalCode, addressLine1, addrssLine2, city, region, timeStamp) {
		return new Promise((resolve, reject) => {
			logger.info('insertAddress() initiated');
			let sql = sqlObj.addressModel.insertAddress;
			
			let sqlQuery = format(sql, applicantId,addressTypeId, contactId, countryId, postalCode, addressLine1, addrssLine2, city, region, timeStamp)
			DbInstance.doInsert(sqlQuery).then(result => {
				logger.info("query executed");
				resolve(result);
			}).catch(err => {
				logger.error("error while  execute the query");
				reject(err);
			});
		});
	}
	//this is for the update the address details
	updateAddress(applicantId, addressTypeId, countryId, postalCode, addressLine1, addrssLine2, city, region, timeStamp) {
		return new Promise((resolve, reject) => {
			logger.info(' updateAddress() initiated');
			let sql = sqlObj.addressModel.updateAddress;
			let sqlQuery = format(sql, applicantId, addressTypeId, countryId, postalCode, addressLine1, addrssLine2, city, region, timeStamp)
 				DbInstance.doUpdate(sqlQuery).then(result => {
				logger.info("query executed");
				resolve(result);
			}).catch(err => {
				logger.error("error while  execute the query");
				reject(err);
			})
		});
	}
	//this is for the get the addressDetails of respective person
	getPersonalAddressDetails(applicantId) {
		return new Promise((resolve, reject) => {
			logger.info('getAddressDetails() initiated');
			let sql = sqlObj.addressModel.getAddressDetails;
			let sqlQuery = format(sql,applicantId, 1);
			DbInstance.doRead(sqlQuery).then(results => {			
				logger.info("query executed");
				resolve(results);			
			}).catch(err => {
				logger.error("error while  execute the query");
				reject(err);
			});
		});
	}

	getBusinessAddressDetails(applicantId) {
		return new Promise((resolve, reject) => {
			logger.info('getAddressDetails() initiated');
			let sql = sqlObj.addressModel.getAddressDetails;
			let sqlQuery = format(sql,applicantId, 2);
			DbInstance.doRead(sqlQuery).then(results => {
				logger.info("query executed");
				resolve(results);			
			}).catch(err => {
				logger.error("error while  execute the query");
				reject(err);
			});
		});
	}

	getOperatingAddressDetails(applicantId) {
		return new Promise((resolve, reject) => {
			logger.info('getAddressDetails() initiated');
			let sql = sqlObj.addressModel.getAddressDetails;
			let sqlQuery = format(sql,applicantId, 3);
			DbInstance.doRead(sqlQuery).then(results => {
				logger.info("query executed");
				resolve(results);			
			}).catch(err => {
				logger.error("error while  execute the query");
				reject(err);
			});
		});
	}
	//this is for the addressType details
	getAddressType() {
		return new Promise((resolve, reject) => {
			logger.info(' getAddressType() initiated');
			let sql = sqlObj.addressModel.getAddressType;
			let sqlQuery = format(sql);
			DbInstance.doRead(sqlQuery).then(results => {
				logger.info("query executed");
				resolve(results);
			}).catch(err => {
				logger.error("error while  execute the query");
				reject(err);
			});
		})
	}
	getContactByUser(email) {
		return new Promise((resolve, reject) => {
			logger.info('initialize  getContactByUser() ');
			let sql = sqlConfig.businessOwner.getContactByUser;
			let sqlQuery = format(sql, email);
			DbInstance.doRead(sqlQuery).then(contactInfo => {
				logger.info('success in  getContactByUser() ');
				resolve(contactInfo);
			}).catch(err => {
				logger.error('error in  getContactByUser() ');
				reject(err);
			});
		});
	}

}
