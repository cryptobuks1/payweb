/**
 * businessOwner controller
 * This is a controller file, where the businessOwner signup related data is entered.
 * @package businessOwner
 * @subpackage sources\services\controller\businessOwner\businessOwner
 * @author SEPA Cyber Technologies, Tarangini dola , Satyanarayana G
 */
"use strict";

import {
  config
} from '../dbconfig/connection';
import {
  mariadb
} from '../dbconfig/dbconfig';

import {
  decrypt
} from '../utility/validate';
import {
  Utils
} from '../utility/utils';

import {
  Kyc
} from '../model/kyc';
import {
  SETTING
} from '../model/personalSettings';
import {
  UserModel
} from '../model/userModel';
let user = new UserModel();
import {
  langEngConfig as configVariable,
  langEngConfig
} from '../utility/lang_eng';
import {
  BusinessOwner
} from '../model/businessOwner';
import {
  prepareKycPayload
} from '../controller/kycIdentity.js';
import {
  _callIdentityService,
  requestForKycStatus
} from './museCommManager'
const kyc = new Kyc();
const registerBusinessOwner = new BusinessOwner();
let setting = new SETTING();

const KYC_DEFAULT_STATUS = ['SUCCESS', 'SUCCESS_DATA_CHANGED', 'SUCCESSFUL', 'SUCCESSFUL_WITH_CHANGES', 'CHECK_PENDING'];

const STATUS = {
  FAILED: 1,
  SUCCESS: 0,
  PENDING: 2
};
const OWNERTYPE = {
  DIRECTOR: 'director',
  BUSINESSOWNER: 'businessowner',
  SHAREHOLDER: 'shareholder',
  APPLICANT: 'applicant'
}
class Owner {
  constructor(request) {
    this.ownerDetails = {
      "first_name": request.body.first_name ? request.body.first_name : '',
      "last_name": request.body.last_name ? request.body.last_name : '',
      "email": request.body.email ? request.body.email : '',
      "gender": request.body.gender ? request.body.gender : '',
      "dob": request.body.dob ? request.body.dob : '',
      "mobile": request.body.mobile ? request.body.mobile : '',
      "business_id": request.body.business_id ? request.body.business_id : '',
      "business_owner_type": request.body.business_owner_type ? request.body.business_owner_type : '',
      "percentage": request.body.percentage ? request.body.percentage : '',
      "status": request.body.status ? request.body.status : '',
      "type": request.body.type ? request.body.type : '',
      "isKyc": request.body.isKyc,
      "kyb_bisiness_owner_id": request.body.kyb_bisiness_owner_id ? request.body.kyb_bisiness_owner_id : '',
      "kyb_bo_id": request.body.kyb_bo_id ? request.body.kyb_bo_id : '',
      "country_id": request.body.country_id ? request.body.country_id : '',
      "phone": request.body.phone ? request.body.phone : '',
      "kyb_id": request.body.kyb_id ? request.body.kyb_id : '',
      "place_of_birth": request.body.place_of_birth ? request.body.place_of_birth : '',
      "nationality": request.body.nationality ? request.body.nationality : ''
    };
    this.id = request.params.id;
    this.type = request.params.type ? request.params.type : request.body.type;
    this.contact_id = request.params.contact_id;
    this.kyb_document_id = request.params.kyb_document_id;
    this.token = request.params.token;
    this.applicantId = request.params.applicant_id;
    this.token_link = request.body.token ? request.body.token : '';
  }
}

/**
 * @desc This function is for saving Business Owner  
 * @method saveBusinessOwner 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */

var saveBusinessOwner = (request, response) => {
  const owner = new Owner(request);
  let conn;
  mariadb.createConnection(config)
    .then(dbconn => {
      conn = dbconn;
      logger.info('connection created for save business owner');
      return conn.beginTransaction()
    }, (err) => {
      logger.error('error in createConnection');
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)))
    })
    .then(() => {
      logger.info('transaction start');
      return registerBusinessOwner.getBusinessId(owner.applicantId);
    }, (err) => {
      logger.debug('error in beginTransaction');
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)))
    })
    .then((businessId) => {
      owner.ownerDetails.business_id = businessId[0].business_id;
      return registerBusinessOwner.chechKybId(owner.ownerDetails.business_id, owner.ownerDetails.kyb_bo_id);
    }, (err) => {
      logger.error('error in save businessApplicant');
      conn.rollback();
      conn.close();
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
    })
    .then(results => {
      if (results && results.length <= 0) {
        response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.alertmsg, STATUS.FAILED));
      } else {
        console.log("***owner", owner);
        return registerBusinessOwner.get_contact_id(owner.ownerDetails.business_id, owner.ownerDetails.email);
      }
    }, err => {
      logger.error('error in check the kyb_bo_id');
      conn.rollback();
      conn.close();
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
    })
    .then((contactDetails) => {
      console.log("contactDetails", contactDetails);
      if (contactDetails && contactDetails.length == 0) {
        saveBusinessOwnerInfo(owner, response, conn);
      } else if (contactDetails && contactDetails.length > 0) {
        updateBusinessOwnerInfo(contactDetails, owner, response, conn);
      }
    }, err => {
      logger.error('error in save businessApplicant');
      conn.rollback();
      conn.close();
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
    });
}

export const saveBusinessOwnerInfo = (owner, response, conn) => {
  registerBusinessOwner.checkEmail(owner.ownerDetails.email, owner.ownerDetails.business_id)
    .then(results => {
      if (results && results.length > 0 && results[0].business_id != -1) {
        logger.info("email already exists")
        response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.emailExist, STATUS.FAILED));
      } else {
        let externalTransactionId = Math.floor((Math.random() * 1000) + 4) + Math.random().toString(36).substr(2, 5);
        registerBusinessOwner.saveApplicant('business', owner.ownerDetails.email, owner.ownerDetails.mobile, externalTransactionId, owner.ownerDetails.business_id)
          .then(applicant => {
            logger.info('business application save in db');
            registerBusinessOwner.saveContact(applicant.insertId, owner.ownerDetails)
              .then(contact => {
                logger.info('business contact save in db');
                registerBusinessOwner.saveBusinessOwner(contact.insertId, owner.ownerDetails)
                  .then(owners => {
                    registerBusinessOwner.insertKycDetails(applicant.insertId, owner.ownerDetails)
                      .then(kycEntry => {
                        registerBusinessOwner.updateBusinessOwnerDetails(owner.ownerDetails, owner.ownerDetails.first_name + ',' + owner.ownerDetails.last_name)
                          .then(results => {
                            logger.info('business registerBusinessOwner save in db and commit ');

                            registerBusinessOwner.getBusinessOwnerDetails(owner.ownerDetails.kyb_bo_id).then(result => {
                              if (result && result[0].is_director == result[0].is_shareholder) {
                                owner.ownerDetails.business_owner_type = "Shareholder";
                                registerBusinessOwner.saveBusinessOwner(contact.insertId, owner.ownerDetails)
                                  .then(saveStatus => {
                                    if (saveStatus.affectedRows > 0) {
                                      logger.info('business registerBusinessOwner save in db and commit ');
                                      conn.commit();
                                      conn.close();
                                      logger.info('create a response for save business owner ');
                                      response.send(ResponseHelper.buildSuccessResponse({
                                        "user_id": (applicant.insertId) ? applicant.insertId : null,
                                        "isKyc": owner.ownerDetails.isKyc
                                      }, configVariable.message.businessOwner.success, STATUS.SUCCESS));
                                    } else {
                                      conn.rollback();
                                      conn.close();
                                      return response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.fail)));
                                    }
                                  }, err => {
                                    logger.error('error in updateBusinessOwnerDetails');
                                    conn.rollback(err);
                                    conn.close();
                                    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
                                  })
                              } else {
                                conn.commit();
                                conn.close();
                                logger.info('create a response for save business owner ');
                                response.send(ResponseHelper.buildSuccessResponse({
                                  "user_id": (applicant.insertId) ? applicant.insertId : null,
                                  "isKyc": owner.ownerDetails.isKyc
                                }, configVariable.message.businessOwner.success, STATUS.SUCCESS));

                              }
                            })
                          }, err => {
                            logger.error('error in updateBusinessOwnerDetails');
                            conn.rollback(err);
                            conn.close();
                            response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));

                          })
                      }, (err) => {
                        logger.error('error in failure entry insert');
                        conn.rollback();
                        conn.close();
                        response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.fail)));
                      });
                  }, (err) => {
                    logger.error('error in saveBusinessOwner');
                    conn.rollback();
                    conn.close();
                    response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.fail)));
                  });
              }, (err) => {
                logger.error('error in saveContact');
                conn.rollback();
                conn.close();
                response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.fail)));
              });

          }, (err) => {
            logger.error('error in save businessApplicant');
            conn.rollback();
            conn.close();
            response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessContact.fail)));
          });
      }
    }, err => {
      logger.error('error in check email exist or not');
      conn.rollback();
      conn.close();
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
    })
}

const updateBusinessOwnerInfo = async (contactDetails, owner, response, conn) => {

  let contact_id = contactDetails[0].contact_id;
  let applicant_id = contactDetails[0].applicant_id;
  let reTriggerKyc = false;
  let kyc_doc_type = 4;
  let doc_status = 1;
  let personalInfo = await registerBusinessOwner.getPersonalSettingsInfo(applicant_id);
  console.log("personalInfo", personalInfo);
  if (personalInfo.length > 0) {
    if (personalInfo[0].first_name != owner.ownerDetails.first_name || personalInfo[0].last_name != owner.ownerDetails.last_name || personalInfo[0].place_of_birth != owner.ownerDetails.place_of_birth ||
      personalInfo[0].nationality != owner.ownerDetails.nationality) {
      reTriggerKyc = true;
      let full_name = owner.ownerDetails.first_name + " " + owner.ownerDetails.last_name;
      await setting.updateCounterParty(full_name, applicant_id)
      await registerBusinessOwner.updateShareholderStructure(kyc_doc_type, doc_status, owner.ownerDetails.business_id)
      await registerBusinessOwner.updateKybStatus('KYB_REDO', owner.ownerDetails.business_id)


      //    let kycList = async () => {
      let results = await kyc.getUserByApplicant(applicant_id);

      if (results && results.length > 0) {
        let externalTransactionId = "Trans-" + Math.floor((Math.random() * 1000) + 4) + results[0].customerId;
        results[0]['first_name'] = owner.ownerDetails.first_name;
        results[0]['last_name'] = owner.ownerDetails.last_name;
        results[0]['birth_place'] = owner.ownerDetails.place_of_birth;
        let country = await setting.getCountryCode(owner.ownerDetails.nationality);
        results[0]['nationality'] = country[0].country_code;
        let identInfo = prepareKycPayload(results[0], externalTransactionId, process.env.CLIENT_ID);
        //   await _requestForIdentId(identInfo, applicantId, global.access_token, results[0], request, response)        
        let identityResponse = await _callIdentityService(identInfo, request, global.access_token, applicant_id);
        if (identityResponse && identityResponse.data) {
          let identId = identityResponse.data ? identityResponse.data.id : ''
          let updateKycModel = {
            "kyc_vendor_id": identityResponse.data['id'],
            "transactionNumber": identInfo.data.externalTransactionId,
            "id": "",
            "applicantId": identInfo.data.applicant_id
          };
          let kycUpdate = await setting.updateKycDetails(updateKycModel)
          const statusResponse = await requestForKycStatus(identId, global.access_token, applicant_id);
          if (statusResponse && statusResponse.data && statusResponse.data.status) {
            let identityStatus = statusResponse.data.status;
            await kyc.checkSuccessKyc(identityStatus, updateKycModel.transactionNumber);
          }
        }
      }
      //  }
      // } else {
      //   response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.businessOwner.kybidFail)));
      // }

      // }).catch(r => {
      //   response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.businessOwner.kybidFail)));
      // });

      // }).catch(r => {
      //   response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.businessOwner.kybidFail)));
      // });


      // }).catch(r => {
      //   response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.businessOwner.kybidFail)));
      // });
    }
     registerBusinessOwner.updateContact(contact_id, owner.ownerDetails)
    .then(results => {
      if (results.affectedRows > 0) {
        registerBusinessOwner.updateApplicant(applicant_id, owner.ownerDetails)
          .then(results => {
            if (results.affectedRows > 0) {
              registerBusinessOwner.updateBusinessOwnerDetails(owner.ownerDetails, owner.ownerDetails.first_name + ',' + owner.ownerDetails.last_name)
                .then(updateStatus => {
                  let proofOfShareholderStructure = 0;
                  if (updateStatus.affectedRows > 0) {
                    logger.info('business registerBusinessOwner save in db and commit ');
                    conn.commit();
                    conn.close();
                    logger.info('create a response for save business owner ');
                    response.send(ResponseHelper.buildSuccessResponse({
                      "user_id": applicant_id,
                      "isKyc": owner.ownerDetails.isKyc,
                      "proofOfShareholderStructure": proofOfShareholderStructure,
                      "reTriggerKyc": reTriggerKyc
                    }, configVariable.message.businessOwner.ownerSuccess, STATUS.SUCCESS));
                  } else {
                    conn.rollback();
                    conn.close();
                    return response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.fail)));
                  }
                }, err => {
                  logger.error('error in updateBusinessOwnerDetails');
                  conn.rollback();
                  conn.close();
                  response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
                })
            }
          }, err => {
            logger.error('error in saveContact');
            conn.rollback();
            conn.close();
            response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
          })

      } else {
        conn.rollback();
        conn.close();
        return response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.fail)));
      }

    }, err => {
      logger.error('error in saveContact');
      conn.rollback();
      conn.close();
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
    })
  } else {
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
  }
 
  // }, err => {
  //   logger.error('error in getting personal details');
  //   conn.rollback();
  //   conn.close();

  // })
}




// Helper function for _createIndexResponse
const setKycStatusInBusinessOwnerLists = (listName, businessOwnerList, isKyc) => {
  logger.info(`check size of ${listName}`);
  if (businessOwnerList.length > 0) {
    logger.info(`inside block of ${listName.toUpperCase()} > 0`);
    businessOwnerList.forEach(businessOwner => {
      businessOwner["isKyc"] = isKyc;
      businessOwner['kyc_status'] = (businessOwner['kyc_status'] == '') ? '' : businessOwner['kyc_status'];
    });
  }
  return businessOwnerList;
}

// Helper function for _createIndexResponse
const resolveBusinessOwnersList = (type, businessOwnerList) => {
  logger.info(`if type is ${type}, check size of ${type}`);
  businessOwnerList.length > 0 ? logger.info(`create a response for ${type}`) : logger.warn(`create a response if size of ${type} is < 1 `)
  const status = businessOwnerList.length > 0 ? STATUS.SUCCESS : STATUS.FAILED;
  const response = {
    status
  };
  response[type] = businessOwnerList;
  return response;
}

const resolveNotFoundList = (type, directorsList, shareholdersList, proofOfRegisteredAddress, proofOfOperatingAddress, shareholderStructure) => {
  logger.info(`if type is ${type}, check size of ${type}`);
  //  NotFoundList.length > 0 ? logger.info(`create a response for ${type}`) : logger.warn(`create a response if size of ${type} is < 1 `)
  //  const status = NotFoundList.length > 0 ? STATUS.SUCCESS : STATUS.FAILED;
  let filteredShareholderList = shareholdersList.filter(el => el.kyc_status == 'NOT_FOUND' || el.kyc_status == 'NOT_INITIATED');
  let filteredDirectorList = directorsList.filter(el => el.kyc_status == 'NOT_FOUND' || el.kyc_status == 'NOT_INITIATED');
  const response = {
    Shareholder: filteredShareholderList,
    Directors: filteredDirectorList,
    shareholderStructure: shareholderStructure,
    proofOfRegisteredAddress: proofOfRegisteredAddress,
    proofOfOperatingAddress: proofOfOperatingAddress,
    status: STATUS.SUCCESS
  };
  return response;
}

const resolveStructureBusiness = (type, directorsList, shareholdersList, shareholderStructure) => {
  logger.info(`if type is ${type}, check size of ${type}`);
  const response = {
    Directors: directorsList,
    Shareholder: shareholdersList,
    proofOfShareholderStructure: shareholderStructure,
    status: STATUS.SUCCESS
  };
  return response;
}



/** 
 * @method _createIndexResponse 
 * @param {list} request - It contains StakeholdersInfo list 
 * @param {Object} response - It is type of stack holder
 */

var _createIndexResponse = (list, value, contactList, kycList, addressList, business_id) => {
  return new Promise((resolve, reject) => {
    let compareData = [],
      addressData = [];
    console.log("contactList", contactList);
    contactList.forEach(contact => {
      kycList.forEach(kycItem => {
        if (contact.applicant_id == kycItem.applicant_id) {
          compareData.push({
            ...kycItem,
            ...contact
          });
        }
      })
      addressList.forEach(address => {
        if (contact.contact_id == address.contact_id) {
          addressData.push({
            ...address,
            applicant_id: contact.applicant_id,
            email: contact.email
          });
        }
      })
    });

    if (list.length > 0) {
      let submitedDirectors = 0,
        verifiedShareholders = 0,
        submitedShareholders = 0,
        verifiedDirectors = 0,
        submittedApplicants = 0,
        verifiedApplicants = 0,
        stage = 0;
      let shareholderStructure = 1;
      let proofOfOperatingAddress = false;
      let proofOfRegisteredAddress = false;
      logger.info('insert is Kyc flag  ');
      registerBusinessOwner.getDocStatus(business_id).then(results => {
        if (results.length > 0) {
          results.forEach(element => {
            if (element.kyb_doc_type === 4 && element.doc_status === 3) {
              shareholderStructure = 3;
            } else if (element.kyb_doc_type === 4 && element.doc_status === 4) {
              shareholderStructure = 4;
            } else if (element.kyb_doc_type === 4 && element.doc_status === 1) {
              shareholderStructure = 1;
            } else if (element.kyb_doc_type === 4 && element.doc_status === 2) {
              shareholderStructure = 2;
            }
            if (element.kyb_doc_type === 1 && element.doc_status === 3) {
              proofOfRegisteredAddress = 2;
            } else if (element.kyb_doc_type === 1 && (element.doc_status === 4 || element.doc_status === 2)) {
              proofOfRegisteredAddress = 1;
            } else if (element.kyb_doc_type === 1 && element.doc_status === 1) {
              proofOfRegisteredAddress = 0;
            }

            if (element.kyb_doc_type === 2 && element.doc_status === 3) {
              proofOfOperatingAddress = 2;
            } else if (element.kyb_doc_type === 2 && (element.doc_status === 4 || element.doc_status === 2)) {
              proofOfOperatingAddress = 1;
            } else if (element.kyb_doc_type === 2 && element.doc_status === 1) {
              proofOfOperatingAddress = 0;
            }
          });
        }
      })

      list.forEach(listEl => {
        listEl['kyc_status'] = 'NOT_INITIATED';
        listEl['id'] = "";

        compareData.forEach(compareDataItem => {
          if (listEl.email == compareDataItem.email) {
            listEl['contact'] = compareDataItem;
            listEl['kyc_status'] = compareDataItem.kyc_status;
            listEl['transactionId'] = compareDataItem.kyc_transaction_id;
            listEl['id'] = compareDataItem.kyc_vendor_id;
            listEl['user_id'] = compareDataItem.applicant_id;
          }
        });
        console.log("compareData", compareData);
        console.log("list", list);

        addressData.forEach(address => {
          if (address.email == listEl.email) {
            listEl['address'] = address;
            listEl['is_verified'] = true;
          }
        })
      });

      let shareholdersList = list.filter(el => el.is_shareholder == 1 || el.type == OWNERTYPE.SHAREHOLDER);
      let directorsList = list.filter(el => el.is_director == 1 || el.type == OWNERTYPE.DIRECTOR);
      let primaryApplicantBusinessOwnersList = list.filter(el => el.is_primary_applicant == 1);
      let businessOwnersList = list.filter(li => li.type == OWNERTYPE.BUSINESSOWNER);


      shareholdersList = setKycStatusInBusinessOwnerLists('Shareholder', shareholdersList, true);
      directorsList = setKycStatusInBusinessOwnerLists('Director', directorsList, true);
      primaryApplicantBusinessOwnersList = setKycStatusInBusinessOwnerLists('Primary applicant', primaryApplicantBusinessOwnersList, true);


      setTimeout(() => {
        switch (value) {
          case OWNERTYPE.DIRECTOR:
            return resolve(resolveBusinessOwnersList('directors', directorsList));
          case OWNERTYPE.SHAREHOLDER:
            return resolve(resolveBusinessOwnersList('shareholder', shareholdersList));
          case OWNERTYPE.BUSINESSOWNER:
            return resolve(resolveBusinessOwnersList('businessowner', businessOwnersList));
          case OWNERTYPE.APPLICANT:
            return resolve(resolveBusinessOwnersList('applicant', primaryApplicantBusinessOwnersList));
          case 'kyc_not_done':
            return resolve(resolveNotFoundList('kyc_not_done', directorsList, shareholdersList, proofOfRegisteredAddress, proofOfOperatingAddress, shareholderStructure));
          case 'structureOfBusiness':
            return resolve(resolveStructureBusiness('structureOfBusiness', directorsList, shareholdersList, shareholderStructure));
          case 'all': {
            shareholdersList.forEach(shareholder => {
              if (shareholder['is_verified'] == true) {
                submitedShareholders = (((shareholder['kyc_status']).toUpperCase().trim().includes("CHECK_PENDING")) ||
                  ((shareholder['kyc_status']).toUpperCase().trim().includes("PENDING"))) ? submitedShareholders + 1 : submitedShareholders;
                verifiedShareholders = (shareholder['kyc_status'].includes("SUCCESS")) ? verifiedShareholders + 1 : verifiedShareholders;
              }
            });

            directorsList.forEach(director => {
              if (director['is_verified'] == true) {
                submitedDirectors = (((director['kyc_status']).toUpperCase().trim().includes("CHECK_PENDING")) ||
                  ((director['kyc_status']).toUpperCase().trim().includes("PENDING"))) ? submitedDirectors + 1 : submitedDirectors;
                verifiedDirectors = (director['kyc_status'].includes("SUCCESS")) ? verifiedDirectors + 1 : verifiedDirectors;
              }
            });

            primaryApplicantBusinessOwnersList.forEach(applicant => {
              if (applicant['is_verified'] == true) {
                submittedApplicants = (((applicant['kyc_status']).toUpperCase().trim().includes("CHECK_PENDING")) ||
                  ((applicant['kyc_status']).toUpperCase().trim().includes("PENDING"))) ? submittedApplicants + 1 : submittedApplicants;
                verifiedApplicants = (applicant['kyc_status'].includes("SUCCESS")) ? verifiedApplicants + 1 : verifiedApplicants;
              }
            });

            //Verifying if shareholder structure document is approved         
            const directorsCount = directorsList.length;
            const shareholderCount = shareholdersList.length;
            const primaryApplicantsCount = primaryApplicantBusinessOwnersList.length;
            const totalBusinessHolders = directorsCount + shareholderCount + primaryApplicantsCount;

            if ((totalBusinessHolders == (submitedDirectors + submitedShareholders + submittedApplicants))) {
              stage = 1;
            } else if ((totalBusinessHolders == (verifiedDirectors + verifiedShareholders + verifiedApplicants) && shareholderStructure)) {
              stage = 2;
            } else if ((totalBusinessHolders == (submitedDirectors + submitedShareholders + submittedApplicants + verifiedDirectors + verifiedShareholders + verifiedApplicants))) {
              stage = 1;
            }

            return kyc.updateDashboardKycStatus(stage, business_id, 'business_owner_details').then(results => {
              return resolve({
                Businessowner: businessOwnersList,
                Shareholder: shareholdersList,
                Directors: directorsList,
                Primary_applicants: primaryApplicantBusinessOwnersList,
                status: STATUS.SUCCESS
              });
            }).catch(err => {
              logger.error('Dashboard status fail , while updating')
              return reject(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
            });
          }
          default: {
            logger.warn('create a response in record not found ');
            return resolve({
              message: configVariable.message.businessOwner.recordNotFound,
              status: STATUS.SUCCESS
            });
          }
        }

      }, 300);
    } else {
      logger.debug('create a response in record not found ');
      reject({
        message: configVariable.message.businessOwner.recordNotFound,
        status: STATUS.FAILED
      });
    }
  });
}

/**
 * @desc This function is for update Business Owner detail by id
 * @method updateDetail
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code and updated detail
 */

var updateDetail = async function (request, response) {
  var name = request.body.first_name + ',' + (request.body.last_name ? request.body.last_name : '');
  const business_owner_id = request.params.id;
  const email = request.body.email;
  const businessOwnersList = await registerBusinessOwner.getBusinessOwners();
  const businessIdBlob = await registerBusinessOwner.getBusinessId(request.params.applicant_id);
  const businessId = businessIdBlob[0].business_id;

  const directorsList = businessOwnersList.filter(b => ((b.type == 'director') && (b.business_id === businessId)));
  const directorSameAsShareholder = directorsList.find(s => (s.email == email) && (s.name != name));

  const shareholdersListUpdate = businessOwnersList.filter(b => ((b.type == 'shareholder' || b.is_shareholder == 1) && (b.business_id === businessId)));
  const shareholderUpdate = shareholdersListUpdate.find(s => s.email == email);

  let directorSameAsShareholderEmail = directorSameAsShareholder ? directorSameAsShareholder : shareholderUpdate;
  if (directorSameAsShareholderEmail) {
    return response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.directorEmail, STATUS.FAILED));

  }
  const shareholdersList = businessOwnersList.filter(b => (b.type == 'shareholder' || b.is_shareholder == 1) && (b.business_id === businessId));
  const shareholderToEdit = shareholdersList.find(s => s.kyb_bo_id == business_owner_id);

  if (shareholderToEdit) {
    const exisitingPercentage = parseInt(shareholderToEdit.percentage);
    let percentageTotalOfExistingShareholders = shareholdersList.reduce((p, s) => {
      if (s.percentage == undefined || s.percentage == null || (s.percentage && s.percentage.trim().length == 0)) {
        return p + 0;
      }
      return parseInt(s.percentage.trim()) + p;
    }, 0);
    percentageTotalOfExistingShareholders = percentageTotalOfExistingShareholders - exisitingPercentage;
    const totalPercentage = percentageTotalOfExistingShareholders + parseInt(request.body.percentage);
    if (totalPercentage > 100) {
      const allowedPercentage = 100 - percentageTotalOfExistingShareholders;
      return response.send(ResponseHelper.buildFailureResponse(new Error(`Cannot allow total of share percentages to be more than 100%. The maximum percentage of shares you can get is ${allowedPercentage} %`)));
    }
  }
  registerBusinessOwner.getStakeholdersInfoById(request.params.id).then(result => {
    if (result && result.length > 0) {
      registerBusinessOwner.getOwnerEmail(request.body.email).then(res => {
        if (res.length == 0 || (res.length > 0 && res[0].kyb_bo_id == request.params.id)) {
          let directorOwnerType = result[0].type;
          if (directorOwnerType == "director") {
            if (!Utils.isEmptyObject(request.body.first_name) && !Utils.isEmptyObject(request.body.email)) {
              registerBusinessOwner.updateBusinessOwnerDirector(request.params.id, name, request.body.email).then((directorResponse => {
                registerBusinessOwner.getStakeholdersInfoById(request.params.id).then(result => {
                  logger.info('get response from   registerBusinessOwner.updateBusinessOwnerDirector() ');
                  response.send(ResponseHelper.buildSuccessResponse(result[0], configVariable.message.businessOwner.updatebusinessOwnerStatusSuccess, STATUS.SUCCESS));
                })
              }), (err) => {
                logger.error(' error in get response from   registerBusinessOwner.updateBusinessOwnerDirector() ');
                response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.ErrorHandler)));
              });
            } else {
              logger.error('Error: please provide valid data');
              response.send(ResponseHelper.buildFailureResponse("Please provide valid data"));
            }
          } else {
            if (!Utils.isEmptyObject(request.body.first_name) && !Utils.isEmptyObject(request.body.email) && !Utils.isEmptyObject(request.body.percentage)) {
              registerBusinessOwner.updateBusinessOwnerStatkeholderDetail(request.params.id, name, request.body.email, request.body.percentage).then((StatkeholderResponse => {
                registerBusinessOwner.getStakeholdersInfoById(request.params.id).then(result => {
                  logger.info('get response from   registerBusinessOwner.updateBusinessOwnerStatkeholderDetail() ');
                  response.send(ResponseHelper.buildSuccessResponse(result[0], configVariable.message.businessOwner.updatebusinessOwnerStatusSuccess, STATUS.SUCCESS));
                })
              }), (err) => {
                logger.error(' error in get response from   registerBusinessOwner.updateBusinessOwnerStatkeholderDetail() ');
                response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.ErrorHandler)));
              });

            } else {
              response.send(ResponseHelper.buildFailureResponse("Please provide valid data"));
            }
          }
        } else {
          response.send(ResponseHelper.buildFailureResponse("Email already exist!!"));
        }
      });
    } else {
      response.send(ResponseHelper.buildFailureResponse("Data not found!!"));
    }
  });
}

/**
 * @desc this function used for get list of director shareholder and business Owner  
 * @method getStakeholdersInfo
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return with details of Stackholders
 */
var getStakeholdersInfo = function (request, response) {
  logger.info('initialize  getStakeholdersInfo funxtion');
  const owner = new Owner(request);
  let applicantId = owner.applicantId;
  logger.info('create request and call registerBusinessOwner.getBusinessId function ');
  registerBusinessOwner.getBusinessId(applicantId).then(businessId => {
    logger.info('get response from registerBusinessOwner.getBusinessId  ');
    if (businessId[0] && businessId[0].business_id) {
      registerBusinessOwner.getStakeholdersInfo(businessId[0].business_id).then((ownerList => {
        if (_.size(ownerList) > 0) {
          registerBusinessOwner.getStakeholdersContactInfo(businessId[0].business_id).then((cantactList => {
            logger.info('get response from registerBusinessOwner.getStakeholdersInfo and call _createIndexResponse ');
            let applicants = [];
            cantactList.forEach(r => {
              applicants.push(r.applicant_id)
            });
            registerBusinessOwner.getAddressDetails(applicants).then((addressList => {

              registerBusinessOwner.getKycDetails(applicants).then((kycList => {
                _createIndexResponse(ownerList, owner.type, cantactList, kycList, addressList, businessId[0].business_id).then(result => {
                  logger.info('get response from _createIndexResponse and send to user ');
                  response.send(ResponseHelper.buildSuccessResponse({
                    "ownerList": result
                  }, configVariable.message.businessOwner.StakeholderSuccess, STATUS.SUCCESS));
                  //response.send(result);
                }).catch(err => {
                  logger.error('error in _createIndexResponse ');
                  response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
                  //response.send(`${err}`);
                });
              }), (err) => {
                logger.debug('registerBusinessOwner.getStakeholdersInfo(owner.id)');
                response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
                //response.send(`${err}`);
              });
            }), (err) => {
              logger.debug('registerBusinessOwner.getStakeholdersInfo(owner.id)');
              response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
              //response.send(`${err}`);
            });
          }), (err) => {
            logger.debug('registerBusinessOwner.getStakeholdersInfo(owner.id)');
            response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
            //response.send(`${err}`);
          });

        } else {
          response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.recordNotFound, STATUS.FAILED))
        }

      }), (err) => {
        logger.debug(' registerBusinessOwner.getStakeholdersInfo(owner.id)');
        response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
        //response.send(`${err}`);
      });
    } else {
      logger.error('error in registerBusinessOwner.getBusinessId');
      response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.businessFail, STATUS.FAILED));
    }
  }, err => {
    logger.debug(' registerBusinessOwner.getBusinessId(owner.applicantId)');
    response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
    //response.send(`${err}`);
  });
}
/**
 * @desc this function used for get list of director shareholder and business Owner  
 * @method getStakeholdersInfoById
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return 
 */
var getStakeholdersInfoById = function (req, res) {
  registerBusinessOwner.getStakeholdersInfoById(req.params.id).then(result => {
    res.send(ResponseHelper.buildSuccessResponse({
      "getStakeHoldersById": result
    }, STATUS.SUCCESS));
  })
}

/**
 * @desc this function used for get business owner details by id 
 * @method getBusinessOwnersById 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return with details of business owner
 */
var getBusinessOwnersById = (request, response) => {
  logger.info('initialize  getBusinessOwnersById and call  registerBusinessOwner.getBusinessOwnersById');
  logger.info('create request and call registerBusinessOwner.getBusinessId function ');
  const owner = new Owner(request);
  registerBusinessOwner.getBusinessId(owner.applicantId).then(result => {
    logger.info('get response from    registerBusinessOwner.getBusinessId  ');
    if (_.size(result) > 0) {
      registerBusinessOwner.getBusinessOwnersById(result[0].business_id).then(ownerDetails => {
        logger.info('get response from  registerBusinessOwner.getBusinessOwnersById and check size of response');
        if (ownerDetails[0] && _.size(ownerDetails) > 0) {
          logger.info(' size of response > 0');
          response.send(ResponseHelper.buildSuccessResponse({
            "ownerDetails": ownerDetails
          }, configVariable.message.businessOwnerContact.success, STATUS.SUCCESS));
        } else {
          logger.warn(' size of response < 1');
          response.send(ResponseHelper.buildSuccessResponse({
            "ownerDetails": ownerDetails
          }, configVariable.message.businessOwnerContact.success1, STATUS.SUCCESS));
        }
      }).catch(err => {
        logger.error(' error in  registerBusinessOwner.getBusinessOwnersById');
        response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.error.ErrorHandler, STATUS.FAILED));
      })
    } else {
      logger.debug(' registerBusinessOwner.getBusinessId(owner.applicantId)');
      response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwnerContact.businessId_not_found, STATUS.FAILED));
    }
  }, err => {
    logger.debug(' registerBusinessOwner.getBusinessId(owner.applicantId)');
    response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
  });
}
/**
 * @desc this function used to get share percentage of shareholder
 * @method  _validateTotalSharePercentage
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return with details of shareholder
 */
var _validateTotalSharePercentage = function (data, value) {
  return new Promise((resolve, reject) => {
    logger.info('initialize _validateTotalSharePercentage');
    var input = 0,
      iteration = 0;
    if (_.size(data) > 0) {
      logger.info('if  size of shareholder > 0 in _validateTotalSharePercentage block ');
      _.forEach(data, function (row) {
        iteration++;
        input = input + _.toInteger(row.percentage)
      });
      if (iteration == _.size(data)) {
        logger.info('if iteration ==   _.size(data) then check  the % of shareholder  ');
        if (input + value > 100) {
          logger.info('if shareholder is greater >100 create a response  ');
          resolve({
            value: false,
            message: configVariable.message.businessOwner.errorShareholderRange,
            totalShareholder: input
          })
        } else {
          logger.warn('if shareholder is greater < 100 create a response  ');
          resolve({
            value: true
          })
        }
      }
    } else {
      logger.debug('if  size of shareholder < 0 in _validateTotalSharePercentage block ');
      resolve({
        value: true
      })
    }
  });
}
/**
 * @desc this function used to get business owner registered as a business owner
 * @method  _isApplicantAlreadyRegisteredAsBusinessOwner
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return with details of business owner
 */
export const _isApplicantAlreadyRegisteredAsBusinessOwner = (mail, applicant_id) => {
  return new Promise((resolve, reject) => {
    registerBusinessOwner.isApplicantAlreadyRegisteredAsBusinessOwner(mail, applicant_id).then(res => {
      if (res.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    })

  })

}
/**
 * @desc this function used to get business owner email
 * @method _isEmailExists 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return 
 */
export const _isEmailExists = (mail, flag, type, id, value, applicant_id) => {
  return new Promise((resolve, reject) => {
    logger.info('initialize _isEmailExists');
    if (flag) {
      logger.info('if flag is true  call method  registerBusinessOwner.getKybBusinessOwner(id, mail)  ');
      registerBusinessOwner.getKybBusinessOwner(id, mail).then((data) => {
        logger.info('get response of registerBusinessOwner.getKybBusinessOwner(id, mail)  and check condition  ');
        if (_.size(data) == 0) {
          resolve({
            value: true
          });
        } else if ((type == OWNERTYPE.BUSINESSOWNER && _.size(_.filter(data, {
            type: OWNERTYPE.BUSINESSOWNER
          })) == 0 && _.size(_.filter(data, {
            type: OWNERTYPE.DIRECTOR
          })) <= 1) || (type == OWNERTYPE.BUSINESSOWNER && _.size(_.filter(data, {
            type: OWNERTYPE.BUSINESSOWNER
          })) == 0 && _.size(_.filter(data, {
            type: OWNERTYPE.SHAREHOLDER
          })) <= 1)) {
          logger.info('if condition true send value true ');
          resolve({
            value: true
          });
        } else if (_.size(data) > 0) {
          logger.warn('if_.size(data) > 0 send value false ');
          resolve({
            value: false
          });
        } else {
          logger.debug('send true');
          resolve({
            value: true
          });
        }
      }, (err) => {
        resolve({
          value: false
        });
      })
    } else {
      logger.info('if flag is false ');
      if (_.includes(type, OWNERTYPE.DIRECTOR)) {
        logger.info('if type director send true ');
        resolve({
          value: true
        });
      } else {
        if (_.isInteger(_.toInteger(value))) {
          logger.info('if iteration is completed  call method  registerBusinessOwner.getKybBusinessOwner(id)');
          registerBusinessOwner.getKybBusinessOwner(id).then((data) => {
            logger.info('get response of  registerBusinessOwner.getKybBusinessOwner(id) and call  _validateTotalSharePercentage()');
            _validateTotalSharePercentage(data, _.toInteger(value)).then((message) => {
              logger.info('get response of   _validateTotalSharePercentage() and resolve ');
              resolve(message);
            })
          })
        } else {
          logger.warn('(_.isInteger(_.toInteger(value)) false');
          resolve({
            value: false,
            message: configVariable.message.businessOwner.inputPercentageError
          });
        }
      }
    }
  })

}


export let isDirectorTryingToBeShareHolderWithDifferentName = function (d, formData) {
  if (d.name.toLowerCase().includes(formData.first_name.toLowerCase()) && d.name.toLowerCase().includes(formData.last_name.toLowerCase())) {
    return false;
  }
  return true;
}

/**
 * @desc this function used for add director , shareholder and business owner  
 * @method addBusinessOwner 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return with the message and status code
 */
var addBusinessOwner = async function (request, response) {
  let list = request.body.list[0];
  logger.info('initialize addBusinessOwner () ');
  const owner = new Owner(request);
  global.type = list.type;

  let is_director = (list.type == "director") ? 1 : 0;
  let is_shareholder = (list.type == "shareholder") ? 1 : 0;

  // 1. Get Business id
  const businessIdBlob = await registerBusinessOwner.getBusinessId(request.params.applicant_id);
  const businessId = businessIdBlob[0].business_id;

  // 2. Get all existing business owners
  registerBusinessOwner.getBusinessOwners().then(businessOwnersList => {
    // 3. Share holders
    if (list.type == "shareholder") {
      const shareholdersList = businessOwnersList.filter(b => ((b.type == 'shareholder' || b.is_shareholder == 1) && (b.business_id === businessId)));
      //  console.log("shareholdersList", shareholdersList);
      const shareholder = shareholdersList.find(s => s.email == list.email);
      if (shareholder) {
        return response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.already_added, STATUS.FAILED));
        //  is_shareholder = 1;
      }
      const directorsList = businessOwnersList.filter(b => ((b.type == 'director') && (b.business_id === businessId)));
      const directorSameAsShareholder = directorsList.find(s => (s.email == list.email) && (s.name != list.first_name + "," + list.last_name));
      if (directorSameAsShareholder) {
        return response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.directorEmail, STATUS.FAILED));

      }

      const percentageTotalOfExistingShareholders = shareholdersList.reduce((p, s) => {
        if (s.percentage == undefined || s.percentage == null || (s.percentage && s.percentage.trim().length == 0)) {
          return p + 0;
        }
        return parseInt(s.percentage.trim()) + p;
      }, 0);
      const totalPercentage = percentageTotalOfExistingShareholders + parseInt(list.percentage);
      if (totalPercentage > 100) {
        const allowedPercentage = 100 - percentageTotalOfExistingShareholders;
        return response.send(ResponseHelper.buildFailureResponse(new Error(`Cannot allow total of share percentages to be more than 100%. The maximum percentage of shares you can get is ${allowedPercentage} %`)));
      }
    }


    // 4. Directors
    const directorsList = businessOwnersList.filter(d => ((d.type == 'director' || d.is_director == 1) && (d.business_id === businessId)));
    const director = directorsList.find(d => d.email == list.email);
    const shareholdersList = businessOwnersList.filter(b => ((b.type == 'shareholder' || b.is_shareholder == 1) && (b.business_id === businessId)));
    const shareholder = shareholdersList.find(s => s.email == list.email);
    const bus_owner = director ? director : shareholder;
    console.log("director", director);
    console.log("shareholder", shareholder);
    if (director && isDirectorTryingToBeShareHolderWithDifferentName(bus_owner, list)) {
      response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.already_added, STATUS.FAILED));
    } else {
      if (director) {
        is_director = 1;
      }
      _isApplicantAlreadyRegisteredAsBusinessOwner(list.email, owner.applicantId).then((isPrimaryApplicant) => {
        const is_primary_applicant = isPrimaryApplicant == true ? 1 : 0;
        // let statusFlag = ((request.body.list[0].status) == true || request.body.list[0].status == 1) ? 0: 1;
        let statusFlag = 0;
        logger.info('create request and call rregisterBusinessOwner.getBusinessId(owner.applicantId) ');
        registerBusinessOwner.getBusinessId(owner.applicantId).then(businessId => {
          logger.info('get response from    registerBusinessOwner.getBusinessId  ');
          logger.info('check _isEmailExists()');
          global.business_id = businessId[0].business_id;
          _isEmailExists(list.email, true, type, business_id, list.percentage, owner.applicantId).then((result) => {
            logger.info('get response of _isEmailExists() and check result.value ');
            console.log("result", result);
            if (result.value) {
              logger.info(' result.value  true ');
              registerBusinessOwner.getPercentage(global.business_id).then(percentageCheck => {
                if (percentageCheck && percentageCheck.length > 0) {
                  let totalPercentage = percentageCheck[0].percentage;
                  let percentageRemained = 100 - totalPercentage;
                  if (list.percentage <= percentageRemained) {
                    if (_.includes(type, OWNERTYPE.BUSINESSOWNER)) {
                      logger.info(' if owner type is business owner  call  registerBusinessOwner.getStakeholdersInfo(business_id) to get list  ');
                      registerBusinessOwner.getStakeholdersInfo(business_id).then((ownerList => {
                        logger.info('get response of  registerBusinessOwner.getStakeholdersInfo(business_id) and call _createIndexResponse ()  ');
                        _createIndexResponse(ownerList, OWNERTYPE.BUSINESSOWNER, [], [], [], business_id).then(List => {
                          logger.info(' get response of l _createIndexResponse ()  and check size  ');
                          if (_.size(List.businessowner) > 0) {
                            logger.info(' if _.size(List.businessowner) > 0 create a response and send   ');
                            response.send(ResponseHelper.buildFailureResponse(configVariable.message.businessOwner.already_added));
                          } else {
                            logger.info(' if _.size(List.businessowner) == 0 call  registerBusinessOwner.saveKybBusinessOwner ()');
                            registerBusinessOwner.saveKybBusinessOwner(business_id, OWNERTYPE.BUSINESSOWNER, is_director, is_shareholder, is_primary_applicant, list.email, list.first_name + ',' + list.last_name, statusFlag, list.dob, list.percentage).then(message => {
                              logger.info('get response of  registerBusinessOwner.saveKybBusinessOwner ()');
                              response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.businessOwner, STATUS.SUCCESS));
                            }, (err) => {
                              logger.error('error in get response of  registerBusinessOwner.saveKybBusinessOwner ()');
                              response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.updateError)));
                            });
                          }
                        }, err => {
                          logger.debug('error in get response of  _createIndexResponse()');
                          response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.updateError)));
                        });
                      }), (err) => {
                        logger.error('error in get response of  registerBusinessOwner.getStakeholdersInfo(business_id)');
                        response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
                      });
                    } else {
                      logger.info(' if owner type is not business owner _isEmailExists()');
                      _isEmailExists(list.email, true, type, business_id, list.percentage, owner.applicantId).then(async (data) => {
                        if (data.value) {
                          logger.info('get response of _isEmailExists() call  registerBusinessOwner.saveKybBusinessOwner()');
                          // const applicant_id_result = await registerBusinessOwner.getApplicantIdUsingEmail(list.email);
                          // if(applicant_id_result.length > 0) {
                          //   const applicant_id = applicant_id_result[0].applicant_id;
                          //   const contact_id_result = await registerBusinessOwner.getContactIdUsingApplicantId(applicant_id);
                          //   const contact_id = contact_id_result[0].contact_id;
                          //   await registerBusinessOwner.saveBusinessOwnerWithContactId(business_id, contact_id, type, list.percentage);
                          // }
                          registerBusinessOwner.saveKybBusinessOwner(business_id, type, is_director, is_shareholder, is_primary_applicant, list.email, list.first_name + ',' + list.last_name, statusFlag, list.dob, list.percentage).then(message => {
                            logger.info('get response of  registerBusinessOwner.saveKybBusinessOwner()');
                            if (_.includes(type, OWNERTYPE.DIRECTOR)) {
                              logger.info('if type is director create a response and send ');
                              response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.directorAdded, STATUS.SUCCESS));
                            } else {
                              logger.debug('if type is not director create a response and send ');
                              response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.shareholderAdded, STATUS.SUCCESS));
                            }
                          }, (err) => {
                            logger.error(' registerBusinessOwner.saveKybBusinessOwner () ');
                            response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.updateError)));
                          })
                        } else {
                          logger.debug('_isEmailExists()');
                          response.send(ResponseHelper.buildSuccessResponse(data.totalShareholder, data.message, STATUS.SUCCESS));
                        }
                      });
                    }
                  } else {
                    response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.businessOwner.percentageError + global.type, STATUS.FAILED))
                  }
                }
              }).catch(err => {
                response.send(ResponseHelper.buildFailureResponse('Something went wrong fetching details'))
              })
            } else if ((is_director == 1 && is_shareholder == 1)) {
              const shareholderAlreadyAdded = directorsList.find(d => (d.email == list.email && d.is_shareholder == 1));
              if (shareholderAlreadyAdded) {

                response.send(ResponseHelper.buildFailureResponse(configVariable.message.businessOwner.already_added));
              } else {
                registerBusinessOwner.getKybBoId(global.business_id, list.email).then(kycBoObj => {
                  let kyb_owner_id = kycBoObj[0].kyb_bo_id;
                  registerBusinessOwner.getBusinessOwnerType(kyb_owner_id).then((data) => {
                    // const applicant_id_result = await registerBusinessOwner.getApplicantIdUsingEmail(list.email);
                    // if(applicant_id_result.length > 0) {
                    //   const applicant_id = applicant_id_result[0].applicant_id;
                    //   const contact_id_result = await registerBusinessOwner.getContactIdUsingApplicantId(applicant_id);
                    //   const contact_id = contact_id_result[0].contact_id;
                    //   await registerBusinessOwner.saveBusinessOwnerWithContactId(global.business_id, contact_id, 'shareholder', list.percentage);
                    // }
                    registerBusinessOwner.updateDirectorAsShareholder(is_shareholder, list.percentage, kyb_owner_id).then(res => {
                      response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.shareholdercumdirector, STATUS.SUCCESS));
                    }).catch(r => {
                      response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.kybidFail)));
                    });
                  })
                });
              }
            } else {
              logger.warn('if result.value false  ');
              response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.already_added, STATUS.FAILED));
            }
          });
        }, err => {
          logger.error(' registerBusinessOwner.getBusinessId(owner.applicantId)');
          response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
        });
      })
    }
  });
}

/**
 * @desc this function used for get business Owner by contact id 
 * @method getBusinessOwnersByCId 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return with the details of business owner
 */
var getBusinessOwnersByCId = function (request, response) {
  const owner = new Owner(request);
  let applicantId = owner.applicantId;
  logger.info('initialize getBusinessOwnersByCId and call ');
  registerBusinessOwner.getContactId(applicantId).then(contact_id => {
    logger.info('initialize getContactId and call  registerBusinessOwner.getBusinessOwnersByCId()');
    registerBusinessOwner.getBusinessOwnersByCId(contact_id[0].contact_id).then((ownerDetails => {
      logger.info('get response from registerBusinessOwner.getBusinessOwnersByCId() and check size ');
      if (ownerDetails[0] && _.size(ownerDetails) > 0) {
        logger.info('size >0 create a response  ');
        response.send(ResponseHelper.buildSuccessResponse({
          "ownerDetails": ownerDetails
        }, configVariable.message.businessOwnerContact.success, STATUS.SUCCESS));
      } else {
        logger.warn('size  == 0 create a response  ');
        response.send(ResponseHelper.buildSuccessResponse({
          "ownerDetails": ownerDetails
        }, configVariable.message.businessOwnerContact.success1, STATUS.FAILED));
      }
    }), (err) => {
      logger.error('error in  registerBusinessOwner.getBusinessOwnersByCId(owner.contact_id) ');
      response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
    });
  }, err => {
    logger.debug(' registerBusinessOwner.getContactId(owner.applicantId)');
    response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
  });
}

/**
 * @desc this function used for updateBusinessOwnerStatus 
 * @method updateBusinessOwnerStatus 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message along with status code
 */
var updateBusinessOwnerStatus = function (request, response) {
  logger.info('initialize updateBusinessOwnerStatus ()  and call   registerBusinessOwner.updateBusinessOwnerStatus() ');
  const owner = new Owner(request);
  registerBusinessOwner.updateBusinessOwnerStatus(owner.ownerDetails.kyb_bisiness_owner_id, owner.ownerDetails.status ? 1 : 0).then((res => {
    logger.info('get response from   registerBusinessOwner.updateBusinessOwnerStatus() ');
    response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.updatebusinessOwnerStatusSuccess, STATUS.SUCCESS));
  }), (err) => {
    logger.error(' error in get response from   registerBusinessOwner.updateBusinessOwnerStatus() ');
    response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.ErrorHandler)));
  });
}

/**
 * @desc this function used for update business owner 
 * @method updateBusinessOwner 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return with message along with status code
 */
var updateBusinessOwner = function (request, response) {
  logger.info('initialize updateBusinessOwner ()');
  const owner = new Owner(request);
  let ownerData = {
    status: owner.ownerDetails.status ? 1 : 0,
    type: owner.ownerDetails.type,
    name: owner.ownerDetails.first_name + ',' + owner.ownerDetails.last_name,
    email: owner.ownerDetails.email,
    dob: owner.ownerDetails.dob,
    percentage: owner.ownerDetails.percentage,
    owner_id: owner.ownerDetails.kyb_bisiness_owner_id,
    business_owner_type: owner.ownerDetails.business_owner_type

  };
  let applicant_id = request.params.applicant_id;
  registerBusinessOwner.getBusinessId(applicant_id).then(data => {
    if (_.size(data[0]) > 0 && data[0].business_id) {
      registerBusinessOwner.getKybBoId(data[0].business_id).then(kycBoObj => {
        if (_.size(kycBoObj[0]) > 0 && kycBoObj[0].kyb_bo_id) {
          logger.info('create a object and call registerBusinessOwner.updateBusinessOwner(ownerDetails)');
          registerBusinessOwner.updateBusinessOwner(ownerData, kycBoObj[0].kyb_bo_id).then((res => {
            logger.info('response of  registerBusinessOwner.updateBusinessOwner(ownerDetails)');
            response.send(ResponseHelper.buildSuccessResponse({}, `${ownerData.business_owner_type} ${configVariable.message.businessOwner.ownerSuccess}`, STATUS.SUCCESS));
          }), (err) => {
            logger.error('error in registerBusinessOwner.updateBusinessOwner(ownerDetails)');
            response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.updateError)));
          });
        } else {
          response.send(ResponseHelper.buildFailureResponse({}, configVariable.message.businessOwner.kybidFail, STATUS.FAILED));
        }
      }).catch(r => {
        response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.kybidFail)));
      })
    } else {
      response.send(ResponseHelper.buildFailureResponse({}, configVariable.message.businessOwner.businessFail, STATUS.FAILED));
    }
  }).catch(r => {
    response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.businessFail)));
  })
}

/**
 * @desc this function used for delete BusinessOwnerKyb 
 * @method deleteBusinessOwnerKyb 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return with message along with status code
 */
let deleteBusinessOwnerKyb = function (request, response) {
  let kyb_bo_id = request.params.bo_id;
  let type = request.params.type;
  registerBusinessOwner.deleteBusinessOwnerKyb(kyb_bo_id).then(res => {
    logger.info('response of registerBusinessOwner.deleteBusinessOwnerKyb(owner.kyb_document_id)');
    response.send(ResponseHelper.buildSuccessResponse({}, type + configVariable.message.businessOwner.deleted, STATUS.SUCCESS));
  }), (err) => {
    logger.error('error in  registerBusinessOwner.deleteBusinessOwnerKyb()');
    response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.deleteError)));
  }
}

/**
 * @desc this function used for get business owner details
 * @method getBusinessOwnerDetails 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return  return with owner details
 */
var getBusinessOwnerDetails = function (request, response) {
  mariadb.createConnection(config).then(conn => {
    logger.info('connection created for save business owner');
    conn.beginTransaction().then(() => {
      logger.info('transaction start');
      const owner = new Owner(request);
      let businessInfo = decrypt(owner.token_link);
      let userInfo = businessInfo.split(" ");
      owner.ownerDetails.business_id = userInfo[3];
      registerBusinessOwner.chechKybId(owner.ownerDetails.business_id, owner.ownerDetails.kyb_bo_id).then(results => {
        if (results.length > 0) {
          registerBusinessOwner.get_contact_id(owner.ownerDetails.business_id, owner.ownerDetails.kyb_bo_id).then((contactDetails) => {
            if (contactDetails.length == 0) {
              registerBusinessOwner.checkEmail(owner.ownerDetails.email, owner.ownerDetails.business_id).then(results => {
                if (results.length > 0) {
                  logger.info("email already exists")
                  response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.emailExist, STATUS.FAILED));
                } else {
                  let externalTransactionId = Math.floor((Math.random() * 1000) + 4) + Math.random().toString(36).substr(2, 5)
                  registerBusinessOwner.saveApplicant('business', owner.ownerDetails.email, owner.ownerDetails.mobile, externalTransactionId).then(applicant => {
                    logger.info('business application save in db');
                    registerBusinessOwner.saveContact(applicant.insertId, owner.ownerDetails).then(contact => {
                      // registerBusinessOwner.insertAddress(applicant.insertId,contact.insertId, owner.ownerDetails.country_id).then(results => {
                      logger.info('business contact save in db');
                      registerBusinessOwner.saveBusinessOwner(contact.insertId, owner.ownerDetails).then(owners => {
                        registerBusinessOwner.insertKycDetails(applicant.insertId, owner.ownerDetails).then(kycEntry => {
                          registerBusinessOwner.updateBusinessOwnerDetails(owner.ownerDetails, owner.ownerDetails.first_name + ',' + owner.ownerDetails.last_name).then(results => {
                            logger.info('business registerBusinessOwner save in db and commit ');
                            conn.commit();
                            conn.close();
                            logger.info('create a response for save business owner ');
                            response.send(ResponseHelper.buildSuccessResponse({
                              "user_id": (contact.insertId) ? contact.insertId : null,
                              "isKyc": (userInfo[2].toLowerCase() == 'true' || userInfo[2] == 1) ? true : false
                            }, configVariable.message.businessOwner.success, STATUS.SUCCESS));
                          }).catch(err => {
                            logger.error('error in updateBusinessOwnerDetails');
                            conn.rollback();
                            conn.close();
                            response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));

                          })
                        }, (err) => {
                          logger.error('error in failure entry insert');
                          conn.rollback();
                          conn.close();
                          response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.fail)));
                        });
                      }, (err) => {
                        logger.error('error in saveBusinessOwner');
                        conn.rollback();
                        conn.close();
                        response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.fail)));
                      });
                    }, (err) => {
                      logger.error('error in saveContact');
                      conn.rollback();
                      conn.close();
                      response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.fail)));
                    });

                  }, (err) => {
                    logger.error('error in save businessApplicant');
                    conn.rollback();
                    conn.close();
                    response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessContact.fail)));
                  });
                }
              }).catch(err => {
                logger.error('error in check email exist or not');
                conn.rollback();
                conn.close();
                response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
              })

            } else {
              let contact_id = contactDetails[0].contact_id;
              registerBusinessOwner.updateContact(contact_id, owner.ownerDetails).then(results => {
                if (results.affectedRows > 0) {
                  registerBusinessOwner.updateBusinessOwnerDetails(owner.ownerDetails, owner.ownerDetails.first_name + ',' + owner.ownerDetails.last_name).then(updateStatus => {
                    if (updateStatus.affectedRows > 0) {
                      logger.info('business registerBusinessOwner save in db and commit ');
                      conn.commit();
                      conn.close();
                      logger.info('create a response for save business owner ');
                      return response.send(ResponseHelper.buildSuccessResponse({
                        "user_id": contact_id,
                        "isKyc": (userInfo[2].toLowerCase() == 'true' || userInfo[2] == 1) ? true : false
                      }, configVariable.message.businessOwner.success, STATUS.SUCCESS));
                    } else {
                      conn.rollback();
                      conn.close();
                      return response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.fail)));
                    }
                  }).catch(err => {
                    logger.error('error updateBusinessOwnerDetails');
                    conn.rollback();
                    conn.close();
                    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
                  })
                } else {
                  conn.rollback();
                  conn.close();
                  return response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.businessOwner.fail)));
                }

              }).catch(err => {
                logger.error('error in saveContact');
                conn.rollback();
                conn.close();
                response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
              })
            }

          }).catch(err => {
            logger.error('error in save businessApplicant');
            conn.rollback();
            conn.close();
            response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
          })

        } else {
          response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.alertmsg, STATUS.FAILED));
        }
      }).catch(err => {
        logger.error('error in check the kyb_bo_id');
        conn.rollback();
        conn.close();
        response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.internalError)));
      })
      //}
      // else {
      //   logger.debug('Bussiness details not found');
      //   response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.businessFail, STATUS.FAILED));
      //  }
    }).catch((err) => {
      logger.debug('error in beginTransaction');
      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)))
    });
  }).catch((err) => {
    logger.error('error in createConnection');
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)))
  })
}


/**
 * @desc this function used for get business Owner details by email 
 * @method getBusinessOfOwner
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return with the details of business owner
 */
var getBusinessOfOwner = function (request, response) {
  const owner = new Owner(request);
  let email = owner.ownerDetails.email;
  let business_id = owner.ownerDetails.business_id;
  let type = owner.ownerDetails.type;
  let kyb_id = owner.ownerDetails.kyb_id;


  logger.info('initialize getBusinessOwnersByCId and call ');
  registerBusinessOwner.getContactByOwner(business_id, email, type).then(owner => {
    if (_.size(owner) > 0) {
      logger.info('initialize getContactId and call  registerBusinessOwner.getBusinessOwnersByCId()');
      registerBusinessOwner.getBusinessOwnersDetails(owner[0].business_id, email, type, kyb_id).then((ownerDetails => {
        logger.info('get response from registerBusinessOwner.getBusinessOwnersByCId() and check size ');
        if (ownerDetails[0] && _.size(ownerDetails) > 0) {
          logger.info('size >0 create a response  ');
          response.send(ResponseHelper.buildSuccessResponse({
            "ownerDetails": ownerDetails
          }, configVariable.message.businessOwnerContact.success, STATUS.SUCCESS));
        } else {
          logger.warn('size  == 0 create a response  ');
          response.send(ResponseHelper.buildSuccessResponse({
            "ownerDetails": ownerDetails
          }, configVariable.message.businessOwnerContact.success1, STATUS.FAILED));
        }
      }), (err) => {
        logger.error('error in  registerBusinessOwner.getBusinessOwnersByCId(owner.contact_id) ');
        response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
      });
    } else {
      response.send(ResponseHelper.buildSuccessResponse({
        "ownerDetails": []
      }, configVariable.message.businessOwnerContact.success1, STATUS.FAILED));
      // response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwnerContact.ownerFail, STATUS.FAILED));
    }
  }, err => {
    logger.debug(' registerBusinessOwner.getContactByUser(owner.ownerDetails.email)');
    response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
  })
}

export const createBusinessOwner = async function (request, response) {
  //  let list = request.body.list[0];
  logger.info('initialize addBusinessOwner () ');
  const owner = new Owner(request);
  global.type = owner.type;

  let is_director = (owner.type == "director") ? 1 : 0;
  let is_shareholder = (owner.type == "shareholder") ? 1 : 0;

  // 1. Get Business id
  const businessIdBlob = await registerBusinessOwner.getBusinessId(request.params.applicant_id);
  const businessId = businessIdBlob[0].business_id;

  // 2. Get all existing business owners
  registerBusinessOwner.getBusinessOwners().then(businessOwnersList => {
  
    // 3. Share holders
    if (owner.type == "shareholder") {
      const shareholdersList = businessOwnersList.filter(b => ((b.type == 'shareholder' || b.is_shareholder == 1) && (b.business_id === businessId)));
        console.log("shareholdersList", shareholdersList);
      const shareholder = shareholdersList.find(s => s.email == owner.ownerDetails.email);
      console.log("shareholder", shareholder);
   //   registerBusinessOwner.get_contact_id(owner.ownerDetails.business_id, owner.ownerDetails.email).then(contact => {
  //      console.log("contact", contact);
  //      if (contact && contact.length > 0) {
   //   if (shareholder) {
   //     return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.businessOwner.already_added, STATUS.FAILED));
        //  is_shareholder = 1;
    //   }
    //  })
      const directorsList = businessOwnersList.filter(b => ((b.type == 'director') && (b.business_id === businessId)));
      const directorSameAsShareholder = directorsList.find(s => (s.email == owner.ownerDetails.email) && (s.name != owner.ownerDetails.first_name + "," + owner.ownerDetails.last_name));
      if (directorSameAsShareholder) {
        return response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.businessOwner.directorEmail, STATUS.FAILED));

      }

      const percentageTotalOfExistingShareholders = shareholdersList.reduce((p, s) => {
        if (s.percentage == undefined || s.percentage == null || (s.percentage && s.percentage.trim().length == 0)) {
          return p + 0;
        }
        return parseInt(s.percentage.trim()) + p;
      }, 0);
      const totalPercentage = percentageTotalOfExistingShareholders + parseInt(owner.ownerDetails.percentage);
      if (totalPercentage > 100) {
        const allowedPercentage = 100 - percentageTotalOfExistingShareholders;
        return response.send(ResponseHelper.buildFailureResponse(new Error(`Cannot allow total of share percentages to be more than 100%. The maximum percentage of shares you can get is ${allowedPercentage} %`)));
      }
    }


    // 4. Directors
    const directorsList = businessOwnersList.filter(d => ((d.type == 'director' || d.is_director == 1) && (d.business_id === businessId)));

    const director = directorsList.find(d => d.email == owner.ownerDetails.email);
    const shareholdersList = businessOwnersList.filter(b => ((b.type == 'shareholder' || b.is_shareholder == 1) && (b.business_id === businessId)));
    const shareholder = shareholdersList.find(s => s.email == owner.ownerDetails.email);
    const bus_owner = director ? director : shareholder;
    console.log("director", director);
    console.log("shareholder", shareholder);
    if ((director || shareholder) && isDirectorTryingToBeShareHolderWithDifferentName(bus_owner, owner.ownerDetails)) {
      response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.businessOwner.already_added, STATUS.FAILED));
    } else {
      if (director) {
        is_director = 1;
      } else if (shareholder) {
        is_shareholder = 1;
      }
      _isApplicantAlreadyRegisteredAsBusinessOwner(owner.ownerDetails.email, owner.applicantId).then((isPrimaryApplicant) => {
        const is_primary_applicant = isPrimaryApplicant == true ? 1 : 0;
        // let statusFlag = ((request.body.list[0].status) == true || request.body.list[0].status == 1) ? 0: 1;
        let statusFlag = 0;
        logger.info('create request and call rregisterBusinessOwner.getBusinessId(owner.applicantId) ');
        registerBusinessOwner.getBusinessId(owner.applicantId).then(businessId => {
          logger.info('get response from    registerBusinessOwner.getBusinessId  ');
          logger.info('check _isEmailExists()');
          global.business_id = businessId[0].business_id;
          owner['ownerDetails']['business_id'] = business_id;
          _isEmailExists(owner.ownerDetails.email, true, type, business_id, owner.ownerDetails.percentage, owner.applicantId).then((result) => {
            logger.info('get response of _isEmailExists() and check result.value ');
            console.log("result", result);
            if (result.value) {
              logger.info(' result.value  true ');
              registerBusinessOwner.getPercentage(global.business_id).then(percentageCheck => {
                console.log("percentageCheck", percentageCheck);
                if (percentageCheck && percentageCheck.length > 0) {
                  let totalPercentage = percentageCheck[0].percentage;
                  let percentageRemained = 100 - totalPercentage;
                  //  console.log("list", list);
                  if (owner.ownerDetails.percentage <= percentageRemained) {
                    console.log("type", type);
                    if (_.includes(type, OWNERTYPE.BUSINESSOWNER)) {
                      logger.info(' if owner type is business owner  call  registerBusinessOwner.getStakeholdersInfo(business_id) to get list  ');
                      registerBusinessOwner.getStakeholdersInfo(business_id).then((ownerList => {
                        logger.info('get response of  registerBusinessOwner.getStakeholdersInfo(business_id) and call _createIndexResponse ()  ');
                        _createIndexResponse(ownerList, OWNERTYPE.BUSINESSOWNER, [], [], [], business_id).then(List => {
                          logger.info(' get response of l _createIndexResponse ()  and check size  ');
                          if (_.size(List.businessowner) > 0) {
                            logger.info(' if _.size(List.businessowner) > 0 create a response and send   ');
                            response.send(ResponseHelper.buildFailureResponse(langEngConfig.message.businessOwner.already_added));
                          } else {
                            logger.info(' if _.size(List.businessowner) == 0 call  registerBusinessOwner.saveKybBusinessOwner ()');
                            registerBusinessOwner.saveKybBusinessOwner(business_id, OWNERTYPE.BUSINESSOWNER, is_director, is_shareholder, is_primary_applicant, owner.ownerDetails.email, owner.ownerDetails.first_name + ',' + owner.ownerDetails.last_name, statusFlag, owner.ownerDetails.dob, owner.ownerDetails.percentage).then(message => {
                              logger.info('get response of  registerBusinessOwner.saveKybBusinessOwner ()');
                              response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.businessOwner.businessOwner, STATUS.SUCCESS));
                            }, (err) => {
                              logger.error('error in get response of  registerBusinessOwner.saveKybBusinessOwner ()');
                              response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.businessOwner.updateError)));
                            });
                          }
                        }, err => {
                          logger.debug('error in get response of  _createIndexResponse()');
                          response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.businessOwner.updateError)));
                        });
                      }), (err) => {
                        logger.error('error in get response of  registerBusinessOwner.getStakeholdersInfo(business_id)');
                        response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
                      });
                    } else {
                      let conn;
                      mariadb.createConnection(config)
                        .then(dbconn => {
                          conn = dbconn;
                          console.log("conn", conn);
                          logger.info('connection created for save business owner');
                          return conn.beginTransaction()
                        }, (err) => {
                          logger.error('error in createConnection');
                          response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)))
                        })
                        .then(() => {
                          logger.info('transaction start');
                          return registerBusinessOwner.getBusinessId(owner.applicantId);
                        }, (err) => {
                          logger.debug('error in beginTransaction');
                          response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)))
                        })
                      logger.info(' if owner type is not business owner _isEmailExists()');
                      _isEmailExists(owner.ownerDetails.email, true, type, business_id, owner.ownerDetails.percentage, owner.applicantId).then(async (data) => {
                        if (data.value) {
                          logger.info('get response of _isEmailExists() call  registerBusinessOwner.saveKybBusinessOwner()');
                          // const applicant_id_result = await registerBusinessOwner.getApplicantIdUsingEmail(list.email);
                          // if(applicant_id_result.length > 0) {
                          //   const applicant_id = applicant_id_result[0].applicant_id;
                          //   const contact_id_result = await registerBusinessOwner.getContactIdUsingApplicantId(applicant_id);
                          //   const contact_id = contact_id_result[0].contact_id;
                          //   await registerBusinessOwner.saveBusinessOwnerWithContactId(business_id, contact_id, type, list.percentage);
                          // }
                          registerBusinessOwner.saveKybBusinessOwner(business_id, type, is_director, is_shareholder, is_primary_applicant, owner.ownerDetails.email, owner.ownerDetails.first_name + ',' + owner.ownerDetails.last_name, statusFlag, owner.ownerDetails.dob, owner.ownerDetails.percentage).then(message => {
                            logger.info('get response of  registerBusinessOwner.saveKybBusinessOwner()');
                            if (_.includes(type, OWNERTYPE.DIRECTOR)) {
                              logger.info('if type is director create a response and send ');
                              owner['ownerDetails']['kyb_bo_id'] = message.insertId

                              registerBusinessOwner.get_contact_id(owner.ownerDetails.business_id, owner.ownerDetails.email).then(contact => {
                                console.log("contact**********", contact);
                                if (contact && contact.length == 0) {

                                  saveBusinessOwnerInfo(owner, response, conn);
                                } else {
                                  updateBusinessOwnerInfo(contact, owner, response, conn);
                                }
                              }, (err) => {
                                logger.error(' registerBusinessOwner.saveKybBusinessOwner () ');
                                response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.businessOwner.updateError)));
                              })
                              //   response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.businessOwner.directorAdded, STATUS.SUCCESS));
                            } else {
                              owner['ownerDetails']['kyb_bo_id'] = message.insertId
                              registerBusinessOwner.get_contact_id(owner.ownerDetails.business_id, owner.ownerDetails.email).then(contact => {
                                if (contact && contact.length == 0) {
                                  saveBusinessOwnerInfo(owner, response, conn);
                                } else {
                                  updateBusinessOwnerInfo(contact, owner, response, conn);
                                }
                              }, (err) => {
                                logger.error(' registerBusinessOwner.saveKybBusinessOwner () ');
                                response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.businessOwner.updateError)));
                              })
                              logger.debug('if type is not director create a response and send ');
                              //   response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.businessOwner.shareholderAdded, STATUS.SUCCESS));
                            }
                          }, (err) => {
                            logger.error(' registerBusinessOwner.saveKybBusinessOwner () ');
                            response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.businessOwner.updateError)));
                          })
                        } else {
                          logger.debug('_isEmailExists()');
                          response.send(ResponseHelper.buildSuccessResponse(data.totalShareholder, data.message, STATUS.SUCCESS));
                        }
                      });
                    }
                  } else {
                    response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.businessOwner.percentageError + global.type, STATUS.FAILED))
                  }
                }
              }).catch(err => {
                response.send(ResponseHelper.buildFailureResponse('Something went wrong fetching details'))
              })
            } else if ((is_director == 1 && is_shareholder == 1)) {
              const shareholderAlreadyAdded = directorsList.find(d => (d.email == owner.email && d.is_shareholder == 1));
              if (shareholderAlreadyAdded) {

                response.send(ResponseHelper.buildFailureResponse(langEngConfig.message.businessOwner.already_added));
              } else {
                registerBusinessOwner.getKybBoId(global.business_id, owner.email).then(kycBoObj => {
                  let kyb_owner_id = kycBoObj[0].kyb_bo_id;
                  registerBusinessOwner.getBusinessOwnerType(kyb_owner_id).then((data) => {
                    // const applicant_id_result = await registerBusinessOwner.getApplicantIdUsingEmail(list.email);
                    // if(applicant_id_result.length > 0) {
                    //   const applicant_id = applicant_id_result[0].applicant_id;
                    //   const contact_id_result = await registerBusinessOwner.getContactIdUsingApplicantId(applicant_id);
                    //   const contact_id = contact_id_result[0].contact_id;
                    //   await registerBusinessOwner.saveBusinessOwnerWithContactId(global.business_id, contact_id, 'shareholder', list.percentage);
                    // }
                    registerBusinessOwner.updateKybStatus('KYB_REDO', global.business_id).then(data => {
                      registerBusinessOwner.updateDirectorAsShareholder(is_shareholder, owner.percentage, kyb_owner_id).then(res => {
                        response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.businessOwner.shareholdercumdirector, STATUS.SUCCESS));
                      }).catch(r => {
                        response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.businessOwner.kybidFail)));
                      });
                    }).catch(r => {
                      response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.businessOwner.kybidFail)));
                    });
                  })
                });
              }
            } else {
              let conn;
              mariadb.createConnection(config)
                .then(dbconn => {
                  conn = dbconn;
                  logger.info('connection created for save business owner');
                  return conn.beginTransaction()
                }, (err) => {
                  logger.error('error in createConnection');
                  response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)))
                }).then(() => {
                  logger.info('transaction start');
                  registerBusinessOwner.get_contact_id(owner.ownerDetails.business_id, owner.ownerDetails.email).then(contact => {
                    console.log("contact", contact);
                    if (contact && contact.length > 0) {
                      logger.warn('if result.value false  ');
                      updateBusinessOwnerInfo(contact, owner, response, conn);
                    } else {
                      saveBusinessOwnerInfo(owner, response, conn);
                    }
                  })
                }, (err) => {
                  logger.debug('error in beginTransaction');
                  response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)))
                })

              //  response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.businessOwner.already_added, STATUS.FAILED));
            }
          });
        }, err => {
          logger.error(' registerBusinessOwner.getBusinessId(owner.applicantId)');
          response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
        });
      })
    }
  });
}

export const updatedKYBStatusDetails = async (request, response) => {
  let applicant_id = request.params.applicant_id;
  let business_id;
  let businessIdResult = await registerBusinessOwner.getBusinessId(applicant_id);
  if (businessIdResult && businessIdResult.length > 0) {
    business_id = businessIdResult[0].business_id;
  }
  let result = await registerBusinessOwner.getKybStatus(applicant_id);
  let KYB_status;
  if (result && result.length > 0) {
    KYB_status = result[0].kyb_status;
  }
  response.send(ResponseHelper.buildSuccessResponse({
    "KYB_status": KYB_status
  }, configVariable.message.businessOwnerContact.kyb_status, STATUS.SUCCESS));
}

export const getVerifyIdentiesInformation = function (request, response) {
  let applicant_id = request.params.applicant_id;
  logger.info('initialize  getStakeholdersInfo funxtion');
  //   const owner = new Owner(request);
  //   let applicantId = owner.applicantId;
  logger.info('create request and call registerBusinessOwner.getBusinessId function ');
  registerBusinessOwner.getBusinessId(applicant_id).then(businessId => {
    logger.info('get response from registerBusinessOwner.getBusinessId  ');
    if (businessId[0] && businessId[0].business_id) {
      registerBusinessOwner.getStakeholdersInfo(businessId[0].business_id).then((ownerList => {
        if (_.size(ownerList) > 0) {
          registerBusinessOwner.getStakeholdersContactInfo(businessId[0].business_id).then((cantactList => {
            logger.info('get response from registerBusinessOwner.getStakeholdersInfo and call _createIndexResponse ');
            let applicants = [];
            cantactList.forEach(r => {
              applicants.push(r.applicant_id)
            });
            registerBusinessOwner.getAddressDetails(applicants).then((addressList => {

              registerBusinessOwner.getKycDetails(applicants).then((kycList => {
                _createIndexResponse(ownerList, 'kyc_not_done', cantactList, kycList, addressList, businessId[0].business_id).then(result => {
                  logger.info('get response from _createIndexResponse and send to user ');
                  // registerBusinessOwner.getBusinessDocsDetails(businessId[0].business_id).then(data =>{

                  // })
                  response.send(ResponseHelper.buildSuccessResponse({
                    "ownerList": result
                  }, configVariable.message.businessOwner.StakeholderSuccess, STATUS.SUCCESS));
                  //response.send(result);
                }).catch(err => {
                  logger.error('error in _createIndexResponse ');
                  response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
                  //response.send(`${err}`);
                });
              }), (err) => {
                logger.debug('registerBusinessOwner.getStakeholdersInfo(owner.id)');
                response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
                //response.send(`${err}`);
              });
            }), (err) => {
              logger.debug('registerBusinessOwner.getStakeholdersInfo(owner.id)');
              response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
              //response.send(`${err}`);
            });
          }), (err) => {
            logger.debug('registerBusinessOwner.getStakeholdersInfo(owner.id)');
            response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
            //response.send(`${err}`);
          });

        } else {
          response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.recordNotFound, STATUS.FAILED))
        }

      }), (err) => {
        logger.debug(' registerBusinessOwner.getStakeholdersInfo(owner.id)');
        response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
        //response.send(`${err}`);
      });
    } else {
      logger.error('error in registerBusinessOwner.getBusinessId');
      response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.businessFail, STATUS.FAILED));
    }
  }, err => {
    logger.debug(' registerBusinessOwner.getBusinessId(owner.applicantId)');
    response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
    //response.send(`${err}`);
  });

}

export const getStructureOfBusiness = function (request, response) {
  logger.info('initialize  getStakeholdersInfo funxtion');
  const owner = new Owner(request);
  let applicantId = owner.applicantId;
  logger.info('create request and call registerBusinessOwner.getBusinessId function ');
  registerBusinessOwner.getBusinessId(applicantId).then(businessId => {
    logger.info('get response from registerBusinessOwner.getBusinessId  ');
    if (businessId[0] && businessId[0].business_id) {
      registerBusinessOwner.getStakeholdersInfo(businessId[0].business_id).then((ownerList => {
        console.log("ownerList", ownerList);
        if (_.size(ownerList) > 0) {
          console.log("businessId[0].business_id", businessId[0].business_id);
          registerBusinessOwner.getStakeholdersContactInfo(businessId[0].business_id).then((cantactList => {
            logger.info('get response from registerBusinessOwner.getStakeholdersInfo and call _createIndexResponse ');
            let applicants = [];
            cantactList.forEach(r => {
              applicants.push(r.applicant_id)
            });
            registerBusinessOwner.getAddressDetails(applicants).then((addressList => {
              console.log("cantactList", cantactList);
              registerBusinessOwner.getKycDetails(applicants).then((kycList => {
                _createIndexResponse(ownerList, 'structureOfBusiness', cantactList, kycList, addressList, businessId[0].business_id).then(result => {
                  logger.info('get response from _createIndexResponse and send to user ');
                  response.send(ResponseHelper.buildSuccessResponse({
                    "ownerList": result
                  }, configVariable.message.businessOwner.StakeholderSuccess, STATUS.SUCCESS));
                  //response.send(result);
                }).catch(err => {
                  logger.error('error in _createIndexResponse ');
                  response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
                  //response.send(`${err}`);
                });
              }), (err) => {
                logger.debug('registerBusinessOwner.getStakeholdersInfo(owner.id)');
                response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
                //response.send(`${err}`);
              });
            }), (err) => {
              logger.debug('registerBusinessOwner.getStakeholdersInfo(owner.id)');
              response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
              //response.send(`${err}`);
            });
          }), (err) => {
            logger.debug('registerBusinessOwner.getStakeholdersInfo(owner.id)');
            response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
            //response.send(`${err}`);
          });

        } else {
          response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.recordNotFound, STATUS.FAILED))
        }

      }), (err) => {
        logger.debug(' registerBusinessOwner.getStakeholdersInfo(owner.id)');
        response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
        //response.send(`${err}`);
      });
    } else {
      logger.error('error in registerBusinessOwner.getBusinessId');
      response.send(ResponseHelper.buildSuccessResponse({}, configVariable.message.businessOwner.businessFail, STATUS.FAILED));
    }
  }, err => {
    logger.debug(' registerBusinessOwner.getBusinessId(owner.applicantId)');
    response.send(ResponseHelper.buildFailureResponse(new Error(configVariable.message.error.ErrorHandler)));
    //response.send(`${err}`);
  });
}

export const getKybStatus = function (request, response) {

}


export {
  addBusinessOwner,
  saveBusinessOwner,
  _createIndexResponse,
  getStakeholdersInfo,
  getBusinessOwnersById,
  getStakeholdersInfoById,
  updateDetail,
  getBusinessOwnersByCId,
  updateBusinessOwnerStatus,
  deleteBusinessOwnerKyb,
  updateBusinessOwner,
  getBusinessOwnerDetails,
  getBusinessOfOwner
}