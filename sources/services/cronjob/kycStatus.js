/**
 * kycstatus Cronjob
 * kycstatus is used for generating kyc details.
 * @package kycstatus
 * @subpackage cronjob/kycindex
 *  @author Incrivelsoft Technologies.
 */
import {
  DbConnMgr
} from '../dbconfig/dbconfig';
import {
  _processKycStatus
} from '../controller/kycStatus';

const db = DbConnMgr.getInstance();

// var AsyncLock = require('async-lock');
// var lock = new AsyncLock()


/**
 * @desc Cron for check and update kyc status for all PENDING kyc's
 * @method getAndUpdateKycStatus  
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */
export var getAndUpdateKycStatus = async () => {
  console.log("Calling cron getAndUpdateKycStatus()");
  logger.info("Calling cron getAndUpdateKycStatus()");
  return new Promise((resolve, reject) => {
    db.doRead(`SELECT k.kyc_status, k.kyc_vendor_id, k.kyc_transaction_id, c.applicant_id,c.email, c.mobile FROM kyc k INNER JOIN contact c
      ON k.applicant_id = c.applicant_id where k.kyc_status LIKE '%PENDING%' || k.kyc_status LIKE '%CHECK_PENDING%' || k.kyc_status LIKE '%FRAUD_SUSPICION%' || k.kyc_status LIKE '%NOT_FOUND%'`).then((kycList, err) => {
      if (kycList.length > 0) {
        _.forEach(_.filter(kycList), async (row) => {
          try {
            if (row.kyc_vendor_id) {
              console.log("Inside the cron: kyc status for applicantid:(" + row.applicant_id + "), current status: (" + row.kyc_status + "), vendor id : (" + row.kyc_vendor_id + ")");
              console.log("Taking out lock from here : cron");
              //   lock.acquire(row.applicant_id, async function () {
                console.log("Lock aquired by  applicant_id [" + row.applicant_id + "]")
                await _processKycStatus(row.applicant_id, row.kyc_status, 2 )
              // }, async function (err, ret) {
              //   console.log("Lock released by on applicant [", row.applicant_id + "]");
              //   console.log(row.applicant_id + " Freeing lock", ret)
              // }, {});
            }

          } catch (err) {
            console.log("error in cron kyc status", err)
            //reject({ err: err });
          }
        });
      }
    }).catch(err => {
      // reject({ err: err }); 
    });
  });
}




/**
 * @desc this method  for change status 
 * @method changeStatus  
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */
var changeStatus = function (value, id) {
  return new Promise((resolve, reject) => {
    db.doUpdate(`update currency_exchange set exchange_status =${value} where auto_exchange_id = ${id}`).then(message => {
      resolve(message)
    }).catch(err => {
      reject(err);
    })
  })
}