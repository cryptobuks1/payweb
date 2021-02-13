/**
 * sandbox Controller
 * sandbox is used for  to get sandbox details.
 * @subpackage controller\sandbox
 *  @author SEPA Cyber Technologies, Tarangini Dola
 */
import { Sandbox } from '../model/sandbox';
import {langEngConfig} from '../utility/lang_eng';
import Cryptr from 'cryptr';
import {getcurrencyExchangeMuse} from '../controller/commonCode';
import { DbConnMgr } from '../dbconfig/dbconfig';
const db = DbConnMgr.getInstance();


let requestPromise = require('request-promise');
const sandbox = new Sandbox();
const key = '*h@rry$p0tter*';
const cryptr = new Cryptr(key);
const STATUS = {
  FAILED: 1,
  SUCCESS: 0,
  VALID: 2,
  UN_AUTHORIZED: 403,
  SUCCESS_PAYMENT: '0001',
  DEFAULT_CVV: '123',
  PAYMENT_SUCCESS: '00001'
};

const ACCOUNT_TYPE = {
  WALLET: 'WALLET',
  BANK_ACCOUNT: 'BANK_ACCOUNT'
}
const TRANSTYPE = {
  DEBIT: 'DB',
  CREDIT: "CR"
}
const DEFAUL_CARD = {
  TRUE: 1,
  FALSE: 0
}

const CARD_STATUS = {
  isActive: 1
}

const CARD = {
  ACTIVE : 1,
  DEACTIVE :0
}
/**
 * This method is used to get sandbox details.
 * @method sandboxGatewayCheck 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
export const sandboxGatewayCheck = (request,response)=>{
  console.log('start');
  const sandboxDetails={
     memberId : request.body.memberId,
     apiKey : request.body.apiKey,
     amount:request.body.amount,
     currency : request.body.currency,
     successUrl : request.body.successUrl,
     failureUrl : request.body.failureUrl
  }
 
  sandbox.getSandboxDetails(sandboxDetails).then(sandbox_result=>{
    try{
      if(sandbox_result){
        let applicant_id = sandbox_result[0].applicant_id;
        sandbox.getByCurrency(applicant_id,sandboxDetails.currency).then(accountDetails=>{
          if(accountDetails[0].account_no){
            let order_id = Math.random().toString(36).substring(2,6) + Math.random().toString(36).substring(2,6);
            const encryptedString = cryptr.encrypt(order_id).toString();
            let redirectUrl = sandbox_result[0].redirect_url + encryptedString;
            sandbox.saveSandboxOrder(sandboxDetails,applicant_id,order_id).then(ordersave_success=>{
              if(ordersave_success){
                response.redirect(redirectUrl);
              }
              else{
                response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.sandbox.error, STATUS.FAILED));
              }
            })
          }
          else{
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.sandbox.no_account_found, STATUS.FAILED));

          }
        })
        
      }
      else{
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.sandbox.nodataFound, STATUS.FAILED));
      }
    }
    catch(Exception){
      console.log(Exception);
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.Exception)));
    }
  }).catch(err=>{
    console.log(err);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  })
}


/**
 * This method is used to get sandbox details.
 * @method SandboxRedirectUrlDetails 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
export const SandboxRedirectUrlDetails = (request,response)=>{
  try{
    let orderDetails=request.params.orderDetails;
    const orderId = cryptr.decrypt(orderDetails);
    sandbox.getOrderDetails(orderId).then(result=>{
      
      if(result){
        sandbox.getContactDetails(result[0].applicant_id).then(contactResponse=>{
          let orderDetailsObj={
            "order_id": result[0].order_id,
            "success_url": result[0].success_url,
            "failure_url": result[0].failure_url,
            "amount": result[0].amount,
            "currency": result[0].currency,
            "mobile":contactResponse[0].mobile
        }
          response.send(ResponseHelper.buildSuccessResponse({result:orderDetailsObj}, langEngConfig.message.sandbox.detailsfetchedsuccess,STATUS.SUCCESS));
        })
        
      }
      else{
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.sandbox.nodetailsfound, STATUS.FAILED));
      }
    })
  }
  catch(e){
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.Exception)));
  }
}



/*=========================================================================================================================================*/
var valid = require('card-validator');
import { Utils } from '../utility/utils';
const utils = new Utils();
const card = new Sandbox();


/**
 * This method is used to get card details.
 * @method getCardType 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
export const getCardType = (request,response)=>{
  
  let cardInfo = valid.number(request.params.cardNumber);
  if (cardInfo.card) {
    logger.info("get the card info");
    let cardDetails = {};
    cardDetails["type"] = cardInfo.card.type;
    cardDetails["isValid"] = cardInfo.isValid;
    logger.info("send response");
    response.send(ResponseHelper.buildSuccessResponse(cardDetails, langEngConfig.message.getFail.success, STATUS.SUCCESS));
  } else {
    logger.debug("No data found with this number");
    response.send(ResponseHelper.buildSuccessResponse({ card: cardInfo.card }, langEngConfig.message.getFail.fail, STATUS.FAILED));
  }
}



// export const addCard = (request,response)=>{
//   const newCard = {
//     card_type : _.toUpper(request.body.card_type),
//         name_on_card : _.toUpper(request.body.name_on_card),
//         card_number : request.body.card_number,
//         card_cvv : request.body.card_cvv,
//         card_month : request.body.card_month,
//         card_year : request.body.card_year,
//         status : CARD_STATUS.isActive,
//         default_card : DEFAUL_CARD.TRUE
//   }
//   const applicant_id = request.params.applicant_id;
//   utils.isValidCard(newCard)
//   .then((result) => {
//     if (result.status) {
//       let cardNumber = newCard.card_number;
//       cardNumber = cardNumber.replace(/ +/g, "");
//       logger.info('model/card isDuplicatCard() called');
//       isDuplicatCard(cardNumber, applicant_id)
//         .then((result) => {
//           if (result.status == STATUS.FAILURE) {
//             logger.info('model/card isFirstCard() called');
//             _isFirstCard(applicant_id)
//               .then((result) => {
//                 logger.info('model/card insertCardData() called');
//                 _insertCardData(applicant_id, newCard.card_type,
//                   newCard.name_on_card, cardNumber, newCard.card_cvv, newCard.card_month, newCard.card_year,
//                   newCard.status, newCard.default_card)
//                   .then(result => {
//                     logger.info('controller/card addCard() execution completed');
//                     return response.send(ResponseHelper.buildSuccessResponse({ payment_cards_id: result.payment_cards_id }, result.message, result.status));
//                   })
//                   .catch(err => {
//                     logger.info('execution completed');
//                     return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
//                   });
//               })
//               .catch((err) => {
//                 logger.info('execution completed');
//                 return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
//               });
//           } else {
//             logger.info('execution completed');
//             if(result.flag){
//               return response.send(ResponseHelper.buildSuccessResponse(result, langEngConfig.message.payment.cardActiveSuccess, STATUS.SUCCESS));
//             }
//             return response.send(ResponseHelper.buildSuccessResponse(result, langEngConfig.message.payment.duplicate_card_succ, STATUS.FAILURE));
//           }
//         })
//         .catch(err => {
//           logger.info('execution completed');
//           return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
//         });
//     } else {
//       return response.send(ResponseHelper.buildSuccessResponse({}, result.message, STATUS.FAILURE));
//     }
//   })
//   .catch(err => {
//     logger.info('execution completed');
//     return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
//   });
// }




/**
* @desc Method to store/add the card details in payment_cards_id table
* @method addCard 
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return return message and status code.
*/
export const addCard = (request, response) => {
  logger.info('initiated');
    const newCard = {
    card_type : _.toUpper(request.body.card_type),
        name_on_card : _.toUpper(request.body.name_on_card),
        card_number : request.body.card_number,
        card_cvv : request.body.card_cvv,
        card_month : request.body.card_month,
        card_year : request.body.card_year,
        status : CARD_STATUS.isActive,
        default_card : DEFAUL_CARD.TRUE
  }
  const applicant_id = request.params.applicant_id;
  logger.info('model/card isValidCard() called');
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
            resolve({ message: langEngConfig.message.payment.duplicate_card_succ, payment_cards_id: result[0].payment_cards_id, status: STATUS.FAILED, flag: false });
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
 * This method is used to get card details.
 * @method isFirstCard
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
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
 * This method is used to insert card details.
 * @method insertCardData
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
const _insertCardData = (applicantId, cardType, nameOnCard, cardNumber, cardCvv, cardMonth, CardYear, encrypted_number, encrypted_key, status, defaultCard, secret_key) => {
  return new Promise((resolve, reject) => {
    logger.info('initiated');
    card.insertCardData(applicantId, cardType, nameOnCard, cardNumber, cardCvv, cardMonth, CardYear, encrypted_number, encrypted_key, status, defaultCard)
      .then(result => {
        if (result) {
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
 * This method is used to get delete card details.
 * @method deleteCard
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
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
 * This method is used to get delete card details.
 * @method dodeleteCard
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
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











// export const getAllCards = (request, response) => {
//   logger.info('controller/card getAllCards() initiated');
//   let applicantId = request.params.applicant_id;
//   card.getAllCards(applicantId)
//     .then(result => {
//       if (result.length > 0) {
//         logger.info('controller/card getAllCards() execution completed');
//         response.send(ResponseHelper.buildSuccessResponse({ cards: result }, langEngConfig.message.payment.getcardSuccess, STATUS.SUCCESS));
//       } else {
//         logger.info('controller/card getAllCards() execution completed');
//         response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.getcardError, STATUS.FAILURE));
//       }
//     })
//     .catch(err => {
//       console.log(err);
//       return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
//     });
// }




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
  card.getAllCards(applicantId,CARD.ACTIVE).then(result => {
    if (result.length > 0) {
      logger.info("get the results successfully");
      var lists = [];
      result.forEach(list => {       
          card.getSecretKey(list.payment_cards_id,applicantId).then(key => {
            if(key.length > 0) {
              logger.info("cardDecrypt() initiated");
              utils.cardDecrypt(null, list.card_month, list.card_year, key[0].secret_number, list.encrypted_key).then(data => {
                let results = {};
                results["payment_cards_id"] = list.payment_cards_id;
                results["card_type"] = list.card_type;
                results["name_on_card"] = list.name_on_card;
                results["card_number"] = list.card_number;
                results["status"] = list.status;
                results["default_card"] = list.default_card;
                results["card_month"] =  data.data.card_month;
                results["card_year"] = data.data.card_year;  
                lists.push(results)            
                if (lists.length == result.length) {
                  logger.info('controller/card getAllCards() execution completed');
                  return response.send(ResponseHelper.buildSuccessResponse({ cards:lists }, langEngConfig.message.payment.getcardSuccess, STATUS.SUCCESS));
                }
              }).catch(err => {
                return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
              })
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

/*============================================================================================================================================*/
const account = new Sandbox();
/**
* @desc Method to get account details of the user
* @method createAccount
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return return account details .
*/
export const createAccount = (request, response) => {
  logger.info('createAccount() initiated');
  let applicantId = request.params.applicant_id;
  let currencyAccount = request.body.currency;
  logger.info('isCurrencyAccountExist() called');
  //check wheather the user already has the same currency account?
  account.isCurrencyAccountExist(currencyAccount, applicantId).then(isExistAccountRes => {
    
    //let isExistAccount = _.filter(isExistAccountRes, { status: 1 });
    if (isExistAccountRes.length == 0 ) {
      //If currency account does not exist, Create new one.
      account.createCurrencyAccount(currencyAccount, applicantId).then(result => {
        logger.info('createAccount() execution completed');
        response.send(ResponseHelper.buildSuccessResponse({account_id : result.insertId}, langEngConfig.message.insert.success, STATUS.SUCCESS));
      })
      .catch(err=>{
        logger.info('createAccount() execution completed');
        response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
      })
    } else {
      //If currency account exist upsate the status to active.
      if(!isExistAccountRes[0].status){
        logger.info('createAccount() execution completed');
        account.activateAccount(currencyAccount, applicantId).then(result => {
          response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.update.success, STATUS.SUCCESS));
        })
        .catch(err=>{
          logger.info('createAccount() execution completed');
          response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
        })
      }
      else {
        logger.info('createAccount() execution completed');
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.insert.alredy_exist, STATUS.FAILURE));
      }
    }
  })
  .catch(err=>{
    logger.info('createAccount() execution completed');
    logger.error(err);
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  })
};













export const getAccounts = function (request, response) {
  logger.info('getAccounts() initiated');
  const applicantId = request.params.applicant_id;
  account.getAccount(applicantId)
    .then(result => {
      if(result.length == 0){
        logger.info('getAccounts() execution completed');
        response.send(ResponseHelper.buildSuccessResponse({ account: result }, langEngConfig.message.accountStatus.account_notfound, STATUS.FAILURE));
      }
      else {
        logger.info('getAccounts() execution completed');
        console.log(result);
        response.send(ResponseHelper.buildSuccessResponse({ account: result }, langEngConfig.message.accountStatus.getAccount, STATUS.SUCCESS));
      }
     
    }).catch(err => {
      logger.error(err);
      logger.info('getAccounts() execution completed');
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.accountStatus.fail)));
    });
}









export const getByCurrency = function (request, response) {
  logger.info('initiated');
  let applicantId = request.params.applicant_id;
  let currency = request.body.currency;
  account.getByCurrency(applicantId,currency)
    .then(result => {
      if (result.length > 0) {
        logger.info('execution completed');
        response.send(ResponseHelper.buildSuccessResponse({ account: result }, langEngConfig.message.accountStatus.getAccount, STATUS.SUCCESS));
      } else {
        logger.info('execution completed');
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.accountStatus.fail, STATUS.FAILURE));
      }
    }, err => {
      logger.info('execution completed');
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    });
}









export const updateAccountStatus = (request, response) => {
  logger.info('updateAccountStatus() initiated');
  //let userAccount = new UserAccountDetails(request.body);
  let status = request.body.status;
  let currency = request.body.currency;
  let applicantId = request.params.applicant_id;
  account.updateCurrencyAccount(status, applicantId, currency)
    .then(result => {
    if(result.affectedRows != 0 ){
      if (status == 1) {
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.accountStatus.success1, STATUS.SUCCESS));
        logger.info('updateAccountStatus() execution completed');
      } else {
        logger.info('updateAccountStatus() execution completed');
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.accountStatus.success2, STATUS.SUCCESS));
      }
    }
    else {
      logger.info('updateAccountStatus() execution completed');
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.accountStatus.account_notfound, STATUS.FAILURE));
    }
    })
    .catch(err => {
      logger.info('updateAccountStatus() execution completed');
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    })
};













/*==============================================================================================================================*/


/**
 * @desc method is to perform money transfer form one account to another account 
 * @method AccountTransfer
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns status message and status code
**/

export const moneyTransfer = (request, response) => {
  logger.info('walletToWalletTransferInfo() called');
  //request.setHeader('x-auth-token', request.body.x-auth-token)
 // request.headers['x-auth-token'] = request.body.x-auth-token;
  let order_id = request.body.orderDescriptor;
  sandbox.getOrderDetails(order_id).then(urlDetails=>{
    let redirectUrls={
      successUrl : urlDetails[0].success_url,
      failureUrl : urlDetails[0].failure_url
    }
  __walletToWalletTransfer(request,response)
    .then(transferRes => {
      logger.info('walletToWalletTransferInfo() execution completed');
      return transferRes
    })
  })
}

  const __walletToWalletTransfer = async (request, response ) => {
  const newTransferReq = new Sandbox();
  console.log(6666)
  let newTransfer = {
    "applicant_id" : request.params.applicant_id,
		"from_currency" : request.body.currency,
		"to_currency" : request.body.currency,
		"to_mobile" : 12368767699,
		"amount" : request.body.amount,
		"currency_type" : "EUR",
		"device_type" : "mobile"
  }

  let fromApplicantId = request.params.applicant_id;
  let fromCurrency = request.body.currency;
  let toCurrency = request.body.currency;
  let fromAmount = request.body.amount;
  let receiverMobile = 35112321222;
  let transactionId = utils.generateTransNum();
  
  try {
    console.log(789)
    logger.info('isValidMoneyTransferRequest() called');
    //Checking the money tranfer request is valid or not.
    const isValidReq = await utils.isValidMoneyTransferRequest(newTransfer);
    if (isValidReq.status) {
      console.log(120000)
      //Get the account number from which amount will be deduct.
      logger.info('getFromCurrencyAccountno() called');
      let fromCurrencyRes = await newTransferReq.getFromCurrencyAccountno(fromCurrency, fromApplicantId);
      console.log(21230000)
      if (fromCurrencyRes.length > 0) {
        console.log(130000)
        let from_account = fromCurrencyRes[0].account_no;
        logger.info('__getRecipientCurrencyAccount() called');
        //Get the account number to which amount will be credit.
        let accountNoRes = await __getRecipientCurrencyAccount(receiverMobile, toCurrency, newTransferReq);
        //If receipient account found
        //console.log(accountNoRes);
        console.log(430000)
        if (accountNoRes.account_no) {
          console.log(830000)
          let to_account = accountNoRes.account_no;
          let toApplicantid = accountNoRes.applicant_id;
          logger.info('checkMunimumBalance() called');
          //Checking minimum balance before deducting 
          let minimunBal = await __checkminimumBalance(from_account, fromAmount, newTransferReq);
          console.log(30000)
          //IF sender has the sufficient balance
         // console.log(minimunBal,'bbb')
          if (minimunBal.status == 0) {
            console.log(522359)
            logger.info('__getExchangeAmount() called');
            //Get the respective exchange rate of from ammount
          //  let exchangeRateRes = await __getExchangeAmount(fromCurrency, toCurrency, fromAmount);
            let toAmount = fromAmount;
            //Account balance after deduction of money from senders account
            let deductAmnt = minimunBal.balance - newTransfer.amount;
            //Get a single connection object from connection pool to perform 
            let conn = await db.getConnObject();
            //If we get a conn object
            if (conn) {
              //Begin the transaction
              await conn.beginTransaction();
              logger.info('__deductAmount() called');
              //Money deduction from senders account
              let deductRes = await __deductAmount(from_account, to_account, fromApplicantId, fromAmount, toAmount, deductAmnt, transactionId, newTransferReq, conn);
              //If money deducted successfully
              console.log(deductRes,'dddddd')
              if (deductRes.status == 0) {
                logger.info('__addbalance() called');
                let addbalRes = await __addbalance(from_account, to_account, toApplicantid, fromAmount, toAmount, transactionId, newTransferReq, conn);
                //If money added successfully
                if (addbalRes.status == 0) {
                  //commit the transaction and release the conn object
                  conn.commit();
                  conn.release();
                  //response.redirect(redirectUrls.successUrl+'/'+transactionCodes.codes.TransactionApproved);
                  response.send(ResponseHelper.buildSuccessResponse({transactionId:deductRes.transactionId}, langEngConfig.message.payment.trans_success, STATUS.SUCCESS));
                }
                else {
                  //If money did not added into receipient account roolback the transaction
                  conn.rollback();
                  conn.release();
                 // response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.InvalidTransaction)
                  response.send(ResponseHelper.buildFailureResponse(langEngConfig.message.payment.trans_failed))
                }
              } else {
               // response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.InvalidTransaction)

                response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.amount_deduction_fail, STATUS.FAILURE));
              }
            } else {
            

              response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.moneyTransfer.errorConnObj, STATUS.FAILURE));
            }

          } else {
          
      
 
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.insufficient_balance, STATUS.FAILURE));
          }
        } else {
      

          response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.moneyTransfer.no_account_found, STATUS.FAILURE));
        }
      } else {
      

        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.moneyTransfer.senderCurrenyAccNotFound, STATUS.FAILURE));
      }

    } else {
     // response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.Error)

      response.send(ResponseHelper.buildSuccessResponse({ isValidReq }, langEngConfig.message.moneyTransfer.req_objerr, STATUS.FAILURE));
    }
  } catch (error) {
    logger.error('Error occured ' + error);
    //response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.Error)

    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  }
}




/**
 * @desc Method for getting receiver's applicant_id
 * @method getRecipientCurrencyAccount
 * @param {receipientApplicantId} - it is the applicant id of receipient.
 * @param {toCurrency} - it is the to currency account of receipient.
 * @return returns applicant id
**/

const __getRecipientCurrencyAccount = async (toMobile, toCurrency, body) => {
  let newTransferReq = new Sandbox()
  try {
    logger.info('getRecipientCurrencyAccount() initiated');
    let currencyAccount = await newTransferReq.getRecipientCurrencyAccount(toMobile, toCurrency)
    logger.info('getRecipientCurrencyAccount() execution completed.');
    return ({ account_no: currencyAccount[0].account_no, applicant_id: currencyAccount[0].applicant_id });
  }
  catch (err) {
    console.log(err);
    logger.error('Error occured ' + err);
    return (new Error(langEngConfig.message.error.ErrorHandler))
  }

}


/**
 * @desc Method for checking account balance before performing money transfer 
 * @method checkMunimumBalance
 * @param {number} accountNo -- it is Request object
 * @param {number} amount --it is Response object
 * @param {number} newTransfer --it is newTransfer object
 * @return returns status message and status code
 **/
const __checkminimumBalance = async (accountNo, amount, newTransfer) => {
  try {
    logger.info('checkMinimumBalance() called');
    let result = await newTransfer.checkMinimumBalance(accountNo);
    if (amount > result[0].balance || result[0].status == 0) {
      if (result[0].status == 0) {
        logger.info('account_deactive() executed');
        return ({
          status: STATUS.FAILURE,
          message: `${accountNo}` + langEngConfig.message.payment.account_deactive
        });
      } else {
        logger.info('insufficient_balance() executed');

        return ({
          message: langEngConfig.message.payment.insufficient_balance,
          status: STATUS.FAILURE
        });
      }
    } else {
      logger.info('enough_balance() executed');

      return ({
        message: langEngConfig.message.payment.enough_balance,
        balance: result[0].balance,
        status: STATUS.SUCCESS
      })
    }

  } catch (err) {
    logger.error('Error occured ' + err);
    return (new Error(langEngConfig.message.error.ErrorHandler));

  }

}


/**
 * @desc Method for getting receiver's applicant_id by mobile number
 * @method getRecipientApplicantId
 * @param {mobileNo}  - it mobile number of receipient.
 * @param {newTransferReq} - Money transfer object.
 * @return returns applicant id
**/
const __getExchangeAmount = async (fromCurrency, toCurrency, amount) => {
  try {
    logger.info('getExchangeAmount() initiated');
    let exchangeRes = await getcurrencyExchangeMuse(fromCurrency, toCurrency, null)
    let exchangedAmount = (exchangeRes.rate * amount).toFixed(2);
    return ({ exchangeAmount: exchangedAmount });
  }
  catch (err) {
    logger.error('Error occured ' + err);
    return (new Error(langEngConfig.message.error.ErrorHandler));
  }
}



/**
 * @desc Method for deducting balance from account
 * @method deductAmount
 * @param {number} fromAccount -- it is from Account 
 * @param {number} deductBalance --it is deduct Balance 
 * @param {number} transactionId --it is transaction id 
 * @param {object} newTransfer --it is newTransfer object
 * @param {object} conn --it is connection object
 * @return returns status message and status code
**/
const __deductAmount = async (fromAccount, toAccount, applicantId, amount, toAmount, deductBalance, transactionId, newTransfer, conn) => {
  try {
    let result = await newTransfer.deductAmnt(fromAccount, deductBalance, conn)
    console.log(result,'result')
    if (result != 0) {
      //creating the debit transaction record.
     let transactionDetails= await __createTransaction(newTransfer, fromAccount, toAccount, applicantId, amount, toAmount, TRANSTYPE.DEBIT, transactionId, false, conn)
      console.log(transactionDetails,'sssss')
      return ({
        transactionId:transactionDetails.transactionId,
        message: langEngConfig.message.payment.amount_deduction_success,
        status: STATUS.SUCCESS
      })

    } else {
      conn.rollback();
      conn.release();
      return ({
        message: langEngConfig.message.payment.amount_deduction_fail,
        status: STATUS.FAILURE
      });
    }
  }
  catch (err) {
    logger.error('Error occured ' + err);
    return (new Error(langEngConfig.message.error.ErrorHandler));

  }
}



/**
 * @desc Method for creting an account to account transfer transaction record
 * @method createTransaction
 * @param {object} newTransfer - it is newTransfer object
 * @param {string} transType - it is transaction type 
 * @param {number} transactionNumber - it is transaction Number
 * @param {object} newTransfer - it is newTransfer object
 * @param {number} flag - it is flag
 * @param {object} conn - it is connection object
 * @return returns status message and status code
**/
const __createTransaction = async (newTransfer, fromAccount, toAccount, applicantId, amount, toAmount, transType, transactionNumber, flag, conn) => {
  //transaction number.
  let transnum = transactionNumber;
  let account = 0;
  let transAmount = 0;
  try {
    transType == 'DB' ? account = fromAccount : account = toAccount;
    //getting the full name
    let fullnameRes = await __getFullName(account, newTransfer)

    let fullname = fullnameRes.full_name;
    let currency = fullnameRes.currency;
    let timestamp = utils.getCurrentTimeStamp();
    let transtype = transType;
    let transApplicantId = applicantId;
    (flag) ? transAmount = toAmount : transAmount = amount;
    //inserting the transaction record
    let transRes = await newTransfer.insertTransaction(transApplicantId, transnum, transtype, fromAccount, toAccount, currency, fullname, ACCOUNT_TYPE.WALLET, transAmount, timestamp, conn)
    if (transRes != 0) {
      console.log(transRes,'transca')
      return ({
        transactionId:transRes.insertId,
        message: langEngConfig.message.payment.trans_record_succ,
        status: STATUS.SUCCESS
      });
    } else {
      //Rollback the transaction and enable the auto commit in failure case
      conn.rollback();
      conn.release();
      return ({
        message: langEngConfig.message.payment.trans_record_fail,
        status: STATUS.FAILURE
      });
    }
  }
  catch (err) {
    logger.error('Error occured ' + err);
    conn.rollback();
    conn.release();
    return (new Error({
      message: langEngConfig.message.payment.trans_record_fail,
      status: STATUS.FAILURE
    }))

  }
}


/**
 * @desc Method for getting full name by using account no
 * @method getFullName
 * @param {number} accountNo - it is account number
 * @param {object} newTransfer - it is newTransfer object
 * @return returns full name by using account number
**/
const __getFullName = async (accountNo, newTransfer) => {
  try {
    let result = await newTransfer.getFullName(accountNo)
    return ({
      message: langEngConfig.message.payment.fullname_success,
      full_name: result[0].first_name + ' ' + result[0].last_name,
      currency: result[0].currency,
      status: STATUS.SUCCESS
    })
  }
  catch (err) {
    return (new Error({
      err: `Error occured: ${err}`,
      status: STATUS.FAILURE
    }))
  }
}

/**
 * @desc Method for adding money in receipient account
 * @method addbalance
 * @param {number} toAmnt -- it is to amount 
 * @param {number} toAccount --it is to account 
 * @param {number} transactionId --it is transaction id 
 * @param {object} newTransfer --it is newTransfer object
 * @param {object} conn --it is conn object
 * @return returns status message and status code
**/
const __addbalance = async (fromAccount, toAccount, applicantId, amount, toAmount, transactionId, newTransfer, conn) => {
  try {
    let addAmntRes = await newTransfer.addAmnt(toAmount, toAccount, conn)
    if (addAmntRes) {
      await __createTransaction(newTransfer, fromAccount, toAccount, applicantId, amount, toAmount, TRANSTYPE.CREDIT, transactionId, true, conn)
      return ({
        message: langEngConfig.message.payment.amount_addition_success,
        status: STATUS.SUCCESS
      });
    }

  }
  catch (err) {
    conn.rollback();
    conn.release();
    logger.error('Error occured ' + err);
    return (new Error(langEngConfig.message.error.ErrorHandler));

  }

}
/*===================================================================================================================================*/


const payment = new Sandbox();
export const addMoney = function (request, response) {
  logger.info('initialize addMoney()');
 
  const validatePaymentData1 = {
    amount : request.body.amount,
    account_number : request.body.account_number,
    orderDescriptor : request.body.orderDescriptor,
    applicant_id : request.params.applicant_id,
    payment_cards_id : request.body.payment_cards_id,
    card_cvv : request.body.card_cvv
  }
  if (!isValidPaymentRequest(validatePaymentData1)) {
    logger.error('Payment details not valid ');
    return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.invalidInput, STATUS.FAILED));
  }
  logger.info('Proceed for _fetchUserKycDetails()');
  return _makeTransfer(validatePaymentData1, request, response);
}




const isValidPaymentRequest=(validatePaymentData1)=> {

  if (validatePaymentData1.amount && validatePaymentData1.account_number && validatePaymentData1.orderDescriptor && validatePaymentData1.applicant_id && validatePaymentData1.payment_cards_id && validatePaymentData1.card_cvv) {
    return true;
  }
  return false;
}



/**
 * @desc This function is used to fetching kyc related information based on the applicantId
 * @method _makeTransfer 
 * @param {Object}  paymentReqObj - It is holds payment related information to make valid payment
 * @param {Object}  req - It is Request object
 * @param {Object}  res - It is Response object
 */

const _makeTransfer = async (paymentReqObj, req, res) => {
  logger.info('Initiated add walet _makeTransfer()');
  try{
    console.log(4)
  //payment.getUserCardDetails(paymentReqObj.applicant_id, paymentReqObj.payment_cards_id, paymentReqObj.account_number).then(results => {
let results  = await payment.getUserCardDetails(paymentReqObj.applicant_id, paymentReqObj.payment_cards_id, paymentReqObj.account_number);
if (results.length > 0 && paymentReqObj.card_cvv == STATUS.DEFAULT_CVV) {
      console.log(5)
      logger.info('Successfully fetched getUserCardDetails()');
      let cardDecryptionDetails = await decryptedCardDetails(results[0].secret_number, results[0].card_month, results[0].card_year, results[0].encrypted_card, results[0].encrypted_key);
      console.log(cardDecryptionDetails,'cccccccccccccc')
      let userInfo = prepareUserData(results[0], paymentReqObj.card_cvv, cardDecryptionDetails.card_number, cardDecryptionDetails.card_month, cardDecryptionDetails.card_year, req);
      userInfo.ip = ip.address();
      let inputCurrency = (paymentReqObj.currency) ? paymentReqObj.currency : 'EUR';
      accountToCardValue(inputCurrency, req.body.amount).then(results => {
        logger.info('Converting account currency to card default currency');       
        if (results.status == 1) {
          logger.info('Convertion done successfully');
          let cardAmount = results.amount;
          let paymentAmount = paymentReqObj.amount;
          let account_number = paymentReqObj.account_number;
          if(userInfo && userInfo.data) {
            var transactionHolderName = `${userInfo.customerGivenName ? userInfo.customerGivenName : ""} ${userInfo.customerSurname ? userInfo.customerSurname : ""}`;
           }
          userInfo.amount = parseFloat(cardAmount).toFixed(2);  //card 
          userInfo.orderDescriptor = paymentReqObj.orderDescriptor;
          userInfo.tmpl_amount = parseFloat(cardAmount).toFixed(2); // card amount
          console.log(userInfo,'uuuuuuuuuuuuu')
          callAutheticateService().then(function (authResponse) {
            if (authResponse && authResponse.access_token){
              global.accessToken = authResponse.access_token;  
          requestForPayments(userInfo, req, global.accessToken).then(function (res1) {
            logger.info('Initiate request for make payment to museService');
            if (res1 && res1.body.code && res1.body.code == 200) {
              let responseObj = preparePaymentsResponse(paymentReqObj.applicant_id, res1.body.code, res1.body.data,userInfo);
              if (!isNaN(responseObj.paymentId)) {
                payment.insertPayment(responseObj).then(results => {
                  logger.info('insertPayment() details done successfully');
                  if (results.status == 1) {
                    results.transactionInfo = JSON.parse(responseObj.result)
                    results.payStatus = 'success';
                    if (results.transactionInfo.code == 200) {
                      logger.info('Transaction done successfully');
                      let paymentReference = JSON.parse(responseObj.transaction_details)
                      payment.updateAccountDetails(paymentReqObj.applicant_id, account_number, 'USD', 2, paymentReference, paymentAmount).then(responseData => {
                        logger.info('Updated account details successfully');
                        payment.insertTransactionDetails(responseData.paymentObject.paymentsid, responseData.paymentObject.applicant_id, transactionHolderName, account_number, paymentAmount, inputCurrency, JSON.parse(responseObj.transaction_details)).then(transactions => {
                          logger.info('Transaction details captured successfully');

                          if (responseData.status == 1 && transactions.status == 1) {
                            results.status = STATUS.SUCCESS;
                            results.message = transactions.message;
                            results.payStatus = 'success';
                            res.send(ResponseHelper.buildSuccessResponse(results,/* langEngConfig.message.payment.successPayment */results.message, STATUS.SUCCESS))
                          }
                          else {
                            logger.debug('Transaction details captured failure');
                            results.status = STATUS.FAILED;
                            results.payStatus = 'fail';
                            results.message = 'Fail to capture walet amount / transation status';
                          }
                        }).catch(r => {
                          console.log(r);
                          logger.error('Some thing went wrong , While inserting transation details');
                          res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.transactionFailInsert)))
                        });
                      }).catch(r => {
                        logger.error('Some thing went wrong , While updating account details');
                        res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.updateAccountFail)))
                      })
                    } else {
                      logger.debug('Not a successfull transation');
                      res.send(ResponseHelper.buildSuccessResponse(results, langEngConfig.message.payment.failurePayment, STATUS.FAILED))
                    }
                  }
                  else {
                    logger.error(`Some thing went wrong , ${results.message}`);
                    res.send(ResponseHelper.buildSuccessResponse({}, `${results.message}`, STATUS.FAILED))
                  }
                }).catch(err => {
                  logger.error(`Some thing went wrong , While inserting payments details`);
                  console.log(err);
                  res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.paymentInsertFail)))
                });
              }
              else {
                let data = {}
                data.status = STATUS.FAILED;
                data.payStatus = 'fail';
                data.message = 'Payment failure'
                data.transactionInfo = JSON.parse(responseObj.result);
                logger.error(`Some thing went wrong ,Payment Failure`);
                res.send(ResponseHelper.buildSuccessResponse(data, langEngConfig.message.payment.errorPayment, STATUS.FAILED))
              }
            } else {
              if (res1 && res1.body.data.httpErrorCode == STATUS.UN_AUTHORIZED) {
                logger.error(`un-authorized access failure`);
                res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.authError, STATUS.FAILED))
              }
              else {
                if (res1.body && res1.body.data.message && res1.body.data.status == STATUS.SUCCESS) {
                  //res.send(ResponseHelper.buildFailureResponse(response.body.message.message));
                  // res.send(ResponseHelper.buildFailureResponse(res1.body.message));
                  res.send(ResponseHelper.buildSuccessResponse(
                    res1.body
                    , langEngConfig.message.token.tokenExpired, STATUS.VALID));
                } else {
                  if (res1.body.data.status == 0) {
                    logger.error(`${res1.body.data.message}`);
                    res.send(ResponseHelper.buildSuccessResponse({}, res1.body.data.message, STATUS.FAILED))
                  }
                  else {
                    logger.error(`please provide header is mandatory`);
                    res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.headerError, STATUS.FAILED))
                  }
                }
              }
            }
          }).catch(err => {
            logger.error('Some thing went wrong , service side ');
            res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.internalError)))
          })
        }
      })
        }
      }).catch(err => {
        logger.error('Some thing went wrong , Fail while currency convert');
        res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.currencyConverterError)))
      })
    }
    else {
      if (paymentReqObj.card_cvv != STATUS.DEFAULT_CVV) {
        logger.error('Invalid cvv');
        res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.cvv_fail, STATUS.FAILED))
      } else {
        logger.error('No data found with details');
        res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.noDataError, STATUS.FAILED))
      }
    }
  }
  catch(e){
    console.log(5)
    logger.error('Some thing went wrong , fetching user card details');
    console.log(e)
    res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.card_fail)))
  }
}


const decryptedCardDetails = async (secret_number, card_month, card_year, encrypted_card, encrypted_key) => {
  try {
    let cardData = await utils.cardDecrypt(encrypted_card, card_month, card_year, secret_number, encrypted_key);
    if (cardData.status == 0) {
      return cardData.data
    } else {
      return {
        "card_number": "",
        "card_month": "",
        "card_year": ""
      }
    }
  }
  catch (err) {
    logger.debug("error while doing decrypted format");
    console.log(err);
  }
}


function prepareUserData(paymentObj, card_cvv, card_number, card_month, card_year, request) {

  let transactionId = paymentObj.first_name+"_"+paymentObj.first_name+"_"+Math.random()
  let birthDate = (paymentObj.dob)//.toISOString().slice(0, 10);
  return {
    // "payments": {

    //   "currency": paymentObj.currency,
    //   "country": paymentObj.country_name,
    //   "city": paymentObj.city,
    //   "state": paymentObj.region,
    //   "street1": paymentObj.address_line1,
    //   "phone": paymentObj.mobile,
    //   "email": paymentObj.email,
    //   "givenName": paymentObj.first_name,
    //   "surname": paymentObj.last_name,
    //   "telnocc": paymentObj.telnocc,
    //   "postcode": paymentObj.postal_code,
    //   "birthDate": birthDate.split('-').join(''),
    //   "number": card_number,//paymentObj.card_number,
    //   "expiryMonth": card_month, //paymentObj.card_month,
    //   "expiryYear": card_year, // paymentObj.card_year,
    //   "cvv": card_cvv,//paymentObj.card_cvv,
    //   "paymentBrand": paymentObj.name_on_card,
    //   "paymentMode": "CC",
    //   "paymentType": "DB",//paymentObj.card_type,
    //   "tmpl_currency": paymentObj.currency,
    //   "recurringType": "",
    //   "createRegistration": "true",
      "memberId": "5",
      "type": "creditcard",
        "data": {
          "transactionId": transactionId,
          "amount": request.body.amount,
          "currency": paymentObj.currency,
          "orderDesc": request.body.orderDescriptor,
          "customerIP": ip.address(),
          "customerSurname": paymentObj.last_name,
          "customerGivenName": paymentObj.first_name,
          "customerMail": paymentObj.email,
          "customerBirthDate": birthDate.split('-').join,
          "customerPhone": paymentObj.mobile,
          "cardCVV": card_cvv,
          "cardExpiryYear": card_year,
          "cardExpiryMonth": card_month,
          "cardNumber": card_number,
          "cardBrand": paymentObj.card_type,
          "customerId": 12345,
          "shippingPostcode": paymentObj.postal_code,
          "shippingState": paymentObj.region,
          "shippingStreet": paymentObj.address_line1,
          "shippingCity": paymentObj.city,
          "shippingCountry": paymentObj.country_name,
          "customerTelephoneCountrycode": paymentObj.telnocc        
      //"customerId": paymentObj.applicant_id
    }
  }
}





var accountToCardValue = function (target, amount) {
  return new Promise((resolve, reject) => {
    fixer.convert('USD', target, amount).then(function (list) {
      if (list.success)
        resolve({ amount: list.result, status: 1 })
      else
        reject({ amount: 0, status: 1 })
    }, (err) => {
      reject({ message: err, status: 0 })
    })
  })
}

var callAutheticateService = async () => {

  console.log("callAutheticateService() initiated ");
  logger.info("callAutheticateService() initiated");

  let option = {
    uri: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/authenticate`,
    method: 'POST',
    json: true,
    body: {
            "memberId": process.env.CLIENT_ID,
            "secret": process.env.MUSE_SECRET
          }
  }
  try { 
        let authResponse = await requestPromise(option);
        console.log("Successful in authenticating with muse service", authResponse);
        logger.info("Successful in authenticating with muse service");
        global.access_token = authResponse.access_token
  return authResponse;
  } catch (err) {
      console.log("Error while authenticating with muse service "+ err);   
      return err;   
  }
}



var requestForPayments = function (userInfo, req, token) {
  return new Promise((resolve, reject) => {
    // request({
    //   method: 'post',
    //   headers: {'x-token':token,'accept': "application/json", 'authorization': req.headers["authorization"], 'member_id': req.headers["member_id"], 'api_access_key': req.headers["api_access_key"], 'client_auth': req.headers["client_auth"] },
    //   url: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/payment/debit`,
    //   body: userInfo,
    //   json: true,
    // }, function (err, res1) {
    //   console.log(res1.body)
    //   if (res1) {
    //     console.log(res1,'urunf');
    //     resolve(res1)
    //   } else {
    //     console.log(err,'error');
    //     reject(err)
    //   }
    // })

     var res1 = {
      body:
      {
        "code": 200,
        "data": {
          "timestamp": 1582960680,
          "gateway_payment_id": "92058"
        }
      }
    };
    resolve(res1); 
  });
}


function preparePaymentsResponse(applicant_id, status, paymentsResponse,paymentRequestInfo) {
  let paymentsInfo = {};
  paymentsInfo.applicant_id = parseInt(applicant_id)  
  paymentsInfo.paymentId = (typeof paymentsResponse.gateway_payment_id === "undefined") ? "" : parseInt(paymentsResponse.gateway_payment_id)  
  paymentsInfo.status = (status === 200) ? "SUCCESS" : ""
  paymentsInfo.paymentBrand = paymentRequestInfo.data.cardBrand  
  paymentsInfo.paymentMode = "CR";
  paymentsInfo.firstName = paymentRequestInfo.customerSurname
  paymentsInfo.lastName = paymentRequestInfo.customerGivenName
  paymentsInfo.amount = parseFloat(paymentRequestInfo.amount)
  paymentsInfo.currency = paymentRequestInfo.currency
  paymentsInfo.descriptor = paymentRequestInfo.orderDescriptor
  paymentsInfo.result = (status === 200) ? JSON.stringify({code: status, description: "Added money to wallet"}) : {};
  paymentsInfo.card = paymentRequestInfo.cardBrand
  paymentsInfo.customer = paymentRequestInfo.customerId
  paymentsInfo.transaction_details = (status === 200) ? JSON.stringify({code: status, 
    paymentId: paymentsResponse.gateway_payment_id, paymentType: "CR", paymentBrand: paymentRequestInfo.data.cardBrand}) : {};
  paymentsInfo.timestamp = utils.getGMT();
  paymentsInfo.merchantTransactionId = ""
  paymentsInfo.remark = "";
  paymentsInfo.transactionStatus = (status === 200) ? "SUCCESS" : ""
  paymentsInfo.tmpl_amount = paymentRequestInfo.tmpl_amount
  paymentsInfo.tmpl_currency = paymentRequestInfo.tmpl_currency
  paymentsInfo.eci = ""
  paymentsInfo.checksum = ""
  paymentsInfo.orderDescription = paymentRequestInfo.orderDescriptor
  paymentsInfo.companyName = paymentRequestInfo.companyName
  paymentsInfo.merchantContact = paymentRequestInfo.merchantContact
  return paymentsInfo;
}

/*========================================================================================================================================================================================================*/

export const payWithPayVoo = (request,response)=>{
  const addMoneyData = {
    amount : request.body.amount,
    account_number : request.body.account_number,
    orderDescriptor : request.body.orderDescriptor,
    applicant_id : request.params.applicant_id,
    payment_cards_id : request.body.payment_cards_id,
    card_cvv : request.body.card_cvv,
    currency : request.body.currency
  }


  sandbox.getCurrencyAccount(addMoneyData.applicant_id,addMoneyData.currency).then(accountResult=>{
    console.log(444)
    let accountsData = accountResult;
    console.log(addMoneyData.currency,'cccccc')
   
    if(accountsData){
      console.log('fff')
      let walletBalance = accountResult[0].balance;
      
      if(walletBalance>=addMoneyData.amount){
        console.log(8888)
        __walletToWalletTransfer(request, response)
        .then(transferRes => {
          logger.info('walletToWalletTransferInfo() execution completed');
          return transferRes
        })
      }
      else{
        console.log(2)
        let moneyToAdd = addMoneyData.amount-walletBalance;
        addMoneyData.amount = moneyToAdd;
        let paymentReqObj = addMoneyData;
        if (!isValidPaymentRequest(addMoneyData)) {
          logger.error('Payment details not valid ');
          //return response.redirect(redirectUrls.failureUrl+''+transactionCodes.codes.Error)
          return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.invalidInput, STATUS.FAILED));
        }
        console.log(3)
        return _makeTransfer(paymentReqObj, request, response);



        
      }
      
    }
    else{
     // response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.NoIssuer)

      response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.noAccountForCurrency, STATUS.FAILED))
    }

  })

}



export const getTransactions = (request,response)=>{
  let applicant_id = request.params.applicant_id;
  console.log(applicant_id,'fdsf')
  sandbox.getTransactions(applicant_id).then(transactionsResponse=>{
    if(transactionsResponse){
      console.log(transactionsResponse);
      response.send(ResponseHelper.buildSuccessResponse(transactionsResponse, langEngConfig.message.payment.transactionSuccess, STATUS.SUCCESS))
    }
    else{
      response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.noTransactions, STATUS.SUCCESS))
    }
  })
}

























// logger.info('Initiated add walet _makeTransfer()');
// payment.getUserCardDetails(paymentReqObj.applicant_id, paymentReqObj.payment_cards_id, paymentReqObj.account_number).then(results => {
//   if (results.length > 0 && paymentReqObj.card_cvv == STATUS.DEFAULT_CVV) {
//     logger.info('Successfully fetched getUserCardDetails()');
//     let userInfo = prepareUserData(results[0], paymentReqObj.card_cvv);
//     userInfo.payments.ip = ip.address();
//     let inputCurrency = (paymentReqObj.currency) ? paymentReqObj.currency : 'EUR';
//     accountToCardValue(inputCurrency,addMoneyData.amount).then(results => {
//       logger.info('Converting account currency to card default currency');
//       if (results.status == 1) {
//         logger.info('Convertion done successfully');
//         let cardAmount = results.amount;
//         let paymentAmount = paymentReqObj.amount;
//         let account_number = paymentReqObj.account_number;
//         let transactionHolderName = `${userInfo.payments.givenName ? userInfo.payments.givenName : ""} ${userInfo.payments.surname ? userInfo.payments.surname : ""}`;
//         userInfo.payments.amount = parseFloat(cardAmount).toFixed(2);  //card 
//         userInfo.payments.orderDescriptor = paymentReqObj.orderDescriptor;
//         userInfo.payments.tmpl_amount = parseFloat(cardAmount).toFixed(2); // card amount
//         requestForPayments(userInfo, request).then(function (res1) {
//           console.log(res1);
//           logger.info('Initiate request for make payment to museService');
//           if (res1 && res1.body.status && res1.body.data.status == 1) {
//             let responseObj = preparePaymentsResponse(paymentReqObj.applicant_id, res1.body.data.data);
//             if (!isNaN(responseObj.paymentId)) {
//               payment.insertPayment(responseObj).then(results => {
//                 logger.info('insertPayment() details done successfully');
//                 if (results.status == 1) {
//                   results.transactionInfo = JSON.parse(responseObj.result)
//                   results.payStatus = 'fail';
//                   if (results.transactionInfo.code == STATUS.PAYMENT_SUCCESS) {
//                     logger.info('Transaction done successfully');
//                     let paymentReference = JSON.parse(responseObj.transaction_details)
//                     payment.updateAccountDetails(paymentReqObj.applicant_id, account_number, 'USD', 2, paymentReference, paymentAmount).then(responseData => {
//                       logger.info('Updated account details successfully');
//                       payment.insertTransactionDetails(responseData.paymentObject.paymentsid, responseData.paymentObject.applicant_id, transactionHolderName, account_number, paymentAmount, inputCurrency, JSON.parse(responseObj.transaction_details)).then(transactions => {
//                         logger.info('Transaction details captured successfully');

//                         if (responseData.status == 1 && transactions.status == 1) {
//                           results.status = STATUS.SUCCESS;
//                           results.message = transactions.message;
//                           results.payStatus = 'success';
//                           __walletToWalletTransfer(request, response)
//                           .then(transferRes => {
//                             logger.info('walletToWalletTransferInfo() execution completed');
//                             return transferRes
//                           })
//                          // res.send(ResponseHelper.buildSuccessResponse(results,/* langEngConfig.message.payment.successPayment */results.message, STATUS.SUCCESS))
//                         }
//                         else {
//                           logger.debug('Transaction details captured failure');
//                           results.status = STATUS.FAILED;
//                           results.payStatus = 'fail';
//                           results.message = 'Fail to capture walet amount / transation status';
//                           //response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.InvalidAmount)
//                            response.send(ResponseHelper.buildSuccessResponse(results,/* langEngConfig.message.payment.successPayment */results.message, STATUS.FAILED))
//                         }
//                       }).catch(r => {
//                         console.log(r);
//                         logger.error('Some thing went wrong , While inserting transation details');
//                         //response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.Error)

//                         response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.transactionFailInsert)))
//                       });
//                     }).catch(r => {
//                       logger.error('Some thing went wrong , While updating account details');
//                      // response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.Error)
//                       response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.updateAccountFail)))
//                     })
//                   } else {
//                     logger.debug('Not a successfull transation');
//                    // response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.Error)
//                     response.send(ResponseHelper.buildSuccessResponse(results, langEngConfig.message.payment.failurePayment, STATUS.FAILED))
//                   }
//                 }
//                 else {
//                   logger.error(`Some thing went wrong ,dsgsdgasdgsdag ${results.message}`);
//                   //response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.Error)

//                   response.send(ResponseHelper.buildSuccessResponse({}, `${results.message}`, STATUS.FAILED))
//                 }
//               }).catch(err => {
//                 logger.error(`Some thing went wrong , While inserting payments details`);
//                // response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.Error)

//                response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.paymentInsertFail)))
//               });
//             }
//             else {
//               let data = {}
//               data.status = STATUS.FAILED;
//               data.payStatus = 'fail';
//               data.message = 'Payment failure'
//               data.transactionInfo = JSON.parse(responseObj.result);
//               data.payStatus = 'fail';
//               logger.error(`Some thing went wrong ,Payment Failure`);
//            //   response.redirect(redirectUrls.failureUrl+'/'+data.transactionInfo)

//               response.send(ResponseHelper.buildSuccessResponse(data, langEngConfig.message.payment.errorPayment, STATUS.FAILED))
//             }
//           } else {
//             if (res1 && res1.body.status == STATUS.UN_AUTHORIZED) {
//               logger.error(`un-authorized access failure`);
//              // response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.RestrictedCardRetainCard)
//               response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.authError, STATUS.FAILED))
//             }
//             else {
//               if (res1.body && res1.body.message.message && res1.body.message.status == STATUS.SUCCESS) {

//                // response.redirect(redirectUrls.failureUrl+'/'+STATUS.VALID)

//                 response.send(ResponseHelper.buildSuccessResponse(
//                   res1.body
//                    , langEngConfig.message.token.tokenExpired, STATUS.VALID));
//               } else {
//                 if (res1.body.status == 0) {
//                   logger.error(`${res1.body.message}`);
//                   //response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.Error)

//                   response.send(ResponseHelper.buildSuccessResponse({}, res1.body.message, STATUS.FAILED))
//                 }
//                 else {
//                   logger.error(`please provide header is mandatory`);
//                  // response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.FormatError)

//                   response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.headerError, STATUS.FAILED))
//                 }
//               }
//             }
//           }
//         }).catch(err => {
//           logger.error('Some thing went wrong , service side ');
//           //response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.Error)

//           response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.internalError)))
//         })

//       }
//     }).catch(err => {
//       logger.error('Some thing went wrong , Fail while currency convert');
//     //  response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.Error)

//       response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.currencyConverterError)))
//     })
//   }
//   else {
//     if (paymentReqObj.card_cvv != STATUS.DEFAULT_CVV) {
//       logger.error('Invalid cvv');
//     //  response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.Error)

//       response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.cvv_fail, STATUS.FAILED))
//     } else {
//       logger.error('No data found with details');
//    //   response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.Error)

//       response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.noDataError, STATUS.FAILED))
//     }
//   }
// }).catch(err => {
//   logger.error('Some thing went wrong , fetching user card details');
// //  response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.Error)

//   response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.card_fail)))
// })