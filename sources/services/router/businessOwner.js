
/**
 * businessOwner route
 * This is a route file, where all the businessOwner related services are defined. 
 * @package businessOwner
 * @subpackage sources\services\router\businessOwner
 * @author SEPA Cyber Technologies, Tarangini Dola , Satyanarayana G
 */

"use strict";

import { saveBusinessOwner, getStakeholdersInfo, getStakeholdersInfoById,updatedKYBStatusDetails,
    createBusinessOwner, updateDetail, getBusinessOwnersById,getVerifyIdentiesInformation,getStructureOfBusiness,
     addBusinessOwner, getBusinessOwnersByCId, updateBusinessOwnerStatus, updateBusinessOwner, deleteBusinessOwnerKyb, getBusinessOwnerDetails, getBusinessOfOwner } from '../controller/businessOwner';
import { isTokenValid } from './interceptor'

router.post('/service/businessOwner',isTokenValid, saveBusinessOwner);
router.get('/service/businessOwners/:type', isTokenValid, getStakeholdersInfo);

router.get('/service/businessOwnersById/:id', isTokenValid, getStakeholdersInfoById);
router.put('/service/businessOwners/:id', isTokenValid, updateDetail);
router.get('/service/businessOwnersList', isTokenValid, getBusinessOwnersById);

router.post('/service/businessOwners', isTokenValid, addBusinessOwner);// by list
router.get('/service/businessOwnersContact', isTokenValid, getBusinessOwnersByCId);
router.patch('/service/businessOwners', isTokenValid, updateBusinessOwnerStatus);
router.put('/service/businessOwners', isTokenValid, updateBusinessOwner);

router.delete('/service/businessOwners/:bo_id/:type', isTokenValid, deleteBusinessOwnerKyb);
router.post('/service/businessOwnerDetails', getBusinessOwnerDetails);

router.post('/service/businessDetailsOfOwner',isTokenValid ,getBusinessOfOwner);

router.post('/service/createBusinessOwner', isTokenValid, createBusinessOwner);

router.get('/service/updatedKYBStatusDetails', isTokenValid, updatedKYBStatusDetails);
router.get('/service/getVerifyIdentiesInformation', isTokenValid, getVerifyIdentiesInformation);
router.get('/service/structureOfBusiness', isTokenValid,  getStructureOfBusiness)

module.exports = router;

