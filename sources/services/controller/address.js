/**
 * address Controller
 * address Controller is used for the user will able to enter the address details either
  business or operating or shipping
 * @package address
 * @subpackage controller/address/address
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */

"use strict";
import {
	AddressModel
} from '../model/addressModel';
import {
	langEngConfig as configVariable,
	langEngConfig
} from '../utility/lang_eng';
import {
	UserModel
} from '../model/signUp';
import {
	BusinessOwner
} from '../model/businessOwner';
import {
	Kyc
} from '../model/kyc';
import {
	Utils
} from '../utility/utils';

const registerBusinessOwner = new BusinessOwner();
const kyc = new Kyc();
const STATUS = {
	SUCCESS: 0,
	FAILURE: 1
};

const today = new Date();
const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let util = new Utils();
const timeStamp = util.getGMT();
const userModel = new UserModel();

/**
 * @desc this is for the create address. 
 * @method createAddress 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */
export let createAddress = (request, response) => {
	let applicant_id = request.params.applicant_id;
	let addressModel = new AddressModel(request.body);
	logger.info('createAddress() initiated')
	if (applicant_id == '' || applicant_id == 'undefined') {
		logger.debug('invalid request');
		response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.info, STATUS.FAILURE));
	} else {
		addressModel.updateAddress(applicant_id, addressModel.address_type_id, addressModel.country_id, addressModel.postal_code, addressModel.address_line1, addressModel.address_line2, addressModel.city, addressModel.region, timeStamp).then(results => {
			if ((results.affectedRows) > 0) {
				logger.info("updated data successfully");
				logger.info("sent the response");
				response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.success, STATUS.SUCCESS));
			} else {
				logger.info("failed to updated");
				response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.fail, STATUS.FAILURE));
			}
		}).catch(err => {
			logger.error("error while update the data", err);
			response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
		});
	}
};

/**
 * @desc get the details of respective person. 
 * @method getAddressDetails 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return address details of person
 */
export let getAddressDetails = (request, response) => {
	let applicant_id = request.params.applicant_id;
	let addressModel = new AddressModel(request.params);
	logger.info('getDetails initiated');
	if (applicantId == '' && applicantId != 'undefined') {
		logger.debug('invalid request');
		return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.info, STATUS.FAILURE));
	} else {
		logger.info("getAddressDetails() initiated")
		addressModel.getAddressDetails(applicantId).then(results => {
			if ((_.size(results)) > 0) {
				logger.info("successfully fetch the data");
				response.send(ResponseHelper.buildSuccessResponse({
					addressDetails: results
				}, langEngConfig.message.get.success, STATUS.SUCCESS));
			} else {
				logger.dubug("failed while getting data");
				response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.get.fail, STATUS.FAILURE));
			}
		}).catch(err => {
			logger.error("error while getting data");
			response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
		});
	}
}

/**
 * @desc Update address of the respective person.
 * @method updateAddress 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code.
 */
export let updateAddress = (request, response) => {
	let applicant_id = request.params.applicant_id;
	let addressModel = new AddressModel(request.body);
	logger.info('updateAddress() initiated')
	if (applicant_id != 'undefined' && applicant_id && addressModel.address_type_id && addressModel.address_type_id != 'undefined') {
		userModel.getApplicantContact(request.body.user_id)
			.then(contact => {
				logger.info('getApplicantContact() success');
				if (_.size(contact) > 0 && contact[0] && contact[0].applicant_id) {
					addressModel.updateAddress(contact[0].applicant_id, addressModel.address_type_id, addressModel.country_id, addressModel.postal_code, addressModel.address_line1, addressModel.address_line2, addressModel.city, addressModel.region, timeStamp).then(results => {
						if ((results.affectedRows) > 0) {
							logger.info("data updated successfully");
							logger.info("sent the response");
							response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.success, STATUS.SUCCESS));
						} else {
							logger.info("unable to update");
							response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.fail, STATUS.FAILURE));
						}
					}).catch(err => {
						logger.error("error while update the data")
						response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
					});
				} else {
					logger.info('Applicant not found');
					response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.signUp.applicant_notFound, STATUS.FAILED));
				}
			}).catch(err => {
				response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.signUp.contactError)));
			})

	} else {
		logger.debug("invalid request");
		response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.info, STATUS.FAILURE));
	}
}

/**
 * @desc Method for fetching all the address_type available.
 * @method getAddressType 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return list of address types.
 */
export let getAddressType = (request, response) => {
	let addressModel = new AddressModel(request);
	logger.info('getAddressType() initiated')
	addressModel.getAddressType().then(res => {
		logger.info("response sent")
		response.send(ResponseHelper.buildSuccessResponse({
			address_type: res
		}, langEngConfig.message.address_type.success, STATUS.SUCCESS))
	}).catch(err => {
		logger.error("error while getting data");
		response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
	})
}

/**
 * @desc Method for fetching all the business_address_details available. 
 * @method getBusinessAddressDetails
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return list of address details.
 */
export let getBusinessAddressDetails = (request, response) => {
	let addressModel = new AddressModel(request.body);
	addressModel.getContactByUser(addressModel.user_id).then(applicant_Id => {
		if (_.size(applicant_Id) > 0 && applicant_Id[0]) {
			logger.info('getDetails initiated');
			let applicantId = applicant_Id[0].applicant_id;
			if (applicantId == '' && applicantId != 'undefined') {
				logger.debug('invalid request');
				response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.info, STATUS.FAILURE));
			} else {
				logger.info("getAddressDetails() initiated")
				addressModel.getAddressDetails(applicantId).then(results => {
					if ((_.size(results)) > 0) {
						logger.info("successfully fetch the data");
						response.send(ResponseHelper.buildSuccessResponse({
							addressDetails: results
						}, langEngConfig.message.get.success, STATUS.SUCCESS));
					} else {
						response.send(ResponseHelper.buildSuccessResponse({
							addressDetails: []
						}, configVariable.message.businessOwnerContact.ownerAddressFail, STATUS.FAILED));
						//	response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.get.fail, STATUS.FAILURE));
					}
				}).catch(err => {
					logger.error("error while getting data");
					response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
				});
			}
		} else {
			response.send(ResponseHelper.buildSuccessResponse({
				addressDetails: []
			}, configVariable.message.businessOwnerContact.ownerAddressFail, STATUS.FAILED));
		}
	}).catch(err => {
		logger.debug(' registerBusinessOwner.getContactByUser(owner.ownerDetails.email)');
		response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
	});
}