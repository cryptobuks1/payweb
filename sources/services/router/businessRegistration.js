/**
 * businessSignUp route
 * This is a route file, where all the business related services such as, for registering business, businessIndustries,
 * and business sector details as well as to get the business type and sector type also defined. 
 * @package businessSignUp
 * @subpackage router\businessSignUp
 * @author SEPA Cyber Technologies, Sekhara Suman Sahu , Satyanarayana G.
 */

"use strict";

// import {
//   postSectorAndIndustries,
//   patchSectorAndIndustries
// } from '../controller/businessSignup/businessRegistration';
import {
  businessSignUp,
  businessSignUpWithoutKyb,
  typeOfBusiness,
  typeOfSector,
  typeOfSectorAndIndustries,
  typeOfIndustries,
  patchSectorAndIndustries,
  postSectorAndIndustries
} from '../controller/businessRegistration'
import {isTokenValid} from './interceptor';

//route for business registration service.
router.post('/service/businessRegistration', isTokenValid,businessSignUp);

router.post('/service/businessRegistrationWithOutKyb', isTokenValid ,businessSignUpWithoutKyb);

// foute for get business sector industries details
router.post('/service/businessSectorIndustriesDetails',isTokenValid, postSectorAndIndustries);

//route for updating business_sector_details.
router.patch('/service/businessSectorIndustriesDetails',isTokenValid, patchSectorAndIndustries);

//route for get business_type service.
router.get('/service/businessType', isTokenValid, typeOfBusiness);

//route for get sector_type service.
router.get('/service/sectorType', isTokenValid, typeOfSector);
 
//route for getting business_sector_details.
router.get('/service/businessSectorIndustriesDetails',isTokenValid, typeOfSectorAndIndustries);

//route for get businessIndustries service.
router.get('/service/businessIndustries',isTokenValid, typeOfIndustries);


module.exports = router;
