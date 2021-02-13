/**
 * otp route
 * This is a route file, where the otp related services are defined. 
 * @package otp
 * @subpackage sources\services\router\otp
 * @author SEPA Cyper Technologies, Sujit kumar.
 */

"use strict";

import { generateOtp, verifyOtp } from '../controller/otp';
//var otpController = require('../controller/otp');
import { isTokenValid } from './interceptor'


// router for otp
router.post('/service/generateOtp', isTokenValid, generateOtp);
router.post('/service/verifyOtp', isTokenValid, verifyOtp);

module.exports = router;