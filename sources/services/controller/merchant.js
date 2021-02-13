import {Merchant} from '../model/merchant';


import {langEngConfig} from '../utility/lang_eng';
import Cryptr from 'cryptr';
import {getcurrencyExchangeMuse} from '../controller/commonCode';
import { DbConnMgr } from '../dbconfig/dbconfig';
const db = DbConnMgr.getInstance();

var valid = require('card-validator');
import { Utils } from '../utility/utils';
const utils = new Utils();
const card = new Merchant();
const payment = new Merchant();

const merchant = new Merchant();
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
 * This function is used to check merchant gateway.
 * @method merchantGatewayCheck 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return 
 */
export const merchantGatewayCheck = (request,response)=>{
  const merchantDetails={
    memberId : request.body.memberId,
    apiKey : request.body.apiKey,
    amount:request.body.amount,
    currency : request.body.currency,
    successUrl : request.body.successUrl,
    failureUrl : request.body.failureUrl
 }

 
 merchant.getMerchantDetails(merchantDetails).then(merchant_result=>{
  try{
    if(merchant_result){
      let applicant_id = merchant_result[0].applicant_id;
      merchant.getByCurrency(applicant_id,merchantDetails.currency).then(accountDetails=>{
if(accountDetails[0].account_no){
  let order_id = Math.random().toString(36).substring(2,6) + Math.random().toString(36).substring(2,6);
  const encryptedString = cryptr.encrypt(order_id).toString();
  let redirectUrl = merchant_result[0].redirect_url + encryptedString;
  merchant.saveMerchantOrder(merchantDetails,applicant_id,order_id).then(ordersave_success=>{
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
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.Exception)));
  }
}).catch(err=>{
  response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
})

}


/**
 * This function is used to check merchant details.
 * @method merchantRedirectUrlDetails  
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return 
 */
export const merchantRedirectUrlDetails = (request,response)=>{
  try{
    let orderDetails=request.params.orderDetails;
    const orderId = cryptr.decrypt(orderDetails);
    merchant.getOrderDetails(orderId).then(result=>{
      
      if(result){
        merchant.getContactDetails(result[0].applicant_id).then(contactResponse=>{
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

/**
 * This function is used to get currency details.
 * @method getByCurrency 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return 
 */
export const getByCurrency = function (request, response) {
  logger.info('initiated');
  let applicantId = request.params.applicant_id;
  let currency = request.body.currency;
  merchant.getByCurrency(applicantId,currency)
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


/**
 * This function is used to get payment details.
 * @method payWithPayVoo 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return 
 */
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


  merchant.getCurrencyAccount(addMoneyData.applicant_id,addMoneyData.currency).then(accountResult=>{
    let accountsData = accountResult;
    if(accountsData){
      let walletBalance = accountResult[0].balance;
      
      if(walletBalance>=addMoneyData.amount){
        __walletToWalletTransfer(request, response)
        .then(transferRes => {
          logger.info('walletToWalletTransferInfo() execution completed');
          return transferRes
        })
      }
      else{
        let moneyToAdd = addMoneyData.amount-walletBalance;
        addMoneyData.amount = moneyToAdd;
        let paymentReqObj = addMoneyData;
        if (!isValidPaymentRequest(addMoneyData)) {
          logger.error('Payment details not valid ');        
          return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.invalidInput, STATUS.FAILED));
        }
        return _makeTransfer(paymentReqObj, request, response);



        
      }
      
    }
    else{
      response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.noAccountForCurrency, STATUS.FAILED))
    }

  })

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
let results  = await payment.getUserCardDetails(paymentReqObj.applicant_id, paymentReqObj.payment_cards_id, paymentReqObj.account_number);
    if (results.length > 0 && paymentReqObj.card_cvv == STATUS.DEFAULT_CVV) {
      logger.info('Successfully fetched getUserCardDetails()');
      let cardDecryptionDetails = await decryptedCardDetails(results[0].secret_number, results[0].card_month, results[0].card_year, results[0].encrypted_card, results[0].encrypted_key);
      let userInfo = prepareUserData(results[0], paymentReqObj.card_cvv, cardDecryptionDetails.card_number, cardDecryptionDetails.card_month, cardDecryptionDetails.card_year);
      userInfo.payments.ip = ip.address();
      let inputCurrency = (paymentReqObj.currency) ? paymentReqObj.currency : 'EUR';
      accountToCardValue(inputCurrency, req.body.amount).then(results => {
        logger.info('Converting account currency to card default currency');
        if (results.status == 1) {
          logger.info('Convertion done successfully');
          let cardAmount = results.amount;
          let paymentAmount = paymentReqObj.amount;
          let account_number = paymentReqObj.account_number;
          let transactionHolderName = `${userInfo.payments.givenName ? userInfo.payments.givenName : ""} ${userInfo.payments.surname ? userInfo.payments.surname : ""}`;
          userInfo.payments.amount = parseFloat(cardAmount).toFixed(2);  //card 
          userInfo.payments.orderDescriptor = paymentReqObj.orderDescriptor;
          userInfo.payments.tmpl_amount = parseFloat(cardAmount).toFixed(2); // card amount
          requestForPayments(userInfo, req).then(function (res1) {
            logger.info('Initiate request for make payment to museService');
            if (res1 && res1.body.status && res1.body.data.status == STATUS.SUCCESS) {
              let responseObj = preparePaymentsResponse(paymentReqObj.applicant_id, res1.body.data.data);
              if (!isNaN(responseObj.paymentId)) {
                payment.insertPayment(responseObj).then(results => {
                  logger.info('insertPayment() details done successfully');
                  if (results.status == 1) {
                    results.transactionInfo = JSON.parse(responseObj.result)
                    results.payStatus = 'fail';
                    if (results.transactionInfo.code == STATUS.PAYMENT_SUCCESS) {
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
                            __walletToWalletTransfer(req,res)
                            .then(transferRes => {
                              logger.info('walletToWalletTransferInfo() execution completed');
                              return transferRes
                            })
                           // res.send(ResponseHelper.buildSuccessResponse(results,/* langEngConfig.message.payment.successPayment */results.message, STATUS.SUCCESS))
                          }
                          else {
                            logger.debug('Transaction details captured failure');
                            results.status = STATUS.FAILED;
                            results.payStatus = 'fail';
                            results.message = 'Fail to capture walet amount / transation status';
                          }
                        }).catch(r => {
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
                console.log(res1,'sssss')
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
            console.log(err)
            logger.error('Some thing went wrong , service side ');
            res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.internalError)))
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
    logger.error('Some thing went wrong , fetching user card details');
    res.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.payment.card_fail)))
  }
}



/**
 * @desc This function is used to decrypyt card details 
 * @method decryptedCardDetails 
 * @param {Object}  req - It is Request object
 * @param {Object}  res - It is Response object
 */
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





function prepareUserData(paymentObj, card_cvv, card_number, card_month, card_year) {

  let birthDate = (paymentObj.dob)//.toISOString().slice(0, 10);
  return {
    "payments": {

      "currency": paymentObj.currency,
      "country": paymentObj.country_name,
      "city": paymentObj.city,
      "state": paymentObj.region,
      "street1": paymentObj.address_line1,
      "phone": paymentObj.mobile,
      "email": paymentObj.email,
      "givenName": paymentObj.first_name,
      "surname": paymentObj.last_name,
      "telnocc": paymentObj.telnocc,
      "postcode": paymentObj.postal_code,
      "birthDate": birthDate.split('-').join(''),
      "number": card_number,//paymentObj.card_number,
      "expiryMonth": card_month, //paymentObj.card_month,
      "expiryYear": card_year, // paymentObj.card_year,
      "cvv": card_cvv,//paymentObj.card_cvv,
      "paymentBrand": paymentObj.name_on_card,
      "paymentMode": "CC",
      "paymentType": "DB",//paymentObj.card_type,
      "tmpl_currency": paymentObj.currency,
      "recurringType": "",
      "createRegistration": "true",
      //"customerId": paymentObj.applicant_id
    }
  }
}


/**
 * @desc This function is used to get card details 
 * @method accountToCardValue
 * @param {Object}  req - It is Request object
 * @param {Object}  res - It is Response object
 */
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


/**
 * @desc This function is used to get payment details 
 * @method requestForPayments
 * @param {Object}  req - It is Request object
 * @param {Object}  res - It is Response object
 */
var requestForPayments = function (userInfo, req) {
  return new Promise((resolve, reject) => {
    request({
      method: 'post',
      headers: { "accept": "application/json", "authorization": req.headers["authorization"], "member_id": req.headers["member_id"], "api_access_key": req.headers["api_access_key"], "client_auth": req.headers["client_auth"] },
      url: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/PAYMENT/payment_paymentz/paymentz`,
      body: userInfo,
      json: true,
    }, function (err, res1) {
      if (res1) {
        resolve(res1)
      } else {
        reject(err)
      }
    })
  });
}



function preparePaymentsResponse(applicant_id, paymentsResponse) {
  let paymentsInfo = {};
  paymentsInfo.applicant_id = parseInt(applicant_id)
  paymentsInfo.paymentId = (typeof paymentsResponse.paymentId === "undefined") ? "" : parseInt(paymentsResponse.paymentId)
  paymentsInfo.status = (typeof paymentsResponse.status === "undefined") ? "" : paymentsResponse.status
  paymentsInfo.paymentBrand = (typeof paymentsResponse.paymentBrand === "undefined") ? "" : paymentsResponse.paymentBrand
  paymentsInfo.paymentMode = (typeof paymentsResponse.paymentMode === "undefined") ? "" : paymentsResponse.paymentMode
  paymentsInfo.firstName = (typeof paymentsResponse.firstName === "undefined") ? "" : paymentsResponse.firstName
  paymentsInfo.lastName = (typeof paymentsResponse.lastName === "undefined") ? "" : paymentsResponse.lastName
  paymentsInfo.amount = (typeof paymentsResponse.amount === "undefined") ? "" : parseFloat(paymentsResponse.amount)
  paymentsInfo.currency = (typeof paymentsResponse.currency === "undefined") ? "" : paymentsResponse.currency
  paymentsInfo.descriptor = (typeof paymentsResponse.descriptor === "undefined") ? "" : paymentsResponse.descriptor
  paymentsInfo.result = (typeof paymentsResponse.result === "undefined") ? "" : JSON.stringify(paymentsResponse.result)
  paymentsInfo.card = (typeof paymentsResponse.card === "undefined") ? "" : JSON.stringify(paymentsResponse.card)
  paymentsInfo.customer = (typeof paymentsResponse.customer === "undefined") ? "" : JSON.stringify(paymentsResponse.customer)
  paymentsInfo.transaction_details = JSON.stringify(paymentsResponse)
  paymentsInfo.timestamp = (typeof paymentsResponse.timestamp === "undefined") ? "" : paymentsResponse.timestamp
  paymentsInfo.merchantTransactionId = (typeof paymentsResponse.merchantTransactionId === "undefined") ? "" : paymentsResponse.merchantTransactionId
  paymentsInfo.remark = (typeof paymentsResponse.remark === "undefined") ? "" : paymentsResponse.remark
  paymentsInfo.transactionStatus = (typeof paymentsResponse.transactionStatus === "undefined") ? "" : paymentsResponse.transactionStatus
  paymentsInfo.tmpl_amount = (typeof paymentsResponse.tmpl_amount === "undefined") ? "" : paymentsResponse.tmpl_amount
  paymentsInfo.tmpl_currency = (typeof paymentsResponse.tmpl_currency === "undefined") ? "" : paymentsResponse.tmpl_currency
  paymentsInfo.eci = (typeof paymentsResponse.eci === "undefined") ? "" : paymentsResponse.eci
  paymentsInfo.checksum = (typeof paymentsResponse.checksum === "undefined") ? "" : paymentsResponse.checksum
  paymentsInfo.orderDescription = (typeof paymentsResponse.orderDescription === "undefined") ? "" : paymentsResponse.orderDescription
  paymentsInfo.companyName = (typeof paymentsResponse.companyName === "undefined") ? "" : paymentsResponse.companyName
  paymentsInfo.merchantContact = (typeof paymentsResponse.merchantContact === "undefined") ? "" : paymentsResponse.merchantContact
  return paymentsInfo;
}







































































































/**
 * @desc This function is used to get payment details 
 * @method walletToWalletTransfer
 * @param {Object}  req - It is Request object
 * @param {Object}  res - It is Response object
 */

const __walletToWalletTransfer = async (request, response ) => {
  logger.info('walletToWalletTransfer() initiated');
  const newTransferReq = new Merchant();
  let newTransfer = {
    "applicant_id" : request.params.applicant_id,
		"from_currency" : request.body.from_currency,
		"to_currency" : request.body.to_currency,
		"to_mobile" : request.body.to_mobile,
		"amount" : request.body.amount,
		"currency_type" : request.body.currency_type,
		"device_type" : request.body.device_type
  }

  let fromApplicantId = request.params.applicant_id;
  let fromCurrency = request.body.from_currency;
  let toCurrency = request.body.to_currency;
  let fromAmount = request.body.amount;
  let receiverMobile = request.body.to_mobile;
  let transactionId = utils.generateTransNum();
  
  try {
    logger.info('isValidMoneyTransferRequest() called');
    //Checking the money tranfer request is valid or not.
    const isValidReq = await utils.isValidMoneyTransferRequest(newTransfer);
    if (isValidReq.status) {
      //Get the account number from which amount will be deduct.
      logger.info('getFromCurrencyAccountno() called');
      let fromCurrencyRes = await newTransferReq.getFromCurrencyAccountno(fromCurrency, fromApplicantId);
      if (fromCurrencyRes.length > 0) {
        let from_account = fromCurrencyRes[0].account_no;
        logger.info('__getRecipientCurrencyAccount() called');
        //Get the account number to which amount will be credit.
        let accountNoRes = await __getRecipientCurrencyAccount(receiverMobile, toCurrency, newTransferReq);
        //If receipient account found     
        if (accountNoRes.account_no) {
          let to_account = accountNoRes.account_no;
          let toApplicantid = accountNoRes.applicant_id;
          logger.info('checkMunimumBalance() called');
          //Checking minimum balance before deducting 
          let minimunBal = await __checkminimumBalance(from_account, fromAmount, newTransferReq);
          //IF sender has the sufficient balance      
          if (minimunBal.status == 0) {
            logger.info('__getExchangeAmount() called');
            //Get the respective exchange rate of from ammount
            let exchangeRateRes = await __getExchangeAmount(fromCurrency, toCurrency, fromAmount);
            let toAmount = exchangeRateRes.exchangeAmount;
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
              //response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.InvalidTransaction)

              response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.moneyTransfer.errorConnObj, STATUS.FAILURE));
            }

          } else {
          
           // response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.InvalidAmount)
 
            response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.insufficient_balance, STATUS.FAILURE));
          }
        } else {
         // response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.NoMerchant)

          response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.moneyTransfer.no_account_found, STATUS.FAILURE));
        }
      } else {
        //response.redirect(redirectUrls.failureUrl+'/'+transactionCodes.codes.NoMerchant)

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

const __getRecipientCurrencyAccount = async (toMobile, toCurrency, newTransferReq) => {
  try {
    logger.info('getRecipientCurrencyAccount() initiated');
    let currencyAccount = await newTransferReq.getRecipientCurrencyAccount(toMobile, toCurrency)
    logger.info('getRecipientCurrencyAccount() execution completed.');
    return ({ account_no: currencyAccount[0].account_no, applicant_id: currencyAccount[0].applicant_id });
  }
  catch (err) {
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
 * @method getExchangeAmount
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
    if (result != 0) {
      //creating the debit transaction record.
     let transactionDetails= await __createTransaction(newTransfer, fromAccount, toAccount, applicantId, amount, toAmount, TRANSTYPE.DEBIT, transactionId, false, conn)
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



const isValidPaymentRequest=(validatePaymentData1)=> {


  if (validatePaymentData1.amount && validatePaymentData1.account_number && validatePaymentData1.orderDescriptor && validatePaymentData1.applicant_id && validatePaymentData1.payment_cards_id && validatePaymentData1.card_cvv) {
    return true;
  }
  return false;
}



/**
 * This function is used to get transaction details
 * @method __ getTransactions
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return 
 */
export const getTransactions = (request,response)=>{
  let applicant_id = request.params.applicant_id;
  merchant.getTransactions(applicant_id).then(transactionsResponse=>{
    if(transactionsResponse){
      response.send(ResponseHelper.buildSuccessResponse(transactionsResponse, langEngConfig.message.payment.transactionSuccess, STATUS.SUCCESS))
    }
    else{
      response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.noTransactions, STATUS.SUCCESS))
    }
  })
}

