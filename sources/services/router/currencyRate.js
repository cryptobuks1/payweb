/**
 * currencyRate
 * this is used for the check the current currency rates and also show the convertamount with multiple Currency
 * @package currencyRate
 * @subpackage router/currencyRate
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */
"use strict";

import {currencyRate,deleteCurrencyRate,addRate, getfixerValues, getfixerMultipleValues, getConvertNow} from '../controller/currencyRate';
import { isTokenValid } from './interceptor';

router.post('/service/v1/currencyRate', isTokenValid, currencyRate);
// get fixer rate hitory
router.get('/service/v1/getFixerDetails/:from/:to', isTokenValid, getfixerValues);

router.get('/service/v1/getFixerMultipleCurrDetails/:from/:toArray', isTokenValid, getfixerMultipleValues);
//insert rates or convertion data in database
router.post('/service/v1/checkRate', isTokenValid,addRate);

router.post('/service/v1/convertNow', getConvertNow);
   
// This method is used for delete cuurencyRates
router.delete('/service/v1/currencyRate/:check_rates_id',  isTokenValid,deleteCurrencyRate);
  

module.exports=router;