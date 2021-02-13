#!/bin/bash

echo CHANGING CONFIGURATION FOR PAYVOO PLATFORM

cat>>/payvoo-web/sources/services<<EOF
/*
    This is an environment file which contains all the environment related properties such as
    development server ip,host number, port number, userid.
    Similarly Testing server related configurations also.
*/ 



MAIL_USER=test@sepa-cyber.com 
MAIL_PASSWORD=Muc46712
MAIL_GMAIL_PORT=587
PORT = 5000                                             ##payvoo service port
SERVICE=smtp.office365.com
PASSWORD_CONFIG=*&^%$#@!0987654321
PASSWORD_CONFIG1=FVT09YZ-WMW4MX7-QWNYCMJ-QFK5G4E
CLIENT_ID = z5a1ee0
API_KEY= FVT09YZ-WMW4MX7-QWNYCMJ-QFK5G4E
FORGOT_PASSWORD_URL=www.payvoo.tk
COUNTRYCODE =+91
DBHOST=192.168.1.1                                      ##database ip address 
DBUSER=test                                             ##database username
DBPORT=3306
DBPASSWORD=Password                                     ##database password
WEBADDRESS=https://192.168.3.3:4200
DB=payvoo                                               ##database name
DBCONNECTIONLIMIT=5
CONNECTTIMEOUT = 10000
GATEWAY_URL =192.168.2.2                                ##define backend gateway url 
GATEWAY_PORT = 6111                                     ##define gateway port number
MUSE_URL=192.168.3.3                                    ##define muse admin ip address
CM_PRODUCT_TOKEN=45829E14-1D3D-44FA-B1B6-881E589999C5
CURRENCY_EXCHANGE=ec953f5e4a0030db2d83563c4a6ab71d
SANDBOX_URL = http://192.168.1.1:5000                                  ##sand box api url
SANDBOX_API_DOC_URL = http://192.168.1.1:5000/merchant-api-docs/   ##sand box api docs url
SANDBOX_REDIRECT_URL = http://192.168.3.3:4200/#/business-sign-up  ##frontend url it wiil redirect to business-sign-up page
MOBICAUSER = sepa-cyber
MOBICAPASS= S$ePa@cY123
WEB_LOGIN_URL = http://192.168.3.3:4200/#/sandboxlogin             ##change sand box login url
WEB_DOC_URL =  http://192.168.1.1:5000/api-docs/                      ##
TOKEN_EXP_TIME =30
EOF
cd /payvoo-web/sources/services
docker build -t payvooservice .

echo CHANGING ANGULAR CONFIG FILES

cd /payvoo-web/sources/Web/src/environments/
rm -rf environment.prod.ts environmen.ts

cat>>/payvoo-web/sources/Web/src/environments/environment.prod.ts<<EOF
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
 // serviceUrl: 'http://192.168.1.1:5000/'   //dev sprint2
   serviceUrl: 'http://192.168.1.1:5000/'       // dev sprint3
};
EOF
cat>>/payvoo-web/sources/Web/src/environments/environment.ts<<EOF
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
         production: true,
         serviceUrl: 'http://192.168.1.1:5000/' 
         // serviceUrl: 'http://192.168.1.1:5000/'       // dev sprint3
};
EOF

echo CREATING DOCKER IMAGES FOR PAYVOO-SERVICE AND PAYVOO-WEB SERVICE 

cd /payvoo-web/sources/services
docker build -t payvooservice .
cd /payvoo-web/sources/Web/
npm install
ng build --prod
docker build -t payvooweb .

##TAG AND PUSH THE DOCKER IMAGES INTO YOUR REGISTORY AND THE EXECUTE KUBERNETES PODS

ssh root@192.168.0.0 '
cd /home/<url>/pods
kubectl apply -f  payvooweb-deployment.yaml
kubectl apply -f  payvoo-service.yaml '