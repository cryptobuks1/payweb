/**
 * sendLink route
 * This is a route file, where the Kyc link related service is defined. This route will call its
 * respective controller method which will send a deep link from web to user mobile using which a user
 * can complete their KYC.
 * @package sendLink
 * @subpackage sources\services\router\sendLink
 * @author SEPA Cyper Technologies, Sujit Kumar.
 */
"use strict";

import {sendLink,sendInvitation} from '../controller/sendLink';
import { getUserDataFromToken } from '../controller/signUp';

import {isTokenValid} from './interceptor';


router.post('/service/sendInvitation', isTokenValid , sendInvitation);
router.get('/service/downloadKycLink/:mobileNumber/:email/:platFormType/:identId',sendLink);
router.get('/service/token/:token', getUserDataFromToken);


module.exports = router;


