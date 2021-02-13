/**
 * account route
 * account route is used for the user will able to enter the account and get the account details of either
  business or operating or shipping
 * @package account
 * @subpackage router/account
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */


import {createAccount, updateAccountStatus, getAccounts, getByCurrency} from "../controller/account";
import { isTokenValid } from './interceptor';

// Route for creating new currency account
router.post("/service/v1/account",isTokenValid, createAccount);
router.get('/service/v1/account',isTokenValid, getAccounts)
router.get('/service/v1/getByCurrency',isTokenValid, getByCurrency)
router.patch("/service/v1/account",isTokenValid, updateAccountStatus);

module.exports = router;
