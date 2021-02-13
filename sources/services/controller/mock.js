/**
 * mockController Controller
 * mockController is used for secure  each and every resource routes based on service type
   only we will allow into next steps
 * @package mockController
 * @subpackage controller/mockApis/mockController
 * @author SEPA Cyper Technologies, Sujit Kumar.
 */
"use strict";



import random from 'random-name';
import uuidAPIKey from 'uuid-apikey';
import verifyMockModel from '../model/mockModel';
const STATUS = {
  SUCCESS: 0,
  FAIL: 1
}

let cardDetails = [{
  "payment_cards_id": "54",
  "card_number": "4444333322221111",
  "card_cvv": "123",
  "card_month": "12",
  "card_year": "2030"
},
{
  "payment_cards_id": "56",
  "card_number": "4444333322221111",
  "card_cvv": "124",
  "card_month": "10",
  "card_year": "2031"
}];

/**
 * @desc This method used to check valid user or not  
 * @method checkValidUser
 * @param {object} request - it is Request object
 * @param {object} response - it is Response object
 * @param {object} next - middleware function
 * @return returns message and status code
**/
export const checkValidUser = function (req, res, next) {
  const header = req.headers['api-key'];
  if (typeof header !== 'undefined' && header) {
    let userModel = new verifyMockModel.obj.checkUser(header);
    verifyMockModel.obj.checkUserValid(userModel).then(results => {
      if (results.status == 1) {
        req.applicant_id = results.applicant_id
        next()
      } else {
        response.send(ResponseHelper.buildSuccessResponse({}, 'user key not valid please , Verify Once', STATUS.FAIL));
      }
    });
  }
  else {
    response.send(ResponseHelper.buildSuccessResponse({}, 'please provide autherization header', STATUS.FAIL));
  }
}


/**
 * @desc This method used to get card  
 * @method getCard
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const getCard = function (request, response) {
  validate(request.body.member_id, request.headers["x-merchant-token"]).then(function (data) {
    if (data.status == 1) {
      indexCard(request).then(success => {
        response.send(ResponseHelper.buildSuccessResponse(success, '', STATUS.SUCCESS));
      }, (error) => {
        response.send(error)
      })
    } else {
      response.send(ResponseHelper.buildSuccessResponse(data, '', STATUS.FAIL));
    }
  }, (err) => {
    response.send(ResponseHelper.buildFailureResponse(err));
  })
}


/**
 * @desc This method used to fetch payment mock  
 * @method fetchPaymentsMock
 * @param {object} req -- it is Request object
 * @param {object} res --it is Response object
 * @return 
**/
export const fetchPaymentsMock = function (req, res) {
  //To check the status
  getLog.getLogStatus(_.toLower(init())).then(logRes => {
    //To get the timestamp.
    getLog.getTimeStamp().then(timeStamp => {
      //log
      (logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "Controller/mockApis/mockController/fetchPaymentsMock() method initiated.") : "";
      let paymentsModel = new verifyMockModel.obj.preparePaymentObj(req.applicant_id);
      //log
      (logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "Initialized \"let paymentsModel\" with constructor of preparePaymentObj class.") : "";

      verifyMockModel.obj.paymentsMock(paymentsModel).then(results => {
        if (results.status == 1) {
          //log
          (logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "Controller/mockApis/mockController/fetchPaymentsMock() execution completed.") : "";

          resolve(results);
        }
        else {
          //log
          (logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "Controller/mockApis/mockController/fetchPaymentsMock() execution completed.") : "";
          reject(results);
        }
      });
    })
  })
}

/**
 * @desc This method used to add money  
 * @method addMoney
 * @param {object} req -- it is Request object
 * @param {object} res --it is Response object
 * @return 
**/
export const addMoney = function (req, res) {
  let valid = cardDetails.some(function (e) {
    return e.payment_cards_id == req.body.payment_cards_id
  });
  if (req.body.amount > 0 && valid) {
    res.send(ResponseHelper.buildSuccessResponse({
      "status": 1,
      "message": `${req.body.amount} ${req.body.currency} added to wallet successfully`,
      "transactionInfo": { "paymentId": "77659", "paymentType": "DB", "paymentBrand": "VISA", "paymentMode": "CC", "amount": `${req.body.amount}`, "currency": `${req.body.currency}`, "descriptor": `Paynetics ${req.body.currency} Test`, "result": { "code": "00001", "description": "Transaction succeeded" }, "card": { "bin": "444433", "last4Digits": "1111", "lastFourDigits": "1111", "holder": "murty m", "expiryMonth": "12", "expiryYear": "2030" }, "timestamp": "2019-09-23 11:53:37", "merchantTransactionId": "03VEC746DGDO", "remark": "Approved or completed successfully", "transactionStatus": "Y", "tmpl_amount": `${req.body.amount}`, "tmpl_currency": `${req.body.currency}`, "notificationUrl": "www.merchantNotificationUrl.com" },
      "payStatus": "success"
    }, '', STATUS.SUCCESS));
  } else {
    if (valid && req.body.amount && req.body.currency && req.body.amount != 'undefined' && req.body.currency != 'undefined') {
      res.send(ResponseHelper.buildSuccessResponse({
        "status": 0,
        "message": `${req.body.amount} ${req.body.currency} not added to wallet`,
        "transactionInfo": {
          "code": "02233",
          "description": "fail"
        },
        "payStatus": "fail"
      }, '', STATUS.FAIL));
    } else {
      res.send(ResponseHelper.buildSuccessResponse({}, `Please provide valid ${valid ? "inputs" : "cardDetails"} for make payment`, STATUS.FAIL));
    }

  }

}


function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


/**
 * @desc This method used to get login details  
 * @method login
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const login = function (req, res) {
  return new Promise(function (resolve, reject) {
    if (req.body.email && req.body.password) {
      var obj = {
        "Token": jwt.sign({ email: "newUser.SandBox@gamil.com" }, 'User%^&**#*#*@SandBox'),
        "client_auth": jwt.sign({ email: "newUser.SandBox@gamil.com" }, 'User%^&**#*#*@SandBox'),
        "member_id": makeid(7),
        "api_access_key": uuidAPIKey.create().apiKey,
        "status": 1,
        "message": "login successfull",
      }
      obj.userInfo = {
        "applicant_id": Math.floor(Math.random() * 100),
        "email": "test@sandbox.com",
        "gender": "",
        "mobile": Math.floor(Math.random() * 10000000000),
        "phone": Math.floor(Math.random() * 10000000000),
        "first_name": random.first(),
        "last_name": random.last(),
        "account_type": _.toLower(req.body.account_type),
        "kycStatus": "NOT_INITIATED",
        "country_id": 20,
        "business_Id": null,
        "business_country_of_incorporation": null,
        "business_legal_name": null,
        "initialPayment": true
      }
      resolve(obj)
    } else {
      resolve({ message: "invalid username or password ", status: 0 })
    }

  })
}

/**
 * @desc This method used to get regisration details  
 * @method userRegistration
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const userRegistration = function (req) {
  return new Promise(function (resolve, reject) {
    if (_.size(req.body.password) < 8) {
      reject({ status: 0, message: "password must be greater than equal to 8 characters" })
    } else if (!req.body.email && !req.body.mobile) {
      reject({ status: 0, message: "please enter valid email and mobile number" })
    } else if (!req.body.email) {
      reject({ status: 0, message: "please enter valid email " })
    } else if (_.size(req.body.mobile) < 9) {
      reject({ status: 0, message: "please enter valid mobile number " })
    } else {
      var obj = {
        "Token": jwt.sign({ email: "newUser.SandBox@gamil.com" }, 'User%^&**#*#*@SandBox'),
        "client_auth": jwt.sign({ email: "newUser.SandBox@gamil.com" }, 'User%^&**#*#*@SandBox'),
        "member_id": makeid(7),
        "api_access_key": uuidAPIKey.create().apiKey,
        "status": 1,
        "message": "login successfull",
        "userInfo": {
          "applicant_id": Math.floor(Math.random() * 100),
          "email": req.body.email,
          "gender": req.body.gender,
          "mobile": req.body.mobile,
          "phone": req.body.phone,
          "account_type": _.toLower(req.body.account_type),
          "kycStatus": "NOT_INITIATED",
          "initialPayment": false
        }
      }
      if (_.toLower(req.body.account_type) != "business") {
        obj.userInfo["first_name"] = req.body.first_name;
          obj.userInfo["last_name"] = req.body.last_name;
          obj.userInfo["next_step"] = "KYC";
          obj.userInfo["address_line1"] = req.body.address_line1;
          obj.userInfo["address_line2"] = req.body.address_line2;
          obj.userInfo["city"] = req.body.city;
          obj.userInfo["country_id"] = req.body.country_id;
          obj.userInfo["postal_code"] = req.body.postal_code;
          obj.userInfo["region"] = req.body.region;
          obj.userInfo["town"] = req.body.town

      }
      resolve(obj);
    }

  })

}


let card = function (req, res) {
  return new Promise(function (resolve, reject) {
    if (req.body.applicant_id && req.body.card_month && req.body.name_on_card && req.body.card_number && req.body.card_type && req.body.card_year) {
      resolve({
        "message": "Card data inserted successfuly", "payment_cards_id": Math.floor(Math.random() * 100), "status": 1
      });
    } else if (!req.body.applicant_id) {
      resolve({ status: 0, message: "applicant id is required" })
    } else if (!req.body.card_month) {
      resolve({ status: 0, message: "card month is required" })
    } else if (!req.body.name_on_card) {
      resolve({ status: 0, message: "card name is required" })
    } else if (!req.body.card_number) {
      resolve({ status: 0, message: "card number is  required" })
    } else if (!req.body.card_type) {
      resolve({ status: 0, message: "card type is  required" })
    } else if (!req.body.card_year) {
      resolve({ status: 0, message: "card year is  required" })
    } else {
      resolve({ status: 0, message: "something went wrong please try later" })
    }
  })
}

/**
 * @desc This method used to get card details  
 * @method indexCard
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
let indexCard = function (req, res) {
  return new Promise(function (resolve, reject) {
    if (req.params.applicant_id) {
      resolve({
        "message": "Card detail fetched sucesfuly",
        "cards": [{
          "payment_cards_id": Math.floor(Math.random() * 100), "card_type": "VISA",
          "name_on_card": random.first(), "card_number": _.toString(Math.floor(Math.random() * 100000000000000)), "card_cvv": "", "card_month": Math.floor(Math.random() * 10) + 1,
          "card_year": 2030, "status": 1, "default_card": 1
        }, {
          "payment_cards_id": Math.floor(Math.random() * 100), "card_type": "CREDIT", "name_on_card": random.first(),
          "card_number": _.toString(Math.floor(Math.random() * 100000000000000)), "card_cvv": "", "card_month": Math.floor(Math.random() * 10) + 1, "card_year": 2030, "status": 1, "default_card": 0
        }],
        "status": 1
      });
    } else if (!req.body.applicant_id) {
      resolve({ status: 0, message: "applicant id is required" })
    }
  })
}

/**
 * @desc This method used to get token details  
 * @method checkToken
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
var checkToken = function (request) {
  return new Promise(function (resolve, reject) {
    if (request.headers["x-merchant-token"]) {
      jwt.verify(request.headers["x-merchant-token"], process.env.PASSWORD_CONFIG, function (err, decoded) {
        if (err) {
          reject({ status: 0, message: err.message })
        } else {
          resolve({ decoded })
        }
      })
    } else {
      reject({ status: 0, message: "please provide token " })
    }
  })
}
/**
 * @desc This method used to validate details  
 * @method validate
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
let validate = function (member_id, token) {
  return new Promise(function (resolve, reject) {
    isAuthorized.obj.isValidSandboxMerchantToken(member_id, token).then(function (result) {
      if (_.size(result) > 0) {
        if (new Date(result[0].created_on).getTime() + result[0].expiry * 60000 > new Date().getTime()) {
          resolve({ status: 1 })
        } else {
          reject({ status: 0, message: "token expired " })
        }
      } else {
        reject({ status: 0, message: "token not valid" })
      }
    }, (err) => {
      reject({ status: 0, message: "token not valid" })
    })
  })
}


/**
 * @desc This method used to get login details  
 * @method userLogin 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const userLogin = function (request, response) {
  validate(request.body.member_id, request.headers["x-merchant-token"]).then(function (data) {
    if (data.status == 1) {
      login(request).then(success => {
        response.send(ResponseHelper.buildSuccessResponse(success, '', STATUS.SUCCESS));
      }, (error) => {
        response.send(ResponseHelper.buildFailureResponse(error.message));
      })
    } else {
      response.send(ResponseHelper.buildSuccessResponse(data, '', STATUS.FAIL));
    }
  }, (err) => {
    response.send(ResponseHelper.buildFailureResponse(err.message));
  })
}

/**
 * @desc This method used to get user details  
 * @method saveUser
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const saveUser = function (request, response) {
  validate(request.body.member_id, request.headers["x-merchant-token"]).then(function (data) {
    if (data.status == 1) {
      userRegistration(request).then(success => {
        response.send(ResponseHelper.buildSuccessResponse(success, '', STATUS.SUCCESS));
      }, (error) => {
        response.send(ResponseHelper.buildFailureResponse(error.message));
      })
    } else {
      response.send(ResponseHelper.buildSuccessResponse(data, '', STATUS.FAIL));
    }
  }, (err) => {
    response.send(ResponseHelper.buildFailureResponse(err.message));
  })
}

/**
 * @desc This method used to save card details  
 * @method saveCard 
 * @param {object} request -- it is Request object
 * @param {object} response --it is Response object
 * @return returns message and status code
**/
export const saveCard = function (request, response) {
  validate(request.body.member_id, request.headers["x-merchant-token"]).then(function (data) {
    if (data.status == 1) {
      card(request).then(success => {
        response.send(ResponseHelper.buildSuccessResponse(success, '', STATUS.SUCCESS));
      }, (error) => {
        response.send(ResponseHelper.buildFailureResponse(error.message));
      })
    } else {
      response.send(ResponseHelper.buildSuccessResponse(data, '', STATUS.FAIL));
    }
  }, (err) => {
    response.send(ResponseHelper.buildFailureResponse(err.message));
  })

}





