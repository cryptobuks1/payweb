/**
 * commonCode
 * commonCode for currencyExcahnge and MobileOtp
 * @package kycEntry
 * @subpackage controller/kycEmtry/kycEntry
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */
import { callCurrencyExchangeMuse, callCurrencyExchangeRateMuse } from './museCommManager'


"use strict";

/**
* @desc get currency exchange details.
* @method currencyExchange
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return return all checkrateid.
*/
let currencyExchange = (from, to, checkRates_id) => {
  return new Promise((resolve, reject) => {
    fixer.latest({ base: from, symbols: [to] }).then((rate) => {
      resolve({ rate: rate.rates[to], status: 1, from: from, to: to, checkRates_id: checkRates_id })
    }).catch((err) => {
      reject({ rate: 0, status: 0 })
    });
  })
}
/**
* @desc get currency exchange details.
* @method getcurrencyExchangeMuse 
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return return all checkrateid.
*/
let getcurrencyExchangeMuse = async (from, to, checkRates_id) => {
  logger.info("Initiate getcurrencyExchangeMuse");
  return new Promise(async function (resolve, reject) {   
        let response = await callCurrencyExchangeMuse(from, to, global.access_token)
          if(response && response.data){
            resolve({ rate: response.data[to], status: 1, from: from, to: to, checkRates_id: checkRates_id })  
          }else{
            resolve({ rate: 0, status: 0 })
          }
      // }).catch(err => {
      //   reject({ err: err });
      //   })    
  })
}
/**
* @desc get currency exchange rates.
* @method currencyExchangeRates
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return 
*/
let currencyExchangeRates = function (from, to) {
  return new Promise(function (resolve, reject) {
    newFixer.between({
      start_date: new Date(new Date() - (30*86400000)).toISOString().slice(0,10),
      end_date: new Date().toISOString().slice(0,10),
      symbols: to,
      base: from
    }).then((rate) => {
      resolve({ rate: rate.rates, status: 1, from: from, to: to })
    }).catch((err) => {
      resolve({ rate: 0, status: 0 })
    });
  })
}
/**
* @desc get currency exchange rates.
* @method getCurrencyExchangeRateMuse
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return 
*/
let getCurrencyExchangeRateMuse = async (from, to, forMobile) => {
  let numberOfDays = 7;
  // if(forMobile) {
  //   numberOfDays = 7;    
  // }
  logger.info("Initiate getcurrencyExchangeRateMuse");
  let start_date= new Date(new Date() - (numberOfDays*86400000)).toISOString().slice(0,10)
  let end_date= new Date().toISOString().slice(0,10)
//  return new Promise (async (resolve, reject) => {  
        try {
        let response = await callCurrencyExchangeRateMuse(from, to, start_date, end_date, global.access_token)
          if(response && response.data && response.data.rates){
            return ({ rate: response.data.rates, status: 1, from: from, to: to })
          } else{
            return ({ rate: 0, status: 0 })
          }
      } catch(err) {
        return ({err: err})
        }      
//  })
}




export {
  currencyExchange,
  currencyExchangeRates,
  getcurrencyExchangeMuse,
  getCurrencyExchangeRateMuse
}

