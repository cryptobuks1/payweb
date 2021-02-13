/**
 * trasactions
 * This is a route file, where the identid related service is defined. 
 * @package transactions
 * @subpackage sources\services\router\transactions
 * @author SEPA Cyper Technologies, Satyanarayana G,Krishnakanth R
 */

"use strict"
import { isTokenValid } from './interceptor'
import {
  transaction,
  getTransaction,
  transactionVolume,
  getStatement,
  getTransactionVolume,
  getStatements
} from '../controller/transaction';

/*Router for setting country based transactional modes list */
router.post('/service/countryTransaction', isTokenValid, transaction);

/*Router for getting country based transactional modes list */
router.get('/service/getcountryTransactions', isTokenValid, getTransaction);

/*Router for setting limits for the transaction as volumes */
router.post('/service/transactionVolume', isTokenValid, transactionVolume);

/*Router for getting limits for the transaction as volumes exist */
router.get('/service/gettransactionVolumes', isTokenValid, getTransactionVolume);

router.post('/service/getStatement', isTokenValid, getStatement);

router.post('/service/getStatementPdf', isTokenValid, getStatements);


module.exports = router;




