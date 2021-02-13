/**
 * loggerConfigure Controller
 * loggerConfigure is used for setting manual updation for logger level's
 * @package loggerConfigure
 * @subpackage controller/loggerConfigure
 * @author SEPA Cyber Technologies, Satyanarayana G.
 */

"use strict";

import { LoggerModel } from '../model/loggerModel';
import { Utils } from '../utility/utils';
import { langEngConfig } from '../utility/lang_eng';

const loggerConfigure = new LoggerModel();

const STATUS = {
	FAILED: 1,
	SUCCESS: 0
};

class logConfigure {
	constructor(loggerReqObj) {
		this.moduleName = loggerReqObj.module_name;
		this.loggerLevel = loggerReqObj.logger_level;
	}
	isValidLoggerRequest() {
		if (Utils.isEmptyObject(this.moduleName) && Utils.isEmptyObject(this.loggerLevel)) {
			return false;
		}
		return true;
	}
}

/**
 * @desc This function is used to update logger service
 * @method updateConfiguration 
 * @param {Object}  request - It is Request object
 * @param {Object}  response - It is Response object
 * @return 
 */
export const updateConfiguration = function (request, response) {
	logger.info('initialize updateConfiguration()');

	const validateData = new logConfigure(request.body);
	if (!validateData.isValidLoggerRequest()) {
		logger.error('input for request are not valid ');
		return response.send(ResponseHelper.buildFailureResponse(langEngConfig.message.logger.invalidInput));
	}
	logger.info('Procced for _updateConfiguration()');
	return _updateConfiguration(validateData.moduleName, validateData.loggerLevel, response);
}

/**
 * @desc This function is used to update logger information
 * @method _updateConfiguration 
 * @param {String}  moduleName - It is reference to moduleName
 * @param {String}  loggerLevel - It is reference to setting logger level
 * @param {Object}  res - It is Response object
 * @return
 */
const _updateConfiguration = function (moduleName, loggerLevel, res) {
	logger.info(`Initiated _updateConfiguration()`);
	loggerConfigure.updateLoggerInfo(moduleName, loggerLevel)
		.then((results, err) => {
			if (!err) {
				logger.info(`Logger updated successfully`);
				res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.logger.updateSuccess, STATUS.SUCCESS))
			}
		})
		.catch(err => {
			logger.error(`Fail while updating logger configuration`);
			res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.logger.internalError)))
		});
}

export {
	updateConfiguration
}
