/**
 * priceAlert Controller
 * priceAlert is used for create a alert for the rates
 * @subpackage controller\priceAlert
 *  @author SEPA Cyber Technologies, Tarangini Dola
 */
import { PriceAlert } from '../model/priceAlert';
import { getcurrencyExchangeMuse } from '../controller/commonCode';
import { langEngConfig } from '../utility/lang_eng';
import { Utils } from '../utility/utils';
let util = new Utils();

const STATUS = {
	SUCCESS: 0,
	FAILURE: 1,
	ACTIVE:1,
	DEACTIVE:0
}

const today = new Date();
const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const timeStamp = util.getGMT();
/**
 * This function for create the alert rates record
 * @method createAlert 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
export const createAlert = (request, response) => {
	logger.info("createAlert() initiated");
	let applicant_id = request.params.applicant_id;
	let priceAlert = new PriceAlert(request.body);
	let status = STATUS.ACTIVE;
	if (priceAlert.from_currency == '' || priceAlert.to_currency == '' || priceAlert.from_currency == 'undefined' || priceAlert.to_currency == 'undefined') {
		logger.info("invalid request data");
		return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail2, STATUS.FAILURE));
	}
	if (priceAlert.target_amount == '' || priceAlert.target_amount == 'undefined') {
		logger.info("target amount is undefined");
		return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail2, STATUS.FAILURE));
	}
	if (priceAlert.from_currency == priceAlert.to_currency) {
		logger.info("from currency and to currency both are same")
		return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail6, STATUS.FAILURE));
	}
	if (priceAlert.from_currency && priceAlert.to_currency && priceAlert.target_amount) {
		priceAlert.checkAlertInfo(applicant_id, priceAlert.from_currency, priceAlert.to_currency, priceAlert.target_amount, status).then(results => {
			if (results.length > 0) {
				logger.info("priceAlert record already existed with this request data");
				return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail8, STATUS.FAILURE));
			} else {
				priceAlert.createPriceAlert(applicant_id, priceAlert.from_currency, priceAlert.to_currency, priceAlert.target_amount, status).then(results => {
					if (results.affectedRows > 0) {
						logger.info("priceAlert created successfully")
						return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.alert_success, STATUS.SUCCESS));
					} else {
						logger.debug("something went wrong while creating data");
						return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.alert_error, STATUS.FAILURE));
					}
				}).catch(err => {
					return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
				});
			}
		}).catch(err => {
			return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
		});
	}
}

/**
 * This function for get the rates of respective person
 * @method getPriceAlerts
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
export const getPriceAlerts = (request, response) => {
	logger.info("getPriceAlerts() called");
	let applicant_id = request.params.applicant_id;
	let priceAlert = new PriceAlert(request.params);
	let status = STATUS.ACTIVE;
	priceAlert.getAlertDetails(applicant_id, status).then(data => {
		if (data.length > 0) {
			logger.info("successfully get the results");
			var i = 0
			_.forEach(data, function (row) {
				getcurrencyExchangeMuse(row.from_currency, row.to_currency, null).then(function (value) {
					i++;
					row["currency_rate"] = parseFloat(value.rate.toFixed(4));
						if (_.size(data) == i) {
							logger.info('execution completed');
							const numberOfPriceAlerts = data.filter(p => p.target_amount == p.currency_rate).length;
							response.send(ResponseHelper.buildSuccessResponse({ priceAlerts: data, numberOfPriceAlerts: numberOfPriceAlerts }, langEngConfig.message.payment.get_alert_success, STATUS.SUCCESS));
						}
					}).catch(err => {
						return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
					});

				
			})			
		} else {
			logger.debug("failed to get the results");
			return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.get_alert_fail, STATUS.FAILURE));
		}
	}).catch(err => {
		return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
	});
}

 /**
 * This function for update the alert rates record
 * @method updatePriceAlerts
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
 export const updatePriceAlerts=(request,response) => {
	 logger.info("updatePriceAlerts() called");
	let applicant_id = request.params.applicant_id;
	let priceAlert = new PriceAlert(request.body);
	let status = STATUS.ACTIVE;
	if(priceAlert.alert_id) {
		priceAlert.checkPriceAlertInfo(priceAlert.alert_id,status).then(data => {
			if(data.length > 0) {		
				priceAlert.updateAlertDetails(applicant_id,priceAlert.alert_id,priceAlert.from_currency,priceAlert.to_currency,priceAlert.target_amount,status,timeStamp).then(results => {
					if(results.affectedRows > 0) {
						logger.info("successfully updated");
						return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.update_alert_success, STATUS.SUCCESS));
					} else {
						logger.debug("failed to update the record");
						return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.update_alert_fail, STATUS.FAILURE));
					}
				}).catch(err => {
					return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
				});
			} else {
				logger.info("record is already there with this data");
				return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.get_fail, STATUS.FAILURE));
			} 
		}).catch(err => {
			return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
		})
	} else {
		logger.info("invalid request data");
		return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.currency.fail2, STATUS.FAILURE));
	}
	
 }

 /**
 * This function for delete the alert rates record
 * @method deletePriceAlerts 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
 export const deletePriceAlerts=(request,response) => {
	 logger.info("deletePriceAlerts() called");
	 let applicant_id = request.params.applicant_id;
	 let priceAlert = new PriceAlert(request.params);
	 let alertId = priceAlert.alert_id;
	 let status = STATUS.ACTIVE;
	 priceAlert.checkPriceAlertInfo(alertId,status).then(data => {
		 if(data.length > 0) {		
			priceAlert.deletePriceAlert(applicant_id,alertId,STATUS.DEACTIVE, timeStamp).then(results => {
				if(results.affectedRows > 0) {
					logger.info("successfully deleted");
				 response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.delete_alert_success, STATUS.SUCCESS));
				} else {
					logger.debug("failed to delete the record");
				 response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.delete_alert_fail, STATUS.FAILURE));
				}
			}).catch(err => {
			 return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
			});
		 } else {
			logger.info("record is already there with this data");
			return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.get_fail, STATUS.FAILURE));
		 } 
	 }).catch(err => {
		return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
	 })
	 
 }