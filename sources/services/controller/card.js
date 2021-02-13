/**
 * card Controller
 * card controller is used to store,update or delete the card details of an individual user.
 * @package card
 * @subpackage services/controller/card
 * @author SEPA Cyber Technologies, Sekhara Suman Sahu.
 */
"use strict";

import { Utils } from '../utility/utils';
import { Card } from '../model/card';
import { langEngConfig } from '../utility/lang_eng';
var valid = require('card-validator');

let utils = new Utils();
let card = new Card();

const STATUS = {
  SUCCESS: 0,
  FAILURE: 1
}

const DEFAUL_CARD = {
  TRUE: 1,
  FALSE: 0
}
const KYC_DEFAULT_STATUS = ['SUCCESS', 'SUCCESS_DATA_CHANGED','SUCCESSFUL', 'SUCCESSFUL_WITH_CHANGES'];

const CARD_STATUS = {
  isActive: 1
}

const CARD = {
  ACTIVE: 1,
  DEACTIVE: 0
}

//Class to store the User card details.
export class UserCardDetails {
  constructor(CardData) {
    this.card_type = _.toUpper(CardData.card_type)
      this.name_on_card = _.toUpper(CardData.name_on_card)
      this.card_number = CardData.card_number
      this.card_cvv = CardData.card_cvv
      this.card_month = CardData.card_month
      this.card_year = CardData.card_year
      this.status = CARD_STATUS.isActive
      this.default_card = DEFAUL_CARD.TRUE
  }
}


/**
* @desc Method to store/add the card details in payment_cards_id table
* @method addCard 
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return return message and status code.
*/
export const addCard = (request, response) => {
  logger.info('initiated');
  const newCard = new UserCardDetails(request.body);
  const applicant_id = request.params.applicant_id;
  logger.info('getKycStatus() called');
  card.getKycStatus(applicant_id).then(kycId => {
    if (kycId.length > 0) {
      if (KYC_DEFAULT_STATUS.includes(kycId[0].kyc_status)) {
        logger.info('isValidCard() called');
        utils.isValidCard(newCard)
          .then((result) => {
            if (result.status) {
              let cardNumber = newCard.card_number;
              // let cardInfo = valid.number(cardNumber); //it will check the card number is valid or not        
              cardNumber = cardNumber.replace(/ +/g, "");
              const last_number = String(cardNumber).substr((cardNumber.length) - 4, 4);
              logger.info('model/card isDuplicatCard() called');
              isDuplicatCard(cardNumber, last_number, applicant_id)
                .then((result) => {
                  if (result.status == STATUS.FAILURE) {
                    logger.info('model/card isFirstCard() called');
                    _isFirstCard(applicant_id)
                      .then((result) => {
                        logger.info('cardEncrypt() called');
                        utils.cardEncrypt(cardNumber, newCard.card_month, newCard.card_year).then(results => {
                          if (results.status == 0) {
                            logger.info('model/card insertCardData() called');
                            _insertCardData(applicant_id, newCard.card_type,
                              newCard.name_on_card, last_number, newCard.card_cvv, results.data.card_month, results.data.card_year, results.data.card_number, results.data.encrypted_key,
                              newCard.status, newCard.default_card, results.data.secret_key)
                              .then(result => {
                                logger.info('controller/card addCard() execution completed');
                                return response.send(ResponseHelper.buildSuccessResponse({ payment_cards_id: result.payment_cards_id }, result.message, result.status));
                              })
                              .catch(err => {
                                logger.info('execution completed');
                                return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
                              });
                          } else {
                            return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.error.ErrorHandler, STATUS.FAILURE));
                          }
                        })
                      }).catch((err) => {
                        logger.info('execution completed');
                        return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
                      });
                  } else {
                    logger.info('execution completed');
                    if (result.flag) {
                      return response.send(ResponseHelper.buildSuccessResponse(result, langEngConfig.message.payment.cardActiveSuccess, STATUS.SUCCESS));
                    }
                    return response.send(ResponseHelper.buildSuccessResponse(result, langEngConfig.message.payment.duplicate_card_succ, STATUS.FAILURE));
                  }
                })
                .catch(err => {
                  logger.info('execution completed');
                  return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
                });

            } else {
              return response.send(ResponseHelper.buildSuccessResponse({}, result.message, STATUS.FAILURE));
            }
          })
          .catch(err => {
            logger.info('execution completed');
            return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
          });
      }
      else {
        return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.kyc.card_fail, STATUS.FAILURE));
      }
    } else {
      return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.kyc.invalid_kyc, STATUS.FAILURE));
    }
  }).catch(err => {
    logger.info('execution completed');
    return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  })
}


/**
* @desc Method to check duplicate card
* @method isDuplicatCard 
* @param {number} cardNumber - It contains card number
* @param {number} applicantId - It contains applicant id
* @return return message and status code.
*/
const isDuplicatCard = (cardNumber, last_number, applicantId) => {
  return new Promise((resolve, reject) => {
    logger.info('initiated');
    card.isDuplicatCard(last_number, applicantId)
      .then(result => {
        if (result.length > 0) {
          if (result[0].status == CARD.DEACTIVE) {
            logger.info('execution completed');
            //calling deletecard() to update status of inactive card.
            card.deleteCard(result[0].payment_cards_id, CARD.ACTIVE).then(activateCard => {
              resolve({ message: langEngConfig.message.payment.cardActiveSuccess, status: STATUS.SUCCESS, flag: true });
            })
              .catch(err => {
                logger.info('execution completed');
                reject(err);
              })
          } else {
            logger.info('execution completed');
            resolve({ message: langEngConfig.message.payment.duplicate_card_succ, payment_cards_id: result[0].payment_cards_id, status: STATUS.SUCCESS, flag: false });
          }
        } else {
          logger.info('execution completed');
          resolve({ message: langEngConfig.message.payment.duplicate_card_fail, status: STATUS.FAILURE });
        }
      })
      .catch(err => {
        logger.info('execution completed');
        reject(err);
      });
  });
}
/**
* @desc Method to check first card
* @method _isFirstCard
* @param {number} applicantId - It contains applicant id
* @return return message and status code.
*/
const _isFirstCard = (applicantId) => {
  return new Promise((resolve, reject) => {
    logger.info('initiated');
    card.isFirstCard(applicantId)
      .then(result => {
        if (result != 0 && result[0].cards === 0) {
          logger.info('execution completed');
          resolve({ status: STATUS.SUCCESS });
        } else {
          logger.info('execution completed');
          resolve({ status: STATUS.FAILURE });
        }
      })
      .catch(err => {
        logger.info('execution completed');
        reject({ message: langEngConfig.message.payment.getcardError, status: STATUS.FAILURE });
      });
  });
}
/**
* @desc Method to check insert data of card
* @method _insertCardData 
* @param {number} applicantId - It contains applicant id
* @return return message and status code.
*/
const _insertCardData = (applicantId, cardType, nameOnCard, cardNumber, cardCvv, cardMonth, CardYear, encrypted_number, encrypted_key, status, defaultCard, secret_key) => {
  return new Promise((resolve, reject) => {
    logger.info('initiated');
    card.insertCardData(applicantId, cardType, nameOnCard, cardNumber, cardCvv, cardMonth, CardYear, encrypted_number, encrypted_key, status, defaultCard)
      .then(result => {
        if (result.affectedRows > 0) {
          card.insertKey(result.insertId, applicantId, secret_key).then(key => {
            logger.info('execution completed');
            resolve({
              message: langEngConfig.message.payment.card_success, payment_cards_id: result.insertId,
              status: STATUS.SUCCESS
            });
          })
        }

      })
      .catch(err => {
        logger.info('execution completed');
        reject({
          message: langEngConfig.message.payment.err, err: `${err}`, status: STATUS.FAILURE
        });
      });
  });
}

/**
* @desc Method to delete (deactivate) a card
* @method deleteCard 
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return return message and status code.
*/
export const deleteCard = (request, response) => {
  logger.info('controller/card deleteCard() initiated');
  let cardId = request.body.payment_cards_id;
  let isActive = request.body.isActive;
  logger.info('model/card deleteCard() called');
  _dodeleteCard(cardId, isActive)
    .then(result => {
      logger.info('controller/card deleteCard() execution completed');
      return response.send(ResponseHelper.buildSuccessResponse({}, result.message, result.status));
    })
    .catch(err => {
      return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    });
}


/**
* @desc Method to delete (deactivate) a card
* @method _dodeleteCard  
* @param {Object} cardId - It contains cardId
* @param {Object} enableOrDisable - It is status
* @return return message and status code.
*/
const _dodeleteCard = (cardId, enableOrDisable) => {
  return new Promise((resolve, reject) => {
    logger.info('initiated');
    card.deleteCard(cardId, enableOrDisable)
      .then(result => {
        if (enableOrDisable == 0) {
          logger.info('execution completed');
          resolve({ message: langEngConfig.message.payment.cardDeactiveSuccess, status: STATUS.SUCCESS });
        } else {
          logger.info('execution completed');
          resolve({ message: langEngConfig.message.payment.cardActiveSuccess, status: STATUS.SUCCESS });
        }
      })
      .catch(err => {
        logger.info('execution completed');
        reject({ message: langEngConfig.message.payment.cardFailure, status: STATUS.FAILURE });
      });
  });
}


/**
* @desc Method to get all the cards saved by an individual user
* @method getAllCards
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return return all cards for individual user.
*/
export const getAllCards = (request, response) => {
  logger.info('controller/card getAllCards() initiated');
  let applicantId = request.params.applicant_id;
  card.getAllCards(applicantId, CARD.ACTIVE).then(result => {
    if (result.length > 0) {
      logger.info("get the results successfully");
      var lists = [];
      result.forEach(list => {
        logger.info("cardDecrypt() initiated");
        utils.cardDecrypt(list.encrypted_card, list.card_month, list.card_year, list.secret_number, list.encrypted_key).then(data => {
          let results = {};
          let cardNumber = data.data.card_number;
          cardNumber = cardNumber.replace(/\d(?=\d{4})/g, "*");
          results["payment_cards_id"] = list.payment_cards_id;
          results["card_type"] = list.card_type;
          results["name_on_card"] = list.name_on_card;
          results["card_number"] = cardNumber;
          results["status"] = list.status;
          results["default_card"] = list.default_card;
          results["card_month"] = data.data.card_month;
          results["card_year"] = data.data.card_year;
          lists.push(results)
          if (lists.length == result.length) {
            logger.info('controller/card getAllCards() execution completed');
            return response.send(ResponseHelper.buildSuccessResponse({ cards: lists }, langEngConfig.message.payment.getcardSuccess, STATUS.SUCCESS));
          }
        }).catch(err => {
          return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
        })

      })
    } else {
      logger.info('controller/card getAllCards() execution completed');
      return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.getcardError, STATUS.FAILURE));
    }
  })
    .catch(err => {
      return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    });
}
/**
* @desc it will give results like card type and card is valid or not
* @method getCardType
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return
*/
export const getCardType = (request, response) => {
  logger.info("getCardType() initiated");
  let cardInfo = valid.number(request.params.cardNumber);
  logger.info("check the card info");
  if (cardInfo.card) {
    logger.info("get the card info");
    let cardDetails = {};
    cardDetails["type"] = cardInfo.card.type;
      cardDetails["isValid"] = cardInfo.isValid;
    logger.info("send response");
    response.send(ResponseHelper.buildSuccessResponse(cardDetails, langEngConfig.message.getFail.success, STATUS.SUCCESS));
  } else {
    logger.debug("No data found with this number");
    response.send(ResponseHelper.buildSuccessResponse({ card: cardInfo.card }, langEngConfig.message.getFail.fail, STATUS.FAILURE));
  }
}
