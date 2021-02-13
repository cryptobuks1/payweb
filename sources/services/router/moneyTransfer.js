
/**
 * moneyTransfer
 * This router contains all the services related to account to account money transfer.
 * @package moneyTransfer
 * @subpackage router/moneyTransfer
 * @author SEPA Cyber Technologies Sekhara Suman Sahu
 */
import { isTokenValid } from './interceptor';
import { getWebTransaction, moneyTransfer, transactionDetails, walletPayments, 
    payNonPayvooUser, getNonPayvooTransactionDetails, bulkPaymentsTotal } from '../controller/moneyTransfer';
//import { setBusinessRole } from '../controller/businessSettings';
// import {walletToWalletTransfer, transactionDetails, getWebTransaction} from '../controller/moneyTransfer'; 
/* Transaction route*/
router.post('/service/v1/transfer/walletToWallet', isTokenValid, moneyTransfer);

/* Get transaction details*/
router.get('/service/v1/transfer/:currency_type/:device_type', isTokenValid, transactionDetails);

/*GET we transaction details for WEB*/
router.post('/service/webTransactionDetails', isTokenValid, getWebTransaction);
router.post('/service/getTransactionDetails', isTokenValid, getWebTransaction);
/*Router to perform Bulk transfer*/
router.post('/service/transfer/walletPayments', isTokenValid, walletPayments);
//router.get('/service/transfer/st', setBusinessRole);

// Handle and save non payvoo user payment transaction
router.post('/service/transfer/nonPayvooUser', isTokenValid, payNonPayvooUser);

// Get details of a specific non-payvoo user payment transaction
router.get('/service/transfer/nonPayvooUser/:unique_payment_id', isTokenValid, getNonPayvooTransactionDetails);

router.post('/service/bulkPaymentsTotal',  isTokenValid, bulkPaymentsTotal);

module.exports = router;
