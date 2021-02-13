/**
 * currencyRateModel
 * this is used for the check the current currency rates and also show the convertamount with multiple Currency
 * @package currencyRateModel
 * @subpackage model/currencyRateModel
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */
"use strict";
import {
	langEngConfig
} from '../utility/lang_eng';
import {
	getCurrencyExchangeRateMuse,
	getcurrencyExchangeMuse
} from '../controller/commonCode';
import {
	CurrencyRate
} from '../model/currencyRateModel';
import {
	callCurrencyExchangeMuse
} from '../controller/museCommManager'

const STATUS = {
	SUCCESS: 0,
	FAILURE: 1
}

/**@desc it is using for the check the rates of currencies and convert the amount
 * @method currencyRate
 * @param {object} request -- it is request object
 * @param {object} response --it is response object

 **/
export let currencyRate = async (request, response) => {
	let currencyRate = new CurrencyRate(request.body);
	let applicant_id = request.params.applicant_id;
	let forMobile = false;
	if (request.body.forMobile !== undefined && request.body.forMobile == true) {
		forMobile = true;
	}
	logger.info("currencyRate() initiated");
	if (applicant_id == "" || applicant_id == "undefined") {
		logger.debug("invalid request data");
		return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail2, STATUS.FAILURE));
	}
	if (currencyRate.isConvert != 0 && currencyRate.isConvert != 1) {
		logger.debug("invalid request data");
		return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail2, STATUS.FAILURE));
	}
	if (currencyRate.isConvert == 0) {
		logger.info("rates function initiated");
		let ratesRes = await currencyRate.currencyRate(applicant_id, currencyRate.isConvert)

			logger.info("check the results valid or not");
			if (ratesRes.length > 0) {
				logger.info("successfully get result");
				var resultArray = [];
            _.forEach(ratesRes, (list) => {
                const obj = {};
                obj.from_currency = list.from_currency;
                obj.to_currency = list.to_currency;
                obj.check_rates_id = list.check_rates_id;
                resultArray.push(obj);
            });			
				var i =0;				
				const pArray = resultArray.map(async result => {
					const museCurrencyExchangeRes = await getCurrencyExchangeRateMuse(result.from_currency, result.to_currency, forMobile)
					return museCurrencyExchangeRes;
				});				
				const museCurrencyExchangeResArray = await Promise.all(pArray);	 
			
				museCurrencyExchangeResArray.forEach(element=> {				
				    const tmpData = []
					
					Object.entries(element.rate).forEach(([key, value]) => {
						var rateData = {
							"date": key,
							"currency":Object.values(element.rate[key])[0]
						}
						tmpData.push(rateData)
					})
					resultArray.forEach(item => {
						if(item.from_currency == element.from && item.to_currency == element.to) {
							item.rates = tmpData;
						}
					})									
					});							
					return response.send(ResponseHelper.buildSuccessResponse({
						rates: resultArray
					}));			
			} else {
				logger.info("failed to get results");
				return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail, STATUS.FAILURE));
			}		
	}
	if (currencyRate.isConvert == 1) {
		logger.info("convertion function initiated");
		currencyRate.convertionAmount(applicant_id, currencyRate.isConvert).then(convertRes => {
			if (convertRes.length > 0) {
				logger.info("successfully get result");
				logger.info("check the request currency and amount values are empty or not");
				if (currencyRate.from_currency != "undefined" && currencyRate.from_currency && currencyRate.amount) {
					logger.info("valid request currency and amount");
					convertRate(convertRes, currencyRate.from_currency, Number(currencyRate.amount)).then(res => {
						if (res.status == STATUS.SUCCESS) {
							logger.info("response send");
							return response.send(ResponseHelper.buildSuccessResponse({
								convertionRates: res.data
							}, langEngConfig.message.currency.success, STATUS.SUCCESS));
						} else {
							logger.info("response send");
							return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail3, STATUS.FAILURE));
						}
					}).catch(err => {
						return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
					});
				} else {
					logger.info("invalid request currency and amount");
					const unique = _.uniqBy(convertRes, function (list) {
						return list.from_currency;
					});
					var result = [];
					_.forEach(unique, function (row, key) {
						const obj = {};
						obj.to_currency = row.from_currency;
						obj.exchanged_amount = 0;
						obj.check_rates_id = row.check_rates_id;
						result.push(obj);
						if (result.length == unique.length) {
							logger.info("send response");
							return response.send(ResponseHelper.buildSuccessResponse({
								convertionRates: result
							}, langEngConfig.message.currency.success, STATUS.SUCCESS));
						}
					})
				}
			} else {
				logger.info("failed to get the results");
				return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail, STATUS.FAILURE));
			}
		}).catch(err => {
			return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
		})
	}
}

/**@desc it is using for the check the rates of currencies and convert the amount
 * @method getfixerValues
 * @param {object} request -- it is request object
 * @param {object} response --it is response object
 **/
export let getfixerValues = (request, response) => {
	var result;
	var modifiedData = [];
	getCurrencyExchangeRateMuse(request.params.from, request.params.to, false).then(res => {
		result = res.rate;
		_.forEach(Object.keys(res.rate), function (row) {
			var rateData = {
				"date": row,
				"currency": Object.values(result[row])[0]
			};
			modifiedData.push(rateData)
		})
		return response.send({
			status: STATUS.SUCCESS,
			message: langEngConfig.message.currency.success,
			data: modifiedData
		})
	}).catch(err => {
		return response.send({
			status: STATUS.FAILURE,
			message: langEngConfig.message.currency.fail3
		});
	})
}
/**@desc it is using for the check the rates of currencies and convert the amount
 * @method getfixerMultipleValues
 * @param {object} request -- it is request object
 * @param {object} response --it is response object
 **/
export let getfixerMultipleValues = (request, response) => {
	// var result;
	// var modifiedData = {};
	currencyExchangeRates(request.params.from, request.params.toArray).then(res => {
		//   result = res.rate;
		//   _.forEach(Object.keys(res.rate), function (row) {
		// 	  modifiedData[row] = Object.values(result[row])[0];
		//   })
		return response.send({
			status: STATUS.SUCCESS,
			message: langEngConfig.message.currency.success,
			data: res
		})
	}).catch(err => {
		return response.send({
			status: STATUS.FAILURE,
			message: langEngConfig.message.currency.fail3
		});
	})
}

/**
 * @method convertRate
 * @param {object} convertRes -- it has all request currencies
 * @param {string} from_currency --it is request currency
 * @param {decimal} amount -- it is request amount 
 * @description -- it is return the all rates values and converted amount and currencies
 **/
let convertRate = function (convertRes, from_currency, amount) {
	logger.info("convertRate initiated");
	return new Promise(function (resolve, reject) {
		logger.info("filter the unique values")
		const unique = _.uniqBy(convertRes, function (list) {
			return list.from_currency;
		});
		logger.info("filter the requested currency from results");
		var convertId = _.filter(unique, function (list) {
			return list.from_currency == from_currency;
		});
		logger.info("check the requested currency in results")
		if (convertId.length > 0) {
			logger.info("separated the requested currency from results");
			var dataList = _.filter(unique, function (list) {
				return list.from_currency !== from_currency;
			});
			var result = [];
			logger.info("check the separated results ");
			if (dataList.length > 0) {
				const request = {};
				request.to_currency = from_currency;
				request.exchanged_amount = amount.toFixed(4);
				request.check_rates_id = convertId[0].check_rates_id;
				result.push(request);
				var currencyExchangeRate = [];
				_.forEach(dataList, function (row, key) {
					currencyExchangeRate.push(getcurrencyExchangeMuse(from_currency, row.from_currency, row.check_rates_id));
				});
				logger.info("send the currencies data through third party api for getting rates");
				Promise.all(currencyExchangeRate).then(arrayList => {
					logger.info("getcurrencyExchangeMuse() initiated");
					logger.info("get the currency rates through third party api");
					_.forEach(arrayList, (list) => {
						const obj = {};
						obj.to_currency = list.to;
						obj.exchanged_amount = ((list.rate) * (amount)).toFixed(4);
						obj.check_rates_id = list.checkRates_id;
						result.push(obj);
					})
					resolve({
						status: STATUS.SUCCESS,
						message: langEngConfig.message.currency.success,
						data: result
					});
				}).catch(err => {
					logger.error("error while getting rates");
					reject(err);
				})
			} else {
				logger.info("no date otherthan request currency");
				//const result = [];
				const request = {};
				request.to_currency = from_currency;
				request.exchanged_amount = amount.toFixed(4);
				request.check_rates_id = convertId[0].check_rates_id;
				result.push(request);
				resolve({
					status: STATUS.SUCCESS,
					message: langEngConfig.message.currency.success,
					data: result
				})
			}
		} else {
			logger.debug("no data found with request currency ");
			resolve({
				status: STATUS.FAILURE,
				message: langEngConfig.message.currency.fail3
			});
		}
	})
}

/**
 * @method deleteCurrencyRate
 * @param {object} request -- it is request object
 * @param {object} response --it is response object
 * @description -- it is using for the delete the currency rate
 **/
export let deleteCurrencyRate = (request, response) => {
	logger.info("deleteCurrencyRate() initiated");
	let currencyRate = new CurrencyRate(request.params);
	currencyRate.deleteCurrencyRate(currencyRate.check_rates_id).then((result) => {
		if (result.affectedRows > 0) {
			logger.info("successfully deleted");
			return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.success1, STATUS.SUCCESS));
		} else {
			logger.debug("failed to delete");
			return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail1, STATUS.FAILURE));
		}
	}).catch(err => {
		return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
	})
}


/**
 * @method addRate
 * @param {object} request -- it is request object
 * @param {object} response --it is response object
 * @description -- it is using for the add rate in the database
 **/
export let addRate = async (request, response) => {
	logger.info("addRate() initiated");
	let currencyRate = new CurrencyRate(request.body);
	let applicant_id = request.params.applicant_id;
	logger.info("check the request data ");
	if (applicant_id == "" || applicant_id == "undefined") {
		logger.debug("invalid request data");
		return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail2, STATUS.FAILURE));
	}
	logger.info("check the request data");
	if (currencyRate.isConvert != 0 && currencyRate.isConvert != 1) {
		logger.debug("invalid request data");
		return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail2, STATUS.FAILURE));
	}
	let from_currency;
	let to_currency;
	if (currencyRate.isConvert == 0) {
		logger.info("check the from_currency and to currency values");
		if (currencyRate.from_currency == currencyRate.to_currency) {
			return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail2, STATUS.FAILURE));
		}
		if (currencyRate.from_currency == '' || currencyRate.to_currency == '' || currencyRate.from_currency == 'undefined' || currencyRate.to_currency == 'undefined') {
			logger.debug("invalid data");
			return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail2, STATUS.FAILURE));
		} else {
			logger.info("valid from_currency and to_currency values");
			from_currency = currencyRate.from_currency;
			to_currency = currencyRate.to_currency;
		}
	}
	if (currencyRate.isConvert == 1) {
		logger.info("check the from_currency value");
		if (currencyRate.from_currency == '' || currencyRate.from_currency == 'undefined') {
			logger.debug("invalid data");
			return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail2, STATUS.FAILURE));
		} else {
			logger.info("valid from_currency value");
			from_currency = currencyRate.from_currency;
			to_currency = currencyRate.from_currency;
		}
	}
	logger.info("selectRate() initiated for validating values in database");
	currencyRate.selectRate(applicant_id, from_currency, to_currency, currencyRate.isConvert).then(async (results) => {
		logger.info("check the results from selectRate() method");
		if (results.length > 0) {
			logger.info("successfully get the results");
			return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.check_rates_fail1, STATUS.FAILURE));
		} else {
			logger.info("no data related to request data");
			var today = new Date();
			let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
			let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			let createdOn = date + ' ' + time;
			logger.info("addRate() initiated for creating rate in database");
			const addRateRes = await currencyRate.addRate(applicant_id, from_currency, to_currency, currencyRate.isConvert, createdOn);

			if (addRateRes.err) {
				logger.error("error while inserted record in database")
				return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
			}

			logger.info("check the results");
			if (addRateRes.affectedRows > 0) {
				const check_rates_id = addRateRes.insertId;				
				let res = await getCurrencyExchangeRateMuse(from_currency, to_currency)
					const ratesResult = res.rate;
					const modifiedData = [];
					Object.keys(ratesResult).forEach((row) => {
						var rateData = {
							"date": row,
							"currency": Object.values(ratesResult[row])[0]
						};
						modifiedData.push(rateData);
					});
					logger.info("successfully inserted");
					return response.send(ResponseHelper.buildSuccessResponse({
						from_currency,
						to_currency,
						check_rates_id,
						rates: modifiedData
					}, langEngConfig.message.currency.success, STATUS.SUCCESS));
				// }).catch(err => {
				// 	logger.error("error while getting data 0");
				// 	return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
				// });
			} else {
				logger.debug("failed to inserted");
				return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.check_rates_fail, STATUS.FAILURE));
			}
		}
	}).catch(err => {
		logger.error("error while validating request data in database");
		return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
	})
}


export let getConvertNow = async (request, response) => {
	logger.info("Initiated convertNow");
	try {
		if (request.body.api_key) {
			if (request.body.api_key == process.env.PAYVOO_API_KEY) {
				logger.info("Calling callCurrencyExchangeMuse")		
				let result = await callCurrencyExchangeMuse(request.body.from_currency, request.body.to_currency, global.access_token);
				logger.info("Response of callCurrencyExchangeMuse", result)
				if (result && result.data) {
					return response.send(ResponseHelper.buildSuccessResponse({
						convertionRates: result
					}, langEngConfig.message.currency.success, STATUS.SUCCESS));
				}
			} else {
				logger.info("API key of callCurrencyExchangeMuse mismatch")
				return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
			}
		}
	} catch (error) {
		logger.info("error in calling callCurrencyExchangeMuse", error)
		return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
	}
}