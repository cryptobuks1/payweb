/**
 * scheduleTransfer route
 * This router file is to support services for get Schedule transfer transactions.
 * @package scheduleTransfer
 * @subpackage sources\services\router\scheduleTransfer
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu
 */

 //Route for getting all the details of scheduled transfer of a particular user

 import { getScheduleTransfers, deleteScheduleTransfer } from '../controller/scheduleTranfer';
 import { isTokenValid } from '../router/interceptor';


 router.get('/service/scheduleTransfers', isTokenValid, getScheduleTransfers);
 router.post('/service/deletScheduleTransfer', isTokenValid, deleteScheduleTransfer);

 module.exports = router;