/**
 * address route
 * address route is used for the user will able to enter the address and get the address details of either
  business or operating or shipping
 * @package businessAddress
 * @subpackage router/businessAddress
 *  @author SEPA Cyper Technologies,J. Madhu Kumar
 */

"use strict";

import { getBusinessPersonalProfileContact, businessPersonalProfileContact,businessPersonalProfileAddress,getBusinessPersonalProfileAddress } from '../controller/businessPersonalProfile';
import { isTokenValid } from './interceptor';

router.get('/service/businessPersonalProfileContact',isTokenValid, getBusinessPersonalProfileContact);
router.post('/service/businessPersonalProfileContact',isTokenValid, businessPersonalProfileContact);

router.get('/service/businessPersonalProfileAddress',isTokenValid, getBusinessPersonalProfileAddress);
router.post('/service/businessPersonalProfileAddress',isTokenValid, businessPersonalProfileAddress);


module.exports = router;