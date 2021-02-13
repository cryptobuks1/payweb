/**
 * address Controller
 * address Controller is used for the user will able to enter the address details either
  business or operating or shipping
 * @package businessAddress
 * @subpackage controller/businessAddress
 * @author SEPA Cyper Technologies,J.Madhu Kumar
 */

"use strict";

import {
    langEngConfig as configVariable,
    langEngConfig
} from '../utility/lang_eng';
import {
    Contact
} from '../model/contactModel';
import {
    BusinessOwner
} from '../model/businessOwner';
import {
    Utils
} from '../utility/utils';
import {
    AddressModel
} from '../model/addressModel';
import {
    Kyc
} from '../model/kyc';

let util = new Utils();
const timeStamp = util.getGMT();
const registerBusinessOwner = new BusinessOwner();
const kyc = new Kyc();
const STATUS = {
    SUCCESS: 0,
    FAILURE: 1
};

class Owner {
    constructor(request) {
      this.ownerDetails = {
        "first_name": request.body.first_name ? request.body.first_name : '',
        "last_name": request.body.last_name ? request.body.last_name : '',
        "email": request.body.email ? request.body.email : '',
        "gender": request.body.gender ? request.body.gender : '',
        "dob": request.body.dob ? request.body.dob : '',
        "mobile": request.body.mobile ? request.body.mobile : '',
        "business_id": request.body.business_id ? request.body.business_id : '',
        "business_owner_type": request.body.business_owner_type ? request.body.business_owner_type : '',
        "percentage": request.body.percentage ? request.body.percentage : '',
        "status": request.body.status ? request.body.status : '',
        "type": request.body.type ? request.body.type : '',
        "isKyc": request.body.isKyc,
        "kyb_bisiness_owner_id": request.body.kyb_bisiness_owner_id ? request.body.kyb_bisiness_owner_id : '',
        "kyb_bo_id": request.body.kyb_bo_id ? request.body.kyb_bo_id : '',
        "country_id": request.body.country_id ? request.body.country_id : '',
        "phone": request.body.phone ? request.body.phone : '',
        "kyb_id": request.body.kyb_id ? request.body.kyb_id : ''
      };
      this.id = request.params.id;
      this.type = request.params.type;
      this.contact_id = request.params.contact_id;
      this.kyb_document_id = request.params.kyb_document_id;
      this.token = request.params.token;
      this.applicantId = request.params.applicant_id;
      this.token_link = request.body.token ? request.body.token : '';
    }
  }

/**
 * @desc this is for the create BusinessPersonalProfile. 
 * @method businessPersonalProfileContact 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */
export const businessPersonalProfileContact = (request, response) => {
    const applicant_id = request.params.applicant_id;
    if (applicant_id == '' || applicant_id == 'undefined') {
        logger.debug('invalid request');
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.info, STATUS.FAILURE));
    } else {
        logger.info("addBusinessPersonalProfile() initiated");
        const contact = new Contact(request.body);
        contact.getContactId(applicant_id).then(results => {
            if (_.size(results) > 0) {
                logger.info("successfully fetched the businessPersonalProfile");
                logger.info("Updating the businessPersonelProfile");
                updateContact(contact, applicant_id, logger, response);
            } else {
                logger.info("No business business personal profile exists and creating new one");
                addContact(contact, applicant_id, logger, response);
            }
        }).catch(err => {
            logger.error("error while getting data");
            response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.getError)));
        });
    }
}

// Helper function for businessPersonalProfileContact
export const updateContact = (contact, applicant_id, logger, response) => {
    contact.updateContact(contact.first_name, contact.middle_name, contact.last_name, contact.email, 
         contact.gender, contact.dob, contact.telephone, contact.mobile, applicant_id, contact.place_of_birth,contact.nationality).then(updateContactResults => {
        if ((updateContactResults.affectedRows) > 0) {
            logger.info("successfully updated business personal profile");
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.success, STATUS.SUCCESS));
        } else {
            logger.debug("failed to update the business personal profile");
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.fail, STATUS.FAILURE));
        }
    }, err => {
        logger.error("error while insert the data");
        response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.insertError)));
    });
}

// Helper function for businessPersonalProfileContact
export const addContact = (contact, applicant_id, logger, response) => {
    contact.addContact(applicant_id, contact.first_name, contact.middle_name, contact.last_name, contact.email, contact.gender, contact.dob, contact.telephone,
        contact.mobile, contact.place_of_birth,contact.nationality).then(addContactResults => {
        if ((addContactResults.affectedRows) > 0) {
            logger.info("successfully added business personal profile");
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.contact.contactSuccess, STATUS.SUCCESS));
        } else {
            logger.dubug("failed to add the business personal profile");
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.contact.contactFail, STATUS.FAILURE));
        }
    }, err => {
        logger.error("error while adding the business personal profile");
        response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.insertError)));
    });
}



/**
 * @desc this is for the create BusinessPersonalProfile. 
 * @method businessPersonalProfileAddress 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */
export let businessPersonalProfileAddress = (request, response) => {
    let applicant_id = request.params.applicant_id
    let addressModel = new AddressModel(request.body);

    if (applicant_id == '' || applicant_id == 'undefined') {
        logger.debug('invalid request');
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.info, STATUS.FAILURE));
    } else {
        if (_.toLower(request.body.account_type) == "business") {
            saveAddressofBusinessOwner(addressModel, applicant_id, request, response);
        }
    }

}

const saveAddressofBusinessOwner = (addressModel, applicant_id, request, response) => {
    let contactId; 
    let business_id;
    logger.info("getContactId() called");

    // 1. Given an applicantID get contact ID
    addressModel.getContactId(applicant_id)
        .then(results => {
            if (results.length > 0) {
                contactId = results[0].contact_id;
                return registerBusinessOwner.getBusinessId(applicant_id);
            }
        }, err => {
            logger.error("error while insert the data");
            return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
        })
        .then(data => {
            if (_.size(data) > 0 && data[0] && data[0].business_id) {
                business_id = data[0].business_id;
                addressModel.getAddressTypeId(applicant_id, contactId, request.body.address_type_id).then(results => {
                    if (results.length > 0) {
                        updateAddressOfBusinessOwner(addressModel, applicant_id, business_id, request, response);
                    } else {
                        insertAddressOfBusinessOwner(addressModel, applicant_id, contactId, business_id, request, response);
                    }
                }, err => {
                    logger.error("error while insert the data");
                    return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
                })
            }
        }, err => {
            logger.error("error while insert the data");
            return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
        })
}

const updateAddressOfBusinessOwner = (addressModel, applicant_id, business_id, request, response) => {
    addressModel.updateAddress(applicant_id, request.body.address_type_id, request.body.country_id, request.body.postal_code, request.body.address_line1, request.body.address_line2, request.body.city, request.body.region, timeStamp).then(results => {
        if ((results.affectedRows) > 0) {
            if (request.body.address_type_id == 1) {
                kyc.updateDashboardKycStatus('2', business_id, 'personal_profile').then(results => {
                    if (results.affectedRows) {
                        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.address_type.businessAddressSuccess, STATUS.SUCCESS));
                    } else {
                        logger.error('Dashboard status fail , while updating personal_profile')
                        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.kyc.updateFail, STATUS.FAILURE))
                    }
                }).catch(err => {
                    logger.error('Dashboard status fail , while updating personal_profile')
                    response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.kyc.updateFail, STATUS.FAILURE))
                })
            } else {
                response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.address_type.businessAddressSuccess, STATUS.SUCCESS));
            }
        } else {
            logger.info("failed to updated");
        }
    }, err => {
        logger.error("error while getting data");
        return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    })
}

const insertAddressOfBusinessOwner = (addressModel, applicant_id, contactId, business_id, request, response) => {
    addressModel.insertAddress(applicant_id, request.body.address_type_id, contactId, request.body.country_id, request.body.postal_code, request.body.address_line1, request.body.address_line2, request.body.city, request.body.region, timeStamp).then(results => {
        if ((results.affectedRows) > 0) {
            if (request.body.address_type_id == 1) {
                kyc.updateDashboardKycStatus('2', business_id, 'personal_profile').then(results => {
                    if (results.affectedRows) {
                        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.address_type.businessAddressSuccess, STATUS.SUCCESS));
                    } else {
                        logger.error('Dashboard status fail , while inserting personal_profile')
                        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.kyc.updateFail, STATUS.FAILURE))
                    }
                }, err => {
                    logger.error('Dashboard status fail , while inserting personal_profile')
                    response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.kyc.updateFail, STATUS.FAILURE))
                });
            } else {
                response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.address_type.businessAddressSuccess, STATUS.SUCCESS));
            }
        } else {
            logger.dubug("failed to insert");
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.address_type.businessAddressFail, STATUS.FAILURE));
        }
    }, err => {
        logger.error("error while insert the data");
        return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    });
}

/**
* @desc this function used for get business Owner by contact id 
* @method getBusinessPersonalProfileContact 
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return return with the details of business owner
*/
export let getBusinessPersonalProfileContact = function (request, response) {
    const owner = new Owner(request);
    let applicantId = owner.applicantId;
    logger.info('initialize getBusinessOwnersByCId and call ');
    registerBusinessOwner.getContactId(applicantId).then(contact_id => {
        if(contact_id[0].contact_id) {            
      logger.info('initialize getContactId and call  registerBusinessOwner.getBusinessOwnersByCId()');
      registerBusinessOwner.getPersonalContactDetails(contact_id[0].contact_id).then(ownerDetails => {
        logger.info('get response from registerBusinessOwner.getBusinessOwnersByCId() and check size ');
        if (ownerDetails[0] && _.size(ownerDetails) > 0) {
          logger.info('size >0 create a response  ');
          response.send(ResponseHelper.buildSuccessResponse({ "ownerDetails": ownerDetails }, configVariable.message.businessOwnerContact.success, STATUS.SUCCESS));
        } else {
          logger.warn('size  == 0 create a response  ');
          response.send(ResponseHelper.buildSuccessResponse({ "ownerDetails": ownerDetails }, configVariable.message.businessOwnerContact.success1, STATUS.FAILURE));
        }
      }).catch(err => {
        logger.error('error in  registerBusinessOwner.getBusinessOwnersByCId(owner.contact_id) ');
        response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
      })
    }
    }).catch(err => {
      logger.debug(' registerBusinessOwner.getContactId(owner.applicantId)');
      response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
    });
  }

/**
 * @desc get the details of respective person. 
 * @method getBusinessPersonalProfileAddress 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return address details of person
 */
export let getBusinessPersonalProfileAddress = (request, response) => {
    let addressModel = new AddressModel(request.params);
    logger.info('getDetails initiated');
    let applicantId = request.params.applicant_id;
    if (applicantId == '' && applicantId != 'undefined') {
        logger.debug('invalid request');
        return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.info, STATUS.FAILURE));
    } else {
        logger.info("getAddressDetails() initiated")
        addressModel.getPersonalAddressDetails(applicantId).then(results => {
            if (results && results.length > 0) {
                logger.info("successfully fetch the data");
                response.send(ResponseHelper.buildSuccessResponse({
                    addressDetails: results
                }, langEngConfig.message.get.success, STATUS.SUCCESS));
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