import {merchantGatewayCheck,
  merchantRedirectUrlDetails,
  getByCurrency,
  payWithPayVoo,
  getTransactions
  
  } from '../controller/merchant';
import { isTokenValid } from './interceptor';



router.post('/service/merchant/gatewayCheck',merchantGatewayCheck);
router.get('/service/merchant/getOrderDetails/:orderDetails',merchantRedirectUrlDetails);

// router.get('/merchant/v1/validateCard/:cardNumber', getCardType);

router.post('/service/merchant/v1/getByCurrency',isTokenValid, getByCurrency)
// router.patch("/merchant/v1/account",isTokenValid, updateAccountStatus);
router.post('/service/merchant/v1/payWithCard',isTokenValid,payWithPayVoo)



router.get('/service/merchant/v1/transactons',isTokenValid,getTransactions);

// /* Transaction route*/
// router.post('/merchant/v1/transfer/walletToWallet', isTokenValid, moneyTransfer);

// router.get('/merchant/v1/transactons',isTokenValid,getTransactions);

// router.post('/merchant/payment/addMoney',isTokenValid, addMoney);
module.exports = router; 