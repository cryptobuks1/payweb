/**
 * kyc route
 * This is a route file, where all the kycStatus && kycIdentity related services are defined. 
 * @package kyc
 * @subpackage sources\services\router\kyc
 * @author SEPA Cyper Technologies, Satyanarayana G.
 */

'use strict';

import { kycCurrentStatus , notifyKycStatus , verifyKyc , updateKycStatus , kycShareholderStatus} from '../controller/kycStatus';
import { createIdentity } from '../controller/kycIdentity';
import { isTokenValid } from './interceptor'

/* Using this router triggering kyc status of current user */
router.post('/service/kyc/status',isTokenValid, kycCurrentStatus);

//router.post('/service/kyc/status',isTokenValid, kycShareholderStatus);

router.get('/service/kyc/shareholder/status/:id',isTokenValid, kycShareholderStatus);


/* Using this router sending kyc status as notification email/mobile */
router.get('/service/kyc/sendKycStatus/:mobileNumber/:email/:status', notifyKycStatus);

/* Using this router verify kyc exist or not  */
router.get('/service/kyc/verifyKyc',isTokenValid, verifyKyc);

/* Using this router triggering create identity */
router.post('/service/kyc/identity',isTokenValid, createIdentity);


/* Using this router triggering  update identity status */
router.put('/service/kyc/updateStatus', updateKycStatus); // updateKycStatus


module.exports = router;