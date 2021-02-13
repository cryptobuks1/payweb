/**
 * address route
 * address route is used for the user will able to enter the address and get the address details of either
  business or operating or shipping
 * @package businessAddress
 * @subpackage router/businessAddress
 *  @author SEPA Cyper Technologies,J. Madhu Kumar
 */

"use strict";

import { createBusinessOwnersAddress, updateBusinessOwnersAddress } from '../controller/businessOwnersAddress';
import { isTokenValid } from './interceptor';



router.post('/service/businessOwnerAddress',isTokenValid, createBusinessOwnersAddress);

router.put('/service/businessOwnerAddress',isTokenValid, updateBusinessOwnersAddress);


module.exports = router;