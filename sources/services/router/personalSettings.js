/**
 * personalSettings route
 * This is a route file, which contains routes for personal profile settings.
 * @subpackage sources\services\router\personalSettings
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu,Tarangini dola.
 */
import { isTokenValid } from '../router/interceptor';
import { validation } from '../utility/dataValidation';
import { getPersonaProfile, getBusinessProfile, settingChangePass,privacy,getPrivacy,accActivateOrDeactivate,editPersonalProfile,updatePasscode,plans,createPlans} from '../controller/personalSettings';

 //Route for getting personal info
router.get('/service/settings/personalProfile', isTokenValid, getPersonaProfile);

//Route for getting business profile data
router.get('/service/settings/businessProfile', isTokenValid, getBusinessProfile);

//Route for changepassword in setting
router.post('/service/settings/changePassword', isTokenValid, settingChangePass);

//Router for demo GET
router.get('/', (req, res)=>{ res.send('Server is Accessable')});

//Router for privacy marketing notifications
router.patch('/service/settings/privacy',isTokenValid,validation('privacyNotifications'), privacy);

//Router for privacy settings notification
router.get('/service/settings/privacyNotify',isTokenValid,getPrivacy);

//Router for Account activate or deactivate
router.patch('/service/setting/accountActivateOrDeactivate',isTokenValid,validation('activeordeactiveaccount'),accActivateOrDeactivate);

//Route for edit personal settings
router.patch('/service/settings/editPersonalProfile', isTokenValid, editPersonalProfile);

//Router for update pin
router.patch('/service/settings/changePasscode',isTokenValid, validation('changePin'), updatePasscode);

//Router for plans
router.get('/service/settings/plans',isTokenValid,plans);

//Router for insert plan details
router.post('/service/settings/createPlans',isTokenValid,createPlans);

 module.exports = router;