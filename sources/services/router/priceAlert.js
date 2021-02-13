/**
 * pricealert route
 * pricealert route is used for the user will able to create the  price alerts
 * @package pricealert
 * @subpackage router/pricealert
 *  @author SEPA Cyper Technologies,krishnakanth r
 */

import {createAlert,getPriceAlerts,updatePriceAlerts,deletePriceAlerts} from '../controller/priceAlert';
import {isTokenValid} from './interceptor';

router.post('/service/v1/pricealert',isTokenValid,createAlert);
router.get('/service/v1/pricealert',isTokenValid,getPriceAlerts);
router.put('/service/v1/pricealert',isTokenValid,updatePriceAlerts);
router.delete('/service/v1/pricealert/:price_alert_id',isTokenValid,deletePriceAlerts);

module.exports = router; 