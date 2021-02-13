/**
 * businessSettings Controller
 * businessSettings Controller is used in business settings.
 * @package businessSettings
 * @subpackage controller/businessSettings
 *  @author SEPA Cyber Technologies, Sekhara suman sahu
 */
import {
  langEngConfig
} from '../utility/lang_eng';
import {
  ACL
} from '../utility/AccessControleList';
import {
  BusiSetting
} from '../model/businessSettings';
import {
  Utils
} from '../utility/utils';
import {
  inviteUserToBusiness
} from '../mailer/mail';
let format = require('string-format');
let util = new Utils();
let bs = new BusiSetting();

const STATUS = {
  SUCCESS: 0,
  FAILURE: 1,
};

/**
 * @desc this is for the create address. 
 * @method setDefaultBusinessRole 
 * @param {int} businessId - It is a business id
 * @param {Object} business - It is a business object
 * @return return message and status code
 */

export const setDefaultBusinessRole = async (businessId, business) => {
  try {
    logger.info('__insertDefaultRole() called');
    let timeStamp = util.getGMT();
    let aclArray = [];
    for (let i = 0; i < ACL.length; i++) {
      aclArray.push(JSON.stringify(ACL[i]));
    }
    logger.info('setBusinessRole() called');
    for (let i = 0; i < aclArray.length; i++) {
      await bs.setBusinessRole(businessId, i + 1, aclArray[i], timeStamp);
      logger.info('setBusinessRole() execution completed');
    }

    logger.info('getRegisteringUser() called');
    let userData = await bs.getRegisteringUser(business.applicant_id);
    logger.info('getRoleId() called');
    let adminRoleId = await bs.getRoleId('ADMIN');
    logger.info('getBusinessRoleId() called');
    let business_admin_id = await bs.getBusinessRoleId(businessId, adminRoleId[0].role_id);
    let adminBusinessRoleId = business_admin_id[0].business_role_id;
    //let timeStamp = util.getGMT();

    //Set default admin for a business
    logger.info('setDeafultAdmin() called');
    await bs.setDeafultAdmin(adminBusinessRoleId, businessId, userData[0].first_name, userData[0].last_name, userData[0].email, adminRoleId[0].role_id, 1, timeStamp);
  } catch (err) {
    logger.error('Error occured ' + err);
  }
}


/**
 * @desc this is to get invited business roles. 
 * @method getInvitedBusinessUsers
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */

//Method for getting invited business roles
export const getInvitedBusinessUsers = (request, response) => {
  logger.info('getInvitedBusinessUsers() called');
  __getInvitedBusinessUsers().then(result => {
    logger.info('getInvitedBusinessUsers() execution completed');
    response.send(result);
  })
}

//Method to get invited business role
const __getInvitedBusinessUsers = async () => {
  logger.info('__getInvitedBusinessUsers() called');
  try {
    let business_users = await bs.getInvitedBusinessUsers();
    let invited_business_users = [];
    if (business_users.length > 0) {
      business_users.forEach(u => {
        let userExists = invited_business_users.find(iu => iu.email == u.email);
        if (!userExists) {
          invited_business_users.push(u);
        }
      });
      logger.info('__getInvitedBusinessUsers() execution completed');
      return ResponseHelper.buildSuccessResponse({
        invited_business_users
      }, langEngConfig.message.business_settings.getInvitedBusinessRoles, STATUS.SUCCESS);
    }
    return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.noInvitedUsers, STATUS.FAILURE);
  } catch (err) {
    logger.error('Error occured ' + err);
    return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler));
  }
}



/**
 * @desc this is for to get the defined roles of a business. 
 * @method getbusinessRole 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */

//Method for getting defined Roles of a business
export const getbusinessRole = (request, response) => {
  logger.info('getbusinessRole called');
  __getBusinessRole().then(result => {
    logger.info('getbusinessRole execution completed');
    response.send(result);
  })
}

const __getBusinessRole = async () => {
  logger.info('__getBusinessRole called');
  try {
    //Get the defined buisness roles based upon applicant id
    let roles = await bs.getBusinessRole();
    if (roles.length > 0) {
      let business_roles = [];
      //Process the data
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].role_id) {
          let obj = {
            role_name: roles[i].role_name,
            role_id: roles[i].role_id,
            acl: JSON.parse(roles[i].acl)
          }
          if(obj.acl == null) {
            obj.acl = fillRoleWithDefaultPermissions();
          }
          business_roles.push(obj);
        }
      }
      logger.info('__getBusinessRole execution completed');
      return ResponseHelper.buildSuccessResponse({
        business_roles
      }, langEngConfig.message.business_settings.getBusinessRole, STATUS.SUCCESS);
    }
    logger.info('__getBusinessRole execution completed');
    return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.getRoleErr, STATUS.FAILURE);
  } catch (err) {
    logger.error('Error occured ' + err)
    return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler));
  }
}

const fillRoleWithDefaultPermissions = () => {
  return {
    "business_management": {
      "business_profile_billing": {
        "can_view": true,
        "can_manage": false
      },
      "user_management": {
        "can_view": true,
        "can_manage": false
      }
    },
    "accounts_statements": {
      "accounts": {
        "can_view": true,
        "can_manage": false
      },
      "transactions": {
        "can_view": true,
        "can_manage": false
      }
    },
    "operations_with_funds": {
      "exchanges": {
        "can_view": true,
        "can_manage": false
      },
      "payments": {
        "can_view": true,
        "can_manage": false
      },
      "counterparties": {
        "can_view": true,
        "can_manage": false
      }
    },
    "cards_employees": {
      "physical_cards": {
        "can_view": true,
        "can_manage": false
      },
      "virtual_cards": {
        "can_view": true,
        "can_manage": false
      }
    }
  }
}

/**
 * @desc this is to create new role for a business. 
 * @method createNewBusiRole 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */

//Method for cretaing new business role
export const createNewBusiRole = (request, response) => {
  logger.info('createNewBusiRole called');
  let applicantId = request.params.applicant_id;
  let roleName = _.toUpper(request.body.role_name);
  let acl = JSON.stringify(ACL[2]); // Default viewer ACL is assigned to every new role

  __createNewRole(applicantId, roleName, acl).then(result => {
    logger.info('createNewBusiRole() execution completed');
    response.send(result);
  })

}

const __createNewRole = async (applicantId, roleName, acl) => {
  logger.info('__createNewRole called');
  //Get the business_id
  try {
    let businessId = await bs.getBusinessId(applicantId);
    if (businessId.length > 0) {
      //check weather business already has this role
      let roles = await bs.getBusinessRole();
      let isRoleExist = _.filter(roles, {
        role_name: roleName
      });
      let timeStamp = util.getGMT();
      if (isRoleExist.length > 0) {
        if (isRoleExist[0].status) {
          return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.roleExist, STATUS.FAILURE);
        }
        let roleId = await bs.getRoleId(roleName);
        //Activate the role for the business
        await bs.activateRole(timeStamp, businessId[0].business_id, roleId[0].role_id);
        return ResponseHelper.buildSuccessResponse({
          role_id: roleId[0].role_id
        }, langEngConfig.message.business_settings.roleCreateSucc, STATUS.SUCCESS);
      }
      //Get the role_id based upon role name
      let roleId = await bs.getRoleId(roleName);
      //If role does not exist. Create the role
      let createRole;
      if (roleId.length == 0) {
        createRole = await bs.createRole(roleName, acl, timeStamp);
        let createBusiRole = await bs.setBusinessRole(businessId[0].business_id, createRole.insertId, acl, timeStamp);
        if (createBusiRole) {
          return ResponseHelper.buildSuccessResponse({
            role_id: createRole.insertId
          }, langEngConfig.message.business_settings.roleCreateSucc, STATUS.SUCCESS);
        }
        return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.roleCreateErr, STATUS.FAILURE);
      }
      //map the role to business
      let createBusiRole = await bs.setBusinessRole(businessId[0].business_id, roleId[0].role_id, acl, timeStamp);
      if (createBusiRole) {
        return ResponseHelper.buildSuccessResponse({
          role_id: roleId[0].role_id
        }, langEngConfig.message.business_settings.roleCreateSucc, STATUS.SUCCESS);
      }
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.roleCreateErr, STATUS.FAILURE);
    }
    return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.noBusinessId, STATUS.FAILURE);
  } catch (err) {
    logger.error('Error occured ' + err);
    return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler));
  }
}

/**
 * @desc this is to update existing role of a business. 
 * @method updateBusiRole 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */

export const updateBusiRole = (request, response) => {
  logger.info('updateBusiRole() called');
  let applicantId = request.params.applicant_id;
  let role_id = request.body.role_id;
  let acl = JSON.stringify(request.body.acl);
  __updateRole(applicantId, role_id, acl).then(result => {
    logger.info('updateBusiRole() exeution completed');
    response.send(result);
  })
}

//Method for updating business role
const __updateRole = async (applicantId, role_id, acl) => {
  logger.info('__updateRole() called');
  try {
    let businessId = await bs.getBusinessId(applicantId);
    //Check wheather the business has this role or not
    let isRoleExist = await bs.getBusinessRoleId(businessId[0].business_id, role_id);
    if (isRoleExist.length == 0) {
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.getRoleErr, STATUS.FAILURE);
    }
    let timeStamp = util.getGMT();
    if (businessId.length > 0) {
      let updateRole = await bs.updateRole(businessId[0].business_id, role_id, acl, timeStamp);
      if (updateRole) {
        logger.info('__updateRole() execution completed');
        return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.roleUpdate, STATUS.SUCCESS);
      }
      logger.info('__updateRole() execution completed');
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.roleUpdateError, STATUS.FAILURE);
    }
    return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.noBusinessId, STATUS.FAILURE);
  } catch (err) {
    logger.error('Error occured ' + err);
    return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler));
  }
}

/**
 * @desc this is to delete role of a business. 
 * @method deleteRole 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */

//Method for deleting business role
export const deleteRole = (request, response) => {
  logger.info('deleteRole() called');
  let applicantId = request.params.applicant_id;
  let role_id = request.body.role_id;
  __deleteRole(applicantId, role_id).then(result => {
    logger.info('deleteRole() execution completed');
    response.send(result);
  }).catch(err => {
    logger.error("error while insert the data");
    response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
  });
}

//Method to delete business role
const __deleteRole = async (applicantId, role_id) => {
  logger.info('__deleteRole() called');
  try {
    let businessId = await bs.getBusinessId(applicantId);
    if (businessId.length > 0) {
      let deleteRole = await bs.doDeleteRole(businessId[0].business_id, role_id);
      if (deleteRole.affectedRows) {
        logger.info('__deleteRole() execution completed');
        return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.roleDeletSucc, STATUS.SUCCESS);
      }
      logger.info('__deleteRole() execution completed');
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.roleDeleteErr, STATUS.FAILURE);
    }
    return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.noBusinessId, STATUS.FAILURE);
  } catch (err) {
    logger.error('Error occured ' + err);
    return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler));
  }
}

/**
 * @desc this is to map an user to a business. 
 * @method mapUserToBusiness 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */

//Method map an user to a business
export const mapUserToBusiness = (request, response) => {
  logger.info('mapUserToBusiness() called');
  let applicantId = request.params.applicant_id;
  let role_id = request.body.role_id;
  let first_name = request.body.first_name;
  let last_name = request.body.last_name;
  let email = request.body.email;
  let acl = JSON.stringify(request.body.acl);

  __mapUserToBusi(applicantId, role_id, first_name, last_name, email, acl).then(result => {
    logger.info('mapUserToBusiness() execution completed');
    response.send(result);
  })
}

const __mapUserToBusi = async (applicantId, role_id, first_name, last_name, email, acl) => {
  logger.info('__mapUserToBusi() called');
  try {
    //Get business id
    let businessId = await bs.getBusinessId(applicantId);
    let timeStamp = util.getGMT();
    if (businessId.length > 0) {
      //Check wheather the email is already ampped to the business or not
      let isAlreayAdded = await bs.isAlreayAdded(businessId.business_id);
      if (isAlreayAdded.length == 0) {
        if (role_id) {
          let save_acl = await bs.saveAclInRole(role_id, acl);
          if (save_acl == null) {
            return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.aclAddError, STATUS.FAILURE);
          }
        }
        let business_role_id = await bs.getBusinessRoleId(businessId[0].business_id, role_id);
        if (business_role_id.length == 0) {
          if (role_id == undefined || role_id == null) {
            return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.rolemapErr, STATUS.FAILURE);
          }
          let tS = util.getGMT();
          await bs.setBusinessRole(businessId[0].business_id, role_id, acl, tS);
          business_role_id = await bs.getBusinessRoleId(businessId[0].business_id, role_id);
        }
        //Insert into business_role_map table
        let mapUser = await bs.mapUserToBusiness(business_role_id[0].role_id, businessId[0].business_id, first_name, last_name, email, acl, timeStamp);
        if (mapUser) {
          let text = format(langEngConfig.message.business_settings.emailText);
          await inviteUserToBusiness(email, text);
          logger.info('__mapUserToBusi() execution completed');
          return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.roleMapSucc, STATUS.SUCCESS);
        }
        logger.info('__mapUserToBusi() execution completed');
        return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.rolemapErr, STATUS.FAILURE);
      }
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.emailAlready, STATUS.FAILURE);
    }
    logger.info('__mapUserToBusi() execution completed');
    return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.noBusinessId, STATUS.FAILURE);
  } catch (err) {
    logger.error('Error occured ' + err);
    return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler));
  }
}

//Method get mapped user of a business
/**
 * @desc this is to map an user to a business. 
 * @method getMappedUser 
 * @param {Object} request - It is Request object
 * @param {Object} response - It is Response object
 * @return return message and status code
 */

export const getMappedUser = (request, response) => {
  logger.info('getMappedUser() called');
  let applicantId = request.params.applicant_id;
  __getMappedUser(applicantId).then(result => {
    logger.info('getMappedUser() execution completed');
    response.send(result);
  })
}

const __getMappedUser = async (applicantId) => {
  logger.info('__getMappedUser() called');
  try {
    //get the business id
    let businessId = await bs.getBusinessId(applicantId);
    //let timeStamp = util.getGMT();
    //get the list of users
    let users = await bs.getMappedUser(businessId[0].business_id);
    if (users.length == 0) {
      return ResponseHelper.buildSuccessResponse({}, langEngConfig.message.business_settings.noMappedUserFound, STATUS.FAILURE);
    }
    // let applicant = [];
    // for (let i = 0; i < users.length; i++) {
    //   let applicantId = await bs.getApplicantId(users[i].email);
    //   applicant.push(applicantId[0].applicant_id);
    // }
    let business_users = [];
    for (let i = 0; i < users.length; i++) {
      let obj = {
        name: users[i].first_name + ' ' + users[i].last_name,
        email: users[i].email,
        permissions: users[i].role_name,
      }
      let applicantId = await bs.getApplicantId(users[i].email);
      if (applicantId.length > 0) {
        obj.status = 'Active';
      } else {
        obj.status = 'Invited';
      }
      business_users.push(obj);
    }
    return ResponseHelper.buildSuccessResponse({
      users: business_users
    }, langEngConfig.message.business_settings.mappedUserSucc, STATUS.SUCCESS);
  } catch (err) {
    logger.error('Error occured ' + err);
    return ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler));
  }
}