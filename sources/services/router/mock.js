/**
 * mock route 
 * This is a route defines merchent/mock related routes implementation. 
 * @package mock route
 * @subpackage sources\services\router\mock route
 * @author SEPA Cyper Technologies, Sujith ,Satya.
 */

"use strict";
import {checkValidUser,getCard,fetchPaymentsMock,addMoney,userLogin,saveUser,saveCard} from '../controller/mock';

router.get("/getAllPayments",checkValidUser,fetchPaymentsMock);
router.get("/card/:applicant_id", getCard);
router.post("/payments", checkValidUser, addMoney);
router.post("/login", userLogin);
router.post("/userRegistration",saveUser);
router.post("/card", saveCard);



module.exports = router;
