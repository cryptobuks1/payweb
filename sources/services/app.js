/*
 * This is main server file for payvoo application. It contains all importing, routing, CORS 
 * compatible code, and listen method.
*/

global.express = require('express');
global.mariadb = require('mariadb/callback');  // Mariadb node package.

global.router = express.Router();
global.HttpStatus = require('http-status');
global.morgan = require('morgan');
global.request = require('request');
var bodyParser = require('body-parser');
global.hashPassword = require('password-hash');
global.nodemailer = require('nodemailer');
global.jwt = require('jsonwebtoken');
global.ip = require("ip");
var cors = require('cors');
global.chalk = require('chalk');
global.fs = require('fs');
global.uuidv1 = require('uuid/v1');
global.CONSTANTS = require('./constant').CONSTANTS;
/* Importing Logger */
import { ResponseHandler } from "./model/responseHandlerModel";
import { ResponseHelper } from "./model/responseHelperModel";

import { LoggerModel } from "./model/loggerModel";

global.responseHandler = new ResponseHandler()
global.ResponseHelper = new ResponseHelper()

const logDir = 'logs/all-logs.log';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

global.dateFormat = require('dateformat');
// swagger implementation 
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument1 = require('./postman-json/swagger.json'),
    swaggerDocument2 = require('./postman-json/swagger-mock.json'),
    swaggerDocument3 = require('./postman-json/swagger-merchant.json');
require('dotenv').config();
global.config = require('./dbconfig/dbconfig').config;
global.uuidAPIKey = require('uuid-apikey');
global.messagingApi = require("@cmdotcom/text-sdk"); // Third party SDK for mobile and email messaging
global._ = require('lodash');
//nodemon.restart(myPool.end())
//global.myPool = mariadb.createPool(config);
// mariadb.createConnection(config).then(function (conn) {
//     global.myPool = conn;
//     var jobFile = require('./cronjob/index')
// })
global.CustomError = require("./utility/errorHandler")
global.customLogger = require("./utility/errorDefiner").customLogger;
global.responseStatusHandler = require('./utility/errorDefiner').responseStatusHandler;

global.app = express();
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(true));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: PUT,GET,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var Fixer = require('fixer-node')
global.newFixer = new Fixer(process.env.CURRENCY_EXCHANGE)
global.fixer = require('fixer-api');
fixer.set({ accessKey: process.env.CURRENCY_EXCHANGE });
global.cronJob = require('cron').CronJob;
app.use(express.static(__dirname + '/public'));
//routing

/* Start  new implementation*/
app.use(require('./router/otp'));
app.use(require('./router/country'));
app.use(require('./router/user'));
app.use(require('./router/personalSettings'))
// app.use(require('./router/password'));
//app.use(require('./router/signUp'));
//app.use(require('./router/login'));
/* end */
app.use(require('./router/loggerConfigure'));
app.use(require('./router/kyc'));
app.use(require('./router/businessRegistration'));
app.use(require('./router/dashboardStatus'));
//app.use(require('./router/payVoo'));
//app.use(require('./router/kyc1'));
//app.use(require('./router/payVoo'));
//app.use(require('./router/userDetails'));
app.use(require('./router/sendLink'));
//app.use(require('./router/businessSignUp'));
app.use(require('./router/address'));
app.use(require('./router/businessOwner'));
app.use(require('./router/transactions'));
app.use(require('./router/contact'));
app.use(require('./router/upload'));
app.use(require('./router/card'));
app.use(require('./router/moneyTransfer'));
app.use(require('./router/payments'));
app.use(require('./router/account'));
app.use('/mock/service/v1', require('./router/mock'));
app.use(require('./router/currencyRate'));
//app.use('/api/auth', require('./router/auth'));
app.use(require('./router/currencyExchange'));
app.use(require('./router/priceAlert'));
//app.use(require('./router/router'));
app.use(require('./router/tokenManager'));
app.use(require('./router/pepSanction'));
app.use((require('./router/counterParty')));
app.use(require('./router/sandbox'));
app.use(require('./router/merchant'));
app.use(require('./router/businessSetting'));
app.use(require('./router/scheduleTransfer'));
app.use(require('./router/businessAddress'));
app.use(require('./router/businessPersonalProfile'));
app.use(require('./router/businessOwnersAddress'));


var options = {
    customCss: `.topbar-wrapper img[alt="Swagger UI"], .topbar-wrapper span {
        visibility: collapse;
    }
    
    .topbar-wrapper .link: {
       content: url('${process.env.SANDBOX_URL}/service/images/payvoo_logo.png');
       top: -5px; //fiddle with this as needed
    }
    .swagger-ui .topbar {
        padding: 10px 0;
        background-color: #FFF;
    }
    .swagger-ui .info .title {
        font-size: 36px;
        margin: 0;
        font-family: sans-serif;
        color: #F8C015 !important;
    }
    .swagger-ui .topbar a {
        font-size: 1.5em;
        font-weight: 700;
        max-width: 180px !important;
        text-decoration: none;
        font-family: sans-serif;
        color: #fff;
        height:50px;
        background: url(${process.env.SANDBOX_URL}/service/images/payvoo_logo.png);
    }
    .swagger-ui .info>div {
        margin: 0 0 5px;
        display: none;
    }
    `
};



swaggerDocument3.host = `${process.env.SANDBOX_URL}`;

//app.use('/api-docs', swaggerUi1.serve, swaggerUi1.setup(swaggerDocument1));
//const useSchema = schema => (...args) => swaggerUi.setup(schema)(...args);
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument1, options));
//app.use('/merchant-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument3, options));

var swaggerHtmlV1 = swaggerUi.generateHTML(swaggerDocument1, options);
var swaggerHtmlV2 = swaggerUi.generateHTML(swaggerDocument2, options);
var swaggerHtmlV3 = swaggerUi.generateHTML(swaggerDocument3, options);

app.use("/api-docs", swaggerUi.serveFiles(swaggerDocument1, options));
app.get("/api-docs", (req, res) => {
    res.send(swaggerHtmlV1);
});

app.use("/mock-api-docs", swaggerUi.serveFiles(swaggerDocument2, options));
app.get("/mock-api-docs", (req, res) => {
    res.send(swaggerHtmlV2);
});

app.use("/merchant-api-docs", swaggerUi.serveFiles(swaggerDocument3, options));
app.get("/merchant-api-docs", (req, res) => {
    res.send(swaggerHtmlV3);
});

initLogger().then(function (rows) {
    global.moduleToLogLevel = rows;
}).catch((err) => setImmediate(() => { throw err; }));

new cronJob('*/10 * * * *', function () {
    initLogger().then(function (rows) {
        global.moduleToLogLevel = rows;
    }).catch((err) => setImmediate(() => { throw err; }));
}, null, true, null);

new cronJob('0 6 * * *', function () {
    removeExpireTokens().then(function (rows) {
        console.log('Expire Tokens Removed At Every Time : 6 AM');
    }).catch((err) => setImmediate(() => { throw err; }));
}, null, true, null);

//Cronjob for schedule tranfer
import { exeScheduleTrans } from './controller/scheduleTranfer';
new cronJob(process.env.CRON_SCHEDULEDPAYMENTS, function () {
    console.log("****** Running scheduled payments cron job ******");
    exeScheduleTrans();
}, null, true, 'Europe/London');

// Cronjob for exchange
import { autoExchange } from './cronjob/index';
new cronJob(process.env.CRON_AUTOEXCHANGE, function () {
    autoExchange();
}, null, true, 'Europe/London');

import { getAndUpdateKycStatus } from './cronjob/kycStatus';
new cronJob(process.env.CRON_KYCCHECKANDUPDATE, function () {
    logger.info("******Calling kycstatus check in cron");
    getAndUpdateKycStatus();
}, null, true, 'Europe/London');

import { Logger } from "./logger"
global.logger = new Logger()

global.access_token = "cepacyb12345678er";

logger.stream = {
    write: message => logger.debug(message.substring(0, message.lastIndexOf('\n')))
};
module.exports = morgan(
    ':method :url :status :response-time ms - :res[content-length]',
    { stream: logger.stream }
);

function initLogger() {
    return new Promise(function (resolve, reject) {
        let loggerObj = new LoggerModel()
        loggerObj.getAllModules().then(r => {
            resolve(r)
        }, (error) => {
            reject(error)
        })
    });
}

function removeExpireTokens() {
    return new Promise(function (resolve, reject) {
        let loggerObj = new LoggerModel()
        loggerObj.removeExpireTokens().then(r => {
            resolve(r)
        }, (error) => {
            reject(error)
        })
    });
}

process.on('uncaughtException', function (err, request, response, next) {
    process.exit(1)
    response.status(500).send("Sorry - something went wrong. We're digging into it.")
})

app.listen(process.env.PORT, err => {
    if (err) throw err;
    console.log(process.env.PORT, "Server Connected.....!");

});

module.exports = app;
