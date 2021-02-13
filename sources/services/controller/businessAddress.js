/**
 * address Controller
 * address Controller is used for the user will able to enter the address details either
  business or operating or shipping
 * @package businessAddress
 * @subpackage controller/businessAddress
 *  @author SEPA Cyper Technologies,J.Madhu Kumar
 */

"use strict";
import {
    AddressModel
} from '../model/addressModel';
import {
    langEngConfig
} from '../utility/lang_eng';
import {
    BusinessOwner
} from '../model/businessOwner';
import {
    Utils
} from '../utility/utils';
import {
    Kyc
} from '../model/kyc';

const registerBusinessOwner = new BusinessOwner();
let util = new Utils();
const timeStamp = util.getGMT();
const kyc = new Kyc();
const STATUS = {
    SUCCESS: 0,
    FAILURE: 1
};

/**
 * @desc this is for the create address. 
 * @method createBusinessAddress 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */
export let createBusinessAddress = async (request, response) => {
    let applicant_id = request.params.applicant_id
    let addressModel = new AddressModel(request.body);
    if (applicant_id) {
        if (_.toLower(request.body.account_type) == "business") {
            logger.info("getContactId() called");
            // 1. Given an applicantID get contact ID
            let results = await addressModel.getContactId(applicant_id)
            if (results.length > 0) {
                let contactId = results[0].contact_id;
                let data = await registerBusinessOwner.getBusinessId(applicant_id)
                if (_.size(data) > 0 && data[0] && data[0].business_id) {
                    let results = await addressModel.getAddressTypeId(applicant_id, contactId, request.body.address_type_id)
                    if (results.length > 0) {
                        let addressResponse = await updateBusinessAddress(applicant_id, request, response, data)
                        if (addressResponse) {
                            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.address_type.businessAddressSuccess, STATUS.SUCCESS));
                        }
                    } else {
                        let addressResponse = await insertBusinessAddress(applicant_id, request, response, data, contactId)
                        if (addressResponse) {
                            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.address_type.businessAddressSuccess, STATUS.SUCCESS));
                        }
                    }
                }
            }
        }
    } else {
        logger.debug('invalid request');
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.info, STATUS.FAILURE));
    }
}


/**
 * @desc get the details of respective person. 
 * @method updateBusinessAddress 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return address details of person
 */
export const updateBusinessAddress = async (applicant_id, request, response, data) => {
    let addressModel = new AddressModel(request.body);
    addressModel.updateAddress(applicant_id, request.body.address_type_id, request.body.country_id, request.body.postal_code, request.body.address_line1, request.body.address_line2, request.body.city, request.body.region, timeStamp).then(results => {
        if ((results.affectedRows) > 0) {
            if (request.body.address_type_id == 3) {
                kyc.updateDashboardKycStatus('1', data[0].business_id, 'business_address').then(results => {
                    if (results.affectedRows) {
                        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.address_type.businessAddressSuccess, STATUS.SUCCESS));
                    } else {
                        logger.error('Dashboard status fail , while updating')
                        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.kyc.updateFail, STATUS.FAILED))
                    }
                }).catch(err => {
                    logger.error('Dashboard status fail , while updating')
                    response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.kyc.updateFail, STATUS.FAILED))
                })
            } else {
                response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.address_type.businessAddressSuccess, STATUS.SUCCESS));
            }
        } else {
            logger.info("failed to updated");
        }
    }).catch(err => {
        logger.error("error while getting data");
        return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    });
}


/**
 * @desc get the details of respective person. 
 * @method updateBusinessAddress 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return address details of person
 */
export const insertBusinessAddress = async (applicant_id, request, response, data, contactId) => {
    let addressModel = new AddressModel(request.body);
    addressModel.insertAddress(applicant_id, request.body.address_type_id, contactId, request.body.country_id, request.body.postal_code, request.body.address_line1, request.body.address_line2, request.body.city, request.body.region, timeStamp).then(results => {
        if ((results.affectedRows) > 0) {
            logger.info('successfully fetech the results');
            logger.info("sent the response");

            if (request.body.address_type_id == 3) {
                kyc.updateDashboardKycStatus('1', data[0].business_id, 'business_address').then(results => {
                    if (results.affectedRows) {
                        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.address_type.businessAddressSuccess, STATUS.SUCCESS));
                    } else {
                        logger.error('Dashboard status fail , while updating')
                        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.kyc.updateFail, STATUS.FAILED))
                    }
                }).catch(err => {
                    logger.error('Dashboard status fail , while updating')
                    response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.kyc.updateFail, STATUS.FAILED))
                })
            } else {
                response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.address_type.businessAddressSuccess, STATUS.SUCCESS));
            }
        } else {
            logger.dubug("failed to insert");
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.address_type.businessAddressFail, STATUS.FAILURE));
        }
    }).catch(err => {
        logger.error("error while insert the data");
        return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    });
}


/**
 * @desc get the details of respective person. 
 * @method getBusinessAddress 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return address details of person
 */
export let getBusinessAddress = (request, response) => {   
    let addressModel = new AddressModel(request.params);
    logger.info('getDetails initiated');
    let applicantId = request.params.applicant_id;
    if (applicantId == '' && applicantId != 'undefined') {
        logger.debug('invalid request');
        return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.info, STATUS.FAILURE));
    } else {
        logger.info("getAddressDetails() initiated")
        addressModel.getBusinessAddressDetails(applicantId).then(results => {          
            if (results && results.length > 0) {
                addressModel.getOperatingAddressDetails(applicantId).then(opAddress => {
                    if (opAddress && opAddress.length > 0) {                 
                logger.info("successfully fetch the data");
                let data = results.concat(opAddress);
                response.send(ResponseHelper.buildSuccessResponse({
                    addressDetails: data
                }, langEngConfig.message.get.success, STATUS.SUCCESS));
            } else {
                response.send(ResponseHelper.buildSuccessResponse({
                    addressDetails: results
                }, langEngConfig.message.get.success, STATUS.SUCCESS));
            }
        }).catch(err => {
            logger.error("error while getting data");
            response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
        });
            } else {
                logger.debug("failed while getting data");
                response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.get.fail, STATUS.FAILURE));
            }
            
        }).catch(err => {
            logger.error("error while getting data");
            response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
        });
    }
}