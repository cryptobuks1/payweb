//var mockconfigVariable = require('../utility/mockConfig');
"use strict";
var configVariable = require('../utility/lang_eng');
var sqlConfig = require('../utility/sqlService');
/**
* @description mockModel
* create model for mockModel operations.
* mock model operations.
* @author SEPA Cyber Technologies, Satyanarayana G .
*/
"use strict";

//init() return current file location.
var init = function () {
	return 'Model.mockModel';
}

var mockconfigVariable = require('../utility/mockConfig');
var getLog = require('../utility/consoleLog');

var obj = {};

obj.checkUser = class {
	constructor(api_key) {
		this.api_key = api_key
	}
};


obj.preparePaymentObj = class {
	constructor(applicant_id) {
		//To check the status
		getLog.getLogStatus(_.toLower(init())).then(logRes => {
			//To get the timestamp.
			getLog.getTimeStamp().then(timeStamp => {
				//log
				(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "Constructor of preparePaymentObj class at Model/mockModel called.") : "";
				this.applicant_id = applicant_id;
			})
		})
	}
};

// verify sandbox user for further access 
obj.checkUserValid = function (userData) {
	return new Promise(function (resolve, reject) {
		//query for get access users 
		myPool.query(`SELECT api_key , applicant_id FROM payvoo_sandbox WHERE api_key = '${userData.api_key}'`).then(results => {
			if (_.size(results) > 0) {
				resolve({ status: 1, message: configVariable.message.mockingConfig.success, applicant_id: results[0].applicant_id });
			} else {
				resolve({ status: 0, message: configVariable.message.mockingConfig.fail });
			}
		}).catch(err => {
			reject({ status: 0, Err: `${err}` })
		})
	})
}

obj.paymentsMock = function () {
	return new Promise(function (resolve, reject) {
		//To check the status
		getLog.getLogStatus(_.toLower(init())).then(logRes => {
			//To get the timestamp.
			getLog.getTimeStamp().then(timeStamp => {
				//log
				(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "Model/mockModel/paymentsMock() method initiated.") : "";
				myPool.query(mockconfigVariable.sql.select_mock_user).then(results => {
					(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "SQL query for payment detail fetching executed.") : "";
					if (_.size(results) > 0) {
						logger.debug(customLogger(responseStatusHandler.SUCCESS.CODE, mockconfigVariable.message.paymentDataSuccess));
						//log
						(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "Response sent to the mockController.") : "";
						//log
						(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "Model/mockModel/paymentsMock() method execution completed.") : "";
						resolve({ status: responseStatusHandler.SUCCESS.CODE, message: `${mockconfigVariable.message.paymentDataSuccess}`, results: results });
					} else {
						logger.debug(customLogger(responseStatusHandler.NOT_FOUND.CODE, mockconfigVariable.message.paymentDataFail));
						throw new CustomError(`${mockconfigVariable.message.paymentDataFail}`, responseStatusHandler.NOT_FOUND.CODE);
					}
				})
			})
		}).catch(err => {
			logger.error(customLogger(responseStatusHandler.NOT_FOUND.CODE, mockconfigVariable.message.paymentDataError));
			throw new CustomError(`${mockconfigVariable.message.paymentDataError}`, responseStatusHandler.NOT_FOUND.CODE);
		})
	})
}

module.exports = { obj }