var isAuthorized = require("../model/tokenModel");
var getLog = require('./consoleLog');

const crypto = require('crypto');
const crpt = require('cryptr');
const cryptr = new crpt('SecretKeyOfSepaCyber');

//init() return current file location.
var init = function () {
	return 'utility.validate';
}

let validate = function (req, res, next) {
	//To check the status
	getLog.getLogStatus(_.toLower(init())).then(logRes => {
		//To get the timestamp.
		getLog.getTimeStamp().then(timeStamp => {

			//log
			(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "utility.validate.validate() method initiated."): "";

			if (req.headers["x-merchant-token"] != 'undefined' && req.headers["x-merchant-token"]) {

				//log
				(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "Model/tokenModel.isValidSandboxMerchantToken() method called."): "";
				isAuthorized.obj.isValidSandboxMerchantToken(req.body.member_id, req.headers["x-merchant-token"]).then(function (result) {
					if (_.size(result) > 0) {

						//log
						(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "Token time expiry checked."): "";
						if (new Date(result[0].created_on).getTime() + result[0].expiry * 60000 > new Date().getTime()) {

							//log
							(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "utility.validate.validate() Execution completed."): "";
							next()
						} else {
							logger.debug(customLogger(responseStatusHandler.FORBIDDEN.CODE, responseStatusHandler.FORBIDDEN.TOKEN_EXPIRE));
							throw new CustomError(responseStatusHandler.FORBIDDEN.TOKEN_EXPIRE, responseStatusHandler.FORBIDDEN.CODE)
							//return res.send({ status: responseStatusHandler.FORBIDDEN.CODE, message: responseStatusHandler.FORBIDDEN.TOKEN_EXPIRE });
						}
					} else {
						logger.debug(customLogger(responseStatusHandler.NOT_FOUND.CODE, responseStatusHandler.NOT_FOUND.INVALID_USER));
						throw new CustomError(responseStatusHandler.NOT_FOUND.INVALID_USER, responseStatusHandler.NOT_FOUND.CODE)
						// return res.send({ status: responseStatusHandler.NOT_FOUND.CODE, message: responseStatusHandler.NOT_FOUND.INVALID_USER });
					}
				}, () => {
					logger.debug(customLogger(responseStatusHandler.NOT_FOUND.CODE, responseStatusHandler.NOT_FOUND.INVALID_DATA));
					throw new CustomError(responseStatusHandler.NOT_FOUND.INVALID_DATA, responseStatusHandler.NOT_FOUND.CODE)
					//return res.send({ status: responseStatusHandler.NOT_FOUND.CODE, message: responseStatusHandler.NOT_FOUND.INVALID_DATA });
				}).catch(e => {

					//log
					(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "Error in catch block of isValidSandboxMerchantToken() at validate()."): "";
					return res.send(e);
				})
			} else {
				logger.debug(customLogger(responseStatusHandler.FORBIDDEN.CODE, responseStatusHandler.FORBIDDEN.VALID_HEADER));

				//log
				(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "utility.validate.validate() Execution completed."): "";

				return res.send({
					status: responseStatusHandler.FORBIDDEN.CODE,
					message: responseStatusHandler.FORBIDDEN.VALID_HEADER
				});
			}
		})
	})
}


export const encrypt = function (text) {
	var cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq')
	var crypted = cipher.update(text, 'utf8', 'hex')
	crypted += cipher.final('hex');
	return crypted;
}

export const decrypt = function (text) {
	var decipher = crypto.createDecipher('aes-256-cbc', 'd6F3Efeq')
	var dec = decipher.update(text, 'hex', 'utf8')
	dec += decipher.final('utf8');
	return dec;
}

export const timeConvert = function(time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }

export const asyncEncrypt = async (text) => {
	let cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq')
	let crypted = cipher.update(text, 'utf8', 'hex')
	crypted += cipher.final('hex');
	return crypted;
}

export const asyncDecrypt = async (text) => {
	let decipher = crypto.createDecipher('aes-256-cbc', 'd6F3Efeq')
	let dec = decipher.update(text, 'hex', 'utf8')
	dec += decipher.final('utf8');
	return dec;
}
module.exports = {
	validate,
	encrypt,
	decrypt
}