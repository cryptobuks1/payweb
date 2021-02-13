/**
 * loggerConfigure route
 * This is a route file, where the loggerConfigure related services are defined. 
 * @package otp
 * @subpackage sources\services\router\loggerConfigure
 * @author SEPA Cyper Technologies, Satyanaraayna G.
 */

'use strict';

import { updateConfiguration } from '../controller/loggerConfigure';

/* Update logger configuration while trigger this api's */
router.post('/service/log/updateConfiguration',  updateConfiguration);


module.exports = router;