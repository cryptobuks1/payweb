/**
 * businessDetails route
 * This is a route file, where the registered business related services are defined. 
 * @package businessDetails
 * @subpackage router/businessDetails
 * @author SEPA Cyber Technologies,  Sekhara Suman Sahu.
 */
import {saveBusinesDetails, updateBusinessDetails, getBusinessDetails} from '../controller/businessDetails';

 // foute for get business sector industries details
router.post('/service/business/sectorAndIndutryDetail', saveBusinesDetails);

//route for updating business_sector_details.
router.patch('/service/business/sectorAndIndutryDetail', updateBusinessDetails);

//route for getting business sector and industry detail
router.get('/service/business/sectorAndIndutryDetail', getBusinessDetails);

module.exports = router;