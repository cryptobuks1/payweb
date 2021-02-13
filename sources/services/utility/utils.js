let dateFormat = require('dateformat');
let alphaChar = require('randomstring');
let timezone = require('timezone-support');
const crypto = require('crypto');
const Cryptr = require('cryptr');

import { timeConvert } from './validate';

export class Utils {
  static isEmptyObject(obj) {
    return (obj === undefined) || (obj === null) || (obj === '') || (Array.isArray(obj) && obj.length <= 0);
  }
  //Method to create response onject during user signup.
  signUpResObject(data, applicantId, contact, address, applicant) {
    return new Promise((resolve) => {
      let isBusiness = false;
      if (_.toLower(applicant.account_type) == 'business') {
        isBusiness = true;
      }
      data.userInfo = {
        // applicant_id: applicantId, email:contact.email,
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        country_id: address.country_id,
        gender: contact.gender,
        mobile: contact.mobile,
        phone: contact.phone,
        account_type: _.toLower(applicant.account_type),
        kycStatus: "NOT_INITIATED",
        initialPayment: true,
        "isBusiness": isBusiness
      }
      if (_.toLower(applicant.account_type) === "personal") {
        data.userInfo.next_step = applicant.next_step;
        data.userInfo.address_line1 = address.address_line1;
        data.userInfo.address_line2 = address.address_line2;
        data.userInfo.phone = contact.phone;
        data.userInfo.city = address.city;
        data.userInfo.postal_code = address.postal_code;
        data.userInfo.region = address.region;
        data.userInfo.town = address.town;
      }
      resolve(data);
    })
  }


  getCompanyInfoBasedOnRegistration(companyInfo, registration_number){
    return new Promise((resolve) => {
      _.forEach(companyInfo, function (row) {        
          if(row.registrationNumber.includes(registration_number)){           
            resolve(row);
          }
      })
      resolve({})
    })
  }
    
    
  

  //Method to validate card data.
  isValidCard(transferDetails) {
    return new Promise((resolve) => {
      if (transferDetails.card_month && transferDetails.name_on_card && transferDetails.card_number && transferDetails.card_type && transferDetails.card_year) {
        resolve({
          status: true
        });
      } else if (!transferDetails.card_month) {
        resolve({
          status: false,
          message: "card month is required"
        })
      } else if (!transferDetails.name_on_card) {
        resolve({
          status: false,
          message: "card name is required"
        })
      } else if (!transferDetails.card_number) {
        resolve({
          status: false,
          message: "card number is  required"
        })
      } else if (!transferDetails.card_type) {
        resolve({
          status: false,
          message: "card type is  required"
        })
      } else if (!transferDetails.card_year) {
        resolve({
          status: false,
          message: "card year is  required"
        })
      } else {
        resolve({
          status: false,
          message: "something went wrong please try later"
        })
      }
    })
  }

  //Method to check valic account to account money transfer request
  isValidMoneyTransferRequest(transferDetails) {
    return new Promise((resolve) => {
      if (transferDetails.from_currency && transferDetails.to_currency && transferDetails.to_mobile && transferDetails.amount > 0) {
        resolve({
          status: true
        });
      } else if (transferDetails.from_currency == 'undefined' || transferDetails.from_currency == null || transferDetails.from_currency == '') {
        resolve({
          status: false,
          message: "Error at from_currency key."
        })
      } else if (transferDetails.to_currency == 'undefined' || transferDetails.to_currency == null || transferDetails.to_currency == '') {
        resolve({
          status: false,
          message: "Error at to_currency key."
        })
      } else if (transferDetails.to_mobile == 'undefined' || transferDetails.to_mobile == null || transferDetails.to_mobile == '') {
        resolve({
          status: false,
          message: "Error at to_mobile key."
        })
      } else if (transferDetails.amount == 'undefined' || transferDetails.amount == null || transferDetails.amount == '') {
        resolve({
          status: false,
          message: "Error at amount key."
        })
      } else {
        resolve({
          status: false,
          message: "something went wrong please check."
        })
      }
    })
  }
  //Method for generating unique transaction number
  generateTransNum() {
    const alpha = alphaChar.generate({
      length: 2,
      charset: 'alphabetic',
      capitalization: 'uppercase'
    });
    let id = Math.floor(Math.random() * 10000000000);
    return 'PVTS' + id + alpha;
  }


  //Method to generate a bulk transfer id
  async getBulkTransId() {
    const alpha = alphaChar.generate({
      length: 2,
      charset: 'alphabetic',
      capitalization: 'uppercase'
    });
    let id = Math.floor(Math.random() * 10000000000);
    return 'PVBT' + id + alpha;
  }

  //method for generating unique schedule transfer id
  async getScheduleTransId() {
    const alpha = alphaChar.generate({
      length: 2,
      charset: 'alphabetic',
      capitalization: 'uppercase'
    });
    let id = Math.floor(Math.random() * 10000000000);
    return 'ST' + id + alpha;
  }

  //Method for checking wheather a resgistration request object is valid or not
  isValidRegRequest(regRequest) {
    return new Promise((resolve, reject) => {
      let result = {
        msg: ''
      };

      if (regRequest.applicant.account_type == 'undefined' || regRequest.applicant.account_type == null || regRequest.applicant.account_type == '') {
        result.msg = 'Key value of account_type can not be empty.';
        reject(result);
      } else if (regRequest.contact.email == 'undefined' || regRequest.contact.email == null || regRequest.contact.email == '') {
        result.msg = 'Key value of email can not be empty.';
        resolve(result);
      } else if (regRequest.login.password == 'undefined' || regRequest.login.password == null || regRequest.login.password == '') {
        result.msg = 'Key value of password can not be empty.';
        resolve(result);
      } else if (regRequest.contact.first_name == 'undefined' || regRequest.contact.first_name == null || regRequest.contact.first_name == '') {
        result.msg = 'Key value of first_name can not be empty.';
        resolve(result);
      } else if (regRequest.contact.last_name == 'undefined' || regRequest.contact.last_name == null || regRequest.contact.last_name == '') {
        result.msg = 'Key value of last_name can not be empty.';
        resolve(result);
      } else if (regRequest.contact.dob == 'undefined' || regRequest.contact.dob == null || regRequest.contact.dob == '') {
        result.msg = 'Key value of dob can not be empty.';
        resolve(result);
      } else if (regRequest.contact.gender == 'undefined' || regRequest.contact.gender == null || regRequest.contact.gender == '') {
        result.msg = 'Key value of gender can not be empty.';
        resolve(result);
      } else if (regRequest.address.country_id == 'undefined' || regRequest.address.country_id == null || regRequest.address.country_id == '') {
        result.msg = 'Key value of country_id can not be empty.';
        resolve(result);
      } else if (regRequest.address.postal_code == 'undefined' || regRequest.address.postal_code == null || regRequest.address.postal_code == '') {
        result.msg = 'Key value of postal_code can not be empty.';
        resolve(result);
      } else if (regRequest.address.address_line1 == 'undefined' || regRequest.address.address_line1 == null || regRequest.address.address_line1 == '') {
        result.msg = 'Key value of address_line1 can not be empty.';
        resolve(result);
      } else if (regRequest.address.city == 'undefined' || regRequest.address.city == null || regRequest.address.city == '') {
        result.msg = 'Key value of city can not be empty.';
        resolve(result);
      } else if (regRequest.address.region == 'undefined' || regRequest.address.region == null || regRequest.address.region == '') {
        result.msg = 'Key value of region can not be empty.';
        resolve(result);
      } else if (regRequest.contact.mobile == 'undefined' || regRequest.contact.mobile == null || regRequest.contact.mobile == '') {
        result.msg = 'Key value of mobile can not be empty.';
        resolve(result);
      } else if (regRequest.login.passcode_pin == 'undefined' || regRequest.login.passcode_pin == null || regRequest.login.passcode_pin == '') {
        result.msg = 'Key value of passcode_pin can not be empty.';
        resolve(result);
      } else {
        result.msg = 'Valid request object'
        resolve(result);
      }
    })
  }

  //Method for checking wheather a resgistration request object is valid or not
  isValidRegRequest1(regRequest) {
    return new Promise((resolve, reject) => {
      let result = {
        msg: '',
        status: 1
      };

      if (regRequest.applicant.account_type == 'undefined' || regRequest.applicant.account_type == '') {
        result.msg = 'Key value of account_type can not be empty.';
        reject(result);
      } else if (regRequest.contact.email == 'undefined' || regRequest.contact.email == '') {
        result.msg = 'Key value of email can not be empty.';
        resolve(result);
      } else if (regRequest.applicant.password == 'undefined' || regRequest.applicant.password == '') {
        result.msg = 'Key value of password can not be empty.';
        resolve(result);
      } else if (regRequest.contact.first_name == 'undefined' || regRequest.contact.first_name == '') {
        result.msg = 'Key value of first_name can not be empty.';
        resolve(result);
      } else if (regRequest.contact.last_name == 'undefined' || regRequest.contact.last_name == '') {
        result.msg = 'Key value of last_name can not be empty.';
        resolve(result);
      } else if (regRequest.contact.dob == 'undefined' || regRequest.contact.dob == '') {
        result.msg = 'Key value of dob can not be empty.';
        resolve(result);
      } else if (regRequest.contact.gender == 'undefined' || regRequest.contact.gender == '') {
        result.msg = 'Key value of gender can not be empty.';
        resolve(result);
      } else if (regRequest.address.country_id == 'undefined' || regRequest.address.country_id == '') {
        result.msg = 'Key value of country_id can not be empty.';
        resolve(result);
      } else if (regRequest.address.postal_code == 'undefined' || regRequest.address.postal_code == '') {
        result.msg = 'Key value of postal_code can not be empty.';
        resolve(result);
      } else if (regRequest.address.address_line1 == 'undefined' || regRequest.address.address_line1 == '') {
        result.msg = 'Key value of address_line1 can not be empty.';
        resolve(result);
      } else if (regRequest.address.city == 'undefined' || regRequest.address.city == '') {
        result.msg = 'Key value of city can not be empty.';
        resolve(result);
      } else if (regRequest.address.region == 'undefined' || regRequest.address.region == '') {
        result.msg = 'Key value of region can not be empty.';
        resolve(result);
      } else if (regRequest.contact.mobile == 'undefined' || regRequest.contact.mobile == '') {
        result.msg = 'Key value of mobile can not be empty.';
        resolve(result);
      } else if (regRequest.applicant.passcode_pin == 'undefined' || regRequest.applicant.passcode_pin == '') {
        result.msg = 'Key value of passcode_pin can not be empty.';
        resolve(result);
      } else {
        result.msg = 'Valid request object';
        result.status = 0;
        resolve(result);
      }
    })
  }

  //Method for checking wheather a editPersonalSettings request object is valid or not
  isValidRequestPersonalSetting(regRequest) {
    return new Promise((resolve, reject) => {
      let result = {
        msg: '',
        status: 1
      };
      if (regRequest.first_name == 'undefined' || regRequest.first_name == null || regRequest.first_name == '' || regRequest.first_name == ' ') {
        result.msg = 'Key value of first_name can not be empty.';
        resolve(result);
      } else if (regRequest.last_name == 'undefined' || regRequest.last_name == null || regRequest.last_name == '' || regRequest.last_name == ' ') {
        result.msg = 'Key value of last_name can not be empty.';
        resolve(result);
      } else if (regRequest.dob == 'undefined' || regRequest.dob == null || regRequest.dob == '' || regRequest.dob == ' ') {
        result.msg = 'Key value of dob can not be empty.';
        resolve(result);
      } else if (regRequest.postal_code == 'undefined' || regRequest.postal_code == null || regRequest.postal_code == '' || regRequest.postal_code == ' ') {
        result.msg = 'Key value of postal_code can not be empty.';
        resolve(result);
      } else if (regRequest.address_line1 == 'undefined' || regRequest.address_line1 == null || regRequest.address_line1 == '' || regRequest.address_line1 == ' ') {
        result.msg = 'Key value of address_line1 can not be empty.';
        resolve(result);
      } else if (regRequest.address_line2 == 'undefined' || regRequest.address_line2 == null || regRequest.address_line2 == '' || regRequest.address_line2 == ' ') {
        result.msg = 'Key value of address_line2 can not be empty.';
        resolve(result);
      } else if (regRequest.country_name == 'undefined' || regRequest.country_name == null || regRequest.country_name == '' || regRequest.country_name == ' ') {
        result.msg = 'Key value of country_name can not be empty.';
        resolve(result);
      } else if (regRequest.city == 'undefined' || regRequest.city == null || regRequest.city == '' || regRequest.city == ' ') {
        result.msg = 'Key value of city can not be empty.';
        resolve(result);
      } else if (regRequest.region == 'undefined' || regRequest.region == null || regRequest.region == '' || regRequest.region == ' ') {
        result.msg = 'Key value of region can not be empty.';
        resolve(result);
      } else if (regRequest.town == 'undefined' || regRequest.town == null || regRequest.town == '' || regRequest.town == ' ') {
        result.msg = 'Key value of town can not be empty.';
        resolve(result);
      } else {
        result.msg = 'Valid request object';
        result.status = 0;
        resolve(result);
      }
    })
  }


  getCurrentTimeStamp() {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let timeStamp = date + ' ' + time;
    //let GMTimeStamp = dateFormat(timeStamp,' : yyyy:mm:dd hh:MM:ss');
    return timeStamp;
  }

  getLocalTimeStamp() {
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let convertedTime = timeConvert(time)
    let timeStamp = date + ' ' + convertedTime;
    //let GMTimeStamp = dateFormat(timeStamp,' : yyyy:mm:dd hh:MM:ss');
    return timeStamp;
  }


  

  //Method converting into GMT timestamp
  getGMT() {
    let today = new Date();
    let current_timezone = timezone.findTimeZone('GMT');
    let lt = timezone.getZonedTime(today, current_timezone);
    let date = lt.year+'-'+lt.month+'-'+lt.day+' '+lt.hours+':'+lt.minutes+':'+lt.seconds;
    let GMTime = dateFormat(date, 'yyyy-mm-dd HH:MM:ss');
    return GMTime;
  }

  cardEncrypt(card_number, cardMonth, cardYear) {
    return new Promise((resolve, reject) => {
      try {
        logger.info("cardEncrypt() initiated");
        //card_number, card_month, card_year,
        const cardNumber = card_number;
        const card_month = cardMonth;
        const card_year = cardYear;
        //generate random number one
        const randomSecretKey = crypto.randomBytes(16);
        const secretKey1 = randomSecretKey.toString('hex');
        const cryptr = new Cryptr(secretKey1);
        const encryptionCard = cardNumber ? cryptr.encrypt(cardNumber) : ''; //encrypt card number
        const encryptionMonth = card_month ? cryptr.encrypt(card_month) : ''; //encrypt card month
        const encryptionYear = card_year ? cryptr.encrypt(card_year) : ''; //encrypt card year
        //generate second random number 
        const secretNumber = crypto.randomBytes(16);
        const secretKey2 = secretNumber.toString('hex');     
        //encrypted first random number 
        const _cryptr = new Cryptr(secretKey2);
        const encryptKey2 = _cryptr.encrypt(secretKey1);
        resolve({
          status: 0,
          data: {
            secret_key: secretKey2,
            encrypted_key: encryptKey2,
            card_number: encryptionCard,
            card_month: encryptionMonth,
            card_year: encryptionYear
          }
        })
      } catch (err) {
        logger.debug("error while doing encrypted format");
        reject(err);
      }
    })
  }

  cardDecrypt(card_number, card_month, card_year, secret_key, encrypted_key) {
    return new Promise((resolve, reject) => {
      try {
        logger.info("cardDecrypt() initiated");
        //card_number,card_month,card_year,secret_key,encrypted_key    

        if (secret_key == '' || secret_key == 'undefined') {
          resolve({
            status: 1,
            message: 'Please send secret Key'
          });
        }
        if (encrypted_key == '' || encrypted_key == 'undefined') {
          resolve({
            status: 1,
            message: 'Please send encrypted key'
          });
        }
        //decrypt encrypted_key with secret_key
        const secretKey = new Cryptr(secret_key);
        const decryptSecretKey = secretKey.decrypt(encrypted_key);      
        const secretKey2 = new Cryptr(decryptSecretKey);
        const cardNumber = (card_number) ? secretKey2.decrypt(card_number) : '';
        const cardMonth = (card_month) ? secretKey2.decrypt(card_month) : '';
        const cardYear = (card_year) ? secretKey2.decrypt(card_year) : '';
        resolve({
          status: 0,
          data: {
            card_number: cardNumber,
            card_month: cardMonth,
            card_year: cardYear
          }
        })
      } catch (err) {
        logger.debug("error while doing decrypted format");
        reject(err);
      }

    })
  }
}