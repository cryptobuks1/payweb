/**
 * address route
 * address route is used for the user will able to enter the address and get the address details of either
  business or operating or shipping
 * @package businessAddress
 * @subpackage router/businessAddress
 *  @author SEPA Cyper Technologies,J. Madhu Kumar
 */

"use strict";

import { createBusinessAddress,getBusinessAddress } from '../controller/businessAddress';
import { isTokenValid } from './interceptor';


router.get('/service/businessAddress',isTokenValid, getBusinessAddress);
router.post('/service/businessAddress',isTokenValid, createBusinessAddress);


module.exports = router;