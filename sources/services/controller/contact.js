/**
 * contactModel
 * this is used for the insert  the contact details of person in database and get the data from database
 * @package contactModel
 * @subpackage model/contactModel
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */
"use strict";

import { langEngConfig } from '../utility/lang_eng';
import { Contact, Peer } from '../model/contactModel';
let contact = new Peer();

const STATUS = {
  SUCCESS: 0,
  FAILURE: 1
}

/**
* @desc Method for inserting contact details 
* @method addContact 
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return return message and status code.
*/
export let addContact = (request, response) => {
  let applicant_id = request.params.applicant_id
  logger.info("addContact() initiated");
  const contact = new Contact(request.body);
  if (applicant_id != 'undefined' && applicant_id) {
    contact.getContactId(applicant_id).then(results => {
      if (_.size(results) > 0) {
        logger.info("successfully fetch the results");
        logger.info("sent the response");
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.insert.error, STATUS.FAILURE));
      } else {
        contact.addContact(applicant_id, contact.first_name, contact.middle_name, contact.last_name, contact.email, contact.gender, contact.dob, contact.telephone, contact.mobile).then(results => {
          if ((results.affectedRows) > 0) {
            logger.info("successfully add contact");
            logger.info("sent the response");
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.contact.contactSuccess, STATUS.SUCCESS));
          } else {
            logger.dubug("failed to insert the data");
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.contact.contactFail, STATUS.FAILURE));
          }
        }).catch(err => {
          logger.error("error while insert the data");
          response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.insertError)));
        });
      }
    }).catch(err => {
      logger.error("error while getting data");
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.getError)));
    });
  }
}

/**
* @desc Method for Update the contact details of the person 
* @method updateContact 
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return return message and status code.
*/
export let updateContact = function (request, response) {
  logger.info("updateContact() initiated");
  const contact = new Contact(request.body);
  let applicant_id = request.params.applicant_id;
  if (applicant_id != 'undefined' && applicant_id) {
    contact.getContactId(applicant_id).then(results => {
      if (_.size(results) > 0) {
        logger.info("successfully fetch the results");
        contact.updateContact(contact.first_name, contact.middle_name, contact.last_name, contact.email, contact.gender, contact.dob, contact.telephone, contact.mobile, applicant_id).then(results => {
          if ((results.affectedRows) > 0) {
            logger.info("successfully add contact");
            logger.info("sent the response");
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.success, STATUS.SUCCESS));
          } else {
            logger.dubug("failed to insert the data");
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.fail, STATUS.FAILURE));
          }
        }).catch(err => {
          logger.error("error while insert the data");
          response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.insertError)));
        })
      } else {
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.error, STATUS.FAILURE));
      }
    }).catch(err => {
      logger.error("error while getting data");
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.getError)));
    })
  }
}

/**
* @desc Method is used get the contact details
* @method getContactDetails 
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return return all contact details of respective person.
*/
export let getContactDetails = (request, response) => {
  logger.info("updateContact() initiated");
  const contact = new Contact(request.params);
  if (contact.applicant_id != 'undefined' && contact.applicant_id) {
    contact.getConatctDetails(contact.applicant_id).then(results => {
      delete results[0].applicant_id;
      if (_.size(results) > 0) {
        logger.info("successfully fetch the data");
        logger.info("sent the response");
        let data = results[0];
        response.send(ResponseHelper.buildSuccessResponse(data, langEngConfig.message.get.success, STATUS.SUCCESS))
      } else {
        logger.debug("failed while getting the data")
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.get.fail, STATUS.SUCCESS))
      }
    }).catch(err => {
      logger.error("error while getting data");
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.getError)));
    })
  }
}
/**
* @desc Method is used get the contact details
* @method getPeerContact 
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @param {number} applicantId - It contains applicant id
* @return 
*/
export const getPeerContact = (request, response) => {
  logger.info('getPeerContact() called');
  __getPeerContact(request, response).then(getPeerContactRes => {
    logger.info('getPeerContact() execution completed');
    return getPeerContactRes;
  }).catch(err => {
    logger.error("error while getting data");
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.getError)));
  })
}

const __getPeerContact = async (request, response) => {
  let applicant_id = request.params.applicant_id;
  try {
    logger.info('__getPeerContact() called');
    let peerContact = await contact.getPeerContact(applicant_id);
    if (peerContact.length > 0) {
      return response.send(ResponseHelper.buildSuccessResponse(peerContact, langEngConfig.message.contact.getContactSuccess, STATUS.SUCCESS));
    } else {
      return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.insert.applicant_id_not_found, STATUS.SUCCESS));
    }
  } catch (error) {
    logger.error('Error occured ' + err);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}
/**
* @desc Method is used get the contact details
* @method savePeerContact 
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @param {number} applicantId - It contains applicant id
* @return 
*/
export const savePeerContact = (request, response) => {
  logger.info('savePeerContact() called');
  __savePeerContact(request, response).then(savePeerContactRes => {
    logger.info('savePeerContact() execution completed');
    return savePeerContactRes;
  }).catch(err => {
    logger.error("error while getting data");
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.getError)));
  })
}

const __savePeerContact = async (request, response) => {
  let applicant_id = request.params.applicant_id;
  let list = request.body.list;
  try {
    logger.info('__savePeerContact() called');
    let contactDetails = await contact.getAllContact();
    if (contactDetails.length > 0) {
      contactDetails.forEach(async (row) => {
        if (_.size(_.filter(list, { mobile: row.mobile })) > 0 || _.size(_.filter(list, { mobile: row.phone })) > 0) {
         let peerContactDetails = await contact.selectPeerContact(applicant_id);
         if (_.size(_.filter(peerContactDetails, { contact_number: _.get(row, 'mobile', ' ') })) > 0 || _.size(_.filter(peerContactDetails, { contact_number: _.get(row, 'phone', ' ') })) > 0) {       
           let insertPeerContact = await contact.insertPeerContact(applicant_id, row.applicant_id, _.get(row, 'mobile', ' '), _.get(row, 'phone', ' '), _.get(row, 'first_name', ' ') + _.get(row, 'last_name', ' '));
           if(insertPeerContact){
            return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.insert.peer_contact, STATUS.SUCCESS));
           }
         }
        }
      });
      return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.insert.peer_contact, STATUS.SUCCESS));

    } else {
      return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.get.fail, STATUS.SUCCESS));
    }
  } catch (error) {
    logger.error('Error occured ' + err);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}