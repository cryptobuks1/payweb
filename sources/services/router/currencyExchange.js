/**
 * currencyExchange route
 * currencyExchange route is used for the user will able to enter the currencyExchange and get,update,delete and insert the currencyExchange details 
 * @package currencyExchange
 * @subpackage router/currencyExchange
 *  @author SEPA Cyper Technologies,Tarangini Dola
 */
'use strict';
import {deleteCurrencyExchange,updateCurrencyExchange,getCurrencyExchange,insertCurrencyExchange,getExchangeAmount} from '../controller/currencyExchange';
import {isTokenValid} from './interceptor';
router.post('/service/v1/currencyExchange',isTokenValid,insertCurrencyExchange);
router.delete('/service/v1/currencyExchange/:auto_exchange_id',isTokenValid,deleteCurrencyExchange);
router.put('/service/v1/currencyExchange',isTokenValid,updateCurrencyExchange);
router.get('/service/v1/currencyExchange',isTokenValid,getCurrencyExchange);
router.get('/service/v1/currencyExchange/:to/:from/:amount',isTokenValid, getExchangeAmount);


module.exports = router;