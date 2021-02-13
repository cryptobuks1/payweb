/**
 * businessModel
 * this is used for the insert  the business details of person in database and get the data from database
 * @package businessModel
 * @subpackage model/businessModel
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */

const format = require('string-format');
import { DbConnMgr } from '../dbconfig/dbconfig';
const DbInstance = DbConnMgr.getInstance();
import { Utils } from "../utility/utils";
import { sqlConfig } from '../utility/sqlService';
import {sqlObj} from '../utility/sql';
const util = new Utils();



export class BusinessOwner {
  constructor() {

  }
  // this method is used for creating different types of business owners like(Director/Shareholder/Ultimate Benificial Owner)

  saveApplicant(type, user_id, mobile, customerId, business_id) {    
    return new Promise((resolve, reject) => {
      logger.info('initialize saveApplicant() ');
      // let sql = sqlConfig.businessOwner.saveApplicant;
      let sql = sqlConfig.businessOwner.save_Applicant;
      let sqlQuery = format(sql, type, user_id, mobile, util.getGMT(), customerId, business_id);
      DbInstance.doInsert(sqlQuery).then(userData => {
        logger.info('success in  saveApplicant() ');
        resolve(userData);
      }).catch(err => {
        logger.error('error  in  saveApplicant() ');
        reject(err);
      });
    });
  }

  saveContact(applicant_id, ownerDetails) {
    return new Promise((resolve, reject) => {
      logger.info('initialize saveContact() ');
      let timestamp = util.getGMT();
      let sql = sqlConfig.businessOwner.saveContact;
      let sqlQuery = format(sql, applicant_id, ownerDetails.first_name, ownerDetails.last_name, ownerDetails.email, ownerDetails.gender, ownerDetails.dob, 
         ownerDetails.mobile,ownerDetails.phone,ownerDetails.place_of_birth, ownerDetails.nationality, timestamp)
      DbInstance.doInsert(sqlQuery).then(userData => {
        logger.info('success in  saveContact() ');
        resolve(userData);
      }).catch(err => {
        logger.error('error in  saveContact() ');
        reject(err);
      });
    });
  }

  saveBusinessOwner(contact_id, ownerDetails) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  saveBusinessOwner() ');
      let timestamp = util.getGMT();
      let sql = sqlConfig.businessOwner.saveBusinessOwner;
      let sqlQuery = format(sql, ownerDetails.business_id, contact_id, ownerDetails.business_owner_type, ownerDetails.percentage, timestamp)
      DbInstance.doInsert(sqlQuery).then(userData => {
        logger.info('success in  saveBusinessOwner() ');
        resolve(userData);
      }).catch(err => {
        logger.error('error in  saveBusinessOwner() ');
        reject(err);
      });
    });
  }

  // this method is used for get all the director 
  getStakeholdersInfo(id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getStakeholdersInfo() ');
      let sql = sqlConfig.businessOwner.getStakeholdersInfo;
      let sqlQuery = format(sql, id);
      DbInstance.doRead(sqlQuery).then(ownerDetails => {
        logger.info('success in  getStakeholdersInfo() ');
        resolve(ownerDetails);
      }).catch(err => {
        logger.error('error in  getStakeholdersInfo() ');
        reject(err);
      });
    });
  }

  getStakeholdersInfoById(id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getStakeholdersInfoById() ');
      let sql = sqlConfig.businessOwner.getStakeholdersInfoById;
      let sqlQuery = format(sql, id);
      DbInstance.doRead(sqlQuery).then(ownerDetails => {
        logger.info('success in  getStakeholdersInfoById() ');
        resolve(ownerDetails);
      }).catch(err => {
        logger.error('error in  getStakeholdersInfoById() ');
        reject(err);
      });
    });
  }

  // this method is used for get all the director 
  getStakeholdersContactInfo(id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getStakeholdersContactInfo() ');
      let sql = sqlConfig.businessOwner.getStakeholdersContactInfo;
      let sqlQuery = format(sql, id);
      DbInstance.doRead(sqlQuery).then(contactDetails => {
        logger.info('success in  getStakeholdersContactInfo() ');
        resolve(contactDetails);
      }).catch(err => {
        logger.error('error in  getStakeholdersContactInfo() ');
        reject(err);
      });
    });
  }
  // kyc details all
  getKycDetails(applicants) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getKycDetails() ');
      let sql = `select applicant_id , kyc_status ,kyc_transaction_id , kyc_vendor_id from kyc where applicant_id  ${applicants.length > 0 ? 'IN (' + applicants + ')' : '= 0'} `;
      DbInstance.executeQuery(sql).then(contactDetails => {
        logger.info('success in  getKycDetails() ');
        resolve(contactDetails);
      }).catch(err => {
        logger.error('error in  getKycDetails() ');
        reject(err);
      });
    });
  }
  // address details 
  getAddressDetails(applicants) {
    return new Promise((resolve, reject) => {
      let ids = applicants.length > 0 ? applicants : 0;
      logger.info('initialize  getAddressDetails() ');
      let sql = `select contact_id,country_id, address_line1 , address_line2, city, town, postal_code, region from address where applicant_id IN (` + ids + `)`;
      let sqlQuery = format(sql, ids)
      DbInstance.doRead(sqlQuery).then(addressDetails => {
        
        logger.info('success in  getAddressDetails() ');
        resolve(addressDetails);
      }).catch(err => {
        logger.error('error in  getAddressDetails() ');
        reject(err);
      });
    });
  }

  getDocStatus(docId) {       
    return new Promise((resolve, reject) => {
        logger.info("getFileDetails() initiated");
        let sql= sqlObj.upload.getDocStatus;
        let sqlQuery = format(sql,docId);            
        DbInstance.doRead(sqlQuery).then(result => {
            logger.info("sql query executed");
            resolve(result);
        }).catch(err => {
            logger.error("error while execute the query");
            reject(err);
        });
    })
}

getPersonalContactDetails(id) {
  return new Promise((resolve, reject) => {
    logger.info('initialize  getBusinessOwnersById() ');
    let sql = sqlConfig.businessOwner.getPersonalContactDetails;
    let sqlQuery = format(sql, id)
    DbInstance.doRead(sqlQuery).then(ownerDetails => {
      logger.info('success in  getBusinessOwnersById() ');
      resolve(ownerDetails);
    }).catch(err => {
      logger.error('error in  getBusinessOwnersById() ');
      reject(err);
    });
  });
}

  // get business owners list by contact_id
  getBusinessOwnersById(id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getBusinessOwnersById() ');
      let sql = sqlConfig.businessOwner.getBusinessOwnersById;
      let sqlQuery = format(sql, id)
      DbInstance.doRead(sqlQuery).then(ownerDetails => {
        logger.info('success in  getBusinessOwnersById() ');
        resolve(ownerDetails);
      }).catch(err => {
        logger.error('error in  getBusinessOwnersById() ');
        reject(err);
      });
    });
  }

  getKybBusinessOwner(id, mail) {
    return new Promise((resolve, reject) => {
      logger.info('initialize getKybBusinessOwner() ');
      var sqlQuery;
      if (mail) {
        let sql = sqlConfig.businessOwner.getKybBusinessOwner;
        sqlQuery = format(sql, mail, id)
        console.log("sqlQuery***", sqlQuery);
      } else {
        let sql = sqlConfig.businessOwner.getKybBusinessOwner_details
        sqlQuery = format(sql, id)
        console.log("sqlQuery@@@***", sqlQuery);
      }
      DbInstance.doRead(sqlQuery).then(ownerDetails => {
        logger.info('success in  getKybBusinessOwner() ');
        resolve(ownerDetails);
      }).catch(err => {
        logger.error('error in  getKybBusinessOwner() ');
        reject(err);
      });
    });
  }

  saveKybBusinessOwner(businessId, type, is_director, is_shareholder, is_primary_applicant, email, name, status, dob, percentage) {
    return new Promise((resolve, reject) => {
      logger.info('initialize saveKybBusinessOwner ');
      let timestamp = util.getGMT();
      let sql = sqlConfig.businessOwner.saveKybBusinessOwner;
      let sqlQuery = format(sql, businessId, type, is_director, is_shareholder, is_primary_applicant, email, name, status, dob, percentage, timestamp);
      DbInstance.doInsert(sqlQuery).then(ownerDetails => {
        logger.info('success in saveKybBusinessOwner ');
        resolve(ownerDetails);
      }).catch(err => {
        logger.error('error in saveKybBusinessOwner ');
        reject(err);
      });
    });
  }

  saveBusinessOwnerWithContactId(business_id, contact_id, business_owner_type, percentage) {
    return new Promise((resolve, reject) => {
      logger.info('initialize saveBusinessOwner ');
      let timestamp = util.getGMT();
      let sql = sqlConfig.businessSql.insert_business_owner;
      let sqlQuery = format(sql, business_id, contact_id, business_owner_type, percentage, timestamp);
      DbInstance.doInsert(sqlQuery).then(ownerDetails => {
        logger.info('success in saveBusinessOwner ');
        resolve(ownerDetails);
      }).catch(err => {
        logger.error('error in saveBusinessOwner ');
        reject(err);
      });
    });
  }

  //get business owners list by contact_id
  getBusinessOwnersByCId(id) {
    return new Promise((resolve, reject) => {
      logger.info(' initialize getBusinessOwnersByCId()');
      let sql = sqlConfig.businessOwner.getBusinessOwnersByCId;
      let sqlQuery = format(sql, id, 1);
      DbInstance.doRead(sqlQuery).then(getContact => {
        logger.info('success in getBusinessOwnersByCId()');
        resolve(getContact);
      }).catch(err => {
        logger.error('error in getBusinessOwnersByCId()');
        reject(err);
      });
    });
  }


  //get business owners list by contact_id
  getBusinessOwnersDetails(businessId, email, type, kyb_id) {
    return new Promise((resolve, reject) => {
      logger.info(' initialize getBusinessOwnersByCId()');
      let sql = sqlConfig.businessOwner.getBusinessOwnersDetails;
      let sqlQuery = format(sql, businessId, email, type , kyb_id);
      DbInstance.doRead(sqlQuery).then(getContact => {
        logger.info('success in getBusinessOwnersByCId()');
        resolve(getContact);
      }).catch(err => {
        logger.error('error in getBusinessOwnersByCId()');
        reject(err);
      });
    });
  }

  // update status of shareholder and directors
  updateBusinessOwnerStatus(id, type) {
    return new Promise((resolve, reject) => {
      logger.info('initialize updateBusinessOwnerStatus() ');
      let timestamp = util.getGMT();
      let sql = sqlConfig.businessOwner.updateBusinessOwnerStatus;
      let sqlQuery = format(sql, type, timestamp, id)
      DbInstance.doUpdate(sqlQuery).then(status => {
        logger.info('success in  updateBusinessOwnerStatus() ');
        resolve(status);
      }).catch(err => {
        logger.error('error in  updateBusinessOwnerStatus() ');
        reject(err);
      });
    });
  }

  // update  status of shareholder and directors in the list
  updateBusinessOwner(ownerDetails, kyb_owner_id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize updateBusinessOwner()');
      let timestamp = util.getGMT();
      let sql = sqlConfig.businessOwner.updateBusinessOwner;
      let sqlQuery = format(sql, ownerDetails.business_owner_type, ownerDetails.email, ownerDetails.name, ownerDetails.status, ownerDetails.dob, ownerDetails.percentage, timestamp, kyb_owner_id)
      DbInstance.doUpdate(sqlQuery).then(status => {
        logger.info('success in updateBusinessOwner() ');
        resolve(status);
      }).catch(err => {
        logger.error('error  in updateBusinessOwner() ');
        reject(err);
      });
    });
  }

    // update status of shareholder and directors in the list
    updateDirectorAsShareholder(is_shareholder, percentage, kyb_owner_id) {
      return new Promise((resolve, reject) => {
        logger.info('initialize updateDirectorAsShareholder()');
        let timestamp = util.getGMT();
        let sql = sqlConfig.businessOwner.updateDirectorAsShareholder;
        let sqlQuery = format(sql, is_shareholder, percentage, timestamp, kyb_owner_id)
        DbInstance.doUpdate(sqlQuery).then(status => {
          logger.info('success in updateDirectorAsShareholder()');
          resolve(status);
        }).catch(err => {
          logger.error('error  in updateDirectorAsShareholder()');
          reject(err);
        });
      });
    }

    updateShareholderStructure(kyc_doc_type, doc_status, business_id) {
      return new Promise((resolve, reject) => {
        logger.info('initialize updateDirectorAsShareholder()');
        let sql = sqlConfig.businessOwner.updateShareholderStructure;
        let sqlQuery = format(sql, kyc_doc_type, doc_status, business_id);
        DbInstance.doUpdate(sqlQuery).then(status => {
          logger.info('success in updateDirectorAsShareholder()');
          resolve(status);
        }).catch(err => {
          logger.error('error  in updateDirectorAsShareholder()');
          reject(err);
        });
      }); 
    }

    updateKybStatus(kyb_status, business_id) {
      return new Promise((resolve, reject) => {
        logger.info('initialize updateDirectorAsShareholder()');
        let timestamp = util.getGMT();
        let sql = sqlConfig.businessOwner.updateKybStatus;
        let sqlQuery = format(sql, kyb_status, business_id);
        DbInstance.doUpdate(sqlQuery).then(status => {
          logger.info('success in updateDirectorAsShareholder()');
          resolve(status);
        }).catch(err => {
          logger.error('error  in updateDirectorAsShareholder()');
          reject(err);
        });
      }); 
    }

  // this method is used to add shareholder
  deleteBusinessOwnerKyb(id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize   deleteBusinessOwnerKyb()');
      let sql = sqlConfig.businessOwner.deleteBusinessOwnerKyb;
      let sqlQuery = format(sql, id);
      DbInstance.doDelete(sqlQuery).then(status => {
        logger.info('success in  deleteBusinessOwnerKyb() ');
        resolve(status);
      }).catch(err => {
        logger.error('error in  deleteBusinessOwnerKyb() ');
        reject(err);
      });
    });
  }

  getKybBoId(business_id, email) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getKybBoId() ');
      let sql = sqlConfig.businessOwner.getKybBoId;
      let sqlQuery = format(sql, business_id, email);
      DbInstance.doRead(sqlQuery).then(kyb_business_id => {
        logger.info('success in  getKybBoId() ');
        resolve(kyb_business_id);
      }).catch(err => {
        logger.error('error in  getKybBoId() ');
        reject(err);
      });
    })
  }

  getBusinessOwnerDetails(kyb_bo_id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getBusinessOwnerDetails() ');
      let sql = sqlConfig.businessOwner.getBusinessOwnerDetails;
      let sqlQuery = format(sql, kyb_bo_id);
      DbInstance.doRead(sqlQuery).then(status => {
        logger.info('success in  getBusinessOwnerDetails() ');
        resolve(status);
      }).catch(err => {
        logger.error('error in  getBusinessOwnerDetails() ');
        reject(err);
      });
    });
  }

  getBusinessOwnerType(kyb_bo_id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getBusinessOwnerType() ');
      let sql = sqlConfig.businessOwner.getBusinessOwnerType;
      let sqlQuery = format(sql, kyb_bo_id);
      DbInstance.doRead(sqlQuery).then(status => {
        logger.info('success in getBusinessOwnerType() ');
        resolve(status);
      }).catch(err => {
        logger.error('error in getBusinessOwnerType() ');
        reject(err);
      });
    });
  }

  getBusinessOwners() {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getBusinessOwnerType() ');
      let sql = sqlConfig.businessOwner.getBusinessOwners;
      let sqlQuery = format(sql);
      DbInstance.doRead(sqlQuery).then(status => {
        logger.info('success in getBusinessOwners() ');
        resolve(status);
      }).catch(err => {
        logger.error('error in getBusinessOwners() ');
        reject(err);
      });
    });
  }

  getBusinessId(applicant_Id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getBusinessId() ');
      let sql = sqlConfig.businessOwner.getBusinessId;
      let sqlQuery = format(sql, applicant_Id);
      DbInstance.doRead(sqlQuery).then(businessInfo => {
        logger.info('success in  getBusinessId() ');
        resolve(businessInfo);
      }).catch(err => {
        logger.error('error in  getBusinessId() ');
        reject(err);
      });
    });
  }

  getPersonalSettingsInfo(applicantId) {
    return new Promise((resolve, reject) => {
      logger.info('getPersonalSettingsInfo() initiated');
      let sql = sqlObj.settings.getBusinessownerInfo;
      let sqlQuery = format(sql, applicantId);
      DbInstance.doRead(sqlQuery).then(personalInfo => {
        logger.info('getPersonalSettingsInfo() execution completed');
        resolve(personalInfo);
      })
        .catch(err => {
          logger.info('getPersonalSettingsInfo() execution error');
          reject(new Error());
        })
    })
  }

  getKybStatus(applicant_id) {
    return new Promise((resolve, reject) => {
      logger.info('getUserData() method initiated');

      let sql = sqlObj.login.getKybStatus;
      let sqlQuery = format(sql, applicant_id);
      console.log("sqlQuery", sqlQuery);
      DbInstance.doRead(sqlQuery).then(result => {
          logger.info('getUserData() execution completed');
          resolve(result);
        })
        .catch(err => {
          logger.error('Error occured : ' + err);
          logger.info('getUserData() execution completed');
          reject(new Error(err));
        })
    })
  }
  getBusinessOwnerId(applicant_Id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getBusinessOwnerId() ');
      let sql = sqlConfig.businessOwner.getBusinessOwnerId;
      let sqlQuery = format(sql, applicant_Id);
      DbInstance.doRead(sqlQuery).then(businessInfo => {
        logger.info('success in  getBusinessOwnerId() ');
        resolve(businessInfo);
      }).catch(err => {
        logger.error('error in  getBusinessOwnerId() ');
        reject(err);
      });
    });
  }

  getBusinessIdfromKyb(id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getContactId() ');
      let sql = sqlConfig.businessOwner.getBusinessIdfromKyb;
      let sqlQuery = format(sql, id);
      DbInstance.doRead(sqlQuery).then(businessInfo => {
        logger.info('success in  getContactId() ');
        resolve(businessInfo);
      }).catch(err => {
        logger.error('error in  getContactId() ');
        reject(err);
      });
    });
  }


  getContactId(applicant_Id) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getContactId() ');
      let sql = sqlConfig.businessOwner.getContactId;
      let sqlQuery = format(sql, applicant_Id);
      DbInstance.doRead(sqlQuery).then(businessInfo => {
        logger.info('success in  getContactId() ');
        resolve(businessInfo);
      }).catch(err => {
        logger.error('error in  getContactId() ');
        reject(err);
      });
    });
  }

  getContactByUser(email) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getContactByUser() ');
      let sql = sqlConfig.businessOwner.getContactByUser;
      let sqlQuery = format(sql, email);
      DbInstance.doRead(sqlQuery).then(cantactInfo => {
        logger.info('success in  getContactByUser() ');
        resolve(cantactInfo);
      }).catch(err => {
        logger.error('error in  getContactByUser() ');
        reject(err);
      });
    });
  }
  getContactByOwner(businessId, email, type) {
    return new Promise((resolve, reject) => {
      logger.info('initialize  getContactByOwner() ');
      let sql = sqlConfig.businessOwner.getContactByOwner;
      let sqlQuery = format(sql, businessId, email, type);
      DbInstance.doRead(sqlQuery).then(cantactInfo => {
        logger.info('success in  getContactByOwner() ');
        resolve(cantactInfo);
      }).catch(err => {
        logger.error('error in  getContactByOwner() ');
        reject(err);
      });
    });
  }


  getPercentage(business_id) {
    return new Promise((resolve, reject) => {
      logger.info('getPercentage() intiated ');
      let sql = sqlConfig.businessOwner.getPercentage;
      let sqlQuery = format(sql, business_id);
      DbInstance.doRead(sqlQuery).then(percentageSum => {
        logger.info('query executed');
        resolve(percentageSum);
      }).catch(err => {
        logger.error('error while getting sum of percentage');
        reject(err);
      })
    })
  }

  getCompanyDetails(businessId) {
    return new Promise((resolve, reject) => {
      logger.info('getCompanyDetails() Initiated')
      let sql = sqlConfig.businessOwner.getCompanyDetails;
      let sqlQuery = format(sql, businessId);
      DbInstance.doRead(sqlQuery)
        .then(result => {
          logger.info('getCompanyDetails() Successfully Exited')
          resolve(result);
        })
        .catch(err => {
          logger.info('getCompanyDetails() Exited')
          reject(err);
        })
    })
  }

  insertKycDetails(applicantId) {
    return new Promise((resolve, reject) => {
      let timestamp = util.getGMT();
      let sql = sqlConfig.businessOwner.insertKycDetails;
      let sqlQuery = format(sql, applicantId, timestamp)
      DbInstance.doInsert(sqlQuery).then(kycResult => {
        resolve(kycResult);
      }).catch(err => {
        reject(err);
      })
    })
  }
  updateBusinessOwnerDetails(ownerDetails,name) {
    return new Promise((resolve, reject) => {
      let sql = sqlConfig.businessOwner.updateBusinessOwnerDetails;
      let sqlQuery = format(sql, ownerDetails.email, ownerDetails.dob, util.getGMT(), ownerDetails.kyb_bo_id, ownerDetails.business_id,name, ownerDetails.percentage)
      DbInstance.doUpdate(sqlQuery).then(kycResult => {
        resolve(kycResult);
      }).catch(err => {
        reject(err);
      })
    })
  }
  
	insertAddress(applicantId,contactId, countryId) {
		return new Promise((resolve, reject) => {
      let timestamp = util.getGMT();
			logger.info('insertAddress() initiated');
			let sql = sqlObj.addressModel.insertOwnerAddress;
			let sqlQuery = format(sql,contactId,applicantId, countryId , timestamp)
			DbInstance.doInsert(sqlQuery).then(result => {
				logger.info("query executed");
				resolve(result);
			}).catch(err => {
				logger.error("error while  execute the query");
				reject(err);
			});
		});
	}
get_contact_id(business_id,email){
  return new Promise((resolve, reject) => {
    logger.info('getContactId initiated');
    let sql = sqlConfig.businessOwner.get_contact_id;
    let sqlQuery = format(sql,business_id,email)
    console.log("sqlQueryvvv", sqlQuery);
    DbInstance.doInsert(sqlQuery).then(result => {     
      logger.info("query executed");
      resolve(result);
    }).catch(err => {
      logger.error("error while  execute the query");
      reject(err);
    });
  });
}

getContactIdUsingApplicantId(applicant_id) {
  return new Promise((resolve, reject) => {
    logger.info('getContactIdUsingApplicantId initiated');
    let sql = sqlConfig.contactSql.select_contact;
    let sqlQuery = format(sql, applicant_id)
    DbInstance.doRead(sqlQuery).then(result => {     
      logger.info("query executed");
      resolve(result);
    }).catch(err => {
      logger.error("error while  execute the query");
      reject(err);
    });
  });

}

updateContact(id,owner) {
  return new Promise((resolve, reject) => {
    let timestamp = util.getGMT();
    logger.info('getContactId initiated');
    let sql = sqlConfig.businessOwner.updateContact;
    let sqlQuery = format(sql,id,owner.dob,owner.email,owner.gender,owner.mobile,owner.phone,owner.first_name,owner.last_name,
      owner.place_of_birth, owner.nationality,timestamp)
      console.log("update contact sqlQuery", sqlQuery);
    DbInstance.doInsert(sqlQuery).then(result => { 
      logger.info("query executed");
      resolve(result);
    }).catch(err => {
      logger.error("error while  execute the query");
      reject(err);
    });
  });
}

updateApplicant(id,owner) {
  return new Promise((resolve, reject) => {
    let timestamp = util.getGMT();
    logger.info('getContactId initiated');
    let sql = sqlConfig.businessOwner.updateApplicant;
    let sqlQuery = format(sql,id,owner.email,owner.mobile,timestamp)
    DbInstance.doInsert(sqlQuery).then(result => { 
      logger.info("query executed");
      resolve(result);
    }).catch(err => {
      logger.error("error while  execute the query");
      reject(err);
    });
  });
}
chechKybId(business_id,kyb_id) {
  return new Promise((resolve, reject) => {
    logger.info('chechKybId initiated');
    let sql = sqlConfig.businessOwner.checkKybId;
    let sqlQuery = format(sql,business_id,kyb_id);
    DbInstance.doInsert(sqlQuery).then(result => {   
      logger.info("query executed");
      resolve(result);
    }).catch(err => {
      logger.error("error while  execute the query");
      reject(err);
    });
  });
}
checkEmail(email,businessId) {
  return new Promise((resolve, reject) => {
    logger.info('checkEmail initiated');
    let sql = sqlConfig.businessOwner.checkEmail;
    let sqlQuery = format(sql,email,businessId)


    DbInstance.doInsert(sqlQuery).then(result => {    
      logger.info("query executed");
      resolve(result);
    }).catch(err => {
      logger.error("error while  execute the query");
      reject(err);
    });
  });  
}
isUserExists(value, applicant_id) {
  return new Promise((resolve, reject) => {
    logger.info('isUserExists initiated');
    let sql = sqlConfig.businessOwner.checkEmailIsNotOfApplicant;
    let sqlQuery = format(sql,value, applicant_id)
    DbInstance.doRead(sqlQuery).then(userData => {
      logger.info("query executed");
      resolve(userData);
    }).catch(err => {
      logger.error("error while  execute the query");
      reject(err);
    });
  })
}

isApplicantAlreadyRegisteredAsBusinessOwner(email, applicant_id) {
  return new Promise((resolve, reject) => {
    logger.info('isEmailOfApplicant initiated');
    let sql = sqlConfig.businessOwner.isApplicantAlreadyRegisteredAsBusinessOwner;
    let sqlQuery = format(sql, email, applicant_id)
    DbInstance.doRead(sqlQuery).then(userData => {
      logger.info("query executed");
      resolve(userData);
    }).catch(err => {
      logger.error("error while  execute the query");
      reject(err);
    });
  })
}

// method to update stakeholder detal (name, email, percentage) by id
updateBusinessOwnerStatkeholderDetail(id,name,email,percentage) {
  return new Promise((resolve, reject) => {
    logger.info('initialize  updateStatkeholderDetails() ');
    let timestamp = util.getGMT();
    let sql = sqlConfig.businessOwner.updateBusinessOwnerStatkeholderDetails;
    let sqlQuery = format(sql, id, name, email, percentage, timestamp);
    DbInstance.doRead(sqlQuery).then(directorDetail => {
      logger.info('success in  updateStatkeholderDetails() ');
      resolve(directorDetail);
    }).catch(err => {
      logger.error('error in  updateStatkeholderDetails() ');
      reject(err);
    });
  });
 }

// method to update director detal (name, email) by id
 updateBusinessOwnerDirector(id,name,email) {
  return new Promise((resolve, reject) => {
    logger.info('initialize  updateBusinessOwnerDirectorDetail() ');
    let timestamp = util.getGMT();
    let sql = sqlConfig.businessOwner.updateBusinessOwnerDirector;
    let sqlQuery = format(sql, id, name, email, timestamp);
    DbInstance.doRead(sqlQuery).then(directorDetail => {
      logger.info('success in  updateBusinessOwnerDirectorDetail() ');
      resolve(directorDetail);
    }).catch(err => {
      logger.error('error in  updateBusinessOwnerDirectorDetail() ');
      reject(err);
    });
  });
 }

 getOwnerEmail(email) {
  return new Promise((resolve, reject) => {
    logger.info('initialize  getOwnerEmails() ');
    let sql = sqlConfig.businessOwner.getOwnerEmail;
    let sqlQuery = format(sql, email);
    DbInstance.doRead(sqlQuery).then(id => {
      logger.info('success in  getOwnerEmails() ');
      resolve(id);
    }).catch(err => {
      logger.error('error in  getOwnerEmails() ');
      reject(err);
    });
  });
 }
 
 getApplicantIdUsingEmail(email) {
  return new Promise((resolve, reject) => {
    logger.info('initialize  getApplicantIdUsingEmail() ');
    let sql = sqlConfig.businessOwner.getApplicantIdUsingEmail;
    let sqlQuery = format(sql, email);
    DbInstance.doRead(sqlQuery).then(id => {
      logger.info('success in  getApplicantIdUsingEmail() ');
      resolve(id);
    }).catch(err => {
      logger.error('error in  getApplicantIdUsingEmail() ');
      reject(err);
    });
  });

 }

}
