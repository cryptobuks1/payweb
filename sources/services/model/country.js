/**
 * countryModel Model
 * countryModel is used for the modeling of country data, Such as calling_code, Country name and Country Id.
 * @package countryModel
 * @subpackage sources/services/model/countryModel
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu.
 */
"use strict";

import { configVariable } from '../utility/country';
import { DbConnMgr } from "../dbconfig/dbconfig";
const db = DbConnMgr.getInstance();
const format = require('string-format');


//init() return current file location.


/* Country model*/
export class country {
	constructor(country) {
		logger.info('Country class constructor initiated')
		this.country_id = country.country_id;
		this.country_name = country.country_name;
		this.calling_code = country.calling_code;
		this.country_code = country.country_code;
	}

	/*Method to save country in database .Currently out of scope.*/
	saveCountry(country) {

	};
	// this method is used to get country list
	getCountriesList() {
		logger.info('Enters country model initiated for fetching countries')
		return new Promise(function (resolve, reject) {
			let sql =configVariable.sql.get_country;
			db.doRead(sql).then((result) => {
				logger.info('Fetched successfully country list at country model')
				resolve(result);
			}).catch((err) => {
				logger.error('Fail to fetch country list at country model')
				reject(`${err}`);
			})
		});
	};
	// this method is used to get country details by ID 
	getCountryByName(country_name) {
		logger.info('Enters country model initiated for fetching country by name')
		return new Promise(function (resolve, reject) {
			let sql = configVariable.sql.getCountryByName;
			let sqlQuery = format(sql, country_name)
			db.doRead(sqlQuery).then((result) => {
				logger.info('Fetched successfully country details by country name at country model')
				resolve(result);
			}).catch((err) => {
				logger.error('Fail to fetch country details by country name at country model')
				reject(err);
			})

		});
	}

	getStatusCurrency(){
		logger.info('Enters country model initiated for fetching country status');
		return new Promise((resolve,reject)=>{
			let sql =configVariable.sql.getStatusCurrency;
			db.doRead(sql).then(result=>{
				logger.info('Fetched successfully country status at country model')
				resolve(result);
			}).catch(err=>{
				logger.error('Fail to fetch country status at country model')
				reject(err);
			})

		})
	}

	getDistinctCurrency(){
		logger.info('Enters country model initiated for fetching curency');
		return new Promise((resolve,reject)=>{
			let sql =configVariable.sql.getDistinctCurrency;
			db.doRead(sql).then(result => {
				logger.info('Fetched successfully country currency')
				resolve(result);
			}).catch(err=>{
				logger.error('Fail to fetch currency at country model')
				reject(err);
			})
		})
	}



	//this method is to get currency by distinct manner 
	getCurrency() {
		logger.info('Enters country model initiated for fetching country currency status')
		return new Promise((resolve, reject) => {
			let sql =configVariable.sql.get_currency;
			db.doRead(sql).then(result => {
				logger.info('Fetched successfully country currency status at country model')
				resolve(result);
			}).catch((err) => {
				logger.error('Fail to fetch country currency status at country model')
				reject(err);
			})

		});
	}
}

