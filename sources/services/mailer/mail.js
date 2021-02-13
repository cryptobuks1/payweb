/**
 * This file contains all the e-mail configuration related data,Such as e-mail and phone number
 * verification through otp tempalate,Wel-come mail once successfull user signup is done and
 * kyc_status once kyc_data is submited.
 * @package mail
 * @subpackage sources\services\mailer\mail
 * @author SEPA Cyper Technologies, Sujit kumar.
 */
"use strict";

var handle = require('handlebars');
let nodemailer = require('nodemailer');
var fs = require('fs');
import {
  configVariables
} from '../utility/sendLink';
import {
  asyncEncrypt
} from '../utility/validate';

import {
  sendOtp
} from '../controller/museCommManager';

import {
  langEngConfig
} from '../utility/lang_eng';

import {
  Utils
} from '../utility/utils';

const util = new Utils();



const STATUS = {
  FAILED: 1,
  SUCCESS: 0,
  VALID: 2,
  MESSAGE_SUCCESS: '1004'
};

var payVooLink = process.env.PAYVOOLINK

const transporter = nodemailer.createTransport({
  // need SMTP host to configure mail.
  host: process.env.SERVICE,
  port: process.env.MAIL_GMAIL_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

var readHTMLFile = function (path, callback) {
  fs.readFile(path, {
    encoding: 'utf-8'
  }, function (err, html) {
    if (err) {
      throw err;
    } else {
      callback(null, html);
    }
  });
};

var forgotStatus = (email, status, messageType) => {
  return new Promise(function (resolve, reject) {
    const transporter = nodemailer.createTransport({
      // need SMTP host to configure mail.
      host: process.env.SERVICE,
      port: process.env.MAIL_GMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });
    var mailOptions = {
      //need SMTP host to configure.
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Reset Your eWallet Password',
      attachments: [{
        filename: 'PayVoo BETA_small3.png',
        path: __dirname + '/images/PayVoo BETA_small3.png',
        cid: 'logo' 
      }]
    };
    readHTMLFile(__dirname + '/forgotStatus.html', function (err, html) {
      var template = handle.compile(html);
      var replacements = {
        forgotStatus: status,
        type: messageType
      };
      var htmlToSend = template(replacements);
      mailOptions.html = htmlToSend;
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          resolve(error);
        } else {
          resolve({
            status: 1
          });
        }
      })
    })
  })
}



var sandBoxInfo = (email, data, docUrl) => {
  return new Promise(function (resolve, reject) {
    const transporter = nodemailer.createTransport({
      // need SMTP host to configure mail.
      host: process.env.SERVICE,
      port: process.env.MAIL_GMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });
    var mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'eWallet Sandbox Information',
      attachments: [{
        filename: 'PayVoo BETA_small3.png',
        path: __dirname + '/images/PayVoo BETA_small3.png',
        cid: 'logo' 
      }]
    };
    readHTMLFile(__dirname + '/sandBoxInfo.html', function (err, html) {
      var template = handle.compile(html);
      var replacements = {
        sandboxObj: data,
        docUrl: docUrl
      };
      var htmlToSend = template(replacements);
      mailOptions.html = htmlToSend;
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          resolve(error);
        } else {
          resolve({
            status: 1
          });
        }
      })
    })
  })
}

var kycStatus = (email, status) => {
  return new Promise(function (resolve, reject) {
    const transporter = nodemailer.createTransport({
      // need SMTP host to configure mail.
      host: process.env.SERVICE,
      port: process.env.MAIL_GMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });
    let kyc_status_subject = '';
    let kyc_status = '';
    let statusImage = {};
    if (status.includes("PENDING")) {
      statusImage = {
        filename: 'pending.png',
        path: __dirname + '/images/pending.png',
        cid: 'pending'
      };
      kyc_status_subject = 'Identity verification Pending';
      kyc_status = '/kycPending.html';
    } else if (status.includes("SUCCESS")) {
      statusImage = {
        filename: 'statustick.png',
        path: __dirname + '/images/statustick.png',
        cid: 'statustick'
      };
      kyc_status_subject = 'Identity verification Success';
      kyc_status = '/kycStatus.html';
    } else if (status.includes("FRAUD_SUSPICION")) {
      statusImage = {
        filename: 'pending.png',
        path: __dirname + '/images/pending.png',
        cid: 'pending'
      };
      kyc_status_subject = 'Identity verification Pending';
      kyc_status = '/kycPending.html';
    } else if (status == "FRAUD") {
      statusImage = {
        filename: 'smly.png',
        path: __dirname + '/images/smly.png',
        cid: 'cancel'
      };
      kyc_status_subject = 'Identity verification Fraud';
      kyc_status = '/kycFraudSuspicion.html'; 
    } else if (status.includes("FAILED")) {
      statusImage = {
        filename: 'cancel.png',
        path: __dirname + '/images/cancel.png',
        cid: 'cancel'
      };
      kyc_status_subject = 'Identity verification Failed';
      kyc_status = '/kycfailstatus.html';   
    }  else if (status.includes("ABORTED")) {
        statusImage = {
          filename: 'cancel.png',
          path: __dirname + '/images/cancel.png',
          cid: 'cancel'
        };
        kyc_status_subject = 'Identity verification Aborted';
        kyc_status = '/kycAbortedStatus.html';
      // } else if (status.includes("SUCCESSFUL_WITH_CHANGES")) {
      //   statusImage = {
      //     filename: 'cancel.png',
      //     path: __dirname + '/images/cancel.png',
      //     cid: 'cancel'
      //   };
      //   kyc_status_subject = 'Identity verification Documents Mismatch';
      //   kyc_status = '/kycmismatch.html';
    } else {
      resolve({
        message: 'Email sent'
      });
      return;
    }
    var mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: kyc_status_subject,
      attachments: [{
          filename: 'PayVoo BETA_small3.png',
          path: __dirname + '/images/PayVoo BETA_small3.png',
          cid: 'status-logo'
        },
        statusImage
      ]
    };
    readHTMLFile(__dirname + kyc_status, function (err, html) {
      var template = handle.compile(html);
      var replacements = {
        kycStatus: status
      };
      var htmlToSend = template(replacements);
      mailOptions.html = htmlToSend;
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error);
        } else {
          resolve({
            message: 'Email sent'
          });
        }
      })
    })
  })
}
var randomNumber = function () {
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
  // return '012345';
};


var timeDiffer = function (dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));

}

var validateEmail = function (email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

let isEmpty = function (inputValue) {
  return (inputValue === undefined || inputValue == null || inputValue.length <= 0) ? true : false;
};
//For otp verification through e-mail
var sendEmail = async (sender, otp, cb) => {
  const transporter = nodemailer.createTransport({
    // need SMTP host to configure mail.
    host: process.env.SERVICE,
    port: process.env.MAIL_GMAIL_PORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });
  var mailOptions = {
    //need SMTP host to configure.
    from: process.env.MAIL_USER,
    to: sender,
    subject: 'eWallet Confirmation Code',
    attachments: [{
      filename: 'PayVoo BETA_small3.png',
      path: __dirname + '/images/PayVoo BETA_small3.png',
      cid: 'logo'
    }]
  };
  readHTMLFile(__dirname + '/otp.html', function (err, html) {
    var template = handle.compile(html);
    var replacements = {
      otp: otp
    };
    var htmlToSend = template(replacements);
    mailOptions.html = htmlToSend;
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Email failed to sent ", error );
        logger.info("Email failed to sent ", error);
        cb(error, null)
      } else {
        console.log("Email sent successfully " + "info:", info )
        logger.info("Email sent successfully " + "info:", info);
        cb(null, info)
      }
    })
  })
};
//Wel-come mail after each successful signup.
var signupMail = (email, firstName, LastName, routeType) => {
  return new Promise(function (resolve, reject) {
    const transporter = nodemailer.createTransport({
      // need SMTP host to configure mail.
      host: process.env.SERVICE,
      port: process.env.MAIL_GMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    var mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      attachments: [{
        filename: 'PayVoo BETA_small3.png',
        path: __dirname + '/images/PayVoo BETA_small3.png',
        cid: 'payvoo-logo'
      }]
    };
    if (_.toLower(routeType) === 'sandbox') {
      mailOptions["subject"] = "Welcome to eWallet Sandbox"
    } else {
      mailOptions["subject"] = "Welcome to eWallet"
    }
    let loadingPage = (_.toLower(routeType) === 'sandbox') ? '/welcome_sandbox.html' : '/welcome_beta.html'
    readHTMLFile(__dirname + loadingPage, function (err, html) {
      var template = handle.compile(html);
      var replacements = {
        username: firstName + LastName,
        loginLink: process.env.WEB_LOGIN_URL,
        docLink: process.env.SANDBOX_API_DOC_URL
      };
      var htmlToSend = template(replacements);
      mailOptions.html = htmlToSend;
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error);
        } else {
          resolve({
            message: 'Email sent'
          });
        }
      })
    })
  })
}


//Wel-come mail after each successful signup.
var signupMerchantMail = (email, firstName, LastName, routeType) => {
  return new Promise(function (resolve, reject) {

    var mailOptions = {
      //need SMTP host to configure.
      from: process.env.MAIL_USER,
      to: email,
      attachments: [{
        filename: 'PayVoo BETA_small3.png',
        path: __dirname + '/images/PayVoo BETA_small3.png',
        cid: 'logo'
      }]
    };
    if (routeType === 'sandbox') {
      mailOptions["subject"] = "Welcome to eWallet Merchant"
    } else {
      mailOptions["subject"] = "Welcome to eWallet"
    }
    let loadingPage = (routeType === 'sandbox') ? '/welcome_merchant.html' : '/welcome.html'
    readHTMLFile(__dirname + loadingPage, function (err, html) {
      var template = handle.compile(html);
      var replacements = {
        username: firstName + LastName,
        loginLink: process.env.WEB_LOGIN_URL,
        docLink: process.env.MERCHANT_API_DOC_URL
      };
      var htmlToSend = template(replacements);
      mailOptions.html = htmlToSend;
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          resolve(error);
        } else {
          resolve({
            message: 'Email sent'
          });
        }
      })
    })
  })
}




//this for sending link to respective mobile devices for continuation of kyc process. 
var sendLink = function (req) {
  return new Promise(function (resolve, reject) {
    asyncEncrypt(req.params.email).then(token => {
      var link = '';
      if (req.params.platFormType == 'android') {
        link = `https://kyc.payvoo.com/app/${process.env.SEPA_KYC_ENVIRONMENT}/identifications/${req.params.identId}`
      } else {
        // link = `${configVariables.link.ios}${req.params.identId}&data_token=${token}`
        link = `https://kyc.payvoo.com/app/${process.env.SEPA_KYC_ENVIRONMENT}/identifications/${req.params.identId}`
      }

      mail(req.params.email, link).then((message) => {
        resolve(message);
      }).catch((error) => {
        reject(error);
      })

    }).catch(err => {
      reject(err)
    })
  })
}


//this for sending link to respective mobile devices for continuation of kyc process. 
var sendInvitation = function (req) {

  return new Promise(function (resolve, reject) {
    //    let token = encrypt(req.body.userEmail + ' ' + req.body.userName + ' ' + req.body.isKyc +' '+ req.body.businessId + ' ' + req.headers['x-auth-token']+ ' ' + req.headers['api_access_key']+ ' ' + req.headers['member_id']+ ' ' +auth[1]+ ' ' + req.headers['client_auth']+ ' ' + JSON.stringify(Date.parse(util.getGMT())));
    var link = {};
    let identId = req.body.identId
    link['android'] = `${configVariables.sendLink.web}${identId}${configVariables.sendLink.web2}`
    link['ios'] = `${configVariables.sendLink.web}${identId}${configVariables.sendLink.web2}`
    // link['web'] = `${configVariables.sendLink.web}token=${token}`
    link['web'] = `${configVariables.sendLink.web}${identId}${configVariables.sendLink.web2}`
    verify((req.body.userEmail), link).then((message) => {
      resolve(message);
    }).catch((error) => {
      reject(error);
    })
  })
}

var verify = (email, link) => {
  return new Promise(function (resolve, reject) {
    var mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      attachments: [{
        filename: 'PayVoo BETA_small3.png',
        path: __dirname + '/images/PayVoo BETA_small3.png',
        cid: 'logo' 
      }],
      subject: configVariables.mail.verifySubject,
    };

    const transporter = nodemailer.createTransport({
      // need SMTP host to configure mail.
      host: process.env.SERVICE,
      port: process.env.MAIL_GMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    readHTMLFile(__dirname + '/verify.html', function (err, html) {
      var template = handle.compile(html);
      var replacements = {
        android: link.android,
        ios: link.ios,
        web: link.web
      };
      var htmlToSend = template(replacements);
      mailOptions.html = htmlToSend;
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          resolve(error);
        } else {          
          resolve({
            message: `${configVariables.mail.resolve}`
          });
        }
      })
    })
  })
};

/* Sending email && mobile messages for notifications*/
let sendKycStatus = async (email, mobile, status, flag, token, applicantId) => {
  logger.info(`Initiated sendKycStatus email and otp process`, applicantId);
//  return new Promise(async (resolve, reject) => {
    let result = await kycStatus(email, status)
      if (result && flag) {
        if (mobile.includes("0000")) {
          return ("Success");
        } else {
          if(status.includes("SUCCESS")) {
            let sendOtpToMobile = await sendOtp(mobile, `${langEngConfig.message.email.successMessage}`, token)
              if (sendOtpToMobile) {                                             
                return ("Success");     
              }
            } else if(status.includes("FAILED")) {
              let sendOtpToMobile = await sendOtp(mobile, `${langEngConfig.message.email.failedMessage}`, token)
              if (sendOtpToMobile) {                                             
                return ("FAILED");     
              }
            } else if(status.includes("ABORTED")) {
              let sendOtpToMobile = await sendOtp(mobile, `${langEngConfig.message.email.notfound}`, token)
              if (sendOtpToMobile) {                                             
                return ("ABORTED");     
              }
            } else if(status.includes("PENDING")) {
              let sendOtpToMobile = await sendOtp(mobile, `${langEngConfig.message.email.pending}`, token)
              if (sendOtpToMobile) {                                             
                return ("PENDING");     
              }            
            } else if(status.includes("FRAUD_SUSPICION")) {
              let sendOtpToMobile = await sendOtp(mobile, `${langEngConfig.message.email.pending}`, token)
              if (sendOtpToMobile) {                                             
                return ("FRAUD_SUSPICION");     
              }
            } else if(status == "FRAUD") {
              let sendOtpToMobile = await sendOtp(mobile, `${langEngConfig.message.email.fraudSuspicion}`, token)
              if (sendOtpToMobile) {                                             
                return ("FRAUD");     
              }
            } else {
           //   let sendOtpToMobile = await sendOtp(mobile, `${langEngConfig.message.email.successMessage}`, token)
           //   if (sendOtpToMobile) {                                             
                return ("Success");
          //    }
            } 
  
        }
      }
      if (error) {
        logger.error(`Sending email failure at sendKycStatus`);
        return ({
          status: STATUS.FAILED,
          message: langEngConfig.message.email.failure
        });
      }
    // }).catch((error) => {
    //   logger.error(`Sending email failure at sendKycStatus`);
    //   reject({
    //     status: STATUS.FAILED,
    //     message: langEngConfig.message.email.failure
    //   });
    // });

//  })
};


const SendSms = function (mobileNo, templateText, req) {
  logger.info('Request initiated for kyc trigger for access museService');
  return new Promise((resolve, reject) => {
    request({
      method: 'post',
      headers: {
        'accept': 'application/json',
        'authorization': req.headers['authorization'],
        'member_id': req.headers['member_id'],
        'api_access_key': req.headers['api_access_key'],
        'client_auth': req.headers['client_auth']
      },
      url: `http://${process.env.GATEWAY_URL}:${process.env.GATEWAY_PORT}/MOBICA/mobica/otp`,
      body: {
        "result": {
          phoneNumber: mobileNo,
          message: templateText
        }
      },
      json: true
    }, function (error, response) {
      if (response) {
        logger.info('Request success, mobica for access museService');
        resolve(response)
      }
      logger.error('Request fail, mobica for access museService');
      reject(error)
    })
  });
}

var mail = (email, link) => {
  return new Promise(function (resolve, reject) {
    const transporter = nodemailer.createTransport({
      // need SMTP host to configure mail.
      host: process.env.SERVICE,
      port: process.env.MAIL_GMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });
    var mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: configVariables.mail.subject,
    };
    readHTMLFile(__dirname + '/kycLink.html', function (err, html) {
      var template = handle.compile(html);
      var replacements = {
        link: link
      };
      var htmlToSend = template(replacements);
      mailOptions.html = htmlToSend;
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          resolve(error);
        } else {
          resolve({
            message: configVariables.mail.resolve
          });
        }
      })
    })
  })
};

//Method for sendig success money tranfer email
export const sendMoneyTransStatus = (mailid, text) => {
  return new Promise((resolve, reject) => {
    let mailOptions = {
      from: process.env.MAIL_USER,
      to: mailid[0].email,
      subject: 'Money credited successfully',
      text: text,
    };
    let transporter = nodemailer.createTransport({
      // need SMTP host to configure mail.
      host: process.env.SERVICE,
      port: process.env.MAIL_GMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve(error);
      } else {
        resolve({});
      }
    })
  })
}

//Method for sendig success money tranfer email
export const sendInsuffiBalEmail = (mailid, text) => {
  return new Promise((resolve, reject) => {
    let mailOptions = {
      from: process.env.MAIL_USER,
      to: mailid[0].email,
      subject: 'Insufficient balance',
      text: text,
    };

    let transporter = nodemailer.createTransport({
      // need SMTP host to configure mail.
      host: process.env.SERVICE,
      port: process.env.MAIL_GMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve(error);
      } else {
        resolve({});
      }
    })
  })
}

//Method to send transaction failure e-mail
export const sendTranFailEmail = async (mailid, text) => {
  return new Promise((resolve, reject) => {
    let mailOptions = {
      from: process.env.MAIL_USER,
      to: mailid[0].email,
      subject: 'Scheduled tranction failed',
      text: text,
    };

    let transporter = nodemailer.createTransport({
      // need SMTP host to configure mail.
      host: process.env.SERVICE,
      port: process.env.MAIL_GMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve(error);
      } else {
        resolve({});
      }
    })
  })
}

//Method to invite user
export const inviteUserToBusiness = (email, text) => {
  return new Promise((resolve, reject) => {
    let mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Invitation from eWallet',
      text: text,
    };

    let transporter = nodemailer.createTransport({
      // need SMTP host to configure mail.
      host: process.env.SERVICE,
      port: process.env.MAIL_GMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve(error);
      } else {
        resolve({});
      }
    })
  })
}

export const sendFundsRequestedMail = (email, text) => {
  return new Promise((resolve, reject) => {
    let mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Funds Requested',
      text: text,
    };

    let transporter = nodemailer.createTransport({
      // need SMTP host to configure mail.
      host: process.env.SERVICE,
      port: process.env.MAIL_GMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve(error);
      } else {
        resolve({});
      }
    })
  })
}


export const sendGenericTextEmail = (email, text, subject) => {
  return new Promise((resolve, reject) => {
    let mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: subject,
      text: text,
    };

    let transporter = nodemailer.createTransport({
      // need SMTP host to configure mail.
      host: process.env.SERVICE,
      port: process.env.MAIL_GMAIL_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve(error);
      } else {
        resolve({});
      }
    })
  })
}

export {
  kycStatus,
  randomNumber,
  validateEmail,
  isEmpty,
  sendEmail,
  timeDiffer,
  signupMail,
  sendLink,
  forgotStatus,
  sendInvitation,
  sandBoxInfo,
  sendKycStatus,
  SendSms,
  signupMerchantMail
}