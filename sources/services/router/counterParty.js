/**
 * counterParty route
 *  counterParty route is used for the user will able to create countetParty and it will give the counterparty names based upon search
 * @package counterparty
 * @subpackage router/counterparty 
 *  @author SEPA Cyper Technologies,krishnakanth r
 */
import { uploadCsvFile, uploadXlsxFile, beneficiarysList,createBenificary,getCounterParties,deleteCounterParty,getCounterPartiesList,getCounterPartyCurrencies} from '../controller/counterParty';
import {isTokenValid} from './interceptor';
import {getCategory,getMerchant,getCountry, getTransactionDetailsByDate} from '../controller/analytics';
import { getPhysicalCards, getVirtualCards, getNewCards, physicalCardDetails, virtualCardDetails } from '../controller/phyVirCards';
 
router.get('/service/v1/globalsearch/:limit/:name',isTokenValid,beneficiarysList);
router.post('/service/v1/counterparty',isTokenValid,createBenificary);
router.get('/service/v1/counterparty/:limit/:name',isTokenValid,getCounterParties);
router.delete('/service/v1/counterparty/:counterparty_id',isTokenValid,deleteCounterParty);
router.get('/service/v1/counterparty',isTokenValid,getCounterPartiesList);
router.get('/service/v1/counterPartyCurrency/:mobile',isTokenValid,getCounterPartyCurrencies);
router.post('/service/v1/uploadCsv', isTokenValid, uploadCsvFile);
router.post('/service/v1/uploadXlsx', isTokenValid, uploadXlsxFile);
router.post('/service/v1/getCategory', isTokenValid, getCategory);
router.post('/service/v1/getMerchant', isTokenValid, getMerchant);
router.post('/service/v1/getCountry', isTokenValid, getCountry); 
router.post('/service/v1/getTransactionDetailsByDate', isTokenValid,getTransactionDetailsByDate);
router.get('/service/v1/getPhysicalCards',isTokenValid, getPhysicalCards);
router.get('/service/v1/getVirtualCards',isTokenValid, getVirtualCards);
router.post('/service/v1/getNewCards',isTokenValid, getNewCards);
router.get('/service/v1/physicalCardDetails',isTokenValid, physicalCardDetails);
router.get('/service/v1/virtualCardDetails',isTokenValid, virtualCardDetails);

module.exports = router;

 