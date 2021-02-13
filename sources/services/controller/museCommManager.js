/**
 * MUSE communication manager
 */

require('any-promise/register/q')


let requestPromise = require('request-promise-any');


/**
 * @desc this method is authenticate compnay
 * @method callAutheticateService
 * @return return token
 */

export const callAutheticateService = async () => {

  console.log("callAutheticateService() initiated ");
  logger.info("callAutheticateService() initiated");

  let option = {
    uri: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/authenticate`,
    method: 'POST',
    json: true,
    body: {
      "memberId": process.env.CLIENT_ID,
      "secret": process.env.MUSE_SECRET
    }
  }

  // let authResponse = {
  //   code: 200,
  //   access_token: global.access_token
  // }

  try {


    console.log("Request for authenticating with muse :", JSON.stringify(option));
    let authResponse = await requestPromise(option);
    console.log("Successful in authenticating with muse service", authResponse);
    logger.info("Successful in authenticating with muse service");
    global.access_token = authResponse.access_token

    return authResponse;
  } catch (err) {
    console.log("Error while authenticating with muse service " + err);
    return err;
  }
}


export const validateToken = async (token) => {
  let option = {
    uri: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/authenticate/validate`,
    method: 'POST',
    json: true,
    body: {
      "memberId": process.env.CLIENT_ID,
      "token": token
    }
  }

  try {
    console.log("Request for validating access token with muse", JSON.stringify(option));
    let validateResponse = await requestPromise(option);
    console.log("Response from muse for validating access token", validateResponse);
    return validateResponse;
  } catch (err) {
    console.log("Error in validating authorization token", err);
    return err;
  }
}

/**
 * @desc This function is used to make request to museService trigger kyc
 * @method requestForKycStatus
 * @param {String} identId - It contains identity Id
 * @param {Object} req - It is request object
 * @return return kyc status
 */

export const requestForKycStatus = async (identId, token, applicantId) => {
  console.log('Request initiated to museService for kyc status for identId[' + identId + '] ' + applicantId + '[' + applicantId + ']');
  logger.info('Request initiated to museService for kyc status for identId', identId);
  let option = {
    uri: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/kyc/status`,
    method: 'POST',
    json: true,
    body: {
      'memberId': process.env.CLIENT_ID,
      'data': {
        'id': identId
      }
    },
    headers: {
      'x-token': token,
      'accept': 'application/json'
    }
  }

  try {
    console.log("Request for kyc status with muse for applicant ID [", applicantId + ']', JSON.stringify(option));
    let res = await requestPromise(option);
    console.log("Response from muse for kyc status for applicant ID [", applicantId + ']', res);
    return res;
  } catch (err) {
    if (err.statusCode == 445) {
      console.log("Response from muse for kyc status: Authentication error (445) for applicant ID [", applicantId + ']');
      try {
        let authResponse = await callAutheticateService();
        if (authResponse && authResponse.access_token) {
          global.access_token = authResponse.access_token;
          let responseKYCStatus = await requestForKycStatus(identId, global.access_token, applicantId);
          return responseKYCStatus;
        }
      } catch (err) {
        console.log("Error while retrieving KycStatus with muse service", err);
        return err;
      }

    } else if (err.message.includes("ETIMEDOUT") || err.message.includes("EHOSTUNREACH")) {
      console.log("Response from muse for kyc status: ETIMEDOUT or EHOSTUNREACH for applicant ID [", applicantId + ']', err);
      return err;
    } else {
      console.log("Response from muse for kyc status: Catch all error for applicant ID [", applicantId + ']', err);
      return err;
    }
  }
}


/**
 * This function is used to make request to museService trigger identity with user data
 * @method _callIdentityService
 * @param {Object} userInfo - userInfo is object used to generate identity in museServer
 * @param {Object} req - It is request object
 * @return return identity id
 */

export const _callIdentityService = async (userInfo, req, token, applicantId) => {

  console.log('Request initiated to museService for _callIdentityService for applicant ID' + applicantId);
  logger.info('Request initiated to museService for _callIdentityService ');

  let option = {
    uri: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/kyc/start`,
    method: 'POST',
    json: true,
    body: userInfo,
    headers: {
      "x-token": token,
      "accept": "application/json"
    }
  }

  try {
    console.log("Request for kyc identity with musefor applicant ID [", applicantId + ']', JSON.stringify(option));
    let res = await requestPromise(option);
    console.log("Response from muse for kyc identity for applicant ID [", applicantId + ']', res);
    return res;
  } catch (err) {
    if (err.statusCode == 445) {
      console.log("Response from muse for kyc identity: Authentication error (445) for applicant ID [", applicantId + ']');
      try {
        let authResponse = await callAutheticateService();
        if (authResponse && authResponse.access_token) {
          global.access_token = authResponse.access_token;
          let responseKycIdentity = await _callIdentityService(userInfo, req, global.access_token, applicantId);
          return responseKycIdentity;
        }
      } catch (err) {
        console.log("Error while retrieving _callIdentityService with muse service", err);
        return err;
      }
    } else if (err.message.includes("ETIMEDOUT") || err.message.includes("EHOSTUNREACH")) {
      console.log("Response from muse for kyc identity: ETIMEDOUT or EHOSTUNREACH for applicant ID [", applicantId + ']', err);
      return err;
    } else {
      console.log("Response from muse for kyc identity:catching all errors for applicant ID [", applicantId + ']', err);
      return err;
    }
  }
}

/**
 * This function is used to make request to museService PEPvalidate
 * @method _callPepAutheticateService
 * @param {Object} userInfo - userInfo is object used to generate identity in museServer
 * @param {Object} req - It is request object
 *
 */
export const _callPepAutheticateService = async (userInfo, member_id, token, applicantId) => {

  console.log('Request initiated to museService for _callPepAutheticateService for applicantId [' + applicantId + "]");
  logger.info('Request initiated to museService for _callPepAutheticateService');
  let requestBody = userInfo;
  let option = {
    uri: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/pep/validate`,
    method: 'POST',
    json: true,
    body: requestBody,
    headers: {
      "x-token": token,
      "accept": "application/json"
    }
  }
  try {
    console.log("Request for pep with muse for applicant ID [", applicantId + ']', JSON.stringify(option));
    let res = await requestPromise(option);
    console.log("Response from muse for kyc identity for applicant ID [", applicantId + ']', res);
    return res;
  } catch (err) {
    if (err.statusCode == 445) {
      console.log("Response from muse for pep authenticate service: Authentication error (445) for applicantId [" + applicantId + "]");
      try {
        let authResponse = await callAutheticateService();
        if (authResponse && authResponse.access_token) {
          global.access_token = authResponse.access_token;
          let responseKycIdentity = await _callPepAutheticateService(userInfo, member_id, global.access_token, applicantId);
          return responseKycIdentity;
        }
      } catch (err) {
        console.log("Error while retrieving _callPepAutheticateService with muse service", err);
        return err;
      }
    } else if (err.message.includes("ETIMEDOUT") || err.message.includes("EHOSTUNREACH")) {
      console.log("Response from muse for pep authenticate service: ETIMEDOUT or EHOSTUNREACH for applicantID [" + applicantId + ']', err);
      return err;
    } else {
      console.log("Error while retrieving _callPepAutheticateService with muse service for applicant ID [", applicantId + ']', err);
      return err;
    }
  }
}

/**
 * @desc this method is used for call KYB api to get company ID 
 * @method getCompanyId
 * @param {string} countryCode - It contains countryCode
 * @param {string} companyName - It contains companyName
 * @param {string} streetName - It contains streetName
 * @param {string} registrationNumber - It contains registrationNumber
 * @param {Object} request - It is Request object
 * @return return company id
 */

export let getCompanyId = async (countryCode, companyName, streetName, registrationNumber, token) => {
  console.log('Request initiated to museService for getCompanyId');
  logger.info('Request initiated to museService for getCompanyId ');

  let option = {
    uri: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/kyb/find`,
    method: 'POST',
    json: true,
    body: {
      "memberId": process.env.CLIENT_ID,
      "data": {
        "country": countryCode,
        "street": streetName,
        "name": companyName,
        "regNumber": registrationNumber
      }
    },
    headers: {
      "x-token": token,
      "accept": "application/json"
    },
    timeout:180000
  }

  try {
    console.log("Request for company Id with muse", JSON.stringify(option));
    let res = await requestPromise(option);
    console.log("Response from muse to get CompanyId", res);
    return res;
  } catch (err) {

    if (err.statusCode == 445) {
      console.log("Response from muse to get company Id: Authentication error (445)");
      try {
        let authResponse = await callAutheticateService();
        console.log("authResponse", authResponse);
        if (authResponse && authResponse.access_token) {
          global.access_token = authResponse.access_token;
          let responseKycIdentity = await getCompanyId(countryCode, companyName, streetName, registrationNumber, global.access_token);
          console.log("request for getCompanyId response", responseKycIdentity);
          return responseKycIdentity;
        }
      } catch (err) {
        return err;
      }
    } else if (err.message.includes("ETIMEDOUT") || err.message.includes("EHOSTUNREACH")) {
      console.log("Response from muse to get CompanyId: is timedout or unable to reach", err);
      return err;
    } else {
      console.log("Response from muse to get CompanyId: Catching errors", err);
      return err;
    }
  }
}


/**
 * @desc this method is used to call kyd API to get company details
 * @method getCompanyDetails
 * @param {Object} companyId - It contains companyId
 * @param {Object} dataSet - It contains dataSet
 * @param {Object} request - It is Request object
 * @return return company details
 */

export let getCompanyDetails = async (companyId, token) => {

  console.log('Request initiated to museService for company full details');
  logger.info('Request initiated to museService for company full details ');
  let option = {
    uri: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/kyb/fullDetails`,
    method: 'POST',
    json: true,
    body: {
      "memberId": process.env.CLIENT_ID,
      "data": {
        "id": companyId
      }
    },
    headers: {
      "x-token": token,
      "accept": "application/json"
    }
  }

  try {
    console.log("Request for company full details with muse", JSON.stringify(option));
    let res = await requestPromise(option);
    console.log("Response for company full details with muse", JSON.stringify(res));
    return res;
  } catch (err) {

    if (err.statusCode == 445) {
      console.log("Response for company full details with muse : Authentication error (445)");
      try {
        let authResponse = await callAutheticateService();
        if (authResponse && authResponse.access_token) {
          global.access_token = authResponse.access_token;
          let responseKycIdentity = await getCompanyDetails(companyId, global.access_token);
          return responseKycIdentity;
        }
      } catch (err) {
        console.log("Response for company full details with muse : catching other errors", err);
        return err;
      }
    } else if (err.message.includes("ETIMEDOUT") || err.message.includes("EHOSTUNREACH")) {
      console.log("Request for retrieving company full details with muse : ETIMEDOUT or EHOSTUNREACH", err);
      return err;
    } else {
      console.log("Error while retrieving company full details with muse service", err);
      return err;
    }
  }
}


/**
 * @desc this method is used for call KYB api to get company ID 
 * @method callCurrencyExchangeMuse
 * @param {string} from - It contains from currency
 * @param {string} to - It contains to currency
 * @param {string} token - It contains token
 * @return return currency exchange
 */
export let callCurrencyExchangeMuse = async (from, to, token) => {
  logger.info("Initiate callCurrencyExchangeMuse");
  let option = {
    uri: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/currency/exchangeRate`,
    method: 'POST',
    json: true,
    body: {
      "memberId": process.env.CLIENT_ID,
      "data": {
        "from": from,
        "to": to
      }
    },
    headers: {
      "accept": "application/json",
      "x-token": token
    }
  }

  try {
    console.log("Request for currency exchange with muse", JSON.stringify(option));
    let res = await requestPromise(option);
    console.log("Response from muse for currency exchange", res);
    return res;
  } catch (err) {
    if (err.statusCode == 445) {
      try {
        let authResponse = await callAutheticateService();
        if (authResponse && authResponse.access_token) {
          global.access_token = authResponse.access_token;
          return await callCurrencyExchangeMuse(from, to, global.access_token);
        }
      } catch (err) {
        return err;
      }
    } else if (err.message.includes("ETIMEDOUT") || err.message.includes("EHOSTUNREACH")) {
      console.log("Request for callCurrencyExchange with muse is ETIMEDOUT or EHOSTUNREACH", err);
      return err;
    } else {
      console.log("Error while callCurrencyExchange with muse", err);
      return err;
    }
  }
}

/**
 * @desc this method is used for call KYB api to get company ID 
 * @method callCurrencyExchangeRateSeries
 * @param {string} from - It contains from currency
 * @param {string} to - It contains to currency
 * @param {string} start_date - It contains from currency
 * @param {string} end_date - It contains from currency
 * @param {Object} request - It is Request object
 * @return return currency exchange series
 */
export let callCurrencyExchangeRateMuse = async (from, to, start_date, end_date, token) => {
  logger.info("Initiate callCurrencyExchangeMuse");
  let option = {
    uri: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/currency/exchangeRateSeries`,
    method: 'POST',
    json: true,
    body: {
      "memberId": process.env.CLIENT_ID,
      "data": {
        "from": from,
        "to": to,
        "start": start_date,
        "end": end_date
      }
    },
    headers: {
      "accept": "application/json",
      "x-token": token
    }
  }

  try {
    console.log("Request for currency exchange rate with muse", JSON.stringify(option));
    let res = await requestPromise(option);
    console.log("Response from muse for currency exchange rate", res);
    return res;
  } catch (err) {
    if (err.statusCode == 445) {
      console.log("Response from muse for currency exchange rate: authentication error (445)");
      try {
        let authResponse = await callAutheticateService();
        if (authResponse && authResponse.access_token) {
          global.access_token = authResponse.access_token;
          return await callCurrencyExchangeRateMuse(from, to, start_date, end_date, global.access_token);
        }
      } catch (err) {
        return err;
      }
    } else if (err.message.includes("ETIMEDOUT") || err.message.includes("EHOSTUNREACH")) {
      console.log("Response from muse for currency exchange rate: ETIMEDOUT or EHOSTUNREACH", err);
      return err;
    } else {
      console.log("Error while callCurrencyExchangeRateMuse", err);
      return err;
    }
  }
}



/**

* @desc This method for sending OTP to mobile number 
 * @method sendOtp
* @param {string} phone - It contains mobile number
* @param {string} message - It contains message
* @param {string} token - It contains token
*/
export const sendOtp = async (phone, message, token) => {

  let mobile = phone.split(" ").join("");
  console.log('Request initiated to museService for sending otp ');
  logger.info('Request initiated to museService for sending otp ');
  let option = {
    uri: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/sms/send`,
    method: 'POST',
    json: true,
    body: {
      "memberId": process.env.CLIENT_ID,
      "data": {
        "phone": mobile,
        "message": message,
        "from": process.env.MAIL_USER
      }
    },
    headers: {
      "accept": "application/json",
      "x-token": token
    }
  }

  try {
    console.log("Request for send otp with muse", JSON.stringify(option));
    let res = await requestPromise(option);
    console.log("Response from muse for send otp", res);
    return res;
  } catch (err) {

    if (err.statusCode == 445) {
      console.log("Muse Auth Error (445)  while sending otp");
      try {
        let authResponse = await callAutheticateService();
        if (authResponse && authResponse.access_token) {
          global.access_token = authResponse.access_token;
          let responseOtp = await sendOtp(phone, message, global.access_token);
          return responseOtp;
        }
      } catch (err) {
        console.log("Response from muse for send otp for applicant ID [", applicantId + ']', err);
        return err;
      }
    } else if (err.message.includes("ETIMEDOUT") || err.message.includes("EHOSTUNREACH")) {
      console.log("Response from muse for send otp:ETIMEDOUT or EHOSTUNREACH for applicant ID [", applicantId + ']', err);
      return err;
    } else {
      console.log("Response from muse for send otp: catching other errors for applicant ID [", applicantId + ']', err);
      return err;
    }
  }
}