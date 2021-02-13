/**
 * loggerModel Model
 * loggerModel is used for the fetching configurable log levels.
 * @package loggerModel
 * @subpackage sources/services/model/loggerModel
 * @author SEPA Cyper Technologies, Satyanarayana G.
 */

"use strict";

import { DbConnMgr } from "../dbconfig/dbconfig";
const DbInstance = DbConnMgr.getInstance();
const format = require('string-format');
import { sqlObj } from '../utility/sql';
import { Utils } from '../utility/utils';
let utils = new Utils();

export class LoggerModel {
	constructor() {
	}
	getAllModules() {
		return new Promise((resolve, reject) => {		
			let sql = sqlObj.loggerModel.getAllModules;
			let sqlQuery = format(sql)
			DbInstance.doRead(sqlQuery)
				.then(res => {				
					resolve(res);
				}).catch(err => {				
					reject(err);
				});
		});
	}
	removeExpireTokens() {
		return new Promise((resolve, reject) => {		
			let sql = sqlObj.loggerModel.removeExpireTokens;
			DbInstance.doDelete(sql)
				.then(res => {					
					resolve(res);
				}).catch(err => {				
					reject(err);
				});
		});
	}
	updateLoggerInfo(moduleName, moduleLevel) {
		return new Promise((resolve, reject) => {
			logger.info('updateConfiguration() initiated');
			let sql = sqlObj.loggerModel.updateLoggerInfo;
			let sqlQuery = format(sql, moduleName, moduleLevel, utils.getGMT())
			DbInstance.doUpdate(sqlQuery).then(res => {				
				resolve(res);
			}).catch(err => {			
				reject(err);
			})
		})
	}
}

