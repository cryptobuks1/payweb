/**
 * pepSanctionController Controller
 * pepSanctionController is used for authentication of user to allow to enter into payvoo app.
 * it will go to  validate  the user email and password then only it will allow into payvoo
 * @package pepSanction
 * @subpackage controller/pepSanction/pepSanctionController
 * @author SEPA Cyper Technologies, satyanarayana G.
 */

var soap = require('strong-soap').soap;
let path = require('path');

"use strict";

//var fs = require('fs');

exports.pepSanction = (request, response) => {

    var url = 'https://apiv3-uat.w2globaldata.com/Service.svc?wsdl';

    var requestArgs = {
        apiKey: '8a2027e5-5cd2-4d56-a4cf-02abe0070ca4'
    };

    var options = {
        method: 'POST',
        url: 'http://localhost:5001/service/pepSanction',
        headers: {
            'Content-Type': 'text/xml'
        },
        body:'xml'
    };
    soap.createClient(url, options, function (err, client) {
        client.addSoapHeader(`<wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing">urn:IQTrack/WebServices/v1/RequesterSync/KYCCheck</wsa:Action>`);
        var method = client['KYCCheck'];

        method(requestArgs, function (err, result, envelope, soapHeader) {
            //response envelope          
            //'result' is the response body          
        });
    });

}