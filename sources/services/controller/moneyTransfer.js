/**
 * moneyTransfer
 * This controller contains all the method required to perform a successfull money transfer from one
 * currency account to another currency account for both individual user as weel as with in two 
 * different users.
 * @package moneyTransfer
 * @subpackage controller/moneyTransfer
 * @author SEPA Cyber Technologies Sekhara Suman Sahu
 */
import {
  MoneyTransfer
} from '../model/moneyTransfer';
import {
  ScheduleTransfer
} from '../model/scheduleTransfer';
import {
  langEngConfig
} from '../utility/lang_eng';
import {
  Utils
} from '../utility/utils';
import {
  DbConnMgr
} from '../dbconfig/dbconfig';
import {
  sendMoneyTransStatus,
  sendGenericTextEmail
} from '../mailer/mail';
import {
  Account
} from '../model/account';
import {
  Beneficiary
} from '../model/counterParty';
import { sendOtp } from './museCommManager';
import { Payment } from '../model/payment';
import { UserModel } from '../model/signUp';
import { __deductAmountRequestFunds, __addbalanceRequestFunds } from '../controller/payments';
import { timeConvert } from '../utility/validate';
import { sendIos } from './iosPushNotification';
import { sendAndriod } from './andriodPushNotifications';


var commonCode = require("../controller/commonCode");




let st = new ScheduleTransfer();

let request = require('request-promise');
let timeZone = require('timezone-support');
const moment = require('moment-timezone')
let london = timeZone.findTimeZone('Europe/London')
let format = require('string-format');
let dateFormat = require('dateformat');
const shortid = require('shortid');

const db = DbConnMgr.getInstance();
let utils = new Utils();
let account = new Account();
const payment = new Payment();
const userModel = new UserModel()

const STATUS = {
  SUCCESS: 0,
  FAILURE: 1
}

const TRANSTYPE = {
  DEBIT: 'DB',
  CREDIT: "CR"
}

let CURRENCY_SYMB = {
  FROM_CURR: '',
  TO_CURR: ''
}

const isScheduledTrans = {
  TRUE: 1,
  FALSE: 0,
}

const isBulkTrans = {
  TRUE: 1,
  FALSE: 0
}

/**
 * @desc method is to perform money transfer form one account to another account 
 * @method moneyTransfer
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns status message and status code
 **/

export const moneyTransfer = (request, response) => { 
  logger.info('walletToWalletTransferInfo() called');
  let senderId = request.params.applicant_id;
  let debitCurrency = request.body.from_currency;
  let creditCurrency = request.body.to_currency;
  let deductAmt = request.body.amount;
  let receipientMobile = request.body.to_mobile ? request.body.to_mobile : request.body.email;
  request.body['applicant_id'] = senderId;

  __walletToWalletTransfer(senderId, debitCurrency, creditCurrency, deductAmt, receipientMobile, '', isBulkTrans.FALSE, request.body, undefined)
    .then(transferRes => {
      logger.info('walletToWalletTransferInfo() execution completed');
      response.send(transferRes);
    }).catch(err => {
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.internalError)));
    })
}


/**
 * @desc Private method for performing wallet to eallet transfers.
 * @method __walletToWalletTransfer
 * @param {int} applicantId -- it is int value of unique id of an user.
 * @param {string} debitCurrency --it is currency code of currency.
 * @param {string} creditCurrency --it is currency code of currency.
 * @param {decimal} deductAmt --it is currency amount to be perform transactions.
 * @param {string} receipientMobile --it is the mobile number of receipient user.
 * @param {string} desc --it is currency amount to be perform transactions.
 * @param {boolean} isbulkTrans --it is a boolean value to check wheather request is for bulk transfer.
 * @param {object} body --it is the request body object.
 * @return returns status message and status code
 **/

const __walletToWalletTransfer = async (senderId, debitCurrency, creditCurrency, deductAmt, receipientMobile, desc, isbulkTrans, body, receiver_email) => {
  logger.info('walletToWalletTransfer() initiated');
  let newTransferReq = new MoneyTransfer(body);
  let fromApplicantId = senderId;
  let fromCurrency = debitCurrency;
  let toCurrency = creditCurrency;
  let fromAmount = deductAmt;
  let receiverMobile = receipientMobile;
  let receiver_applicant_id = newTransferReq.applicant_id ? newTransferReq.applicant_id : newTransferReq.receiver_applicant_id;
  let transactionId = utils.generateTransNum();
  let description = (isbulkTrans) ? desc : '';
  let receiverAccountType = newTransferReq.account_type;
  let transaction_time = newTransferReq.transaction_time;

  //Intializing CURRENCY_SYMB
  CURRENCY_SYMB.FROM_CURR = fromCurrency;
  CURRENCY_SYMB.TO_CURR = toCurrency;

  try {

    logger.info('isValidMoneyTransferRequest() called');
    
    // 1. Checking the money tranfer request is valid or not.
    const isValidReq = await utils.isValidMoneyTransferRequest(newTransferReq);

    // 2. If  invalid then send failed response
    if (isValidReq.status == false) {
      return ResponseHelper.buildSuccessResponse({
        isValidReq
      }, langEngConfig.message.moneyTransfer.req_objerr, STATUS.FAILURE);
    }

  
    // 3. Get the account number from which amount will be deduct.
    logger.info('Get the account details for sender [ applicantId '+fromApplicantId+' ]');
    let fromCurrencyRes = await newTransferReq.getFromCurrencyAccountno(fromCurrency, fromApplicantId);
    if (fromCurrencyRes.length <= 0) {
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.moneyTransfer.senderCurrenyAccNotFound, STATUS.FAILURE);
    }
    
    let from_account = fromCurrencyRes[0].account_no;
    
    // 4. Get the account number to which amount will be credit.
    logger.info('Get the account details for reciever [ applicantId '+receiver_applicant_id+' ]');
    try {
      let accountNoRes = await __getRecipientCurrencyAccount(receiverMobile, toCurrency, body, receiver_applicant_id);
      console.log("accountNoRes", accountNoRes);
      let recepientDetails;
     
      
      // 5. If receipient account is NOT found, create account
      if (accountNoRes == undefined || accountNoRes == null || accountNoRes.length == 0) {
        let recipientApplicantIdData = await newTransferReq.getRecipientApplicantID(receiverMobile);
        let recipientApplicantId;
        if (recipientApplicantIdData.length > 0) {
              recipientApplicantId = recipientApplicantIdData[0].applicant_id;
              receiverAccountType = recipientApplicantIdData[0].account_type;
        }
        
        if (recipientApplicantIdData.length == 0) {
              recepientDetails = await newTransferReq.getRecipientDetailsByEmail(receiver_email);
              recipientApplicantId = recepientDetails[0].applicant_id;             
              receiverMobile = recepientDetails[0].mobile;
              receiverAccountType = recepientDetails[0].account_type;
        }

        receiver_applicant_id = receiver_applicant_id ? receiver_applicant_id : recipientApplicantId;
        accountNoRes = await __getRecipientCurrencyAccount(receiverMobile, toCurrency, body, receiver_applicant_id);            
        if (accountNoRes == undefined || accountNoRes == null || accountNoRes.length == 0) {
          console.log("receiver_applicant_id", receiver_applicant_id);
          console.log("recipientApplicantId", recipientApplicantId);          
              await account.createCurrencyAccount(toCurrency, receiver_applicant_id);
        }
        
        accountNoRes = await __getRecipientCurrencyAccount(receiverMobile, toCurrency, body, receiver_applicant_id);
      }
      
      if (accountNoRes && accountNoRes.length > 0) {
        
        let to_account = accountNoRes[0].account_no;
        let toApplicantid = accountNoRes[0].applicant_id;
        receiverAccountType = accountNoRes[0].account_type;
        
        // 6. If sender and receipient applicnat_id is same. ACCOUNT_TYPE is WALLET
        let ACCOUNT_TYPE = 'TRANSFER';
        if (fromApplicantId == toApplicantid) {
          ACCOUNT_TYPE = 'WALLET';
        }
        
        logger.info('checkMunimumBalance() called');
        
        // 7. Checking minimum balance before deducting 
        let minimumBal = await __checkminimumBalance(from_account, fromAmount, newTransferReq);

        if (minimumBal.status != 0 ) {
          return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.insufficient_balance, STATUS.FAILURE);
        }
       
        logger.info('__getExchangeAmount() called');
          
        // Get the respective exchange rate of from ammount
        // let exchangeRateRes = await __getExchangeAmount(fromCurrency, toCurrency, fromAmount);
        let exchangeRateRes;
        let toAmount = fromAmount;
        if(ACCOUNT_TYPE == 'TRANSFER' && toCurrency != fromCurrency) {
          exchangeRateRes = await commonCode.getcurrencyExchangeMuse(toCurrency, fromCurrency);
          if (exchangeRateRes.rate && exchangeRateRes.rate > 0) {
            fromAmount = toAmount * exchangeRateRes.rate;
            newTransferReq.amount = fromAmount;
          }
        } else {
          exchangeRateRes = await commonCode.getcurrencyExchangeMuse(fromCurrency, toCurrency);
          if (exchangeRateRes.rate && exchangeRateRes.rate > 0) {
            toAmount = fromAmount * exchangeRateRes.rate;
          }
        }

        // Account balance after deduction of money from senders account
        let deductAmnt = minimumBal.balance - newTransferReq.amount; 
        
        // Get a single connection object from connection pool to perform 
        let conn = await db.getConnObject();
        
        // If we get a conn object
        if (conn) {
          
          // Begin the transaction
          await conn.beginTransaction();
          logger.info('__deductAmount() called');
          
          // Money deduction from senders account
          let deductRes = await __deductAmount(from_account, to_account, fromApplicantId, fromAmount, toAmount, deductAmnt, transactionId, description, ACCOUNT_TYPE, newTransferReq,receiver_applicant_id, conn, transaction_time);
          
          // If money deducted successfully
          if (deductRes.status == 0) {
            logger.info('__addbalance() called');                  
            let addbalRes = await __addbalance(from_account, to_account, toApplicantid, fromAmount, toAmount, transactionId, description, ACCOUNT_TYPE, newTransferReq,fromApplicantId, conn, transaction_time);
            
            // If money added successfully
            if (addbalRes.status == 0) {
              
              // Commit the transaction and release the conn object
              conn.commit();
              conn.release();

              // Send Push Notification
              console.log("****** Reciever Applicant Id"+receiver_applicant_id)
              if(ACCOUNT_TYPE != "WALLET") {
              let deviceInfo = await newTransferReq.getDeviceInfoForApplicantID(receiver_applicant_id);
              console.log("****** DeviceInfo"+JSON.stringify(deviceInfo))
              
              if (deviceInfo && deviceInfo.length > 0 && deviceInfo[0].devicetoken) {

                console.log("Device info exists")
                  userModel.getApplicantContact(fromApplicantId).then(contact => {

                    console.log("***** getApplicantContact"+JSON.stringify(contact))

                    let notificationMsg = "You have received "+toCurrency+" " +toAmount +" from "+contact[0].fullName 
                    console.log("**** Sending the notification to iOS", receiverAccountType)
                    if (deviceInfo[0].devicetype == 1) {
                        console.log("**** Sending the notification to iOS")
 
                        sendIos(deviceInfo[0].devicetoken,notificationMsg,receiverAccountType).then(mobileNotificationResult => {
                        console.log("**** Mobile notification success to iOS ***"+ JSON.stringify(mobileNotificationResult))
                      });
                    } else if (deviceInfo[0].devicetype == 2) {
                      console.log("**** Sending the notification to Andriod")
                      sendAndriod(deviceInfo[0].devicetoken,notificationMsg).then(mobileNotificationResult => {
                        console.log("**** Mobile notification success to Andriod  ***"+ JSON.stringify(mobileNotificationResult))
                      });

                    }
                    
                      });
             }
            }
              return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.trans_success, STATUS.SUCCESS);
            } else {
              // If money did not added into receipient account roolback the transaction
              conn.rollback();
              conn.release();
              return ResponseHelper.buildFailureResponse(langEngConfig.message.payment.trans_failed);
            }
          } else {
                  return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.amount_deduction_fail, STATUS.FAILURE);
                }
        } else {
                return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.moneyTransfer.errorConnObj, STATUS.FAILURE);
              }

      } else {
            return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.moneyTransfer.no_account_found, STATUS.FAILURE);

          }
    } catch (error) {
          return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.moneyTransfer.no_account_found));
    }
  } catch (err) {
    logger.error('Error occured ' + err);
    return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler));
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
 * @desc Method for deducting balance from account
 * @method __deductAmount
 * @param {number} fromAccount -- it is the from account number where money will be debited.
 * @param {number} toAccount --it is deduct account number where money will be credited.  
 * @param {number} deductBalance --it is a numeric value after deducting the money from an account. 
 * @param {number} transactionId --it is an unique transaction id.
 * @param {object} newTransfer --it is newTransfer object
 * @param {object} conn --it is connection object
 * @return returns status message and status code
 **/
const __deductAmount = async (fromAccount, toAccount, applicantId, amount, toAmount, deductBalance, transactionId, desc, ACCOUNT_TYPE, newTransfer,receiver_applicant_id, conn, transaction_time) => {
  try {
    let result = await newTransfer.deductAmnt(fromAccount, deductBalance, conn)
    if (result != 0) {
      //creating the debit transaction record.
      await __createTransaction(newTransfer, fromAccount, toAccount, applicantId, amount, toAmount, TRANSTYPE.DEBIT, transactionId, false, desc, ACCOUNT_TYPE,receiver_applicant_id, conn, transaction_time)
      return ({
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
  } catch (err) {
    logger.error('Error occured ' + err);
    return (new Error(langEngConfig.message.error.ErrorHandler));

  }
}

/**
 * @desc Method for adding money in receipient account
 * @method __addbalance
 * @param {number} toAmnt -- it is to amount 
 * @param {number} toAccount --it is to account 
 * @param {number} transactionId --it is transaction id 
 * @param {object} newTransfer --it is newTransfer object
 * @param {object} conn --it is conn object
 * @return returns status message and status code
 **/
const __addbalance = async (fromAccount, toAccount, applicantId, amount, toAmount, transactionId, desc, ACCOUNT_TYPE, newTransfer,fromApplicantId, conn, transaction_time) => {
  try {
    let addAmntRes = await newTransfer.addAmnt(toAmount, toAccount, conn)
    if (addAmntRes) {
      await __createTransaction(newTransfer, fromAccount, toAccount, applicantId, amount, toAmount, TRANSTYPE.CREDIT, transactionId, true, desc, ACCOUNT_TYPE,fromApplicantId, conn, transaction_time)
      return ({
        message: langEngConfig.message.payment.amount_addition_success,
        status: STATUS.SUCCESS
      });
    }

  } catch (err) {
    conn.rollback();
    conn.release();
    logger.error('Error occured ' + err);
    return (new Error(langEngConfig.message.error.ErrorHandler));

  }

}

/**
 * @desc Method for getting foreign currency exchanged amount
 * @method __getExchangeAmount
 * @param {string} fromCurrency  - it is the currency code.
 * @param {string} toCurrency -  it is the currency code.
 * @param {decimal} amount -  it is the currency amount.
 * @return returns applicant id
 **/
const __getExchangeAmount = async (fromCurrency, toCurrency, amount) => {
  //Need make a RESt call to muse to get exchange amounts
  let option = {
    uri: `http://` + process.env.GATEWAY_URL + ':' + process.env.GATEWAY_PORT + `/FIXER/currency/convert`,
    method: 'POST',
    json: true,
    body: {
      "result": {
        "fromCurrency": fromCurrency,
        "toCurrency": toCurrency,
        "amount": amount
      }
    },
    headers: {
      authorization: 'bearer ' + jwt.sign({
        email: process.env.MAIL_USER
      }, process.env.PASSWORD_CONFIG), //'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNla2hhcmFzYWh1QGdtYWlsLmNvbSIsImlhdCI6MTU3NTcwMzcyMX0.m1SU0dq00TVP4XCHF2ZiL-okeGcvXm718AGt2OM2O_E',
      client_auth: jwt.sign({
        email: process.env.MAIL_USER
      }, process.env.PASSWORD_CONFIG1),
      //'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNla2hhcmFzYWh1QGdtYWlsLmNvbSIsImlhdCI6MTU3NTcwMzcyMSwiZXhwIjoxNTc1NzA1NTIxfQ.9cqlaIaRYGOSHVJY1Xgjhf1U0w-2D9XVHQpU9THnLeA',
      member_id: process.env.CLIENT_ID, //'z5a1ee0',
      api_access_key: process.env.API_KEY, //'FVT09YZ-WMW4MX7-QWNYCMJ-QFK5G4E',
      'x-auth-token': uuidv1() + Math.floor(new Date() / 1000), //'317df890-18c3-11ea-b312-9fd5be029c821575703721',
    }
  }

  try {
    logger.info('Exchange amont mathod called')
    let exchgAmt = await request(option);
    return exchgAmt.data.result;
  } catch (err) {
    logger.error('Error occured :' + err);
    return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.moneyTransfer.exchangeError, STATUS.FAILURE);
  }
}

/**
 * @desc Method for getting receiver's applicant_id
 * @method getRecipientCurrencyAccount
 * @param {receipientApplicantId} - it is the applicant id of receipient.
 * @param {toCurrency} - it is the to currency account of receipient.
 * @param {toCurrency} - it is the to currency account of receipient.
 * @return returns applicant id
 **/

const __getRecipientCurrencyAccount = async (toMobile, toCurrency, body, applicant_id) => {
  let newTransferReq = new MoneyTransfer(body);
  try {
    logger.info('getRecipientCurrencyAccount() initiated');   
    let currencyAccount = await newTransferReq.getRecipientCurrencyAccount(toMobile,applicant_id, toCurrency);
    logger.info('getRecipientCurrencyAccount() execution completed.');    
      return currencyAccount;
  } catch (err) {
    logger.error('Error occured ' + err);
    return new Error(langEngConfig.message.error.ErrorHandler)
  }

}

const __walletToWalletTransferCsv = async (senderId, debitCurrency, creditCurrency, deductAmt, receipientMobile, desc, isbulkTrans, body,transaction_time, receiver_email) => {
  logger.info('walletToWalletTransferCSV() initiated');
  let newTransferReq = new MoneyTransfer(body);
  let fromApplicantId = senderId;
  let fromCurrency = debitCurrency;
  let toCurrency = creditCurrency;
  let toAmount = deductAmt;
  let receiverMobile = receipientMobile;
  let receiver_applicant_id = newTransferReq.applicant_id ? newTransferReq.applicant_id : newTransferReq.receiver_applicant_id;
  let transactionId = utils.generateTransNum();
  let description = (isbulkTrans) ? desc : '';

  //Intializing CURRENCY_SYMB
  CURRENCY_SYMB.FROM_CURR = fromCurrency;
  CURRENCY_SYMB.TO_CURR = toCurrency;

  try {
    logger.info('isValidMoneyTransferRequest() called');
    //Checking the money tranfer request is valid or not.
    const isValidReq = await utils.isValidMoneyTransferRequest(newTransferReq);
    if (isValidReq.status) {
      //Get the account number from which amount will be deduct.
      logger.info('getFromCurrencyAccountno() called');
      let fromCurrencyRes = await newTransferReq.getFromCurrencyAccountno(fromCurrency, fromApplicantId);

      if (fromCurrencyRes.length > 0) {
        let from_account = fromCurrencyRes[0].account_no;
        logger.info('__getRecipientCurrencyAccount() called');
        //Get the account number to which amount will be credit.
        try {
          console.log("receiver_applicant_id", receiver_applicant_id);
          let accountNoRes = await __getRecipientCurrencyAccount(receiverMobile, toCurrency, body, receiver_applicant_id);
          console.log("accountNoRes", accountNoRes);
          let recepientDetails;
          //If receipient account is NOT found, create account
          if (accountNoRes == undefined || accountNoRes == null || accountNoRes.length == 0) {
            let recipientApplicantIdData = await newTransferReq.getRecipientApplicantID(receiverMobile);
            let recipientApplicantId;
            if (recipientApplicantIdData.length > 0) {
              recipientApplicantId = recipientApplicantIdData[0].applicant_id;
            }
            if (recipientApplicantIdData.length == 0) {
              recepientDetails = await newTransferReq.getRecipientDetailsByEmail(receiver_email);
              recipientApplicantId = recepientDetails[0].applicant_id;             
              receiverMobile = recepientDetails[0].mobile;
            }
            receiver_applicant_id = receiver_applicant_id ? receiver_applicant_id : recipientApplicantId;
            accountNoRes = await __getRecipientCurrencyAccount(receiverMobile, toCurrency, body, receiver_applicant_id);            
            if (accountNoRes == undefined || accountNoRes == null || accountNoRes.length == 0) {             
              await account.createCurrencyAccount(toCurrency, recipientApplicantId);
            }
            accountNoRes = await __getRecipientCurrencyAccount(receiverMobile, toCurrency, body, receiver_applicant_id);
          }
          if (accountNoRes && accountNoRes.length > 0) {
            let to_account = accountNoRes[0].account_no;
            let toApplicantid = accountNoRes[0].applicant_id;
            //If sender and receipient applicnat_id is same. ACCOUNT_TYPE is WALLET
            let ACCOUNT_TYPE = 'TRANSFER';
            if (fromApplicantId == toApplicantid) {
              ACCOUNT_TYPE = 'WALLET';
            }
            logger.info('checkMunimumBalance() called');
        
            // 7. Checking minimum balance before deducting 
            let minimumBal = await __checkminimumBalance(from_account, toAmount, newTransferReq);
    
            if (minimumBal.status != 0 ) {
              return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.insufficient_balance, STATUS.FAILURE);
            }
            logger.info('__getExchangeAmount() called');
            let exchangeRateRes;
            let fromAmount = toAmount;
              exchangeRateRes = await commonCode.getcurrencyExchangeMuse(toCurrency, fromCurrency);
              if (exchangeRateRes.rate && exchangeRateRes.rate > 0) {
                fromAmount = toAmount * exchangeRateRes.rate;
              }
           
            
            //Get the respective exchange rate of from ammount
            // let exchangeRateRes = await __getExchangeAmount(fromCurrency, toCurrency, fromAmount);
          //   let exchangeRateRes = await commonCode.getcurrencyExchangeMuse(toCurrency, fromCurrency);
          //  console.log("exchangeRateRes", exchangeRateRes);
          //   if (exchangeRateRes.rate && exchangeRateRes.rate > 0) {
          //     fromAmount = toAmount * exchangeRateRes.rate;
          //   }
          //   logger.info('checkMunimumBalance() called');
          //   //Checking minimum balance before deducting 
          //   let minimumBal = await __checkminimumBalance(from_account, fromAmount, newTransferReq);
            //IF sender has the sufficient balance
           // if (minimumBal.status == 0) {             
              //Account balance after deduction of money from senders account
              let deductAmount = minimumBal.balance - fromAmount;
              //Get a single connection object from connection pool to perform 
              let conn = await db.getConnObject();
              //If we get a conn object
              if (conn) {
                //Begin the transaction
                await conn.beginTransaction();
                logger.info('__deductAmount() called');
                //Money deduction from senders account
                let deductRes = await __deductAmount(from_account, to_account, fromApplicantId,fromAmount, toAmount, deductAmount, transactionId, description, ACCOUNT_TYPE, newTransferReq,receiver_applicant_id, conn, transaction_time);
                //If money deducted successfully
                if (deductRes.status == 0) {
                  logger.info('__addbalance() called');                  
                  let addbalRes = await __addbalance(from_account, to_account, toApplicantid, fromAmount, toAmount, transactionId, description, ACCOUNT_TYPE, newTransferReq,fromApplicantId, conn, transaction_time);
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
                  return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.amount_deduction_fail, STATUS.FAILURE);
                }
              } else {
                return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.moneyTransfer.errorConnObj, STATUS.FAILURE);
              }

            // } else {
            //   return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.insufficient_balance, STATUS.FAILURE);
            // }
          } else {
            return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.moneyTransfer.no_account_found, STATUS.FAILURE);

          }
        } catch (error) {
          return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.moneyTransfer.no_account_found));
        }
      } else {
        return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.moneyTransfer.senderCurrenyAccNotFound, STATUS.FAILURE);
      }


    } else {
      return ResponseHelper.buildSuccessResponse({
        isValidReq
      }, langEngConfig.message.moneyTransfer.req_objerr, STATUS.FAILURE);
    }
  } catch (err) {
    logger.error('Error occured ' + err);
    return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler));
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
const __createTransaction = async (newTransfer, fromAccount, toAccount, applicantId, amount, toAmount, transType, transactionNumber, flag, desc, ACCOUNT_TYPE,fromApplicantId, conn, transaction_time) => {
  //transaction number.
  let transnum = transactionNumber;
  let account = 0;
  let transAmount = 0;
  let currency = '';
  try {
    transType == 'DB' ? account = toAccount : account = fromAccount;
    transType == 'DB' ? currency = CURRENCY_SYMB.FROM_CURR : currency = CURRENCY_SYMB.TO_CURR;
    //getting the full name
    let fullname;
    let details = await payment.getBusinessDetails(fromApplicantId);
    if(details && details.length > 0) {
      fullname = details[0].business_legal_name;
    } else {
    let fullnameRes = await payment.getFullName(account);
    if(fullnameRes && fullnameRes.length > 0) {
    fullname = fullnameRes[0].first_name + " "+fullnameRes[0].last_name;
    }
  }
    //let currency = fullnameRes.currency;
    let timestamp = utils.getGMT();
    let transtype = transType;
    let transApplicantId = applicantId;
    (flag) ? transAmount = toAmount: transAmount = amount;
    //inserting the transaction record
    let transRes = await newTransfer.insertTransaction(transApplicantId, transnum, transtype, fromAccount, toAccount, currency, fullname, ACCOUNT_TYPE, transAmount, desc, transaction_time, conn, '', '', '')
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
        status: STATUS.FAILURE
      });
    }
  } catch (err) {
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
  } catch (err) {
    return (new Error({
      err: `Error occured: ${err}`,
      status: STATUS.FAILURE
    }))
  }
}
/**
 * @desc Method for getting transaction details
 * @method transactionDetails 
 * @param {number} accountNo - it is account number
 * @param {object} newTransfer - it is newTransfer object
 * @return returns full name by using account number
 **/
export const transactionDetails = async (request, response) => {
  logger.info('******* transactionDetailsInfo() called');
  try {
  let transactionResult = await __transactionDetails(request, response)
    logger.info('transactionDetailsInfo() execution completed');
    if(transactionResult) {
    return ResponseHelper.buildSuccessResponse({transactionResult : transactionResult}, langEngConfig.message.payment.transaction_detail_fetch_success, STATUS.SUCCESS)
    } else {
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.transaction_detail_fetch_error, STATUS.FAILURE);
    }
  } catch(err) {
    return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.internalError))
  }
}

const __transactionDetails = async (request, response) => {
  let newTransfer = new MoneyTransfer(request.params);
  let applicant_id = newTransfer.applicant_id;
  let currency = newTransfer.currency_type;

  console.log("****** applicant_id******["+applicant_id)

  try {
    if (_.toLower(currency) == "all") {
      let res = await newTransfer.getTransactionDetails(applicant_id)
      console.log("****** Transactions details"+ JSON.stringify(res) +"for applicant_id"+ applicant_id)

      if (res != 0) {
        if (_.toLower(newTransfer.device_type) == "web") {
          let list = await __createResponse(request, res)
          console.log("list", list);
          return response.send(ResponseHelper.buildSuccessResponse({ 
            transaction_details: list
          }, langEngConfig.message.payment.transaction_detail_fetch_success, STATUS.SUCCESS));

        } else {
          return response.send(ResponseHelper.buildSuccessResponse({
            transaction_details: res
          }, langEngConfig.message.payment.transaction_detail_fetch_success, STATUS.SUCCESS));
        }
      } else {
        return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.transaction_detail_fetch_error, STATUS.FAILURE));
      }

    } else {
      let results = await newTransfer.getFromCurrencyAccountno(currency, applicant_id)
      console.log("Account #"+ JSON.stringify(results))
      if (results.length > 0) {
        let accountNo = results[0].account_no;
        let res = await newTransfer.transactionDetailsByAccount(accountNo, currency)
        console.log("**** transactionDetailsByAccount [", res+"]");
        if (res != 0) {
          if (_.toLower(newTransfer.device_type) == "web") {
            let list = await __createResponse(request, res)
            console.log("list", list);
            return response.send(ResponseHelper.buildSuccessResponse({
              transaction_details: list
            }, langEngConfig.message.payment.transaction_detail_fetch_success, STATUS.SUCCESS));


          } else {
            return response.send(ResponseHelper.buildSuccessResponse({
              transaction_details: res
            }, langEngConfig.message.payment.transaction_detail_fetch_success, STATUS.SUCCESS));

          }
        } else {
          return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.transaction_detail_fetch_error, STATUS.FAILURE));
        }

      } else {
        return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.transaction_detail_fetch_error, STATUS.FAILURE));
      }
    }
  } catch (err) {
    return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));

  }
}
/**
 * @desc This method used to get details  
 * @method createResponse 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
const __createResponse = async (request, res) => {
  let newTransfer = new MoneyTransfer(request.params);
  try {
    var i = 0;
    _.forEach(res, async (row) => {
      i++
      //row.created_on = dateFormat(row.created_on, 'dd-mm-yyyy')
     
      //  if(row.counterparty_mobile) {
      //   let counterparty_email = await newTransfer.getCounterPartyEmail(row.counterparty_mobile);      
      //   row["created_on_with_time"] = dateFormat(row.created_on, "HH:MM:ss");
      //   console.log("row.created_on_with_time",row["created_on_with_time"]);   
      //   if(counterparty_email && counterparty_email.length > 0) {
      //     row["counterparty_email"] = counterparty_email[0].user_id;
      //     console.log("row.counterparty_email",row["counterparty_email"]);          
      //     }
      //  } else {
      row["created_on_with_time"] = dateFormat(row.created_on, "HH:MM:ss"); 
   //    }   
      row.created_on = dateFormat(row.created_on, 'dd-mm-yyyy')
     
    })
    if (_.size(res) == i) {
      var array = []
      var y = 0
      _.forEach(_.uniqBy(res, 'created_on'), function (rowData) {
        y++
        var obj = {}
        obj["created_on"] = rowData.created_on;
        obj.data = _.filter(res, {
          created_on: rowData.created_on
        });
        array.push(obj);
      })
      if (_.size(_.uniqBy(res, 'created_on')) == y) {
        return (array)
      }
    }
  } catch (err) {
    logger.error('Error occured ' + err);
    return (new Error(langEngConfig.message.error.ErrorHandler))
  }
}


/**
 * @desc This method used for getting webtransaction details
 * @method getWebTransaction
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const getWebTransaction = (request, response) => {
  logger.info('getWebTransaction() initiated');
  __getWebTransDetails(request, response).then(webTrans => {
    logger.info('getWebTransaction() execution completed');
    return webTrans;
  })
}

const __getWebTransDetails = async (request, response) => {
  let transModel = new MoneyTransfer(request.params);
  let applicantID = transModel.applicant_id;
  let currentDate = utils.getGMT();

  let fromDate = request.body.from_date;
  let curreny = request.body.currency_type;

  let rangeDate = '';

  //If fromdate is not empty initialize with that day
  if (fromDate != 'undefined' && fromDate != '' && fromDate != null) {
    rangeDate = fromDate + ' 00:00:01';
  } else {
    //If empty initialize with one month back date
    rangeDate = dateFormat(Date.parse(utils.getGMT()) - 2592000000, 'yyyy-mm-dd HH:MM:ss');
  }



  //If currency is empty get transaction of all accounts.
  if (curreny == 'undefiend' || curreny == '' || curreny == null) {
    try {
      logger.info('getWebTransactionDetails() called');
      let transRes = await transModel.getWebTransactionDetails(applicantID, rangeDate, currentDate);
    //  console.log("***** after getWebTransactionDetails ****"+ JSON.stringify(transRes)) 

      if (transRes.length > 0) {
        //Create the transaction records in perticular order
        let tranDetailRes = await __createResponse(request,transRes);    
   //     console.log("***** after create response ****"+ JSON.stringify(tranDetailRes))   
        response.send(ResponseHelper.buildSuccessResponse({
          transaction_details: tranDetailRes
        }, langEngConfig.message.payment.transaction_detail_fetch_success, STATUS.SUCCESS));
      } else {
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.transaction_detail_fetch_error, STATUS.FAILURE));
      }
    } catch (err) {
      logger.error('Error occured : ' + err);
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    }
  } else {
    //Else give a perticular account data
    try {
      //GET the currency account number
      logger.info('getFromCurrencyAccountno() called');
    
      let accountRes = await transModel.getFromCurrencyAccountno(curreny, applicantID);
      if (accountRes.length > 0) {
        let currency_account = accountRes[0].account_no;
        let webTransByAcc;
     //   let webTransByAccRequest;
       
     //   webTransByAccRequest = await transModel.getWebTransByAccountRequest(currency_account, rangeDate, currentDate);
       
        webTransByAcc = await transModel.getWebTransByAccount(currency_account, rangeDate, currentDate);
        
    //   let webTrans = webTransByAcc.concat(webTransByAccRequest);
        if (webTransByAcc.length > 0) {
          //Create the transaction records in particular order
          let webAccRes = await __createResponse(request, webTransByAcc);
          response.send(ResponseHelper.buildSuccessResponse({
            transaction_details: webAccRes
          }, langEngConfig.message.payment.transaction_detail_fetch_success, STATUS.SUCCESS));
        } else {
          response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.transaction_detail_fetch_error, STATUS.FAILURE));
        }
      } else {
        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.moneyTransfer.no_account_found, STATUS.FAILURE));
      }
    } catch (err) {
      logger.error('Error occured : ' + err);
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    }
  }

}


/**
 * @desc This method used to support bulk tranfer request
 * @method walletPayments 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const walletPayments = async (request, response) => {
  let applicantId = request.params.applicant_id;
  let fromCurrency = request.body.from_currency;
  //let totalAmt = request.body.total_amount;
  let transferTime = request.body.transfer_time;
  let transactions = request.body.transaction_list;
  let transaction_time = request.body.transaction_time;
  let doNotify;
  if (request.body.do_notify) {
    doNotify = request.body.do_notify;    
  } else {
    doNotify = 0;
  }
  //let description = request.body.description;
  //let timeZone = request.body.time_zone;
  let non_payvoo_transactions = transactions.filter(t => t.is_non_payvoo_user == 1);
  transactions = transactions.filter(t => t.is_non_payvoo_user == undefined);

  let non_payvoo_payment_result;  
  if (non_payvoo_transactions.length > 0) {
    non_payvoo_payment_result = await sendMoneyToNonPayvooUser({ transaction_list: non_payvoo_transactions });
  }
  if (transactions.length > 0) {
    console.log("request.body.isCsv", request.body.isCsv);
    if(request.body.isCsv) {
      __bulkTransferCsv(applicantId, fromCurrency, transferTime, transactions,transaction_time, non_payvoo_transactions, doNotify)
      .then((bulkTransRes) => {
        response.send(bulkTransRes);
      }).catch(err => {
        response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.internalError)));
      });
  } else {
    __bulkTransfer(applicantId, fromCurrency, transferTime, transactions, non_payvoo_transactions, doNotify)
    .then((bulkTransRes) => {
      response.send(bulkTransRes);
    }).catch(err => {
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.internalError)));
    });
  }
  } else {
    non_payvoo_payment_result = {
      status: 0,
      data: { status: 0},
      money_sent_to: non_payvoo_transactions.map(t => t.email)
    }
    response.send(non_payvoo_payment_result);
  }
}


/**
 * @desc This method used to perform both real time and sceduled bulk transfer.
 * @method bulkTransfer 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const __bulkTransfer = async (senderId, senderCurrency, sceduleTime, arrayOfTrans,non_payvoo_transactions, notify) => {
  let applicantId = senderId;
  let fromCurrency = senderCurrency;
  let transferTime = sceduleTime;
  let transactions = arrayOfTrans;
  let nonpayvoo_transactions = non_payvoo_transactions;
  let doNotify = (notify == 'undefined') ? '0' : notify;
  //let description = desc;
  let totalAmt = await __getTotalAmt(transactions);
  //let timezone = timeZone;

  let no_of_succ_trans = 0;
  let no_of_failure_trans = 0;
  let array_of_succ_trans = [];
  let array_of_fail_trans = [];
  let totalAmount = 0;
  let totalTrans = (transactions ? transactions.length : 0) + (nonpayvoo_transactions ? nonpayvoo_transactions.length : 0);
  let currentTime = utils.getCurrentTimeStamp();
    

  //If array_of_transaction is invalid return error.
  if (totalTrans == 0 || totalTrans == '' || totalTrans == 'undefined' || totalTrans == null) {
    return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.bulkTransfer.invalidTransArray, STATUS.FAILURE);
  }

  //If transfer time is null or empaty or undefined or past time. Execute the bulk transfer.
  if (transferTime == null || transferTime == '' || transferTime == 'undefined') {

    //Check wheather the currency account has the balance or not
    let balance = await st.checkBalance(applicantId, fromCurrency);
    if (totalAmt > (balance.length > 0 ? balance[0].balance : 0) || balance[0] == 'undefined') {
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.bulkTransfer.lowBal, STATUS.FAILURE);
    }
    //Create a unique refference id for bulk transfer
    let bulkTransId = await utils.getBulkTransId();
    if(bulkTransId) {
    //Iterate each transfer object
    for (let i = 0; i < totalTrans; i++) {
      //Check for valid request
      let isValid = await utils.isValidMoneyTransferRequest(transactions[i]);
      //If its a valid transfer request
      if (isValid.status) {

        let debitCurrency = transactions[i].from_currency;
        let creditCurrency = transactions[i].to_currency;
        let deductAmt = transactions[i].amount;
        let receipientMobile = transactions[i].to_mobile;
        let desc = transactions[i].description;
        let receiver_email = transactions[i].receiver_email;
        let transaction_time = transactions[i].transaction_time;

        let isbulkTrans = 1;

        let bulkTransRes = await __walletToWalletTransfer(applicantId, debitCurrency, creditCurrency, deductAmt, receipientMobile, desc, isbulkTrans, transactions[i], receiver_email);
        if (bulkTransRes.data.status == 0) {
          //Increment the count
          no_of_succ_trans++;
          //Create a success trans object
          let SuccTrans = {
            index: i,
            TransReq: transactions[i],
            TransRes: bulkTransRes.data
          }
          
          let exchangeRateRes = await commonCode.getcurrencyExchangeMuse(transactions[i].to_currency, transactions[i].from_currency)
          console.log("exchangeRateRes", exchangeRateRes);
          if (exchangeRateRes.rate && exchangeRateRes.rate > 0) {
            totalAmount = totalAmount + parseFloat(transactions[i].amount) * exchangeRateRes.rate;            
          }
          //Push it to array of success transaction
          array_of_succ_trans.push(SuccTrans);
        } else {
          //If transaction fails
          //Increment the count
          no_of_failure_trans++;
          //Create a failure trans object
          let FailTrans = {
            index: i,
            TransReq: transactions[i],
            TransRes: bulkTransRes.data
          }
          //Push it to array of success transaction
          array_of_fail_trans.push(FailTrans);
        }
        //}
      } else {
        return ResponseHelper.buildSuccessResponse({
          isValid
        }, langEngConfig.message.moneyTransfer.req_objerr, STATUS.FAILURE);
      }
    }
  }

    let transResObj = {
      'no_of_trans': totalTrans,
      'total_succ_trans': no_of_succ_trans,
      'list_of_succ_trans': array_of_succ_trans,
      'total_fail_trans': no_of_failure_trans,
      'list_of_fail_trans': array_of_fail_trans
    }

    let transHis = await st.insertTransHistory(applicantId, currentTime, totalTrans, totalAmt, fromCurrency, JSON.stringify(transactions), no_of_succ_trans, JSON.stringify(array_of_succ_trans), no_of_failure_trans, JSON.stringify(array_of_fail_trans), currentTime);
    if (transHis) {
      //Send mail if only its a single payment
      if (totalTrans == 1 && doNotify == 1) {
        for (let i = 0; i < array_of_succ_trans.length; i++) {
          await sendSuccTransEmail(applicantId, fromCurrency, array_of_succ_trans[0].TransReq.to_currency, array_of_succ_trans[0].TransReq.amount, array_of_succ_trans[0].TransReq.to_mobile, array_of_succ_trans[0].TransReq.description, array_of_succ_trans[0].TransReq.transaction_time);
        
        } 
      }
      let bulkTransferSucc = `${array_of_succ_trans.length} Payments for total of ${fromCurrency} ${totalAmount.toFixed(4)}`;
      return ResponseHelper.buildSuccessResponse(transResObj, bulkTransferSucc, STATUS.SUCCESS);
    } else {
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.bulkTransfer.transHisError, STATUS.FAILURE);
    }

  } else {
    //if not, Schedule the bulk transfer at given time.
    try {
      //Generate a unique di for scheduled tranfer.
      let scheduleTransId = await utils.getScheduleTransId();
      let arrayOfTrans = JSON.stringify(transactions);

      //Check wheather the date is valid schedued date (Future date)
      let isValidDate = await __isValidTimeStamp(transferTime);
      if (isValidDate.status == STATUS.FAILURE) {
        return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.schedulrTrans.pastDateError, STATUS.FAILURE);
      }

      //Call the method for scheduling the transfer
      let setSceduleTrans = await st.setScheduleTransfer(scheduleTransId, applicantId, transferTime, fromCurrency, arrayOfTrans, totalAmt, doNotify, currentTime);
      if (setSceduleTrans) {
        //If the transfer scheduled successfully the send the success message.
        let succMsg = format(langEngConfig.message.schedulrTrans.scheduleTransSucc, totalTrans, totalAmt, fromCurrency, transferTime);
        let no_of_scheduled_transactions = totalTrans;
        return ResponseHelper.buildSuccessResponse({
          no_of_scheduled_transactions
        }, succMsg, STATUS.SUCCESS);
      } else {
        //If not send failure message
        return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.schedulrTrans.scheduleTransSucc, STATUS.FAILURE);
      }
    } catch (err) {
      logger.error('Error occured : ' + err);
      return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler));
    }
  }
}


/**
 * @desc This method used for calculating sum ammount of transactions
 * @method getTotalAmt
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
const __getTotalAmt = async (transactions) => {
  let sum = 0;
  for (let i = 0; i < transactions.length; i++) {
    sum += parseInt(transactions[i].amount, 10);
  }
  return sum;
}


/**
 * @desc This method used for validating schedule transfer timestamp
 * @method isValidTimeStamp
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
const __isValidTimeStamp = async (givenTime) => {
  let lt = timeZone.getZonedTime(new Date(), london);
  let gmtDate = lt.year + '-' + lt.month + '-' + lt.day + ' ' + lt.hours + ':' + lt.minutes + ':' + lt.seconds;
  let scheduleTime = givenTime + ' 00:00:00';

  let currentMiliSec = Date.parse(gmtDate);
  let scheduleMili = Date.parse(scheduleTime);

  if (currentMiliSec > scheduleMili) {
    return {
      status: STATUS.FAILURE
    }
  }
  return {
    status: STATUS.SUCCESS
  }
}

export const __bulkTransferCsv = async (senderId, senderCurrency, sceduleTime, arrayOfTrans,transaction_time,non_payvoo_transactions, notify) => {
  let applicantId = senderId;
  let fromCurrency = senderCurrency;
  let transferTime = sceduleTime;
  let transactions = arrayOfTrans;
  let nonpayvoo_transactions = non_payvoo_transactions;
  let doNotify = (notify == 'undefined') ? '0' : notify;
  //let description = desc;
  let totalAmt = await __getTotalAmt(transactions);
  //let timezone = timeZone;

  let no_of_succ_trans = 0;
  let totalAmount = 0;
  let no_of_failure_trans = 0;
  let array_of_succ_trans = [];
  let array_of_fail_trans = [];

  let totalTrans = (transactions ? transactions.length : 0) + (nonpayvoo_transactions ? nonpayvoo_transactions.length : 0);
  let currentTime = utils.getCurrentTimeStamp();
    

  //If array_of_transaction is invalid return error.
  if (totalTrans == 0 || totalTrans == '' || totalTrans == 'undefined' || totalTrans == null) {
    return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.bulkTransfer.invalidTransArray, STATUS.FAILURE);
  }

  //If transfer time is null or empaty or undefined or past time. Execute the bulk transfer.
  if (transferTime == null || transferTime == '' || transferTime == 'undefined') {

    //Check wheather the currency account has the balance or not
    let balance = await st.checkBalance(applicantId, fromCurrency);
    if (totalAmt > (balance.length > 0 ? balance[0].balance : 0) || balance[0] == 'undefined') {
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.bulkTransfer.lowBal, STATUS.FAILURE);
    }
    //Create a unique refference id for bulk transfer
    let bulkTransId = await utils.getBulkTransId();
    if(bulkTransId) {
    //Iterate each transfer object
    for (let i = 0; i < totalTrans; i++) {
      //Check for valid request
      let isValid = await utils.isValidMoneyTransferRequest(transactions[i]);
      //If its a valid transfer request
      if (isValid.status) {

        let debitCurrency = transactions[i].from_currency;
        let creditCurrency = transactions[i].to_currency;
        let deductAmt = transactions[i].amount;
        let receipientMobile = transactions[i].to_mobile;
        let desc = transactions[i].description;
        let receiver_email = transactions[i].receiver_email;
        

        let isbulkTrans = 1;

        let bulkTransRes = await __walletToWalletTransferCsv(applicantId, debitCurrency, creditCurrency, deductAmt, receipientMobile, desc, isbulkTrans, transactions[i],transaction_time, receiver_email);
        if (bulkTransRes.data.status == 0) {
          //Increment the count
          no_of_succ_trans++;
          //Create a success trans object
          let SuccTrans = {
            index: i,
            TransReq: transactions[i],
            TransRes: bulkTransRes.data
          }
          let exchangeRateRes = await commonCode.getcurrencyExchangeMuse(transactions[i].to_currency, transactions[i].from_currency)
         
          if (exchangeRateRes.rate && exchangeRateRes.rate > 0) {
            totalAmount = totalAmount + parseFloat(transactions[i].amount) * exchangeRateRes.rate;            
          }
          //Push it to array of success transaction
          array_of_succ_trans.push(SuccTrans);
        } else {
          //If transaction fails
          //Increment the count
          no_of_failure_trans++;
          //Create a failure trans object
          let FailTrans = {
            index: i,
            TransReq: transactions[i],
            TransRes: bulkTransRes.data
          }
          //Push it to array of success transaction
          array_of_fail_trans.push(FailTrans);
        }
        //}
      } else {
        return ResponseHelper.buildSuccessResponse({
          isValid
        }, langEngConfig.message.moneyTransfer.req_objerr, STATUS.FAILURE);
      }
    }
  }

    let transResObj = {
      'no_of_trans': totalTrans,
      'total_succ_trans': no_of_succ_trans,
      'list_of_succ_trans': array_of_succ_trans,
      'total_fail_trans': no_of_failure_trans,
      'list_of_fail_trans': array_of_fail_trans
    }

    let transHis = await st.insertTransHistory(applicantId, currentTime, totalTrans, totalAmt, fromCurrency, JSON.stringify(transactions), no_of_succ_trans, JSON.stringify(array_of_succ_trans), no_of_failure_trans, JSON.stringify(array_of_fail_trans), currentTime);
    if (transHis) {
      //Send mail if only its a single payment
      if (totalTrans == 1 && doNotify == 1) {
        for (let i = 0; i < array_of_succ_trans.length; i++) {
          await sendSuccTransEmail(applicantId, fromCurrency, array_of_succ_trans[0].TransReq.to_currency, array_of_succ_trans[0].TransReq.amount, array_of_succ_trans[0].TransReq.to_mobile, array_of_succ_trans[0].TransReq.description, array_of_succ_trans[0].TransReq.transaction_time);
        } 
      }
      if(transResObj.list_of_fail_trans && transResObj.list_of_fail_trans.length > 0) {
        return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.bulkTransfer.nonPayvooTransaction, STATUS.FAILURE);
      } else {
        let bulkTransferSucc = `${array_of_succ_trans.length} payments for total of ${fromCurrency} ${totalAmount.toFixed(4)}`;
      return ResponseHelper.buildSuccessResponse(transResObj, bulkTransferSucc, STATUS.SUCCESS);
      }
    } else {
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.bulkTransfer.transHisError, STATUS.FAILURE);
    }

  } else {
    //if not, Schedule the bulk transfer at given time.
    try {
      //Generate a unique di for scheduled tranfer.
      let scheduleTransId = await utils.getScheduleTransId();
      let arrayOfTrans = JSON.stringify(transactions);

      //Check wheather the date is valid schedued date (Future date)
      let isValidDate = await __isValidTimeStamp(transferTime);
      if (isValidDate.status == STATUS.FAILURE) {
        return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.schedulrTrans.pastDateError, STATUS.FAILURE);
      }

      //Call the method for scheduling the transfer
      let setSceduleTrans = await st.setScheduleTransfer(scheduleTransId, applicantId, transferTime, fromCurrency, arrayOfTrans, totalAmt, doNotify, currentTime);
      if (setSceduleTrans) {
        //If the transfer scheduled successfully the send the success message.
        let succMsg = format(langEngConfig.message.schedulrTrans.scheduleTransSucc, totalTrans, totalAmt, fromCurrency, transferTime);
        let no_of_scheduled_transactions = totalTrans;
        return ResponseHelper.buildSuccessResponse({
          no_of_scheduled_transactions
        }, succMsg, STATUS.SUCCESS);
      } else {
        //If not send failure message
        return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.schedulrTrans.scheduleTransSucc, STATUS.FAILURE);
      }
    } catch (err) {
      logger.error('Error occured : ' + err);
      return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler));
    }
  }
}


/**
 * @desc This method used to execute schedule transfers
 * @method scheduleTrans
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const scheduleTrans = async (trans) => {
  let applicantId = trans.applicantId;
  let fromCurrency = trans.fromCurrency;
  let transferTime = trans.transferTime;
  let transactions = trans.transactions;
  let doNotify = trans.doNotify;
  let description = trans.description;

  try {
    await __bulkTransfer(applicantId, fromCurrency, transferTime, transactions, doNotify);
  } catch (err) {
    logger.error('Error occured : ' + err);
  }
}


/**
 * @desc This method used to send email in successfull payment
 * @method sendSuccTransEmail
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
const sendSuccTransEmail = async (applicantId, fromCurr, toCurr, amount, toMobile, description, currentTime) => {
  try {
    let name = await st.getFullName(applicantId);
    let receipientEmail = await st.getReceipientMail(toMobile);
    let fullName = name[0].first_name + ' ' + name[0].last_name;
    let today = new Date(currentTime);
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let convertedTime = timeConvert(time);
    let timestamp = date + ' ' +convertedTime;
    let text = format(langEngConfig.message.schedulrTrans.succTrans, timestamp, fullName, amount, fromCurr, toCurr, description);
    //let text = `PayVoo informs you that on ${date}, ${fullName} made a transfer of ${fromCurr} ${amount} to your PayVoo ${toCurr} account.`;
    //Sending money tranfer success mail
    await sendMoneyTransStatus(receipientEmail, text);
  } catch (err) {
    logger.error('Error occured ' + err);
  }
}

function convertTime(serverdate) {
  var date = new Date(serverdate);
  // convert to utc time
  var toutc = date.toUTCString();
  //convert to local time
  var locdat = convertUTCDateToLocalDate(new Date(toutc + " UTC"));

  return locdat;
}



/**
 * @desc This method used to transfer money to non-payvoo user
 * @method payNonPayvooUser 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message, link, and status code
**/
export const payNonPayvooUser = async (request, response) => {
  const recipientDetails = request.body;
  sendMoneyToNonPayvooUser(recipientDetails, request).then(res => {
    response.send(ResponseHelper.buildSuccessResponse(res, langEngConfig.message.countrparty.moneySent, STATUS.SUCCESS));
  }).catch(err => {
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.kyc.internalError)));
  });
}

export const sendMoneyToNonPayvooUser = (recipientDetails, request) => {
  
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < recipientDetails.transaction_list.length; i++) {
      recipientDetails.transaction_list[i]['sender_applicant_id'] = request.params.applicant_id; 
      const transaction = recipientDetails.transaction_list[i];  
      const sendAmount = recipientDetails.transaction_list[i].amount; 
      const sendCurrency = recipientDetails.transaction_list[i].to_currency;
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
      let account_type = await mt.getAccountType(request.params.applicant_id);
      if(account_type.length > 0 && account_type[0].account_type == "personal") {
        var uniquePaymentUrl = `${process.env.WEBADDRESS}/personal/pay/${uniquePaymentId}/${sendCurrency}/${sendAmount}`
      } else if(account_type.length > 0 && account_type[0].account_type == "business") {
        var uniquePaymentUrl = `${process.env.WEBADDRESS}/business/pay/${uniquePaymentId}/${sendCurrency}/${sendAmount}`

        // Get the business name
      //  var businessDetails = await mt.getBusinessDetails(request.params.applicant_id)
      // transaction.sender_name = businessDetails.business_legal_name
      //  console.log("***** sender_name ****"+ JSON.stringify(businessDetails))
      }
      const responseObj = {
        uniquePaymentUrl,
        uniquePaymentId,
        code: 200   
      }
      let details = await payment.getBusinessDetails(request.params.applicant_id);
      if(details && details.length > 0) {
        transaction.sender_name = details[0].business_legal_name;
      }
      const text = `Hi ${transaction.receiver}.
                    \n\n${transaction.sender_name} has sent you funds of ${transaction.amount} ${transaction.from_currency} on eWallet.
                    \nUse this unique url to register on eWallet and receive these funds: ${uniquePaymentUrl}
                    \n\nTransactions Reasons: ${transaction.description}
                    \n\nThank you.`;
                    
      if(transaction.email) {
      sendGenericTextEmail(transaction.email, text, 'Receive payments').then(
        (emailRes) => {
          mt.insertNonPayvooTransaction(uniquePaymentId, transaction.receiver, transaction.email, transaction.from_currency, transaction.receiver_mobile, transaction.amount, transaction.sender_name, transaction.sender_email, transaction.sender_applicant_id, 0, 'SEND').then(res => {
            if (i == recipientDetails.transaction_list.length - 1) {
              resolve(responseObj);
            }
          }).catch(err => {
            reject((langEngConfig.message.kyc.internalError));
          });        
        }).catch(err => {
          reject((langEngConfig.message.kyc.internalError));
        });
      } else {
        sendOtp(transaction.to_mobile, text, global.access_token).then(
          (emailRes) => {
            mt.insertNonPayvooTransaction(uniquePaymentId, transaction.receiver, transaction.to_mobile, transaction.from_currency, transaction.receiver_mobile, transaction.amount, transaction.sender_name, transaction.sender_email, transaction.sender_applicant_id, 0, 'SEND').then(res => {
              if (i == recipientDetails.transaction_list.length - 1) {
                resolve(responseObj);
              }
            }).catch(err => {
              reject((langEngConfig.message.kyc.internalError));
            });        
          }).catch(err => {
            reject((langEngConfig.message.kyc.internalError));
          });   
      }
    }
  });
}

export const getNonPayvooTransactionDetails = (request, response) => {
  const unique_payment_id = request.params.unique_payment_id;
  const mt = new MoneyTransfer({
    applicant_id: null,
    from_currency: null,
    to_currency: null,
    to_mobile: null,
    amount: null,
    currency_type: null,
    device_type: null
  });
  mt.getNonPayvooTransactionDetails(unique_payment_id).then(data => {
    let code;
    if (data.length > 0) {
      code = 200;
    } else {
      code = 404;
    }
    response.send({ code, data: data[0] })
  });
}

export const payNewlyRegisteredUserWithNonPayvooPayments = (email, applicant_id, mobile, transaction_time) => {
 
  return new Promise(async (resolve, reject) => {
   
    const mt = new MoneyTransfer({
      applicant_id: null,
      from_currency: null,
      to_currency: null,
      to_mobile: null,
      amount: null,
      currency_type: null,
      device_type: null
    });
  
     const nonPayvooResult = await mt.checkNonPayvooUserPayments(email);
     if(nonPayvooResult.length == 0) {
      return resolve (ResponseHelper.buildFailureResponse(langEngConfig.message.payment.trans_failed));
     }
    // Check if the applicant ID is alredy in the tansaction table
    const applicantExistsinTransTable = await mt.checkIfTrasanctionExistsForApplicantId(applicant_id);
    console.log("applicantExistsinTransTable", applicantExistsinTransTable);
    if (applicantExistsinTransTable && applicantExistsinTransTable.length >0) {
      return resolve (ResponseHelper.buildFailureResponse(langEngConfig.message.payment.trans_failed));
    }
    let full_name;
    let details = await mt.getBusinessDetails(applicant_id);
    console.log("details", details);
    if(details && details.length > 0) {
      full_name = details[0].business_legal_name;
    } else {
      details = await mt.getContactDetails(applicant_id);
      if(details && details.length > 0) {
        full_name = details[0].first_name + " " + details[0].last_name;
      }
    }
   

    const updated_nonpayvoo_user = await mt.updateNonPayvooUser(email, mobile);
    await mt.updateUserCounterpaty(email, mobile);
    let transferResults = null;
    const non_payvoo_transactions = await mt.getNonPayvooTransactionsOfReceiverByEmail(email);
    if (non_payvoo_transactions.length > 0) {     
      const senderId = non_payvoo_transactions[0].sender_applicant_id;
      const senderCurrency = non_payvoo_transactions[0].currency;
      let requestedAmount = non_payvoo_transactions[0].amount;
      const sender_email = non_payvoo_transactions[0].sender_email;
  
      const transactionsList = non_payvoo_transactions.map(t => {
        return {
          ...t,
          from_currency: t.currency,
          to_currency: t.currency,
          to_mobile: t.receiver_mobile,
          applicant_id: applicant_id,
          transaction_time: transaction_time,
          description: 'Money sent before receiver was registered on PayVoo.'
        };
      });
      if(non_payvoo_transactions[0].transaction_operation == 'REQUEST') {
        let from_account;
        let to_account;
        let toApplicantid;
        let transactionId = utils.generateTransNum();
        let requestedCurrency = senderCurrency;
        let request_currency = requestedCurrency;
        let fromCurrencyRes = await mt.getFromCurrencyAccountno(requestedCurrency, applicant_id);
      if (fromCurrencyRes.length > 0) {
         from_account = fromCurrencyRes[0].account_no;
        } else {
          fromCurrencyRes = await mt.getFromCurrencyAccountno('EUR',applicant_id);
        if (fromCurrencyRes && fromCurrencyRes.length > 0) {
          from_account = fromCurrencyRes[0].account_no;
        //  toApplicantid = fromCurrencyRes[0].applicant_id;
          requestedCurrency = 'EUR';
        }
        }
      //  let accountNoRes = await __getRecipientCurrencyAccount(receiverMobile, requestedCurrency, body, receiver_applicant_id);
      let recipientApplicantId;
      let receiverMobile;
      let recepientDetails = await mt.getRecipientDetailsByEmail(sender_email);
        if(recepientDetails && recepientDetails.length >0) {
        recipientApplicantId = recepientDetails[0].applicant_id;             
        receiverMobile = recepientDetails[0].mobile;
        }
        let currencyAccount = await mt.getRecipientCurrencyAccount(receiverMobile,recipientApplicantId, senderCurrency);
      if (currencyAccount && currencyAccount.length > 0) {
          to_account = currencyAccount[0].account_no;
          toApplicantid = currencyAccount[0].applicant_id;
      }
     
          let ACCOUNT_TYPE = 'REQUEST';         
          let conn = await db.getConnObject();
          if(conn) {
            await conn.beginTransaction();
            let description = "You owe"
            logger.info('__deductAmount() called'); 
            //Money deduction from senders account
            let deductRes = await __deductAmountRequestFunds(from_account, to_account, applicant_id, requestedAmount, requestedAmount,requestedCurrency,sender_email, transactionId, description,receiverMobile, ACCOUNT_TYPE, mt, conn, request_currency, transaction_time, applicant_id);
            //If money deducted successfully
            if (deductRes.status == 0) {
              let desc = "Owes you"
              logger.info('__addbalance() called'); 
              let addbalRes = await __addbalanceRequestFunds(from_account, to_account, senderId, requestedAmount, requestedAmount,requestedCurrency,email, transactionId, desc,receiverMobile, ACCOUNT_TYPE, mt, conn, request_currency, transaction_time, applicant_id);
              console.log("addbalance", addbalRes);
              //If money added successfully
              if (addbalRes.status == 0) {
                //commit the transaction and release the conn object
                conn.commit();
                conn.release();
                const callingCode = mobile.substr(0, receiverMobile.indexOf(" "));
                const benificiaryObject = {
                  name: '',
                  mobile: receiverMobile,
                  full_name: full_name,
                  country: 0,
                  counterparty_id: undefined,
                  limit: undefined,
                  email: email
                }
                const beneficiary = new Beneficiary(benificiaryObject);
                const country = await beneficiary.getCountryId(callingCode);
                const country_id = country[0].country_id; 
                await mt.deleteNonPayvooTransactionsOfReceiverByEmail(email);               
                await beneficiary.changeToPayvooCounterParty(email,applicant_id, recipientApplicantId, country_id, full_name);
                resolve (ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.trans_success, STATUS.SUCCESS));
              } else {
                //If money did not added into receipient account roolback the transaction
                conn.rollback();
                conn.release();
                resolve (ResponseHelper.buildFailureResponse(langEngConfig.message.payment.trans_failed));
              }
            } else {
              resolve( ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.amount_deduction_fail, STATUS.FAILED));
            }         
          }
      } else {
      transferResults = await __bulkTransfer(senderId, senderCurrency, undefined, transactionsList, undefined);
      if(transferResults.status === 0) {
        const benificiaryObject = {
          name: transactionsList[0].receiver_name,
          mobile: transactionsList[0].receiver_mobile,
          full_name: transactionsList[0].receiver_name,
          country: 0,
          counterparty_id: undefined,
          limit: undefined,
          email: transactionsList[0].receiver_email
        }
        let recipientApplicantId;
        let recepientDetails = await mt.getRecipientDetailsByEmail(sender_email);
        if(recepientDetails && recepientDetails.length > 0) {     
        recipientApplicantId = recepientDetails[0].applicant_id;
        }  
        const beneficiary = new Beneficiary(benificiaryObject);
        const callingCode = mobile.substr(0, benificiaryObject.mobile.indexOf(" "));
        const country = await beneficiary.getCountryId(callingCode);
        const country_id = country[0].country_id; 
        await mt.deleteNonPayvooTransactionsOfReceiverByEmail(email);
        await beneficiary.changeToPayvooCounterParty(email, applicant_id,senderId, country_id, full_name);
      }
    }
    
    resolve(transferResults);
  }
  })
}



export const bulkPaymentsTotal = async (request, response) => {
    let bulkPaymentsList = request.body.bulkPaymentsList;
    let totalAmount = 0;
    if(bulkPaymentsList && bulkPaymentsList.length > 0) {
    for (var i = 0; i < bulkPaymentsList.length; i++) {
      bulkPaymentsList[i].amount = bulkPaymentsList[i].Amount ? bulkPaymentsList[i].Amount : bulkPaymentsList[i].amount;
      if(bulkPaymentsList[i].amount != '' || bulkPaymentsList[i].Amount != '') {
        let selectedFromCurrency = bulkPaymentsList[i].selectedFromCurrency;
        let selectedToCurrency = bulkPaymentsList[i].selectedToCurrency;
       if(selectedToCurrency && selectedToCurrency != selectedFromCurrency) {
        let exchangeRateRes = await commonCode.getcurrencyExchangeMuse(selectedToCurrency, selectedFromCurrency)
          if (exchangeRateRes.rate && exchangeRateRes.rate > 0) {
            totalAmount = totalAmount + parseFloat(bulkPaymentsList[i].amount) * exchangeRateRes.rate;
          }
          } else {
            totalAmount = totalAmount + parseFloat(bulkPaymentsList[i].amount);
          }
        }   
    }
    response.send(ResponseHelper.buildSuccessResponse({totalAmount: totalAmount.toFixed(4)}, langEngConfig.message.countrparty.bulkPaymentTotal, STATUS.SUCCESS));   
    } else {
      response.send( ResponseHelper.buildSuccessResponse({}, langEngConfig.message.payment.amount_deduction_fail, STATUS.FAILED)); 
    }

}
