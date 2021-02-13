/**
 * businessModel
 * this is used for the insert  the business details of person in database and get the data from database
 * @package businessModel
 * @subpackage model/businessModel
 *  @author SEPA Cyper Technologies,krishnakanth.r
 */
"use strict";
const format = require('string-format');
const common = require('../mailer/mail');

//var mailer = require('../mailer/mail');
const config = require('../dbconfig/dbconfig').config;
//var businessOwnerConfig = require('../utility/businessOwnerConfig');
var configVariable = require('../utility/lang_eng');
// var sqlConfig = require('../utility/sqlService');
import {sqlConfig}  from '../utility/sqlService';
import { Utils } from "../utility/utils";
import { getCompanyId, getCompanyDetails } from '../controller/getCompanyId'
const util = new Utils();
var obj = {};


obj.businessOwnersDetails = class {
	constructor(request) {
		this.first_name = request.body.first_name;
		this.last_name = request.body.last_name;
		this.email = request.body.email;
		this.gender = request.body.gender;
		this.dob = request.body.dob;
		this.mobile = request.body.mobile;
		this.business_id = request.body.business_id;
		this.business_owner_type = request.body.business_owner_type;
		this.percentage = request.body.percentage;
		this.status = request.body.status;
		this.type = request.body.type;
		this.kyb_bisiness_owner_id = request.body.kyb_bisiness_owner_id;
	}
}

//this method is used for creating different types of business owners like(Director/Shareholder/Ultimate Benificial Owner)
obj.businessOwner = function (businessOwnersDetails, response) {
	return new Promise((resolve, reject) => {
		mariadb.createConnection(config).then(conn => {
			conn.beginTransaction().then(() => {

				let timestamp = util.getGMT();
				let sql = sqlConfig.businessSql.insert_applicant;
				let sqlQuery = format(sql, businessOwnersDetails, timestamp);

				conn.query(sqlQuery, ["business"]).then((applicantResponse) => {
					conn.query(sqlConfig.businessSql.insert_contact,
						[applicantResponse.insertId, businessOwnersDetails.first_name, businessOwnersDetails.last_name, businessOwnersDetails.email, businessOwnersDetails.gender, businessOwnersDetails.dob, businessOwnersDetails.mobile
						]).then((conRes) => {

							let timestamp = util.getGMT();
							let sql = sqlConfig.businessSql.insert_business_owner;
							let sqlQuery = format(sql, business_id ,contact_id ,business_owner_type,percentage,timestamp)

							conn.query(sqlQuery, [
								businessOwnersDetails.business_id, conRes.insertId,
								businessOwnersDetails.business_owner_type, businessOwnersDetails.percentage]).then((addRes) => {
									conn.commit(); conn.close();
									resolve({ message: `${businessOwnersDetails.business_owner_type} ${configVariable.message.businessOwner.success}`, status: 1, applicantId: applicantResponse.insertId });
								}).catch((err) => {
									conn.rollback(err); conn.close();
									reject({ message: configVariable.message.businessOwner.fail, status: 0 });
								})
						}).catch((err) => {
							conn.rollback(err); conn.close();
							reject({ message: configVariable.message.businessContact.fail, status: 0 });
						})
				}).catch((err) => {
					conn.rollback(err); conn.close();
					reject({ message: configVariable.message.businessApplicant.fail, status: 0 });
				})
			}).catch((err) => {
				reject({ message: `${err}`, status: 0 })
			})
		}).catch((err) => {
			reject({ message: `${err}`, status: 0 })
		})
	})
}

//this method is used for get all the director 
obj.index = function (id, type) {
	return new Promise((resolve, reject) => {
		global.value = type
		let sql = sqlConfig.businessSql.select_kyb_business_owner;
		let sqlQuery = format(sql, id)
		myPool.query(sqlQuery).then((data) => {
			if (_.size(data) > 0) {
				_.forEach(data, function (row) {
					row["isKyc"] = true
				})
				if (_.size(_.filter(data, { type: "shareholder" })) > 0) {
					_.forEach(_.filter(data, { percentage: `${Math.max.apply(Math, _.filter(data, { type: "shareholder" }).map(function (o) { return o["percentage"]; }))}` }), function (row) {
						row["isKyc"] = true
					})
				}
				if (_.size(_.filter(data, { type: "businessowner" })) > 0) {
					_.filter(data, { type: "businessowner" })[0]["isKyc"] = true
				}
				setTimeout(function () {
					if (value == "director") {
						if (_.size(_.filter(data, { type: "director" })) > 0) {
							resolve({ directors: _.filter(data, { type: "director" }), status: 1 });
						} else {
							resolve({ directors: _.filter(data, { type: "director" }), status: 0 });
						}

					} else if (value == "shareholder") {
						if (_.size(_.filter(data, { type: "shareholder" })) > 0) {
							resolve({ shareholder: _.filter(data, { type: "shareholder" }), status: 1 });
						} else {
							resolve({ shareholder: _.filter(data, { type: "shareholder" }), status: 0 });
						}
					} else if (value == "businessowner") {
						if (_.size(_.filter(data, { type: "businessowner" })) > 0) {
							resolve({ businessowner: _.filter(data, { type: "businessowner" }), status: 1 });
						} else {
							resolve({ businessowner: _.filter(data, { type: "businessowner" }), status: 0 });
						}
					} else if (value == "all") {
						resolve({ businessowner: _.filter(data, { type: "businessowner" }), shareholder: _.filter(data, { type: "shareholder" }), directors: _.filter(data, { type: "director" }), status: 1 });
					} else {
						resolve({ message: configVariable.message.businessOwner.recordNotFound, status: 1 });
					}
				}, 1000)
			} else {
				resolve({ message: configVariable.message.businessOwner.recordNotFound, status: 0 });
			}
		}, (err) => {
			reject({ message: configVariable.message.businessOwner.getDirectorError, status: 0 });
		})
	})
};

// this method is used to check total shareholder with the business
var checkTotalShareholder = function (data, value) {
	return new Promise((resolve, reject) => {
		var input = 0, iteration = 0;
		if (_.size(data) > 0) {
			_.forEach(data, function (row) {
				iteration++;
				input = input + _.toInteger(row.percentage)
			});
			if (iteration == _.size(data)) {
				if (input + value > 100) {
					resolve({ value: false, message: configVariable.message.businessOwner.errorShareholderRange, totalShareholder: input })
				} else {
					resolve({ value: true })
				}
			}
		} else {
			resolve({ value: true })
		}
	})
}

//this method is used to check Duplicate email
var checkDuplicateEmail = function (mail, flag, type, id, value) {
	return new Promise((resolve, reject) => {
		if (flag) {
			let sql = sqlConfig.businessSql.checkDuplicateEmail;
			let sqlQuery = format(sql, mail, id)
			myPool.query(sqlQuery).then((data) => {
				if ((type == "businessowner" && _.size(_.filter(data, { type: "businessowner" })) == 0 && _.size(_.filter(data, { type: "director" })) <= 1) || (type == "businessowner" && _.size(_.filter(data, { type: "businessowner" })) == 0 && _.size(_.filter(data, { type: "shareholder" })) <= 1)) {
					resolve({ value: true })
				} else if (_.size(data) > 0) {
					resolve({ value: false })
				} else {
					resolve({ value: true })
				}
			})
		} else {
			if (_.includes(type, "direct")) {
				resolve({ value: true })
			} else {
				if (_.isInteger(_.toInteger(value))) {
					let sql = sqlConfig.businessSql.select_shareholder;
					let sqlQuery = format(sql, id)
					myPool.query(sqlQuery).then((data) => {
						checkTotalShareholder(data, _.toInteger(value)).then((message) => {
							resolve(message)
						})
					})
				} else {
					resolve({ value: false, message: configVariable.message.businessOwner.inputPercentageError })
				}
			}
		}
	})
}

//this method is used to add the director  
obj.businessOwners = function (list, business_id, reponse) {
	return new Promise((resolve, reject) => {
		global.type = list.type;
		checkDuplicateEmail(list.email, true, type, business_id, list.percentage).then((result) => {
			if (result.value) {
				if (_.includes(type, "business")) {
					obj.index(business_id, 'businessowner').then(function (res) {
						if (_.size(res.businessowner) > 0) {
							resolve({ message: configVariable.message.businessOwner.already_added, status: 0 });
						} else {
							let timestamp = util.getGMT();
							let sql = sqlConfig.businessSql.kyb_business_owner;
							let sqlQuery = format(sql, business_id,type,email,name,status,dob, percentage,timestamp)

							myPool.query(sqlQuery, [business_id, 'businessowner', list.email, list.first_name + ',' + list.last_name, list.status, list.dob, list.percentage]).then(function (message) {
								resolve({ message: configVariable.message.businessOwner.businessOwner, status: 1 });
							}, function (error) {
								resolve({ message: configVariable.message.businessOwner.updateError, status: 0 });
							})
						}
					}, function (err) {
						resolve({ message: configVariable.message.businessOwner.updateError, status: 0 });
					})
				} else {
					checkDuplicateEmail(list.email, false, type, business_id, list.percentage).then((data) => {
						if (data.value) {

							let timestamp = util.getGMT();
							let sql = sqlConfig.businessSql.kyb_business_owner;
							let sqlQuery = format(sql, [business_id,list.type,list.email,list.first_name + ',' + list.last_name,list.status, list.dob, list.percentage,timestamp])

							myPool.query(sqlQuery).then(function (message) {
								if (_.includes(type, "direct")) {
									resolve({ message: configVariable.message.businessOwner.directorAdded, status: 1 });
								} else {
									resolve({ message: configVariable.message.businessOwner.shareholderAdded, status: 1 });
								}

							}, function (error) {
								resolve({ message: configVariable.message.businessOwner.updateError, status: 0 });
							})
						} else {
							resolve({ message: data.message, status: 0, totalShareholder: data.totalShareholder })
						}
					})

				}
			} else {
				resolve({ message: configVariable.message.businessOwner.emailExists, status: 0 });
			}
		})

	})
}

// get business owners list by businessId
obj.getBusinessOwners = function (id, response) {
	return new Promise((resolve, reject) => {
		mariadb.createConnection(config).then(conn => {
			let sql = sqlConfig.businessSql.select_business_owners;
			let sqlQuery = format(sql, id)
			conn.query(sqlQuery).then((data) => {
				conn.close();
				if (_.size(data) > 0) {
					resolve({ businessOwners: data, status: 1, message: `${configVariable.message.businessOwnerList.success}` });
				} else {
					resolve({ message: `${configVariable.message.businessOwnerList.success1}`, status: 1, businessOwners: data });
				}
			}, (err) => {
				conn.close();
				reject({ message: `${configVariable.message.businessOwnerList.fail}`, status: 0 });
			})
			//})
		})
	})
}

//get business owners list by contact_id
obj.getBusinessOwnersContact = function (id, response) {
	return new Promise((resolve, reject) => {
		mariadb.createConnection(config).then(conn => {
			let sql = sqlConfig.businessSql.select_business_owners_contact;
			let sqlQuery = format(sql, id);
			conn.query(sqlQuery).then((data) => {
				conn.close();
				if (data[0] && _.size(data) > 0) {
					resolve({ businessOwnerContact: data, status: 1, message: `${configVariable.message.businessOwnerContact.success}` });
				} else {
					resolve({ message: `${configVariable.message.businessOwnerContact.success1}`, status: 1, businessOwnerContact: data });
				}
			}, (err) => {
				conn.close();
				reject({ message: `${configVariable.message.businessOwnerContact.fail}`, status: 0 });
			})
		})
	})
}

// update status of shareholder and directors
obj.changeStatus = function (businessOwnersDetails) {
	return new Promise((resolve, reject) => {
		let timestamp = util.getGMT();
		var id = businessOwnersDetails.kyb_bisiness_owner_id;
		var type = (businessOwnersDetails.status) ? 1 : 0;
		let sql = sqlConfig.businessSql.update_kyb_business_owner;
		let sqlQuery = format(sql, type,timestamp,id)
		myPool.query(sqlQuery).then((data) => {
			resolve({ message: "status update", status: 1 });
		}, (err) => {
			resolve({ message: configVariable.message.businessOwner.updateError, status: 0 });
		})
	})
}

// this method is used to add shareholder
obj.deleteKybDocument = function (id, type) {
	return new Promise((resolve, reject) => {
		let sql = sqlConfig.businessSql.delete_kyb_business_owner;
		let sqlQuery = format(sql,id)
		myPool.query(sqlQuery).then((data) => {
			resolve({ message: type + configVariable.message.businessOwner.deleted, status: 1 });
		}, (err) => {
			resolve({ message: configVariable.message.businessOwner.deleteError, status: 0 });
		})
	})
}

// update  status of shareholder and directors in the list
obj.updateBusinessOwner = function (businessOwnersDetails) {
	return new Promise((resolve, reject) => {
		let timestamp = util.getGMT();
		var status = (businessOwnersDetails.status) ? 1 : 0;
		var type = businessOwnersDetails.type;
		var name = businessOwnersDetails.first_name + ',' + businessOwnersDetails.last_name
		let sql = sqlConfig.businessSql.update_Business_Owner;
		let sqlQuery = format(sql, timestamp, type, businessOwnersDetails.email, name, status, businessOwnersDetails.dob, businessOwnersDetails.percentage, businessOwnersDetails.kyb_bisiness_owner_id)
		myPool.query(sqlQuery).then((data) => {
			resolve({ message: `${type} updated`, status: 1 });
		}, (err) => {
			resolve({ message: configVariable.message.businessOwner.updateError, status: 0 });
		})
	})
}
 
//get BusinessOwner Details after send invitation
obj.businessOwnerDetails = function (request) {
	return new Promise((resolve, reject) => {
		jwt.verify(request.params.token, process.env.PASSWORD_CONFIG, function (err, decoded) {
			if (err) {
				reject(err)
			} else {
				var data = {
					Token: jwt.sign({ email: decoded.email }, process.env.PASSWORD_CONFIG),
					status: 1,
					client_auth: jwt.sign({ email: decoded.email }, process.env.PASSWORD_CONFIG1),
					member_id: process.env.CLIENT_ID,
					api_access_key: process.env.API_KEY,
					business_id: decoded.business_id,
					kyb_bo_id: decoded.kyb_bo_id,
					isKyc: decoded.isKyc
				}
				myPool.query(`select type, email, name, dob, percentage, type from kyb_business_owner where kyb_bo_id = ${decoded.kyb_bo_id}`).then((result) => {
					if (_.size(result) > 0) {
						data.type = result[0].type
						data.email = result[0].email
						data.name = result[0].name
						data.percentage = result[0].percentage
						data.dob = result[0].dobgetCompanyDetails
						resolve(data)
					} else {
						resolve({ message: configVariable.message.businessOwner.recordNotFound, status: 0 });
					}
					// resolve(data)
				}, (err) => {
					resolve({ message: err, status: 0 });
				})


			}
		});
	})
}


//Class with constructor
obj.newBusiness = class {
	constructor(request) {
		this.applicant_id = request.params.applicant_id;
		this.country_of_incorporation = request.body.country_of_incorporation;
		this.business_legal_name = request.body.business_legal_name;
		this.trading_name = request.body.trading_name;
		this.registration_number = request.body.registration_number;
		this.incorporation_date = request.body.incorporation_date;
		this.business_type = request.body.business_type;
	}
}

//for business registration with Kyb
obj.businessSignUp = function (businesModelObject, request, response) {
	return new Promise((resolve, reject) => {
		checkUniqueCompany(businesModelObject.applicant_id).then(function (response) {
			if (_.size(response) > 0) {
				reject({ message: `company already registered with applicant_id  `, status: 2 });
			} else {
				getCountryCode(businesModelObject.country_of_incorporation).then(function (countryCode) {
					if (_.size(countryCode) > 0) {						
						getCompanyId(countryCode[0].country_code, businesModelObject.business_legal_name,businesModelObject.address_line1, global.access_token).then(function (response) {
							if (Array.isArray(response.data) && _.size(response.data) > 0) {
								getCompanyDetails(response.data[0].id).then(function (details) {
									createObject(details).then(function (arrayObj) {
										saveCompany(request, arrayObj.arrayObj, arrayObj.details).then(function (message) {
											resolve(message);
										}, (error) => {
											reject(error);
										})
									})

								}, (error) => {
									reject({ message: error, status: 0 });
								})
							} else {
								if (response.status != 1) {
									reject({ message: response.message, status: 0 });
								} else {
									reject({ message: configVariable.message.businessOwner.company_not_found, status: 0 });
								}

							}
						}, (error) => {
							reject({ message: error, status: 0 });
						})
					} else {
						reject({ message: configVariable.message.businessOwner.country_notfound, status: 0 });
					}
				}, (err) => {
					reject({ message: `${err}`, status: 0 });
				})
			}
		}, (error) => {
			reject(error)
		})

	})
}

//this function is used for check company is exist in database or not
var checkUniqueCompany = function (application_id) {
	return new Promise(function (resolve, reject) {
		let sql = sqlConfig.businessSql.select_business_id_details;
		let sqlQuery = format(sql, application_id)
		myPool.query(sqlQuery).then((result, err) => {
			if (err) {
				reject({ Error: `${err}`, status: 0 });
			} else { resolve(result); }
		}).then((err) => {
			reject({ message: `${err}`, status: 0 });
		})
	});
}


// this fnuction is used for get country code so we can check with KYB API
var getCountryCode = function (countryId) {
	return new Promise((resolve, reject) => {
		let sql = sqlConfig.businessSql.getCountryCode;
		let sqlQuery = format(sql, countryId);
		myPool.query(sqlQuery).then((countryCode) => {
			resolve(countryCode);
		}).catch(err => {
			resolve({ message: `${err}`, status: 0 });
		})
	})
}

// this is for the creation of an object for bulk insert in business_owner table 
var createObject = function (details) {
	return new Promise((resolve, reject) => {
		if (details.people && (_.size(details.people.director) > 0 || _.size(details.people.shareholder) > 0)) {
			var arrayObj = [];
			if (_.size(details.people.director) > 0 || _.size(details.people.shareholder) > 0) {
				if (_.size(details.people.director) > 0) {
					_.forEach(details.people.director, function (row) {
						arrayObj.push({
							"dateOfBirth": _.get(row, "dateOfBirth", ''),
							"name": _.get(row, "name", ''),
							"status": _.get(row, "status", ''),
							"type": "director",
							"email": _.get(row, "email", ''),
							"percentage": ""
						})
					})
				}
				if (_.size(details.people.shareholder) > 0) {
					_.forEach(details.people.shareholder, function (row) {
						arrayObj.push({
							"dateOfBirth": _.get(row, "dateOfBirth", ''),
							"name": _.get(row, "name", ''),
							"status": _.get(row, "status", ''),
							"type": "shareholder",
							"email": _.get(row, "email", ''),
							"percentage": _.get(row, "percentage", '')
						})
					})
				}

				if (_.size(details.people.director) + _.size(details.people.shareholder) == _.size(arrayObj)) {
					resolve({ "arrayObj": arrayObj, "details": details });
				}
			}
		} else {
			resolve({ "arrayObj": [], "details": details })
		}

	})
}

// this function is used for save  details
var saveCompany = function (businesModelObject, arrayObj, data) {
	return new Promise((resolve, reject) => {
		mariadb.createConnection(config).then(conn => {
			conn.beginTransaction().then(() => {
				let timestamp = util.getGMT();
				let sql = sqlConfig.signupSql.insert_business_details;
				let sqlQuery = format(sql, timestamp, businesModelObject.params.applicant_id, businesModelObject.body.country_of_incorporation, businesModelObject.body.business_legal_name,businesModelObject.body.trading_name,businesModelObject.body.registration_number,businesModelObject.body.incorporation_date,businesModelObject.body.business_type)
				conn.query(sqlQuery).then((businessDetailRes) => {
						let rowItems = [];
						if (_.size(arrayObj) > 0) {
							(arrayObj).forEach(function (obj) {
								if(obj.status == "CURRENT") {
								let reSetObj = {};
								reSetObj.business_id = businessDetailRes.insertId
								reSetObj.type = obj.type || " "
								reSetObj.email = obj.email
								reSetObj.name = obj.name
								reSetObj.status = getStatus(obj.status)
								reSetObj.dob = obj.dateOfBirth || " "
								reSetObj.percentage = obj.percentage || " "
								rowItems.push(Object.values(reSetObj));
							}
							});
							let timestamp = util.getGMT();
							let sql = sqlConfig.signupSql.kyb_business_owner
							let sqlQuery = format(sql,timestamp,business_id,type,email,name,status,dob, percentage)								
							conn.batch(sqlQuery, rowItems).then((ownerInfo) => {
								if (data) {
									let timestamp = util.getGMT();
									let sql =sqlConfig.signupSql.kyb_company_details;
									let sqlQuery = format(sql, timestamp, kyb_business_id,company_details ) 
									conn.query(sqlQuery,[businessDetailRes.insertId, JSON.stringify(data)]).then((business) => {
											conn.commit();
											conn.close();
											resolve({
												message: configVariable.signupConfig.message.businessdetails.success, business_id: businessDetailRes.insertId, business_country_of_incorporation: businesModelObject.body.country_of_incorporation,
												business_legal_name: businesModelObject.body.business_legal_name, status: 1
											});
										}).catch(err => {
											conn.rollback(err);
											conn.close();
											resolve({ message: `${err}`, status: 0 });
										})
								} else {
									resolve({
										message: configVariable.signupConfig.message.businessdetails.success, business_id: businessDetailRes.insertId, business_country_of_incorporation: businesModelObject.body.country_of_incorporation,
										business_legal_name: businesModelObject.body.business_legal_name, status: 1
									});
								}

							}).catch(err => {
								conn.rollback(err);
								conn.close();
								resolve({ message: `${err}`, status: 0 });
							})
						} else {
							let timestamp = util.getGMT();
							let sql = sqlConfig.signupSql.kyb_company_details;
							let sqlQuery = format(sql, timestamp, kyb_business_id,company_details );
							conn.query(sqlQuery,
								[businessDetailRes.insertId, JSON.stringify(data)]).then((business) => {
									conn.commit();
									conn.close();
									resolve({
										message: configVariable.signupConfig.message.businessdetails.success, business_id: businessDetailRes.insertId, business_country_of_incorporation: businesModelObject.body.country_of_incorporation,
										business_legal_name: businesModelObject.body.business_legal_name, status: 1
									});
								}).catch(err => {
									conn.rollback(err);
									conn.close();
									resolve({ message: `${err}`, status: 0 });
								})

						}

					}).catch(err => {
						conn.rollback(err);
						conn.close();
						resolve({ message: `${err}`, status: 0 });
					})
				}).catch((err) => {
					reject({ message: `${err}`, status: 0 })
				})

		}).catch((err) => {
			reject({ message: `${err}`, status: 0 })
		})
	})
}

// This method is used in SaveCompany method
var getStatus = function (status) {
	return 0
}


//for storing sector,website,industries and services related data.
obj.postSectorAndIndustries = function (request, response) {
	return new Promise((resolve, reject) => {
		let timestamp = util.getGMT();
		let sql = sqlConfig.signupSql.insert_business_sector_details;
		let sqlQuery = format(sql, timestamp, request.body.business_id, request.body.business_sector_id, request.body.range_of_service,
			request.body.website, request.body.restricted_business, request.body.selectedIndustries)
		myPool.query(sqlQuery).then(res => {
				if (request.body.selectedIndustries && request.body.selectedIndustries != '') {
					myPool.query(`SELECT business_industry_id FROM business_industry_lov  WHERE  business_industry_id IN (${request.body.selectedIndustries}) AND  restricted = 1`,
						[]).then(res1 => {
							if (res1.length > 0) {
								let filtered = res1.filter(function (value) {
									return value.hasOwnProperty("business_industry_id")
								}).map(function (value) {
									return value["business_industry_id"]
								});
								let restricted_business = filtered.join(",")
								let timestamp = util.getGMT();
								let sql = sqlConfig.signupSql.update_restricted_business;
								let sqlQuery = format(sql, timestamp, restricted_industries, business_id )
								myPool.query(sqlQuery,[restricted_business, request.body.business_id]).then(res2 => {
										myPool.query(sqlConfig.signupSql.update_business_restricted,
											[request.body.business_id]).then(res3 => {
												resolve({ status: 1, message: `${configVariable.message.industries.restrictedBusinessSuccess}`, restricted: 1 });
											}).catch((err) => {
												resolve({ status: 1, message: `${configVariable.message.industries.restrictedBusinessSuccess}, but Error : ${err}`, restricted: 1 });
											})
									}).catch((err) => {
										reject({ message: `update_restricted_business : ${err}`, status: 0, restricted: 0 });
									})
							}
							else {
								resolve({ status: 1, message: `${configVariable.message.industries.checklistSectorSuccess}`, restricted: 0 });
							}
						}).catch((err) => {
							reject({ message: `select_restricted_business : ${err}`, status: 0, restricted: 0 });
						})
				}
				else {
					resolve({ status: 1, message: `${configVariable.message.industries.checklistSectorSuccess}`, restricted: 0 });
				}

			}).cacth((err) => {
				reject({ message: `insert_business_sector_details :${err}`, status: 0, restricted: 0 });
			})
	})
}


//for updating business sector details table data
obj.patchSectorAndIndustries = function (request, response) {
	return new Promise((resolve, reject) => {
		var column = request.body.column;
		var value = request.body.value;
		var business_id = request.body.business_id;
		myPool.query(`UPDATE business_sector_details SET ${column} = '${value}' where business_id = ${business_id}`).then(res => {
			resolve({ message: configVariable.message.signUp.data_update, status: 1 })
		}).catch(err => {
			reject({ message: `${err}`, status: 0 })
		})
	})
}


//for business registration with Kyb
obj.businessSignUpKyb = function (request, response) {
	return new Promise((resolve, reject) => {
		checkUniqueCompany(request.params.applicant_id).then(function (response) {
			if (_.size(response) > 0) {
				reject({ message: configVariable.message.businessOwner.company_already_exist, status: 2 });
			} else {
				saveCompany(request, [], null).then(function (message) {
					resolve(message);
				}, (error) => {
					reject(error);
				})
			}
		}, (error) => {
			reject(error)
		})

	})
}


module.exports = { obj };