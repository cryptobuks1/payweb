/**
 * Card route
 * This is a route file, where the User Card related services are defined. 
 * @package card
 * @subpackage router/card
 * @author SEPA Cyber Technologies, Sujit kumar , Sekhara Suman Sahu.
 */

"use strict";

import {addCard, deleteCard, getAllCards,getCardType} from '../controller/card';
import { isTokenValid } from './interceptor';

/* To get the card type */
router.get('/service/v1/validateCard/:cardNumber', getCardType);
   

/*Route for inserting card details*/
router.post('/service/v1/card',isTokenValid, addCard);
/* Route for deleting card */
router.patch('/service/v1/card',isTokenValid, deleteCard);
/* router for getting all the card associated with an user */
router.get('/service/v1/card',isTokenValid, getAllCards);


module.exports = router;