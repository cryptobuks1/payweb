/**
 * scheduleTransfer
 * This controller contains all the method required to perform a successfull schedule tranfer for both
 * single and bulk payments
 * @package scheduleTransfer
 * @subpackage controller/scheduleTransfer
 * @author SEPA Cyber Technologies Sekhara Suman Sahu
 */
let dateformat = require('dateformat');
let format = require('string-format');
let timeZone = require('timezone-support');
let london = timeZone.findTimeZone('Europe/London');
let lt = timeZone.getZonedTime(new Date(), london);
let currentTime = lt.year + '-' + lt.month + '-' + (lt.day - 1) + ' ' + '23:59:59'; // Starting night
let limitTime = lt.year + '-' + lt.month + '-' + lt.day + ' ' + '23' + ':' + '59' + ':' + '59'; // Current date midnight

import {
  scheduleTrans
} from './moneyTransfer';
import {
  ScheduleTransfer
} from '../model/scheduleTransfer';
import {
  sendInsuffiBalEmail,
  sendTranFailEmail
} from '../mailer/mail';
import {
  Utils
} from '../utility/utils';
import {
  langEngConfig
} from '../utility/lang_eng';

let util = new Utils();
let st = new ScheduleTransfer();

const STATUS = {
  SUCCESS: 0,
  FAILURE: 1
}

export const exeScheduleTrans = () => {
  logger.info('exeScheduleTrans() called');
  __doExePayments().then(res => {}).catch(err => {});
}

export const checkMinimumBal = () => {
  logger.info('checkMinimumBal() called');
  __doCheckMinimumBal().then(res => {}).catch(err => {});
}


/**
 * This method is used for checking minimum balance before executing a bulk transfer
 * @method doCheckMinimumBal
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
export const __doCheckMinimumBal = async () => {
  logger.info('__doCheckMinimumBal() called');
  logger.info('getTransTotalAmt() called');
  let translist = await st.getTransTotalAmt(currentTime, limitTime);
  let listOfTrans = _.filter(translist, {
    status: 0
  });  
  for (let i = 0; i < listOfTrans.length; i++) {
    let applicantId = listOfTrans[0].applicant_id;
    let fromCurr = listOfTrans[0].from_currency;
    let amount = listOfTrans[0].total_amount;
    logger.info('getFullName() called');
    logger.info('checkBalance() called');
    let trans = await st.checkBalance(applicantId, fromCurr);
    if (trans[0].balance < amount) {
      logger.info('sendInsuffiBalEmail() called');
      await sendInsuffiBalEmail();
    }
  }
}

//Method for executing scheduled transfers
/**
 * This method is used for executing scheduled transfers
 * @method doExePayments
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
export const __doExePayments = async () => {
  logger.info('sendInsuffiBalEmail() called');
  try {
    logger.info('getScheduleTrans() called');
    let transList = await st.getScheduleTrans(currentTime, limitTime);
    let scheduleTranslist = _.filter(transList, {
      status: 0
    });

    for (let i = 0; i < scheduleTranslist.length; i++) {
      let datetime = dateFormat(scheduleTranslist[i].created_on, 'yyyy-mm-dd');
      let trans = {
        'applicantId': scheduleTranslist[i].applicant_id,
        'fromCurrency': scheduleTranslist[i].from_currency,
        'transferTime': '', //Empty string to execute immidieatly
        'transactions': JSON.parse(scheduleTranslist[i].list_of_transaction),
        'doNotify': scheduleTranslist[i].do_notify,
        'description': scheduleTranslist[i].description
      }

      let text = format(langEngConfig.message.schedulrTrans.insuffiBal, trans.fromCurrency, transList[0].total_amount, datetime, trans.fromCurrency);
      logger.info('getFullName() called');
      let user = await st.getFullName(scheduleTranslist[i].applicant_id);
      logger.info('checkBalance() called');
      let accBal = await st.checkBalance(scheduleTranslist[i].applicant_id, scheduleTranslist[i].from_currency);
      if (accBal[0].balance < scheduleTranslist[i].total_amount) {
        logger.info('sendTranFailEmail() called');
        await sendTranFailEmail(user[0].eamil, text);
      }
      logger.info('scheduleTrans() called');
      await scheduleTrans(trans);
      logger.info('updateScheduleTrans() called');
      await st.updateScheduleTrans(util.getGMT(), scheduleTranslist[i].id);
    }

  } catch (err) {
    logger.error('Error occured ' + err);

  }
}



/**
 * @desc method  for getting saved scheduled transfer of a user
 * @method getScheduleTransfers
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns status message and status code
 **/

export const getScheduleTransfers = (request, response) => {
  //get the applicant id of an user
  let applicantId = request.params.applicant_id;
  logger.info('__getScheduleTranfer() called');
  __getScheduleTranfer(applicantId).then(result => {
    logger.info('__getScheduleTranfer() execution completed');
    response.send(result);
  }).catch(err => {
		return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
	});
}

/**
 * This method is used for executing scheduled transfers
 * @method getScheduleTranfer
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 */
const __getScheduleTranfer = async (applicantId) => {
  try {
    let transList = await st.getScheduleTransByUser(applicantId);
    if (transList.length > 0) {
      let parseTransList = [];
      for(let i = 0; i < transList.length; i++){
        let obj = {
          "id": transList[i].id,
          "status": transList[i].status,
          "refference_number": transList[i].refference_number,
          "applicant_id": transList[i].applicant_id,
          "transfer_time": transList[i].transfer_time,
          "from_currency": transList[i].from_currency,
          "list_of_transaction": JSON.parse(transList[i].list_of_transaction),
          "total_amount": transList[i].total_amount,
          "created_on": transList[i].created_on
        }
        parseTransList.push(obj);
      }
      logger.info('__getScheduleTranfer() execution completed');
      return ResponseHelper.buildSuccessResponse({
        transaction_details: parseTransList
      }, langEngConfig.message.payment.transaction_detail_fetch_success, STATUS.SUCCESS);
    }else{
      logger.info('__getScheduleTranfer() execution completed');
      return ResponseHelper.buildSuccessResponse({
        transaction_details: transList
      }, langEngConfig.message.payment.transaction_detail_fetch_error, STATUS.SUCCESS);
    }
  } catch (err) {
    logger.info('__getScheduleTranfer() execution completed');
    logger.error('Error occured ' + err);
  }
}



/**
 * @desc method is to delete schedule transfer of an user 
 * @method deleteScheduleTransfer
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns status message and status code
 **/

 export const deleteScheduleTransfer = (request, response) =>{
  logger.info('deleteScheduleTransfer() called');
  let applicantId = request.params.applicant_id;
  let id = request.body.id;
  __deleteScheduleTransfer(applicantId, id).then(result=>{
    logger.info('deleteScheduleTransfer() execution completed');
    response.send(result);
  }).catch(err => {
		return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
	});
 }

 const __deleteScheduleTransfer = async (applicantId, id) =>{
   try{
    logger.info('__deleteScheduleTransfer() called');
    let timeStamp = util.getGMT();
    let deleteTrans = await st.deleteScheduleTransfer(timeStamp, id);
    if(deleteTrans.affectedRows > 0){
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.schedulrTrans.deletSucc, STATUS.SUCCESS);
    }
    return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.schedulrTrans.deleteError, STATUS.FAILURE);
   } catch(err){
    logger.info('__deleteScheduleTransfer() execution completed');
    logger.error('Error occured ' + err);
   }
 }