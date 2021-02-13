import { registerUser, kycEntry, isUserExists, sendSandboxDetails, userLogout} from '../controller/signUp';
import { forgotPassword, resetPassword, updatePassword, changePassword, resetPin } from '../controller/password';
import { loginUser } from '../controller/login';
import { pushNotification } from '../controller/pushNotification';
import { isTokenValid, refreshToken } from './interceptor'


// route for password
router.post("/service/user/forgotPassword",  forgotPassword)
router.post("/service/user/resetPassword",  resetPassword);
router.post("/service/user/forgotPassword/:type/:code", updatePassword);
router.post("/service/user/changePassword", isTokenValid, changePassword);
router.post("/service/user/resetPin",  resetPin);

//Service for user registration.
router.post('/service/user/registration',isTokenValid, registerUser);
//Service for checking email or phone number given by user already exist or not
router.post('/service/user/isUserExists',isTokenValid, isUserExists);

// service for user Login
router.post('/service/user/login',isTokenValid, loginUser);
router.post('/service/user/kycEntry', kycEntry)

//route for sending email to send box user
router.post('/service/v1/sandBoxDetailsEmail',isTokenValid, sendSandboxDetails);

//route for logout
router.get('/service/user/logout', isTokenValid, userLogout);

// route for session extension
router.post('/service/user/extendSession', refreshToken);

// add push notification
router.post('/service/user/send',pushNotification)

module.exports = router;
