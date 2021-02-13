

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
	langEngConfig
} from '../utility/lang_eng';
import {
	UserModel
} from '../model/signUp';
import {
	Utils
} from '../utility/utils';

const STATUS = {
	SUCCESS: 0,
	FAILURE: 1
};

let util = new Utils();
const timeStamp = util.getGMT();
const userModel = new UserModel();
/**
 * @desc this is for the create address. 
 * @method createBusinessOwnersAddress 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */
export let createBusinessOwnersAddress = (request, response) => {
	let applicant_id = request.params.applicant_id
	let addressModel = new AddressModel(request.body);
	logger.info('createAddress() initiated')
	if (applicant_id == '' || applicant_id == 'undefined') {
		logger.debug('invalid request');
		response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.info, STATUS.FAILURE));
	} else {
		if (_.toLower(request.body.account_type) == "business" && request.body.user_id) {
			userModel.getApplicantContact(request.body.user_id)
				.then(contact => {
					logger.info('getApplicantContact() success');
					if (_.size(contact) > 0 && contact[0] && contact[0].applicant_id) {
						logger.info('insertAddress() triggered');
						addressModel.insertAddress(contact[0].applicant_id, addressModel.address_type_id, contact[0].contact_id, addressModel.country_id, addressModel.postal_code, addressModel.address_line1, addressModel.address_line2, addressModel.city, addressModel.region, timeStamp).then(results => {
							if ((results.affectedRows) > 0) {
								logger.info('successfully fetech the results');
								logger.info("sent the response");
								response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.address_type.businessAddressSuccess, STATUS.SUCCESS));
							} else {
								logger.debug("failed to insert");
								response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.address_type.businessAddressFail, STATUS.FAILURE));
							}
						}).catch(err => {
							logger.error("error while insert the data");
							response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
						});
					} else {
						logger.info('Applicant not found');
						response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.signUp.applicant_notFound, STATUS.FAILED));
					}
				}).catch(err => {
					response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.signUp.contactError)));
				})
            }
	}
};


/**
 * @desc Update address of the respective person.
 * @method updateBusinessOwnersAddress 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code.
 */
export let updateBusinessOwnersAddress = (request, response) => {
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