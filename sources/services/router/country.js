/**
 * otp route
 * This is a route fil. 
 * @package otp
 * @subpackage sources\services\router
 * @author SEPA Cyper Technologies.
 */

"use strict";

import {
  getCountriesList,
  getCountryByName,
  getStatusCurrency,
  getCurrencyList,
  getglobalCountry
} from '../controller/country';
//var countryController = require('../controller/country');

// router for country
router.get('/service/country', getCountriesList);
router.get('/service/country/:country_name', getCountryByName);
router.get('/service/v1/statusCurrency', getStatusCurrency);
router.get('/service/v1/currency', getCurrencyList);
//Router for getting Global country list
router.get('/service/globalCountry', getglobalCountry);




module.exports = router;