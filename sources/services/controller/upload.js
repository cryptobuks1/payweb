/**
 * uploadModel
 * This is using for to store the files as base64 format in database and get the data from database.
 * @package uploadModel
 * @subpackage model/uploadModel
 *  @author SEPA Cyper Technologies, krishnakanth.r
 */
"use strict";
import {
  langEngConfig
} from '../utility/lang_eng';
import {
  Upload
} from '../model/uploadModel';

const STATUS = {
  SUCCESS: 0,
  FAILURE: 1,
  SUBMITTED: "1",
  NOT_AVAILABLE: "0"
}
var fs = require('fs');
const path = require('path');
/**
 * @desc Upload the files or images data in database
 * @method uploadFile
 * @param {object} request -- it is request object
 * @param {object} response --it is response object
 **/
export let uploadFile = function (request, response) {
  logger.info("uploadFile() initiated");
  const upload = new Upload(request.body);
  let applicantId = request.params.applicant_id;
  if (applicantId && upload.file_name != '' && upload.file_name && upload.file_content != '' && upload.file_type != '') {
    // let fileName = _.upperCase(upload.file_name);
    let fileName = upload.file_name;
    let doc_name = upload.doc_name;
    upload.getBusinessId(applicantId).then(results => {
      if (results.length > 0) {
        logger.info("successfully get the results");
        let id = results[0].business_id;
         upload.getCustomerId(applicantId).then(results => {
          if(results.length > 0) {
            let customerId = results[0].customerId;
            return uploadDocs(id, doc_name, fileName, upload, response, customerId);
          } else {
            logger.info('no data with respective id');
            return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.upload.invalid, STATUS.FAILURE));
          }
        }).catch(err => {
          return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
        })        
      } else {
        logger.info('no data with respective id');
        return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.upload.invalid, STATUS.FAILURE));
      }
    }).catch(err => {
      return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
    })
  } else {
    logger.debug("invalid request");
    logger.info("response sent");
    return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.upload.invalid, STATUS.FAILURE));
  }
}

let uploadDocs = (id, doc_name, fileName, upload, response, customerId) => {
  logger.info("uploadDocs initiated");
  const data = {
    fieldname: 'file',        
    originalname: customerId +"_"+doc_name,
    mimetype: upload.doc_name.split(".")[1]
  };
  let filePath = path.join(process.env.FILE_UPLOAD_LOCATION, data.originalname);
  upload.getBusinesDocsId(id, fileName).then(results => {
    if (results.length > 0) {
      logger.info("successfully get results");
      upload.updateDocs(upload.file_type, data.originalname, id, fileName).then(results => {
        if ((results.affectedRows) > 0) {
          logger.info("updated successfully");
          logger.info("response sent");
          return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.upload.success, STATUS.SUCCESS));
        } else {
          logger.debug("failed to update");
          return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.upload.fail, STATUS.FAILURE));
        }
      }).catch(err => {
        logger.error("error in while updating data");
        return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
      });
    } else {
      console.log("Inserting document");
      let doc_status = 4;      
      let buff = Buffer.from(upload.file_content, 'base64');    
     
   //   fs.writeFileSync(data.originalname+ "." +data.mimetype, buff);     
      fs.writeFile(filePath, buff, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      });
      upload.insertDocs(upload.file_type, data.originalname, id, data.originalname, fileName, doc_status).then(results => {
        if ((results.affectedRows) > 0) {
          logger.info("inserted successfully");
          logger.info("response sent");
          return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.upload.success, STATUS.SUCCESS));
        } else {
          logger.debug("failed to insert")
          return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.upload.fail, STATUS.FAILURE));
        }
      }).catch(err => {
        logger.error("error in while inserting data");
        return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
      });
    }
  }).catch(err => {
    logger.error("error in while get the id of document");
    return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  })
}



/**
 * @desc get the Documenet details of respective business
 * @method getFile
 * @param {object} request -- it is request object
 * @param {object} response --it is response object
 **/
export let getFile = (request, response) => {
  logger.info("getFile() initiated");
  let upload = new Upload(request.params);
  upload.getBusinessId(upload.id).then(results => {
    if (results.length > 0) {
      logger.info("successfully get the id");
      var id = results[0].business_id;
      upload.getFileDetails(id).then(results => {
        if (results.length > 0) {
          logger.info("successfully get results");
          logger.info("response sent");
          return response.send(ResponseHelper.buildSuccessResponse({
            documents: results,
            business_id: id
          }, langEngConfig.message.getFail.success, STATUS.SUCCESS));
        } else {
          logger.debug("failed to get the document details");
          return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.getFail.fail, STATUS.FAILURE));
        }
      }).catch(err => {
        logger.error("error in while getting the details of document");
        return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
      });
    } else {
      logger.info("no data with respective id");
      return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.upload.invalid, STATUS.FAILURE));
    }
  }).catch(err => {
    return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  })
}

/**
 * @desc get the Documenet details of respective business with status which it is indicate file uploaded or not
 * @method getFileWithStatus
 * @param {object} request -- it is request object
 * @param {object} response --it is response object
 **/
export let getFileWithStatus = function (request, response) {
  logger.info("getFile initiated");
  let upload = new Upload(request.params);
  upload.getBusinessId(upload.id).then(results => {
    if (results.length > 0) {
      logger.info("successfully get the id");
      let id = results[0].business_id;
      upload.getFileDetails(id).then(results => {
        if (_.size(results) > 0) {
          logger.info("successfully get results");
          _.forEach(results, function (result, key) {
            if (result.kyb_doc_base64 != '' && result.kyb_doc_base64) {
              logger.info("status added");
              results[key].status = STATUS.SUCCESS;
              delete results[key].kyb_doc_base64;
            } else {
              logger.info("status added");
              results[key].status = STATUS.FAILURE;
            }
          })
          logger.info("response sent");
          return response.send(ResponseHelper.buildSuccessResponse({
            documents: results
          }, langEngConfig.message.getFail.success, STATUS.SUCCESS));
        } else {
          logger.debug("failed to get the document details");
          return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.upload.fail, STATUS.FAILURE));

        }
      }).catch(err => {
        logger.error("error in while getting the details of document");
        return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
      });
    } else {
      logger.info("no data with respective id");
      return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.upload.invalid, STATUS.FAILURE));
    }
  }).catch(err => {
    return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  })

}

/**
 * @desc get the Documenet details of respective status which it is indicate file uploaded or not
 * @method getDocumentsStatus
 * @param {object} request -- it is request object with business_id
 * @param {object} response --it is response object
 **/

export let getDocumentsStatus = function (request, response) {
  logger.info("getDocumentsStatus initiated");
  const upload = new Upload(request.params);
  upload.getFileDetails(request.params.business_id).then(results => {
    var Documents = [];
    if (_.size(results) > 0) {
      logger.info("successfully get results");
      _.forEach(results, function (result, key) {
        var document = new Map();
        if (result && result.kyb_doc_base64 != '' && result.kyb_doc_base64) {
          document.kyb_doc_status = result.doc_status;
        } else {
          document.kyb_doc_status = STATUS.NOT_AVAILABLE;
        }
        document.kyb_business_docs_id = result.kyb_business_docs_id;
        document.kyb_doc_type = result.kyb_doc_type;
        Documents.push(document);
      })
      logger.info("response sent");
      return response.send(ResponseHelper.buildSuccessResponse({
        documents: Documents
      }, langEngConfig.message.getFail.success, STATUS.SUCCESS));
    } else {
      logger.debug("failed to get the document details");
      return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.getFail.fail, STATUS.FAILURE));

    }
  }).catch(err => {
    logger.error("error in while getting the details of document");
    return response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  });


}