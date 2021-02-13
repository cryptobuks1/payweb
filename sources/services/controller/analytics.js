export const getCategory = (request, response) => {
    let l=[
        {img:"../../../assets/images/grocery.png", name:"Groceries",transactions:10,moneyspent:200,percentage:6},
        {img:"../../../assets/images/shopping.png", name:"Shopping",transactions:40,moneyspent:345,percentage:7},
        {img:"../../../assets/images/restaurant.png", name:"Restaurants",transactions:50,moneyspent:36,percentage:21},
        {img:"../../../assets/images/transport.png", name:"Transport",transactions:30,moneyspent:165,percentage:61},
        {img:"../../../assets/images/travel.png", name:"Travel",transactions:60,moneyspent:100,percentage:67},
        {img:"../../../assets/images/entertainment.png", name:"Entertainment",transactions:10,moneyspent:100,percentage:8},
        {img:"../../../assets/images/healthservices.png", name:"Health",transactions:90,moneyspent:100,percentage:23},
        {img:"../../../assets/images/general.png", name:"General",transactions:10,moneyspent:100,percentage:5},
        {img:"../../../assets/images/utilities.png", name:"Utilities",transactions:10,moneyspent:100,percentage:15},
        {img:"../../../assets/images/cash.png", name:"Cash",transactions:10,moneyspent:100,percentage:11},
        {img:"../../../assets/images/transfer.png", name:"Transfers",transactions:10,moneyspent:100,percentage:11},
        {img:"../../../assets/images/insurance.png", name:"Insurance",transactions:20,moneyspent:45,percentage:65},
        {img:"../../../assets/images/trading.png", name:"Trading",transactions:70,moneyspent:34,percentage:11}
    ]
 
    
    let totalMoneySpent=0
 
    l.forEach(element => {
        totalMoneySpent=totalMoneySpent+element.moneyspent
    });
    
 
    let m=
    {
        transactionsList: l,
        totalMoneySpent: totalMoneySpent,
        selectedCurrency: request.body.selectedCurrency,
        selectedMonth: request.body.selectedMonth
 
    }
    response.send(m)    
 
}
 
export const getMerchant = (request, response) => {
    let l=[
    {img:"../../../assets/images/Lidl.png", name:"Lidl",transactions:10,moneyspent:100,percentage:11},
    {img:"../../../assets/images/massimo.png", name:"Massimo dutti",transactions:10,moneyspent:100,percentage:11},
    {img:"../../../assets/images/dominos.png", name:"Dominos",transactions:10,moneyspent:100,percentage:11},
    {img:"../../../assets/images/MC.png", name:"McDonalds",transactions:10,moneyspent:100,percentage:11},
    {img:"../../../assets/images/Qatar.png", name:"Qatar airways",transactions:10,moneyspent:100,percentage:11},
    {img:"../../../assets/images/maxifit.png", name:"Maxifit fitness",transactions:10,moneyspent:100,percentage:11},
    {img:"../../../assets/images/dentaprime.png", name:"Dentaprime",transactions:10,moneyspent:100,percentage:11},
    ]
 
    let totalMoneySpent=0
 
    l.forEach(element => {
        totalMoneySpent = totalMoneySpent+element.moneyspent
    });
    
 
    let m=
    {
        transactionsList: l,
        totalMoneySpent: totalMoneySpent,
        selectedCurrency: request.body.selectedCurrency,
        selectedMonth: request.body.selectedMonth
 
    }
    response.send(m)  
    
}
 
export const getCountry = (request, response) => {
    let l=[
        {img:"../../../assets/images/othercountry.png", name:"other ",transactions:10,moneyspent:100,percentage:11},
        {img:"../../../assets/images/bulgaria.png", name:"Bulgaria",transactions:10,moneyspent:100,percentage:11},
        {img:"../../../assets/images/united_kingdom.png", name:"Uk",transactions:10,moneyspent:100,percentage:11},
        {img:"../../../assets/images/germany.png", name:"Germany",transactions:10,moneyspent:100,percentage:11},
    
        ]
            
    let totalMoneySpent=0
 
    l.forEach(element => {
        totalMoneySpent = totalMoneySpent+element.moneyspent
    });
    
 
    let m=
    {
        transactionsList: l,
        totalMoneySpent: totalMoneySpent,
        selectedCurrency: request.body.selectedCurrency,
        selectedMonth: request.body.selectedMonth
 
    }
    response.send(m)  
    
}


import {
    MoneyTransfer
  } from '../model/analytics';
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
        row["created_on_with_time"] = dateFormat(row.created_on, "HH:MM:ss"); 
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
  export const getTransactionDetailsByDate = (request, response) => {
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
  
    let date = request.body.selectedMonth
    let d = date.split(" ")
   
      let month=
    {
      "Jan":[1,31],
      "Feb":[2,29],
      "Mar":[3,31],
      "Apr":[4,30],
      "May":[5,31],
      "Jun":[6,30],
      "Jul":[7,31],
      "Aug":[8,31],
      "Sep":[9,30],
      "Oct":[10,31],
      "Nov":[11,30],
      "Dec":[12,31]
    }
   
    let a = month[d[0]][0]
    let fromDate = d[1]+'-'+a+'-'+1
    //let fromDate = request.body.from_date;
    let currency = request.body.selectedCurrency;
    let l = 86400000 * month[d[0]][1]
    let rangeDate = dateFormat(Date.parse(fromDate), 'yyyy-mm-dd HH:MM:ss');
    let toDate = dateFormat(Date.parse(fromDate) + l-1000, 'yyyy-mm-dd HH:MM:ss');
    //If fromdate is not empty initialize with that day
    if (fromDate != 'undefined' && fromDate != '' && fromDate != null) {
      rangeDate = fromDate + ' 00:00:01';
    } else {
      //If empty initialize with one month back date
      rangeDate = dateFormat(Date.parse(utils.getGMT()) - 2592000000, 'yyyy-mm-dd HH:MM:ss');
    }
  
  
  
    //If currency is empty get transaction of all accounts.
    if (currency == 'undefiend' || currency == '' || currency == null) {
      try {
        logger.info('getWebTransactionDetails() called');
        let transRes = await transModel.getWebTransactionDetails(applicantID, rangeDate, toDate);
 
        console.log("1***** after getWebTransactionDetails ****"+ transRes) 
        console.log("2***** after getWebTransactionDetails ****"+ JSON.stringify(transRes)) 
  
        if (transRes.length > 0) {
          //Create the transaction records in perticular order
          let tranDetailRes = await __createResponse(request,transRes);
          console.log("3***** after create response ****"+ tranDetailRes)
          console.log("3***** after create response ****"+ JSON.stringify(tranDetailRes))  
          
 
        
          let k =await tranDetailRes
 
          console.log("5******",k)
 
        
 
         k.forEach(element => {
 
          console.log(element.data)
          let amount =element.data
 
          let sum=0
          amount.forEach(element => {
            sum =sum+element.amount
            
          });
          element.data=sum
         });
 
        let totalAmount = 0;
        k.forEach(element => {
          totalAmount = totalAmount + element.data;
          
        });
        let r = {
          transactionList:k,
          totalAmount: totalAmount
        }
          response.send(ResponseHelper.buildSuccessResponse({
            transaction_details: r
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
      
        let accountRes = await transModel.getFromCurrencyAccountno(currency, applicantID);
        if (accountRes.length > 0) {
          let currency_account = accountRes[0].account_no;
          let webTransByAcc;
       //   let webTransByAccRequest;
         
       //   webTransByAccRequest = await transModel.getWebTransByAccountRequest(currency_account, rangeDate, currentDate);
         
          webTransByAcc = await transModel.getWebTransByAccount(currency_account, rangeDate, toDate);
          
      //   let webTrans = webTransByAcc.concat(webTransByAccRequest);
          if (webTransByAcc.length > 0) {
            //Create the transaction records in particular order
            let webAccRes = await __createResponse(request, webTransByAcc);
            let k =await webAccRes
 
            console.log("5******",k)
   
          
   
           k.forEach(element => {
   
            console.log(element.data)
            let amount =element.data
   
            let sum=0
            amount.forEach(element => {
              sum =sum+element.amount
              
            });
            element.data=sum
           });
   
          let totalAmount = 0;
          k.forEach(element => {
            totalAmount = totalAmount + element.data;
            
          });
          let r = {
            transactionList:k,
            totalAmount: totalAmount
          }
            response.send(ResponseHelper.buildSuccessResponse({
              transaction_details: r
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