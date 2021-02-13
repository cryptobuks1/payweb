/**
 * contact route
 * contact route is used for the user will able to enter the contact details in the database and get the contact details from
 * database
 * @package contact
 * @subpackage router/contact
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */
"use strict";

//var contact = require('../controller/contact/contact');
import { addContact, updateContact, getContactDetails,savePeerContact,getPeerContact } from '../controller/contact';
import { isTokenValid } from './interceptor'
//This is api using for the store the contact details in our database

router.post('/service/contact',isTokenValid, addContact);
router.put('/service/contact',isTokenValid, updateContact);
router.get('/service/contact',isTokenValid, getContactDetails);
router.get('/service/v1/peerContact',isTokenValid, getPeerContact);
router.post('/service/v1/peerContact',isTokenValid, savePeerContact);


module.exports = router;