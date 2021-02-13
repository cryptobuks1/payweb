/**
 * upload route
 * This is a route file,using for the upload the docuements and get the data which is related to upload documents 
 * @package upload
 * @subpackage router\upload
 * @author SEPA Cyper Technologies, krishnakanth.r
 */
"use strict";

// var uploadFile = require('../controller/upload/upload');
import { uploadFile, getFile, getFileWithStatus, getDocumentsStatus } from '../controller/upload';
import { isTokenValid } from './interceptor';

/*Router for uploading doc for the bussiness */
router.post('/service/upload',isTokenValid, uploadFile);

/*Router for uploaded document status getting */
router.get('/service/uploadstatus',isTokenValid, getFileWithStatus);


/*Router for uploaded documents status getting */

router.get('/service/documentStatus/:business_id', isTokenValid, getDocumentsStatus);


/*Router for getting existing files */
router.get('/service/upload', isTokenValid,getFile);

module.exports = router;