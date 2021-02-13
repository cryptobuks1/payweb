/**
 * businessDetails Controller
 * businessDetails controller contains method for storing business sector related data.
 * @package businessDetails
 * @subpackage controller\businessDetails
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu .
 */
"use strict";

import {
  BusinessDetails
} from '../model/businessDetails';
import { configvariable } from '../utility/signUpConfig';
const businessModel = new BusinessDetails();

const STATUS = {
  SUCCESS: 0,
  FAILURE: 1
}
export class BusinessDetailsInfo {
  constructor(newBusinessDetails) {
    this.business_id = newBusinessDetails.business_id
      this.business_sector = newBusinessDetails.business_sector
      this.range_of_service = newBusinessDetails.range_of_service
      this.website = newBusinessDetails.website
      this.restricted_business = newBusinessDetails.restricted_business
      this.selected_industries = newBusinessDetails.selected_industries
      this.restricted_industries = newBusinessDetails.restricted_industries
      this.column = newBusinessDetails.column
      this.value = newBusinessDetails.value
  }
}

/**
* @desc This function is for storing sector,website,industries and services related data. 
* @method saveBusinesDetails 
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return return message and status code
*/
export const saveBusinesDetails = (request, response) => {
  let newBusinessDetails = new BusinessDetails(request.body);
  businessModel.saveBusinesDetails(newBusinessDetails.business_id, newBusinessDetails.businessSectorId, newBusinessDetails.rangeOfService,
    newBusinessDetails.website, newBusinessDetails.restrictedBusiness, newBusinessDetails.selectedIndustries)
    .then(result => {
      if (newBusinessDetails.selectedIndustries && newBusinessDetails.selectedIndustries != '') {
        businessModel.isRestrictedBusiness(newBusinessDetails.selectedIndustries)
          .then(result => {
            if (result.length > 0) {
              let filtered = result.filter((value) => {
                return value.hasOwnProperty("business_industry_id");
              }).map((value) => {
                return value["business_industry_id"]
              });

              let restricted_business = filtered.join(",");
              businessModel.setBusinessSectorDetails(restricted_business, newBusinessDetails.business_id)
                .then(() => {
                  businessModel.setkybBusiness(newBusinessDetails.business_id)
                    .then(() => {
                      response.send({ status: STATUS.SUCCESS, message: configvariable.message.industries.restrictedBusinessSuccess, restricted: 1 });
                    }, err => {
                      response.send({ status: STATUS.SUCCESS, message: configvariable.message.industries.restrictedBusinessSuccess, Error: err, restricted: 1 });
                    })
                    .catch(err => {
                      response.send({ status: STATUS.FAILURE });
                    })
                })
                .catch(err => {
                  response.send({ status: STATUS.FAILURE });
                })
            }
          })
          .catch(err => {
            response.send({ status: STATUS.FAILURE });
          })
      } else {
        response.send({ status: STATUS.SUCCESS, message: `${configvariable.message.industries.checklistSectorSuccess}`, restricted: 0 });
      }
    }).catch(err => {
      response.send({ status: STATUS.FAILURE });
    })
}

/**
* @desc This function is for updating business sector details table data. 
* @method updateBusinessDetails 
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return return message and status code
*/
export const updateBusinessDetails = (request, response) => {
  let column = request.body.column;
  let value = request.body.value;
  let business_id = request.body.business_id;

  businessModel.updateBusinessDetails(column, value, business_id)
    .then(result => {
      response.send({ msg: configvariable.message.industries.update, status: STATUS.SUCCESS });
    })
    .catch(err => {
      response.send({ msg: configvariable.message.industries.updateerror, status: STATUS.FAILURE });
    })
}

/**
* @desc This function is for getting Business Details. 
* @method getBusinessDetails 
* @param {Object} request - It is Request object
* @param {Object} response - It is Response object
* @return return list of business Details
*/
export const getBusinessDetails = (request, response) => {
  let businessId = request.body.business_id;

  businessModel.getBusinessDetails(businessId)
    .then(result => {
      if (result) {
        response.send({
          business_sector: result[0].business_sector,
          range_of_service: result[0].range_of_service,
          website: result[0].website,
          restricted_business: result[0].restricted_business,
          selected_industries: result[0].selected_industries,
          status: STATUS.SUCCESS
        })
      } else {
        response.send({ status: STATUS.FAILURE });
      }
    })
    .catch(err => {
      response.send({ status: STATUS.FAILURE });
    })
}
