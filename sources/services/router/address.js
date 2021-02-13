/**
 * address route
 * address route is used for the user will able to enter the address and get the address details of either
  business or operating or shipping
 * @package address
 * @subpackage router/address
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */

"use strict";

//var address = require('../controller/address/address');
import { createAddress, getAddressDetails, getAddressType, updateAddress, getBusinessAddressDetails } from '../controller/address';
import { isTokenValid } from './interceptor';
//To store the details of address in database through this api
router.post('/service/address',isTokenValid, createAddress);
//update the address of respective person
router.put('/service/address',isTokenValid, updateAddress);
//get the address details of respective person
router.get('/service/address', isTokenValid, getAddressDetails);
//get the all address types
router.get('/service/addressType', isTokenValid, getAddressType);

// get the address details of user
router.get('/')

// router post
router.post('/service/addressBusinessOwner',isTokenValid ,getBusinessAddressDetails);
module.exports = router;