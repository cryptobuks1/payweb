/**
 * paymentController Controller
 * paymentController is used for validate payment information into payvoo
 * @package payment Controller
 * @subpackage controller/payment/paymentController
 * @author SEPA Cyper Technologies, satyanarayana G.
 */

import { Payment } from '../model/payment';
import { langEngConfig } from '../utility/lang_eng';
import { Utils } from '../utility/utils';
import { callAutheticateService } from './museCommManager';
import {
  DbConnMgr
} from '../dbconfig/dbconfig';
import { sendFundsRequestedMail, sendGenericTextEmail } from '../mailer/mail';
import {
  Account
} from '../model/account';
import {
  MoneyTransfer
} from '../model/moneyTransfer';
const shortid = require('shortid');

var commonCode = require("../controller/commonCode");

const payment = new Payment();
const dbinst = DbConnMgr.getInstance();

let account = new Account();


const TRANSTYPE = {
  DEBIT: 'DB',
  CREDIT: "CR"
}

const utils = new Utils();



let currencyMini = [
  { "currency": "BGN", "amount": 25 },
  { "currency": "HRK", "amount": 90 },
  { "currency": "CZK", "amount": 300 },
  { "currency": "DKK", "amount": 100 },
  { "currency": "EUR", "amount": 10 },
  { "currency": "HUF", "amount": 3500 },
  { "currency": "PLN", "amount": 20 },
  { "currency": "RON", "amount": 50 },
  { "currency": "SEK", "amount": 100 },
  { "currency": "GBP", "amount": 10 },
  { "currency": "USD", "amount": 20 },
  { "currency": "CHF", "amount": 20 },
  { "currency": "ISK", "amount": 20 },
  { "currency": "NOK", "amount": 20 },
]

const STATUS = {
  FAILED: 1,
  SUCCESS: 0,
  VALID: 2,
  UN_AUTHORIZED: 403,
  SUCCESS_PAYMENT: '0001',
  DEFAULT_CVV: '123',
  PAYMENT_SUCCESS: '200',
  KYC_SUCCESS: ['SUCCESS']
};

let CURRENCY_SYMB = {
  FROM_CURR: '',
  TO_CURR: ''
}

class ValidatePaymentData {
  constructor(paymentRequest) {
    this.amount = paymentRequest.body.amount;
    this.account_number = paymentRequest.body.account_number;
    this.orderDescriptor = paymentRequest.body.orderDescriptor;
    this.applicant_id = paymentRequest.params.applicant_id;
    this.payment_cards_id = paymentRequest.body.payment_cards_id;
    this.card_cvv = paymentRequest.body.card_cvv;
    this.currency = paymentRequest.body.currency;
    this.transaction_time = paymentRequest.body.transaction_time;
  }
	/**
	 * @function isValidPaymentRequest
	 * @desc this function is to validate payment information
	 * @param None
	 * @return True if request is valid paymentObject. False if request is invalid
	 */
  isValidPaymentRequest() {
    if (this.amount && this.account_number && this.orderDescriptor && this.applicant_id && this.payment_cards_id && this.card_cvv) {
      return true;
    }
    return false;
  }
}

/**
 * @desc This function is used to make payment to add money in users currency accounts
 * @method addMoney 
 * @param {Object}  request - It is Request object
 * @param {Object}  response - It is Response object
 */

export const addMoney = function (request, response) {
  logger.info('initialize addMoney()');
  const validatePaymentData = new ValidatePaymentData(request);
  if (!validatePaymentData.isValidPaymentRequest()) {
    logger.error('Payment details not valid ');
    return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.invalidInput, STATUS.FAILED));
  }
  logger.info('Proceed for _fetchUserKycDetails()');
  return _makeTransfer(validatePaymentData, request, response);
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
  try {   
    // ------------------------
    // 1. Get User Card details
    // -------------------------
    let results = await payment.getUserCardDetails(paymentReqObj.applicant_id, paymentReqObj.payment_cards_id, paymentReqObj.account_number);
      if (results.length > 0) {
      // ----------------------
      // 2. Check for KYC status
      // ----------------------
      if (['SUCCESS', 'SUCCESSFUL_WITH_CHANGES'].includes(results[0].kyc_status)) {
        logger.info('Successfully fetched getUserCardDetails()');
        let cardDecryptionDetails = await decryptedCardDetails(results[0].secret_number, results[0].card_month, results[0].card_year, results[0].encrypted_card, results[0].encrypted_key);
        // --------------------
        // 3. Prepare user data
        // --------------------      
        let paymentRequestInfo = preparePaymentRequestInfo(results[0], paymentReqObj.card_cvv, cardDecryptionDetails.card_number, cardDecryptionDetails.card_month, cardDecryptionDetails.card_year, req)

        paymentRequestInfo.ip = ip.address();
        let inputCurrency = (paymentReqObj.currency) ? paymentReqObj.currency : 'EUR';
        let minAmount = 0;
        let flag = true;
        let transaction_time = paymentReqObj.transaction_time;
        currencyMini.forEach(r => {
          if (r.currency === inputCurrency) {
            if (r.amount > Number(req.body.amount)) {
              minAmount = r.amount
              flag = false;
            }
          }
        })
        if (flag) {

          // -------------------------
          // 3. Account to Card Value
          // -------------------------
          accountToCardValue(inputCurrency, req.body.amount).then(results => {
            logger.info('Converting account currency to card default currency');
            if (results.status == 1) {
              logger.info('Convertion done successfully');
              let cardAmount = results.amount;
              let paymentAmount = paymentReqObj.amount;
              let account_number = paymentReqObj.account_number;
             if(paymentRequestInfo && paymentRequestInfo.data) {
              var transactionHolderName = `${paymentRequestInfo.data.customerGivenName ? paymentRequestInfo.data.customerGivenName : ""} ${paymentRequestInfo.data.customerSurname ? paymentRequestInfo.data.customerSurname : ""}`;
             }           
              paymentRequestInfo.amount = parseFloat(cardAmount).toFixed(2);  //card 
              paymentRequestInfo.orderDescriptor = paymentReqObj.orderDescriptor;
              paymentRequestInfo.tmpl_amount = parseFloat(cardAmount).toFixed(2); // card amount


              // -----------------------
              // 4. Request for Payement
              // -----------------------
              requestForPayments(paymentRequestInfo, req, global.accessToken).then(function (res1) {           
              

                // Call authenticate service again  
                if (res1 && res1.body && res1.body.error) {            
                  logger.info('Muse service Token expired, requiring the token');
                  callAutheticateService().then(function (authResponse) {
                    if (authResponse && authResponse.access_token){
                      global.accessToken = authResponse.body.access_token;                   
                      // Request for payment again

                      // Generate  new transaction number

                      paymentRequestInfo.transactionId = paymentRequestInfo.givenName+"_"+Math.random()                    
                      requestForPayments(paymentRequestInfo, req, global.accessToken).then(function (res1) {

                        logger.info('Initiate request for make payment to museService, after requiring token');                      
                        if (res1 && res1.body.status && res1.body.data.status == STATUS.SUCCESS) {

                          logger.info('preparePaymentsResponse');
        
                          // -------------------------------
                          // 5. Prepare the payment response
                          //--------------------------------
                          let responseObj = preparePaymentsResponse(paymentReqObj.applicant_id, res1.body.code,res1.body.data,paymentRequestInfo);
                          if (!isNaN(responseObj.paymentId)) {
        
                            // ----------------------------------------------------
                            // 6. Insert payment response in to the Payements table
                            // ----------------------------------------------------
                            logger.info('PreparePayementResponse'+ JSON.stringify(responseObj));

                            logger.info('insertPayment in to payements table');
                            payment.insertPayment(responseObj).then(results => {
                              logger.info('insertPayment() details done successfully');

                              logger.info('insert payment in to payment table results'+JSON.stringify(responseObj));
                              
                              if (results.status == 1) {
        
                                // ---------------------------------------------
                                // 7. Insert transaction in to transaction table
                                // ---------------------------------------------
                                results.transactionInfo = JSON.parse(responseObj.result)
                                results.payStatus = 'fail';
                                
                                if (results.transactionInfo.code == STATUS.PAYMENT_SUCCESS) {
                                  logger.info('Transaction done successfully');
                                  let paymentReference = JSON.parse(responseObj.transaction_details)
        
                                  // ------------------------
                                  // 8. Update accounts table
                                  // ------------------------
                                  payment.updateAccountDetails(paymentReqObj.applicant_id, account_number, 'USD', 2, paymentReference, paymentAmount).then(responseData => {
                                    logger.info('Updated account details successfully');
                                    payment.insertTransactionDetails(responseData.paymentObject.paymentsid, responseData.paymentObject.applicant_id, transactionHolderName, account_number, paymentAmount, inputCurrency, JSON.parse(responseObj.transaction_details), transaction_time).then(transactions => {
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
                                      logger.error('Something went wrong , While inserting transation details');
                                      res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.transactionFailInsert)))
                                    });
                                  }).catch(r => {
                                    logger.error('Something went wrong , While updating account details');
                                    res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.updateAccountFail)))
                                  })
                                } else {
                                  logger.debug('Not a successfull transation');
                                  res.send(ResponseHelper.buildSuccessResponse(results, langEngConfig.message.payment.failurePayment, STATUS.FAILED))
                                }
                              }
                              else {
                                logger.error(`Something went wrong , ${results.message}`);
                                res.send(ResponseHelper.buildSuccessResponse({}, `${results.message}`, STATUS.FAILED))
                              }
                            }).catch(err => {
                              logger.error(`Something went wrong , While inserting payments details`);
                              res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.paymentInsertFail)))
                            });
                          }
                          else {
                            let data = {}
                            data.status = STATUS.FAILED;
                            data.payStatus = 'fail';
                            data.message = 'Payment failure'
                            data.transactionInfo = JSON.parse(responseObj.result);                           
                            logger.error(`Something went wrong ,Payment Failure`);// langEngConfig.message.payment.errorPayment,
                            res.send(ResponseHelper.buildSuccessResponse(data, data.transactionInfo.description, STATUS.FAILED))
                          }
                        }
                      }).catch(err => {
                        logger.error(`Something went wrong , While inserting payments details`);
                        res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.paymentInsertFail)))
                      });                                      
                    }
                  }).catch(err => {
                    logger.error(`Something went wrong , While inserting payments details`);
                    res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.paymentInsertFail)))
                  });
                } else {
                  logger.info('Initiate request for make payment to museService - No Token expiry');                
                  if ((res1 && res1.body.status && res1.body.data.status == STATUS.SUCCESS) || (res1 && res1.body.code == 200 )) {
                    let responseObj = preparePaymentsResponse(paymentReqObj.applicant_id,res1.body.code, res1.body.data,paymentRequestInfo);
                    if (!isNaN(responseObj.paymentId)) {
        
                      // ----------------------------------------------------
                      // 6. Insert payment response in to the Payements table
                      // ----------------------------------------------------
                      logger.info('PreparePayementResponse');

                      logger.info('insertPayment in to payements table');
                      payment.insertPayment(responseObj).then(results => {
                        logger.info('insertPayment() details done successfully');

                        logger.info('insert payment in to payment table results');
                        
                        if (results.status == 1) {
  
                          // ---------------------------------------------
                          // 7. Insert transaction in to transaction table
                          // ---------------------------------------------
                          results.transactionInfo = JSON.parse(responseObj.result)
                          results.payStatus = 'fail';
                          
                          if (results.transactionInfo.code == STATUS.PAYMENT_SUCCESS) {
                            logger.info('Transaction done successfully');
                            let paymentReference = JSON.parse(responseObj.transaction_details)
  
                            // ------------------------
                            // 8. Update accounts table
                            // ------------------------
                            payment.updateAccountDetails(paymentReqObj.applicant_id, account_number, 'USD', 2, paymentReference, paymentAmount).then(responseData => {
                              logger.info('Updated account details successfully',+JSON.stringify(responseData ));                         
                              payment.insertTransactionDetails(responseData.paymentObject.paymentsid, responseData.paymentObject.applicant_id, transactionHolderName, account_number, paymentAmount, inputCurrency, 
                                JSON.parse(responseObj.transaction_details), transaction_time).then(transactions => {
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
                                logger.error('Something went wrong , While inserting transation details');
                                res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.transactionFailInsert)))
                              });
                            }).catch(r => {
                              logger.error('Something went wrong , While updating account details');
                              res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.updateAccountFail)))
                            })
                          } else {
                            logger.debug('Not a successfull transation');
                            res.send(ResponseHelper.buildSuccessResponse(results, langEngConfig.message.payment.failurePayment, STATUS.FAILED))
                          }
                        }
                        else {
                          logger.error(`Something went wrong , ${results.message}`);
                          res.send(ResponseHelper.buildSuccessResponse({}, `${results.message}`, STATUS.FAILED))
                        }
                      }).catch(err => {
                        logger.error(`Something went wrong , While inserting payments details`);
                        res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.paymentInsertFail)))
                      });
                    }
                    else {
                      let data = {}
                      data.status = STATUS.FAILED;
                      data.payStatus = 'fail';
                      data.message = 'Payment failure'
                      data.transactionInfo = JSON.parse(responseObj.result);                     
                      logger.error(`Something went wrong ,Payment Failure`);// langEngConfig.message.payment.errorPayment,
                      res.send(ResponseHelper.buildSuccessResponse(data, data.transactionInfo.description, STATUS.FAILED))
                    }


                  } else {
                      if (res1 && res1.body.data.httpErrorCode == STATUS.UN_AUTHORIZED) {
                        logger.error(`un-authorized access failure`);
                        res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.authError, STATUS.FAILED))
                      }
                      else {
                        if (res1.body && res1.body.data.message && res1.body.data.status == STATUS.SUCCESS) {                        
                          res.send(ResponseHelper.buildSuccessResponse(res1.body, langEngConfig.message.token.tokenExpired, STATUS.VALID));
                        } else {
                          if (res1.body.data.status == STATUS.FAILED) {
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

                }

              }).catch(err => {
                logger.error('Something went wrong , service side ');
                res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.internalError)))
              })

            }
          }).catch(err => {
            logger.error('Something went wrong , Fail while currency convert');
            res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.currencyConverterError)))
          })
        } else {
          logger.error('Invalid amount range');
          res.send(ResponseHelper.buildFailureResponse({}, `${langEngConfig.message.payment.amount_range}${inputCurrency} ${minAmount}` , STATUS.FAILED))
        }
      } else {
        logger.error('Invalid kyc');
        res.send(ResponseHelper.buildFailureResponse({}, langEngConfig.message.payment.invalid_kyc, STATUS.FAILED))
      }
    } else {    
        logger.error('No data found with details');
        res.send(ResponseHelper.buildFailureResponse({}, langEngConfig.message.payment.noDataError, STATUS.FAILED))   
    }
  } catch (e) {
    logger.error('Something went wrong , fetching user card details');
    res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.card_fail)))
  }
}



/* Prepare for payment response to addMoney functionality */
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


/**
 * @desc This function is used to make request for make payments with user details
 * @method requestForPayments 
 * @param {Object} userInfo - userInfo is object used to make payment in museServer 
 * @param {Object} req - It is request object 
 * 
 */

var requestForPayments = function (userInfo, req, token) {
  return new Promise((resolve, reject) => {
    // request({
    //   method: 'post',
    //   headers: {'x-token':token,'accept': "application/json", 'authorization': req.headers["authorization"], 'member_id': req.headers["member_id"], 'api_access_key': req.headers["api_access_key"], 'client_auth': req.headers["client_auth"] },
    //   url: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/payment/preAuth`,
    //   body: {
    //     'memberId': '5',
    //      'type':'creditcard',
    //     'data': paymentRequestInfo
    //   },
    //   json: true,
    // }, function (err, res1) {
    //   if (res1) {
    //     resolve(res1)
    //   } else {
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


/**
 * @desc This function will work for convert user account money value to card default currency
 * @method accountToCardValue 
 * @param {String} target - It is referce to account holders currency  
 * @param {String} amount - It is reference for amount
 * 
 */

var accountToCardValue = function (target, amount) {
  return new Promise((resolve, reject) => {
    //   fixer.convert('USD', target, amount).then(function (list) {
    //     if (list.success)
    //       resolve({ amount: list.result, status: 1 })
    //     else
    //       reject({ amount: 0, status: 1 })
    //   }, (err) => {
    //     reject({ message: err, status: 0 })
    //   })
    // })

    resolve({ amount: 30, status: 1 });
  });
}
/**
 * @desc This method used for decrypting card details.
 * @method decryptedCardDetails
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
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
  }
}

function preparePaymentRequestInfo(paymentObj, card_cvv, card_number, card_month, card_year, request) {

  let transactionId = paymentObj.first_name+"_"+paymentObj.first_name+"_"+Math.random()
  let birthDate = (paymentObj.dob)//.toISOString().slice(0, 10);
  return {
      "memberId": process.env.CLIENT_ID,
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
        }
  }
}

export const requestFunds = async (req, res) => {
  const mt = new MoneyTransfer({
    applicant_id: null,
    from_currency: null,
    to_currency: null,
    to_mobile: null,
    amount: null,
    currency_type: null,
    device_type: null
  });

  logger.info('request funds initialized');
  let { requestedFrom, requestedBy, requestedByEmail, requestedAmount, requestedCurrency, transaction_time } = req.body;
  let from_account;
  let element = await payment.getEmailId(req.params.applicant_id)
 
  let fromApplicantId = req.params.applicant_id;
    if(element && element.length > 0) {
    let sender_email = element[0].user_id;
    let transactionId = utils.generateTransNum();
    let details = await payment.getBusinessDetails(req.params.applicant_id);
    if(details && details.length > 0) {
      requestedBy = details[0].business_legal_name;
    }
  const text = `Hi ${requestedFrom}.\n\n${requestedBy} has requested ${requestedAmount} ${requestedCurrency} from you.\n Log in to your eWallet Account and send the requested amount if you agree.`;
  try {
  await sendFundsRequestedMail(requestedByEmail, text)
      //   requestPaymentsTransactons(requestedCurrency, req.params.applicant_id, requestedAmount).then(res => {
      let fromCurrencyRes = await mt.getFromCurrencyAccountno(requestedCurrency, fromApplicantId);
      if (fromCurrencyRes.length > 0) {
        let to_account = fromCurrencyRes[0].account_no;
      //  let accountNoRes = await __getRecipientCurrencyAccount(receiverMobile, requestedCurrency, body, receiver_applicant_id);
      let recepientDetails = await mt.getRecipientDetailsByEmail(requestedByEmail);
      let recipientApplicantId = recepientDetails[0].applicant_id;             
      let receiverMobile = recepientDetails[0].mobile;
      let toApplicantid = recipientApplicantId;
    //  let requestToCurrency;
      let toAmount;
      let request_currency = requestedCurrency;
      let currencyAccount = await mt.getRecipientCurrencyAccount(receiverMobile,recipientApplicantId, requestedCurrency);
     if (currencyAccount && currencyAccount.length > 0) {
          from_account = currencyAccount[0].account_no;
          toApplicantid = currencyAccount[0].applicant_id;
        } else {
          currencyAccount = await mt.getRecipientCurrencyAccount(receiverMobile,recipientApplicantId, 'EUR');
        if (currencyAccount && currencyAccount.length > 0) {
          from_account = currencyAccount[0].account_no;
          toApplicantid = currencyAccount[0].applicant_id;
          requestedCurrency = 'EUR';
        }
        }
        // else {
        //   await account.createCurrencyAccount(requestedCurrency, recipientApplicantId);
        // }
        // currencyAccount = await mt.getRecipientCurrencyAccount(receiverMobile,recipientApplicantId, requestedCurrency);
        // if (currencyAccount && currencyAccount.length > 0) {
        //   from_account = currencyAccount[0].account_no;
        //   toApplicantid = currencyAccount[0].applicant_id;
        // }
        

          let ACCOUNT_TYPE = 'REQUEST';         
          let conn = await dbinst.getConnObject();
          if(conn) {
            await conn.beginTransaction();
            let description = "You owe"        
            //requestToCurrency = requestToCurrency ? requestToCurrency : requestedCurrency;
            toAmount = toAmount ? toAmount : requestedAmount;
            //Money deduction from senders account
            let deductRes = await __deductAmountRequestFunds(from_account, to_account, toApplicantid, toAmount, toAmount,requestedCurrency,sender_email, transactionId, description,receiverMobile, ACCOUNT_TYPE, mt, conn, request_currency, transaction_time, fromApplicantId);
            //If money deducted successfully
            if (deductRes.status == 0) {
              let desc = "Owes you"
              logger.info('__addbalance() called'); 
              let addbalRes = await __addbalanceRequestFunds(from_account, to_account, fromApplicantId, requestedAmount, requestedAmount,request_currency,requestedByEmail, transactionId, desc,receiverMobile, ACCOUNT_TYPE, mt, conn, request_currency, transaction_time, toApplicantid);
              console.log("addbalance", addbalRes);
              //If money added successfully
              if (addbalRes.status == 0) {
                //commit the transaction and release the conn object
                conn.commit();
                conn.release();
                res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.trans_success, STATUS.SUCCESS));
              } else {
                //If money did not added into receipient account roolback the transaction
                conn.rollback();
                conn.release();
                res.send(ResponseHelper.buildFailureResponse(langEngConfig.message.payment.trans_failed));
              }
            } else {
              return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.amount_deduction_fail, STATUS.FAILED);
            }         
          }       
      }
} catch {
    
      res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.requestFundsEmailNotSent, STATUS.FAILED));
    
  }
}
}

/**
 * @desc Method for checking account balance before performing money transfer 
 * @method __checkminimumBalance
 * @param {number} accountNo -- it is Request object
 * @param {number} amount --it is Response object
 * @param {object} newTransfer --it is newTransfer object
 * @return returns status message and status code
 **/
const __checkminimumBalance = async (accountNo, amount, newTransfer) => {
  try {
    logger.info('checkMinimumBalance() called');
    let result = await newTransfer.checkMinimumBalance(accountNo);
    if (result && result.length > 0 && (amount > result[0].balance || result[0].status == 0)) {
      if (result[0].status == 0) {
        logger.info('account_deactive() executed');
        return ({
          status: STATUS.FAILED,
          message: `${accountNo}` + langEngConfig.message.payment.account_deactive
        });
      } else {
        logger.info('insufficient_balance() executed');

        return ({
          message: langEngConfig.message.payment.insufficient_balance,
          status: STATUS.FAILED
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


const __createTransaction = async (newTransfer, fromAccount, toAccount, applicantId, amount, toAmount,requestedCurrency,requestedByEmail, transType, transactionNumber, flag, desc,receiverMobile, ACCOUNT_TYPE, conn, request_Currency, transaction_time, applicant_id) => {
  //transaction number.
  let transnum = transactionNumber;
  let account = 0;
  let transAmount = 0;
  let currency = requestedCurrency;
  let request_currency = request_Currency;
  try {
    transType == 'DB' ? account = toAccount : account = fromAccount;
  //  transType == 'DB' ? currency = CURRENCY_SYMB.FROM_CURR : currency = CURRENCY_SYMB.TO_CURR;
    //getting the full name
    let fullname;
    let details = await payment.getBusinessDetails(applicant_id);
    if(details && details.length > 0) {
      fullname = details[0].business_legal_name;
    } else {
    let fullnameRes = await payment.getFullName(account);
    if(fullnameRes && fullnameRes.length > 0) {
    fullname = fullnameRes[0].first_name + " "+fullnameRes[0].last_name;
    }
  }
    //let currency = fullnameRes.currency;
    let transtype = transType;
    let transApplicantId = applicantId;
    (flag) ? transAmount = toAmount: transAmount = amount;   
    //inserting the transaction record
    let transRes = await payment.insertTransaction(transApplicantId, transnum, transtype, fromAccount, toAccount, currency, fullname, ACCOUNT_TYPE, transAmount,
       desc,receiverMobile,requestedByEmail, transaction_time, conn, request_currency)
    if (transRes != 0) {
      return ({
        message: langEngConfig.message.payment.trans_record_succ,
        status: STATUS.SUCCESS
      });
    } else {
      //Rollback the transaction and enable the auto commit in failure case
      conn.rollback();
      conn.release();
      return ({
        message: langEngConfig.message.payment.trans_record_fail,
        status: STATUS.FAILED
      });
    }
  } catch (err) {
    logger.error('Error occured ' + err);
    conn.rollback();
    conn.release();
    return (new Error({
      message: langEngConfig.message.payment.trans_record_fail,
      status: STATUS.FAILED
    }))

  }
}

export const requestFundsNonPayvoo = async (req, res) => {
  let reqAmount = req.body.requestedAmount;
  let reqCurrency = req.body.requestedCurrency;
  let uniquePaymentId = shortid.generate();
  const mt = new MoneyTransfer({
    applicant_id: null,
    from_currency: null,
    to_currency: null,
    to_mobile: null,
    amount: null,
    currency_type: null,
    device_type: null
  });
  let account_type = await mt.getAccountType(req.params.applicant_id);
  if(account_type.length > 0 && account_type[0].account_type == "personal") {
    var uniquePaymentUrl2 = `${process.env.WEBADDRESS}/personal/request/${uniquePaymentId}/${reqCurrency}/${reqAmount}`
  } else if(account_type.length > 0 && account_type[0].account_type == "business") {
    var uniquePaymentUrl2 = `${process.env.WEBADDRESS}/business/request/${uniquePaymentId}/${reqCurrency}/${reqAmount}`
  }
  const responseObj = {
    uniquePaymentUrl2,
    uniquePaymentId
  }
  logger.info('request funds initialized');
  let { requestedFrom, requestedBy, requestedByEmail, requestedAmount, requestedCurrency } = req.body;
  let fromApplicantId = req.params.applicant_id;
  let element = await payment.getEmailId(fromApplicantId)
    if(element && element.length > 0) {
    let sender_email = element[0].user_id;
    let transaction_operation = 'REQUEST';
    let details = await payment.getBusinessDetails(req.params.applicant_id);
    if(details && details.length > 0) {
      requestedBy = details[0].business_legal_name;
    }
  const text = `Hi ${requestedFrom}.\n\n${requestedBy} has requested you to send them funds of ${requestedAmount} ${requestedCurrency}.\nUse this url to register ${uniquePaymentUrl2} to perform this transaction.\n\nThank you.`;
  try {
      await sendFundsRequestedMail(requestedByEmail, text)
      await mt.insertNonPayvooTransaction(uniquePaymentId,requestedFrom, requestedByEmail,requestedCurrency, 0, requestedAmount, requestedBy, sender_email, req.params.applicant_id, 0, transaction_operation)
      let from_account;
      //   requestPaymentsTransactons(requestedCurrency, req.params.applicant_id, requestedAmount).then(res => {
      let fromCurrencyRes = await mt.getFromCurrencyAccountno(requestedCurrency, fromApplicantId);
      console.log("fromCurrencyRes", fromCurrencyRes);
      if (fromCurrencyRes.length > 0) {
        from_account = fromCurrencyRes[0].account_no;
      //  let accountNoRes = await __getRecipientCurrencyAccount(receiverMobile, requestedCurrency, body, receiver_applicant_id);
    //  let recepientDetails = await mt.getRecipientDetailsByEmail(requestedByEmail);
   //   console.log("recepientDetails", recepientDetails);
   //   let recipientApplicantId = recepientDetails[0].applicant_id;             
   //   let receiverMobile = recepientDetails[0].mobile;
 //     let currencyAccount = await mt.getRecipientCurrencyAccount(receiverMobile,recipientApplicantId, requestedCurrency);
  //    if (currencyAccount && currencyAccount.length > 0) {
        //   let to_account = currencyAccount[0].account_no;
        //   let toApplicantid = currencyAccount[0].applicant_id;
        //   let ACCOUNT_TYPE = 'TRANSFER';
        //   let conn = await db.getConnObject();
        //   await __createTransaction(mt, from_account, to_account, toApplicantid, requestedAmount, requestedAmount, TRANSTYPE.DEBIT, transactionId, false, '', ACCOUNT_TYPE, conn)
        //   res.send(ResponseHelper.buildSuccessResponse({responseObj: responseObj}, langEngConfig.message.payment.requestFundsEmailSent, STATUS.SUCCESS));

        // }
      }
     res.send(ResponseHelper.buildSuccessResponse({uniquePaymentUrl2: uniquePaymentUrl2, uniquePaymentId: uniquePaymentId, requestedAmount: requestedAmount, requestedCurrency: requestedCurrency}, langEngConfig.message.payment.requestFundsEmailSent, STATUS.SUCCESS));
} catch {
      res.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.requestFundsEmailNotSent, STATUS.FAILED));
    
  }
} 
}

export const requestPaymentsTransactons = (to_account,fromApplicantId, fromAmount) => {
//  await conn.beginTransaction();
  logger.info('__deductAmount() called');
  console.log("!!!!")

  let fromCurrencyRes = newTransferReq.getFromCurrencyAccountno(fromCurrency, fromApplicantId);
  if (fromCurrencyRes.length > 0) {
    let from_account = fromCurrencyRes[0].account_no;
    let accountNoRes = __getRecipientCurrencyAccount(receiverMobile, toCurrency, body, receiver_applicant_id);

  //Money deduction from senders account
  let deductRes =__deductAmountRequestFunds(from_account, to_account, fromApplicantId, fromAmount, toAmount, deductAmnt, transactionId, description, ACCOUNT_TYPE, newTransferReq, conn, transaction_time);
  //If money deducted successfully
  if (deductRes.status == 0) {
    logger.info('__addbalance() called');                  
    let addbalRes = __addbalanceRequestFunds(from_account, to_account, toApplicantid, fromAmount, toAmount, transactionId, description, ACCOUNT_TYPE, newTransferReq, conn, transaction_time);
    //If money added successfully
    if (addbalRes.status == 0) {
      //commit the transaction and release the conn object
      conn.commit();
      conn.release();
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.trans_success, STATUS.SUCCESS);
    } else {
      //If money did not added into receipient account roolback the transaction
      conn.rollback();
      conn.release();
      return ResponseHelper.buildFailureResponse(langEngConfig.message.payment.trans_failed);
    }
  } else {
    return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.amount_deduction_fail, STATUS.FAILED);
  }
  } 
}

export const acceptRequestFunds = async (request, response) => {
  let transactionId = request.body.transaction_id;
  let requestedAmount = request.body.requestedAmount;
  let requestedCurrency = request.body.requestedCurrency;
  let counterparty = request.body.counterparty;
  let selectedFromCurreny = request.body.selectedFromCurreny ? request.body.selectedFromCurreny : requestedCurrency;
  let requestedByEmail = request.body.counterpartyEmail;
  let transaction_number = request.body.transaction_number;
  let transaction_time = request.body.transaction_time;
  const mt = new MoneyTransfer({
    applicant_id: null,
    from_currency: null,
    to_currency: null,
    to_mobile: null,
    amount: null,
    currency_type: null,
    device_type: null
  });
  
  let ACCOUNT_TYPE = "TRANSFER";
  let status = 2;
  let fromCurrencyRes = await mt.getFromCurrencyAccountno(requestedCurrency, request.params.applicant_id);
  let account_no;
      if (fromCurrencyRes && fromCurrencyRes.length > 0) {
      account_no = fromCurrencyRes[0].account_no;
      }
      let recepientDetails = await mt.getRecipientDetailsByEmail(requestedByEmail);
      let recipientApplicantId;
      let receiverMobile;
      console.log("recepientDetails", recepientDetails);
      if(recepientDetails && recepientDetails.length >0) {
      recipientApplicantId = recepientDetails[0].applicant_id;          
      receiverMobile = recepientDetails[0].mobile;
      }
      let result = await mt.getRequestedCurrencyType(transaction_number,recipientApplicantId);
      let requested_currency = requestedCurrency;
      if (result && result.length > 0) {
        requested_currency = result[0].requested_currency ? result[0].requested_currency : result[0].currency_type;
        requestedAmount = result[0].amount;
        if(result[0].transaction_operation == "CANCELLED") {
          ACCOUNT_TYPE = "CANCELLED";
          return response.send(ResponseHelper.buildSuccessResponse({transaction_status: 'CANCELLED'}, langEngConfig.message.payment.trans_cancelled, STATUS.FAILED));
        }
      }
      let currencyAccount = await mt.getRecipientCurrencyAccount(receiverMobile,recipientApplicantId, requested_currency);
      let to_account;
      console.log("currencyAccount", currencyAccount);
      if (currencyAccount && currencyAccount.length > 0) {
          to_account = currencyAccount[0].account_no;
      }
  // let minimumBal = await __checkminimumBalance(account_no, requestedAmount, mt);
  // if (minimumBal.status == 0) {
    let toAmount;
    let from_account_no = account_no;
    logger.info('__getExchangeAmount() called');
   // Get the respective exchange rate of from ammount
   toAmount = requestedAmount;
   if(requestedCurrency != selectedFromCurreny) {
  let exchangeRateRes = await commonCode.getcurrencyExchangeMuse(requestedCurrency, selectedFromCurreny);    
  console.log("exchangeRateRes", exchangeRateRes);
  if (exchangeRateRes.rate && exchangeRateRes.rate > 0) {
    toAmount = requestedAmount * exchangeRateRes.rate;
     console.log("toAmount33", toAmount);
   
  }
   let fromCurrencyRes = await mt.getFromCurrencyAccountno(selectedFromCurreny, request.params.applicant_id);
   
   if (fromCurrencyRes && fromCurrencyRes.length > 0) {
    from_account_no = fromCurrencyRes[0].account_no;
    }
    console.log("toAmount", toAmount);
   
  }
  console.log("from_account_no", from_account_no);
  let minimumBal_to = await __checkminimumBalance(from_account_no, toAmount, mt);
  console.log("minimumBal_to", minimumBal_to);
  if (minimumBal_to.status == 0) {
  let conn = await dbinst.getConnObject();
  if(conn) {
  let deductAmnt = minimumBal_to.balance - toAmount;
  let resultBalance = await mt.deductAmnt(from_account_no, deductAmnt, conn)
  let addAmntRes = await mt.addAmnt(requestedAmount, to_account, conn)
  if (resultBalance != 0 && addAmntRes !==0) {
    let transactiontype = 'DB' ;
//  await payment.updateCurrencyInAccounts(selectedFromCurreny,request.params.applicant_id, account_no)
  await payment.updateTransactions(selectedFromCurreny,toAmount,transactionId,status,transactiontype, ACCOUNT_TYPE, from_account_no, to_account, transaction_time);
  transactiontype = 'CR';
  let textMessage = `${requestedCurrency} ${requestedAmount} transferred to ${counterparty} via ${selectedFromCurreny} account`; 
  let  result = await payment.updateReceiveTransactions(transaction_number,status,transactiontype, ACCOUNT_TYPE, to_account, requested_currency, transaction_time);
  if(result){
   response.send(ResponseHelper.buildSuccessResponse({data: textMessage}, langEngConfig.message.payment.trans_success, STATUS.SUCCESS));
  }
}
  }
}else {
  response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.insufficient_balance, STATUS.FAILED));
}
   
// } else {
//   response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.insufficient_balance, STATUS.FAILED));
// }
      
}
export const __deductAmountRequestFunds = async (from_account, to_account, from_applicantId, requestedAmount, toAmount, requestedCurrency,requestedByEmail,  transactionId, desc,receiverMobile, ACCOUNT_TYPE, newTransfer, conn, request_currency, transaction_time, applicant_id) => {
  try {
   
      //creating the debit transaction record.
      await __createTransaction(newTransfer, from_account, to_account, from_applicantId, requestedAmount, requestedAmount,requestedCurrency,requestedByEmail, TRANSTYPE.DEBIT, transactionId, false, desc,receiverMobile, ACCOUNT_TYPE, conn, request_currency, transaction_time, applicant_id)
      return ({
        message: langEngConfig.message.payment.amount_deduction_success,
        status: STATUS.SUCCESS
      })
    
  } catch (err) {
    logger.error('Error occured ' + err);
    return (new Error(langEngConfig.message.error.ErrorHandler));

  }
}

export const __addbalanceRequestFunds = async (fromAccount, toAccount, applicantId, requestedAmount, toAmount,requestedCurrency,requestedByEmail, transactionId, desc,receiverMobile, ACCOUNT_TYPE, newTransfer, conn, request_currency, transaction_time, applicant_id) => {
  try {
    
      await __createTransaction(newTransfer, fromAccount, toAccount, applicantId, requestedAmount, requestedAmount,requestedCurrency,requestedByEmail, TRANSTYPE.CREDIT, transactionId, false, desc,receiverMobile, ACCOUNT_TYPE, conn, request_currency, transaction_time, applicant_id)
      return ({
        message: langEngConfig.message.payment.amount_addition_success,
        status: STATUS.SUCCESS
      });
    

  } catch (err) {
    conn.rollback();
    conn.release();
    logger.error('Error occured ' + err);
    return (new Error(langEngConfig.message.error.ErrorHandler));

  }

}


export const declineRequestFunds = async (request, response) => {
  let transactionId = request.body.transaction_id;
  let transactionNumber = request.body.transaction_number;
  let transaction_time = request.body.transaction_time;
  let { counterparty, counterpartyEmail, requestedAmount, requestedCurrency } = request.body;
  const text = `Hi ${counterparty}.\n\n Request of ${requestedAmount} ${requestedCurrency} has been declined.\n`;
  let transactiontype = 'DB'
  let status = 3;
  let ACCOUNT_TYPE;
  let results = await payment.getTransactionOperation(transactionNumber,transactionId); 
  if(results[0].transaction_operation == "CANCELLED") {
    ACCOUNT_TYPE = "CANCELLED";
    return response.send(ResponseHelper.buildSuccessResponse({transaction_status: 'CANCELLED'}, langEngConfig.message.payment.trans_cancelled, STATUS.FAILED));
  }
  let transaction_operation = 'DECLINED';
  let description = 'Declined';
  let result = await payment.updateRequestTransaction(status, transactiontype, transactionNumber, transaction_operation, description, transaction_time);
  transactiontype = 'CR';
 
  await payment.updateRequestTransaction(status, transactiontype, transactionNumber, transaction_operation, description, transaction_time);
  await sendFundsRequestedMail(counterpartyEmail, text)
  if(result) {
    response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.trans_declined, STATUS.SUCCESS));
  }
}


export const cancelRequestFunds = async (request, response) => {
  let transactionId = request.body.transaction_id;
  let transactionNumber = request.body.transaction_number;
   let transaction_time = request.body.transaction_time;
  let { counterparty, counterpartyEmail, requestedAmount, requestedCurrency } = request.body;
  const text = `Hi ${counterparty}.\n\n Request of ${requestedAmount} ${requestedCurrency} has been cancelled.\n`;
  let results = await payment.getTransactionOperation(transactionNumber,transactionId);
  let ACCOUNT_TYPE;
  if(results[0].transaction_operation == "DECLINED") {
    ACCOUNT_TYPE = "DECLINED";
    return response.send(ResponseHelper.buildSuccessResponse({transaction_status: 'DECLINED'}, langEngConfig.message.payment.trans_declined_already, STATUS.FAILED));
  }
  if(results[0].transaction_operation == "TRANSFER") {
    ACCOUNT_TYPE = "TRANSFER";
    return response.send(ResponseHelper.buildSuccessResponse({transaction_status: 'TRANSFER'}, langEngConfig.message.payment.trans_amount, STATUS.FAILED));
  }
  let description = 'Cancelled';
  let transactiontype = 'CR';
  let transaction_operation = 'CANCELLED'
  let status = 3;
  let result = await payment.updateRequestTransaction(status, transactiontype, transactionNumber, transaction_operation, description, transaction_time);
  transactiontype = 'DB'
  await payment.updateRequestTransaction(status, transactiontype, transactionNumber, transaction_operation, description, transaction_time);
  await sendFundsRequestedMail(counterpartyEmail, text)
  if(result) {
    response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.trans_cancelled, STATUS.SUCCESS));
 }
}