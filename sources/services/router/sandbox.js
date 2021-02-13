import {sandboxGatewayCheck,
        moneyTransfer,
        payWithPayVoo,
        SandboxRedirectUrlDetails,
        getCardType,
        addCard,
        deleteCard,
        getAllCards,
        createAccount,
        getAccounts,
        getByCurrency,
        getTransactions,
        updateAccountStatus,
        
        addMoney} from '../controller/sandbox';
import { isTokenValid } from './interceptor';



router.post('/service/sandbox/gatewayCheck',sandboxGatewayCheck);
router.get('/service/sandbox/getOrderDetails/:orderDetails',SandboxRedirectUrlDetails);
// router.post('/sandboxTransactions',sandboxTransactions)

/* To get the card type */
router.get('/service/sandbox/v1/validateCard/:cardNumber', getCardType);
/*Route for inserting card details*/
router.post('/service/sandbox/v1/card',isTokenValid, addCard);
/* Route for deleting card */
router.patch('/service/sandbox/v1/card',isTokenValid, deleteCard);
/* router for getting all the card associated with an user */
router.get('/service/sandbox/v1/card',isTokenValid, getAllCards);



router.post("/service/sandbox/v1/account",isTokenValid, createAccount);
router.get('/service/sandbox/v1/account',isTokenValid, getAccounts)
router.post('/service/sandbox/v1/getByCurrency',isTokenValid, getByCurrency)
router.patch("/service/sandbox/v1/account",isTokenValid, updateAccountStatus);

router.post('/service/sandbox/v1/payWithCard',isTokenValid,payWithPayVoo)


/* Transaction route*/
router.post('/service/sandbox/v1/transfer/walletToWallet', isTokenValid, moneyTransfer);

router.get('/service/sandbox/v1/transactons',isTokenValid,getTransactions);

router.post('/service/sandbox/payment/addMoney',isTokenValid, addMoney);
module.exports = router; 