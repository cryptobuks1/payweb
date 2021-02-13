/**
 * payments route
 * This is a route file, we call payment request to marchent . 
 * @package payments
 * @subpackage sources\services\router\payments
 * @author SEPA Cyper Technologies, Satyanarayana G.
 */

'use strict';

import { addMoney, requestFunds, acceptRequestFunds,declineRequestFunds,cancelRequestFunds, requestFundsNonPayvoo } from '../controller/payments'
import { isTokenValid } from './interceptor'

/*Router for create payments request from payvoo and send response to payvoo via GateWay */

router.post('/service/payment/addMoney',isTokenValid, addMoney);


router.post('/service/payment/requestFunds', isTokenValid, requestFunds);
router.post('/service/payment/requestFundsNonPayvoo', isTokenValid, requestFundsNonPayvoo);

router.patch('/service/payment/cancelRequestFunds', isTokenValid, cancelRequestFunds);
router.patch('/service/payment/acceptRequestFunds', isTokenValid, acceptRequestFunds);
router.patch('/service/payment/declineRequestFunds', isTokenValid, declineRequestFunds);

router.post('/service/payment/bulkPaymentTemplate', isTokenValid, (req, res) => res.download('./assets/bulk_payments_sample.csv'));

module.exports = router;

