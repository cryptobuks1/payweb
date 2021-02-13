/**
 * businessSignUp route
 * This is a route file, where all the business related services such as, for registering business, businessIndustries,
 * and business sector details as well as to get the business type and sector type also defined. 
 * @package businessSignUp
 * @subpackage router\businessSignUp
 * @author SEPA Cyber Technologies, Sekhara Suman Sahu , Satyanarayana G.
 */
"use strict";

var business = require('../controller/businessSignup/businessSignup');


// foute for get business sector industries details
router.post('/service/businessSectorIndustriesDetails', function (req, res) {
    business.postSectorAndIndustries(req, res).then(function (response) {
        res.send(response);
    }, function (error) {
        res.send(error);
    });
});


//route for updating business_sector_details.
router.patch('/service/businessSectorIndustriesDetails', function (req, res) {
    business.patchSectorAndIndustries(req, res).then(function (response) {
        res.send(response);
    }, function (error) {
        res.send(error);
    });
});


//route for getting status for dashbosrd.
router.post('/service/status', function (req, res) {
    business.getAccountVerificationStatus(req, res).then(function (response) {
        res.send(response);
    }, function (error) {
        res.send(error);
    });
});



module.exports = router;
