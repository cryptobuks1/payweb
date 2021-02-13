/**
 * businessSetting route
 * This router contains the feature required in business profile settings.
 * @package businessSetting
 * @subpackage router/businessSetting
 *  @author SEPA Cyper Technologies, Sekhara Suman Sahu
 */

import {
  getbusinessRole,
  createNewBusiRole,
  updateBusiRole,
  deleteRole,
  mapUserToBusiness,
  getMappedUser,
  getInvitedBusinessUsers
} from '../controller/businessSettings';
import {
  isTokenValid
} from './interceptor';


router.get('/service/businessRole', isTokenValid, getbusinessRole);
router.post('/service/createRole', isTokenValid, createNewBusiRole);
router.patch('/service/updateRole', isTokenValid, updateBusiRole);
router.patch('/service/deleteRole', isTokenValid, deleteRole);

router.get('/service/getInvitedBusinessUsers', isTokenValid, getInvitedBusinessUsers);
router.get('/service/getBusinessUser', isTokenValid, getMappedUser);
router.post('/service/mapUserToBusiness', isTokenValid, mapUserToBusiness);




module.exports = router;