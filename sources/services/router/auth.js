/**
 * uploadModel
 * This is using for to store the files as base64 format in database and get the data from database.
 * @package uploadModel
 * @subpackage model/uploadModel
 *  @author SEPA Cyper Technologies, sujit.kumar
 */

"use strict";
var authenticateController = require('../controller/authentication/authController')

router.post("/authenticate", (request, response) => {
    authenticateController.obj.authenticate(request.body.member_id, request.body.api_key).then(function (result) {
        response.send(result);
    }, (errResponse) => {
        response.send(errResponse);
    })
})


module.exports = router;
