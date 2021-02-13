/**
 * signUpController Controller
 * signUpController is used for the user registration purpose. An individual user has to give the required 
 * data to register himself in the payvoo app.
 * @package signUpController
 * @subpackage controller/signUP/signUpController
 * @author SEPA Cyber Technologies, Sekhara Suman Sahu.
 */

"use strict";

import { country } from '../model/country';
import { Login } from '../model/login';
import { configVariable } from '../utility/country';
import { langEngConfig } from '../utility/lang_eng';
let login = new Login();

const STATUS = {
  FAILED: 1,
  SUCCESS: 0
};

/**
 * This function is used to get country details by country name 
 * @method getCountriesList 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @description It returns the list of countries.
 */
export const getCountriesList = (request, response) => {
  let countryObject = new country(request);
  logger.info('getCountriesList initiated')
  countryObject.getCountriesList().then(result => {
    //Filtering EURO and USA country
    let countyList = _.filter(result, function (data) {
      return data.country_name != 'USA' && data.country_name != 'EUROPE';
    })
    logger.info('getCountriesList fetched successfully')
    response.send(ResponseHelper.buildSuccessResponse({ "country list": countyList }, langEngConfig.message.country.success, STATUS.SUCCESS))
  }).catch(err => {
    logger.error('Error while fetching countries list ')
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  });

}

/**
 * This function is used to get country details by country name 
 * @method getCountryByName 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return country details by country name.
 */
export const getCountryByName = (request, response) => {
  let countryObject = new country(request.params);
  logger.info('getCountryByName initiated')
  let countryName = countryObject.country_name ? countryObject.country_name : ''
  if (countryName) {
    countryObject.getCountryByName(countryName).then(result => {
      if (result.length == 0) {
        logger.debug('There is no countries by name');
        return response.send(ResponseHelper.buildSuccessResponse({ "countries list": result }, langEngConfig.message.country.nocountry, STATUS.SUCCESS));
      }
      logger.info('get countries by name fetched successfully')
      return response.send(ResponseHelper.buildSuccessResponse({ "countries list": result }, langEngConfig.message.country.successbyname, CONSTANTS.DEFAULT_CODES.SUCCESS));
    }).catch((err) => {
      logger.error('Fail to fetch countries by name')
      return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.country.fail)));
    })
  } else {
    logger.debug('Invalid input details for get countries by name')
    return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.country.invalidinput, STATUS.FAILED));
  }

}

/**
 * This function is used to get Currency details 
 * @method getStatusCurrency 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return Currency details.
 */
export const getStatusCurrency = (request, response) => {
  logger.info('getStatusCurrency initiated');
  let countryObject = new country(request.params);
  countryObject.getStatusCurrency(request, response).then(result => {
    if (typeof result[0] == 'undefined' || _.size(result) == 0) {
      logger.debug('There is no status currency')
      return response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.indexCountry.inputError)));
    }
    logger.info('get countries currency status successfully')
    return response.send(ResponseHelper.buildSuccessResponse({ currency: result }, configVariable.message.indexCountry.success, STATUS.SUCCESS));
  }).catch((err) => {
    logger.error('Fail to fetch countries currency status')
    return response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.indexCountry.inputError)));
  }).catch(e => {
    logger.error('Fail to fetch countries currency status')
    return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.indexCountry.fetchfail)));
  })
}

/**
 * This function is used to get Currency list
 * @method getCurrencyList 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return Currency details.
 */
export const getCurrencyList = (request, response) => {
  logger.info('getCurrencyList initiated');
  let countryObject = new country(request.params);
  countryObject.getDistinctCurrency().then(result => {
    if ( result && result.length > 0) {
      let euro = result.filter(item => item.country_id === 2);
      let finalResult = euro.concat(result.filter(item => item.country_id !== 2));
      logger.info('get currency list successfully')
      response.send(ResponseHelper.buildSuccessResponse({ currency: finalResult }, langEngConfig.message.indexCurrency.success, STATUS.SUCCESS));
    }
    else {
      logger.debug('There is no currency list found')
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.indexCurrency.nodata)));
    }
  }).catch(e => {
    logger.error('Fail to fetch currency list')
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.indexCurrency.fetchfail)));
  })
}

//Method for fetching global country list
/**
 * This function is used to get global Currency list
 * @method getglobalCountry
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return Currency details.
 */

 export const getglobalCountry = (request, response) =>{
   logger.info('getglobalCountry() called');
   __getGlobCountry().then(result=>{
    logger.info('getglobalCountry() execution completed');
     response.send(result);
   }).catch((err) => {
    logger.error('Error while fetching global country ')
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  });
 }

 //Private method to support get global country list service
 const __getGlobCountry = async()=>{
   try{
     let countryList = await login.getGlobalCountryList();
     if(countryList){
      return ResponseHelper.buildSuccessResponse({global_country_list : countryList}, langEngConfig.message.indexCountry.countrySucc, STATUS.SUCCESS);
     }
     return ResponseHelper.buildSuccessResponse(countryList, langEngConfig.message.indexCountry.countryFail, STATUS.FAILED);
   } catch(err){
     logger.error('Error occured '+ err);
     ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.signUp.signUpError));
   }
 }