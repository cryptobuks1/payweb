/**
 * transaction Controller
 * This api is used for to send or receive payments from bussiness app .
 * @package transaction
 * @subpackage controller/transactions/transaction
 *  @author SEPA Cyper Technologies, Satyanarayana G,Krishnakanth R
 */

"use strict"
import {
	Transaction
} from '../model/transactionModel';
import {
	langEngConfig
} from '../utility/lang_eng';
import {
	Kyc
} from '../model/kyc';
import {
	Utils
  } from '../utility/utils';

import {
	MoneyTransfer
  } from '../model/moneyTransfer';
 import * as Excel from 'exceljs';

 import { PDFDocument } from 'pdf-lib'

const kyc = new Kyc();

let utils = new Utils();

// var pdf = require('html-pdf');

// var pdf = require("pdf-creator-node");

var PDFKit = require('pdfkitjs');

const { buildPathHtml, buildPathPdf } = require('./buildPaths');

const STATUS = {
	SUCCESS: 0,
	FAIL: 1
}


var fs = require('fs');
var http = require('http');

// var Blob = require('blob');

const path = require("path");


/**
 * @desc This function is used to insert country transactions
 * @method transaction
 * @param {Object}  request  - It is request Object
 * @param {Object}  response - It is response Object
 * @return return status message and status code 
 */
const transaction = async (request, response) => {
	logger.info('transaction() initiated');
	const transaction = new Transaction();
	let applicant_id = request.params.applicant_id;
	let res = await transaction.getBusinessId(applicant_id)
	if (_.size(res) > 0) {
		let countries_Details = request.body.countries_Details;
		let paymentType = request.body.paymentType;

		let results = _.size(countries_Details) > 0 ? countries_Details : [];
		if (results && results.length > 0) {
			let rowItems = [];
			(results).forEach(function (obj) {
				let reSetObj = {};
				reSetObj.business_id = res[0].business_id
				reSetObj.country_id = obj.country_id
				reSetObj.business_description = obj.business_description
				reSetObj.transaction_type = obj.transaction_type
				rowItems.push(Object.values(reSetObj));
			});

			try {
				let results = await transaction.getTransaction(res[0].business_id)
				let data = '';
				if (results.length > 0 && results[0].transaction_type == countries_Details[0].transaction_type) {
					data = await transaction.updateTransaction(countries_Details[0].country_id, countries_Details[0].business_description,
						countries_Details[0].transaction_type, res[0].business_id)						
				} else {
					data = await transaction.transactionPayment(rowItems)					
				}				
				if (data) {
					if (paymentType === 'SEND') {
						kyc.updateDashboardKycStatus('2', res[0].business_id, 'type_of_business').then(results => {
							if (results.affectedRows) {
								logger.info('status updated dashboard')
								response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.transaction.operationSuccess, STATUS.SUCCESS));
							} else {
								logger.error('Dashboard status fail , while updating')
								response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.transaction.operationError, STATUS.FAIL));
							}
						}).catch(err => {
							logger.error('Dashboard status fail , while updating')
							response.send({
								message: `status updation failure, while updating type_of_business : ${error}`,
								status: 0,
								restricted: 0
							});
						});
					} else {
						response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.transaction.operationSuccess, STATUS.SUCCESS));
					}
				} else {
					logger.error('getTransaction() Error', err);
					response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
				}
			} catch (error2) {
				logger.error('transaction() Error', error2);
				response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
			}
		} else {
			logger.error('transaction() Error');
			response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.transaction.dataEmpty, STATUS.FAIL));
		}
	} else {
		logger.error('transaction() Error');
		response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.transaction.businessId_error, STATUS.FAIL));
	}
}

 const getStatements = async (req, res) => {
	let currentDate = utils.getGMT();
	let transModel = new MoneyTransfer(req.params);
	let applicantID = transModel.applicant_id;
	let rangeDate = '';
  
	//If fromdate is not empty initialize with that day
	
	  //If empty initialize with one month back date
	  rangeDate = dateFormat(Date.parse(utils.getGMT()) - 2592000000, 'yyyy-mm-dd HH:MM:ss');
	let transRes = {};
   transRes = await transModel.getWebTransactionDetails(applicantID, rangeDate, currentDate);
   if (transRes.length > 0) {
	//Create the transaction records in perticular order
	let tranDetailRes = await __createResponse(transRes);
if(req && req.body.type == "mobile") {
	var html = fs.readFileSync(path.join(process.cwd(), 'statement.html'), 'utf8');

	var options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
        },
        "footer": {
            "height": "28mm",
            "contents": {
            first: 'Cover page',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
	}
  };
	var users = [
		{
			name:"Shyam",
			age:"26"
		},
		{
			name:"Navjot",
			age:"26"
		},
		{
			name:"Vitthal",
			age:"26"
		}
	]
	var document = {
		html: html,
		data: {
			users: users
		},
		path: "./output.pdf"
	};

//	const pdfDoc = htmlpdf.create(document, options)


	const pdfDoc = await PDFDocument.create();
	var URL = global.URL || global.webkitURL
		const pdfUrl = URL.createObjectURL(
			new Blob([await pdfDoc.save()], { type: 'application/pdf' }),
		  );
		  res.send(pdfUrl);	
} else if(req.body.type == "web") {
	var items = [];
	var columns = [];
	tranDetailRes.forEach(async (element, i) => {
		var valuesArray = [];
		valuesArray = Object.values(tranDetailRes[i].data);		
		if(req.body.transaction_id) {
			valuesArray.forEach((element, i) => {
				var column = {};
				if(req.body.transaction_id == element.transaction_id) {
					column['transaction_id'] = element.transaction_id
					column['transaction_number'] = element.transaction_number
					column['counterparty'] = element.counterparty
					column['amount'] = element.amount
					column['created_on'] = element.created_on
				columns.push(column);
				}
				});
		} else {
		valuesArray.forEach((element, i) => {
			var column = {};
			column['transaction_id'] = element.transaction_id
				column['transaction_number'] = element.transaction_number
				column['counterparty'] = element.counterparty
				column['amount'] = element.amount
				column['created_on'] = element.created_on
			columns.push(column);
			});
		} 
	})
	items = columns	

	const createRow = (item) => `
  <tr>
    <td>${item.transaction_id}</td>
    <td>${item.transaction_number}</td>
    <td>${item.counterparty}</td>
    <td>${item.amount}</td>
    <td>${item.created_on}</td>
  </tr>
`;
const createTable = (rows) => `
  <table>
    <tr>
        <th>Trancation Id</td>
        <th>Transaction Number</td>
        <th>Counterparty</td>
        <th>Amount</td>
        <th>Created On</td>       
    </tr>
    ${rows}
  </table>
`;
const createHtml = (table) => `
  <html>
    <head>
      <style>
        table {
          width: 100%;
        }
        tr {
          text-align: left;
          border: 1px solid black;
        }
        th, td {
          padding: 15px;
        }
        tr:nth-child(odd) {
          background: #CCC
        }
        tr:nth-child(even) {
          background: #FFF
        }
        .no-content {
          background-color: red;
        }
      </style>
    </head>
    <body>
      ${table}
    </body>
  </html>
`;
const doesFileExist = (filePath) => {
	try {
		fs.statSync(filePath); // get information of the specified file path.
		return true;
	} catch (error) {
		return false;
	}
};
try {
	/* Check if the file for `html` build exists in system or not */
	/* generate rows */
	const rows = items.map(createRow).join('');
	/* generate table */
	const table = createTable(rows);
	/* generate html */
	const html = createHtml(table);

    var options = { format: 'Letter' };
	var document = {
		html: html,
		data: {
			users: users
		},
		path: buildPathPdf
	};
	var pdf = new PDFKit('file', html)
	pdf.toFile(buildPathPdf, function (err, file) {
		console.log('File ' + file + ' written');
	  });
	// pdf.create(document, options).then(response => {		
	// 	var data = fs.readFileSync('./build.pdf');
 	//     res.contentType("application/pdf");
    // 	res.send(data);
	// 	console.log(response.filename); // { filename: '/app/businesscard.pdf' }
	// 	console.log('Succesfully created an HTML table');
	//   });	
} catch (error) {
	console.log('Error generating table', error);
}	
}
   }
}



/**
 * @desc This function is used to get country transactions
 * @method getTransaction
 * @param {Object}  request  - It is request Object
 * @param {Object}  response - It is response Object 
 * @return return country transactions 
 */
const getTransaction = (request, response) => {
	logger.info('getTransaction() initiated');
	const getTransaction = new Transaction();
	let applicant_id = request.params.applicant_id;
	getTransaction.getBusinessId(applicant_id).then(result => {
		if (_.size(result) > 0) {
			getTransaction.getTransaction(result[0].business_id).then((res, err) => {
				let data = [];
				_.forEach(res, function (results, key) {
					delete res[key].business_id;
					data.push(results);
				});
				if (err) {
					logger.error('getTransaction() Error', err);
					response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
				} else {
					if (res[0]) {
						logger.info('getTransaction() exited');
						response.send(ResponseHelper.buildSuccessResponse({
							"transaction_country": data
						}, langEngConfig.message.transactionVolume.country_transaction_success, STATUS.SUCCESS));
					} else {
						if (_.size(result) > 0) {
							logger.error('getTransaction() failed');
							response.send(ResponseHelper.buildSuccessResponse({
								"transaction_country": res
							}, langEngConfig.message.transactionVolume.country_transaction_failed, STATUS.FAIL));
						} else {
							logger.error('getTransaction() Error');
							response.send(ResponseHelper.buildSuccessResponse({
								"transaction_country": res
							}, langEngConfig.message.transactionVolume.country_transaction_failed, STATUS.FAIL));
						}
					}
				}
			}).catch(err => {
				logger.error('getTransaction() Error', err);
				response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
			})
		} else {
			logger.error('getTransaction() Error');
			response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.transaction.businessId_error, STATUS.FAIL));
		}
	}).catch(err => {
		logger.error('getTransaction() Error', err);
		response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
	})
}

const getStatement = async (request, response) => {
	let transModel = new MoneyTransfer(request.params);
	let applicantID = transModel.applicant_id;
	let currentDate = utils.getGMT();
  
	let fromDate = dateFormat(Date.parse(request.body.from_date), 'yyyy-mm-dd HH:MM:ss');
	let toDate = dateFormat(Date.parse(request.body.to_date)+86400000, 'yyyy-mm-dd HH:MM:ss');
	let curreny = request.body.currency_type;
  
	let rangeDate = '';
  
	//If fromdate is not empty initialize with that day
	if (fromDate != 'undefiend' && fromDate != '' && fromDate != null) {
	  rangeDate = fromDate 
	} else {
	  //If empty initialize with one month back date
	  rangeDate = dateFormat(Date.parse(utils.getGMT()) - 2592000000, 'yyyy-mm-dd HH:MM:ss');
	}
	try {		
		let transRes = {};
		transRes = await transModel.getWebTransactionDetail_statement(applicantID, rangeDate,toDate);
		var workbook = new Excel.Workbook();

	

		if (transRes.length > 0) {
			//Create the transaction records in perticular order
			let tranDetailRes = await __createResponse(transRes); 
		
		
	 var worksheet = workbook.addWorksheet('Transactions -' + (1));
		tranDetailRes.forEach((element, i) => {			
			var valuesArray = [];
			valuesArray = Object.values(tranDetailRes[i].data);			
			var keysArray = [];
			valuesArray.forEach((element, i) => {				
				keysArray = Object.keys(element);					
			});	
		//	console.log('vlaues ::'+JSON.stringify(valuesArray));
			console.log('keys ::'+JSON.stringify(keysArray)); 
			var columns = [];
			keysArray.forEach((element, i) => {
				var column = {};
				column['header'] = element
				column['key'] = element
				column['width'] = 20
				columns.push(column);
			});
			worksheet.columns = columns;
			console.log('columns:::'+JSON.stringify(columns))
			if(request.body.transaction_id) {
			valuesArray.forEach((dataElement, i) => {
				if(request.body.transaction_id == dataElement.transaction_id) {
				var data = {};				
				keysArray.forEach((element, i) => {				
					data[element] = dataElement[element]
				});
				console.log('data:::'+JSON.stringify(data))
				worksheet.addRow(data);
			}		
			});
		} else {
			valuesArray.forEach((dataElement, i) => {			
				var data = {};				
				keysArray.forEach((element, i) => {				
					data[element] = dataElement[element]
				});
				console.log('data:::'+JSON.stringify(data))
				worksheet.addRow(data);
			
			});
		}
		});
	}

		response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		response.setHeader("Content-Disposition", "attachment; filename=" + "Customer_Churn.xlsx");
		workbook.xlsx.write(response)
			.then(function (data) {
				response.end();
				console.log('File write success........');
			});


	} catch (error) {
		return "error"
	}
// 	global.createPDFFile = function (htmlString, fileName, callback) {
// 		var options = {
// 			format: 'Letter',
// 			header: {
// 			   "height": "15mm",
// 			   "contents": "<img alt='Clintek logo' height='100' width='100' src='http://52.207.115.173:9191/files/5a6597eb7a67600c64ce52cf/?api_key=25BDD8EC59070421FDDE3C571182F6F12F5AAF99FF821A285884E979F3783B23'>"
// 				  }
				 
// 		};
// 		/**
//  * It will create PDF of that HTML into given folder.
//  */ 
// pdf.create(htmlString, options).toFile('./public/pdf/' + fileName, function (err, data) {
//     if (err) return console.log(err);
//     return callback(null, config.get('AdminBaseURL') + ':' +
//          config.get('server.port') + '/pdf/' + fileName)
//   });
// }
// 	}
}
  
/**
 * This function is used to insert transactions
 * @method transactionVolume
 * @param {Object}  request  - It is request Object
 * @param {Object}  response - It is response Object 
 * @return return status message and status code 
 */
const transactionVolume = (request, response) => {
	logger.info('transactionVolume() initiated');
	const transactionVolume = new Transaction();
	let applicantId = request.params.applicant_id;
	transactionVolume.getBusinessId(applicantId).then(result => {
		if (_.size(result) > 0) {
			logger.info('business id found');
			let transaction = {
				business_id: result[0].business_id,
				monthy_transfer_amount: request.body.monthy_transfer_amount,
				no_payments_per_month: request.body.no_payments_per_month,
				max_value_of_payment: request.body.max_value_of_payment
			}
			if (transaction.business_id && transaction.business_id != 'undefined') {
				transactionVolume.transactionVolume(transaction).then((results, err) => {
					if (_.size(results) > 0) {
						logger.info('transactionVolume() exited');
						response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.transactionVolume.success, STATUS.SUCCESS));
					} else {
						logger.error('transactionVolume() Error');
						response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.transactionVolume.fail, STATUS.FAIL));
					}
				}).catch(err => {
					logger.error('transactionVolume() Error', err);
					response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
				})
			}
		} else {
			logger.error('error in fetching business Id');
			response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.transactionVolume.businessId_error, STATUS.FAIL));
		}
	}).catch(err => {
		logger.error('transactionVolume() Error', err);
		response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
	})

}




const __createResponse = async (res) => {
	try {
	  var i = 0;
	  _.forEach(res, function (row) {
		i++
		//row.created_on = dateFormat(row.created_on, 'dd-mm-yyyy')
		row["created_on_with_time"] = dateFormat(row.created_on, "HH:MM:ss")
		row.created_on = dateFormat(row.created_on, 'dd-mm-yyyy')
	  })
	  if (_.size(res) == i) {
		var array = []
		var y = 0
		_.forEach(_.uniqBy(res, 'created_on'), function (rowData) {
		  y++
		  var obj = {}
		  obj["created_on"] = rowData.created_on;
		  obj.data = _.filter(res, {
			created_on: rowData.created_on
		  });
		  array.push(obj);
		})
		if (_.size(_.uniqBy(res, 'created_on')) == y) {
		  return (array)
		}
	  }
	} catch (err) {
	  logger.error('Error occured ' + err);
	  return (new Error(langEngConfig.message.error.ErrorHandler))
	}
  }
/**
 * This function is used to get Transactions
 * @method getTransactionVolume
 * @param {Object}  request  - It is request Object
 * @param {Object}  response - It is response Object 
 * @return return transaction volume list 
 */
const getTransactionVolume = (request, response) => {
	logger.info('getTransactionVolume() initiated');
	const getTransactionVolume = new Transaction();
	let applicantId = request.params.applicant_id;
	getTransactionVolume.getBusinessId(applicantId).then(result => {
		if (_.size(result) > 0) {
			getTransactionVolume.getTransactionVolume(result[0].business_id).then(res => {
				if (_.size(res) > 0) {
					let data = {
						monthy_transfer_amount: res[0].monthly_transfer_amount,
						no_payments_per_month: res[0].no_payments_per_month,
						max_value_of_payment: res[0].max_value_of_payments,
					}
					logger.info('getTransactionVolume() exited');
					response.send(ResponseHelper.buildSuccessResponse({
						"TransactionVolume": data
					}, langEngConfig.message.transactionVolume.fetchsuccess, STATUS.SUCCESS));

				} else {
					let data = {};
					logger.error('getTransactionVolume() Error');
					response.send(ResponseHelper.buildSuccessResponse({
						"TransactionVolume": data
					}, langEngConfig.message.transactionVolume.fetcheerror, STATUS.FAIL));
				}
			}).catch(err => {
				logger.error('getTransactionVolume() Error', err);
				response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
			})
		} else {
			logger.error('error in fetching business Id');
			response.send(ResponseHelper.buildSuccessResponse({}, langEngConfig.message.transactionVolume.businesssId_error, STATUS.FAIL));
		}
	}).catch(err => {
		logger.error('getTransactionVolume() Error', err);
		response.send(ResponseHelper.buildFailureResponse(new Error(langEngConfig.message.error.ErrorHandler)));
	})
}

export {
	transaction,
	getTransaction,
	transactionVolume,
	getStatement,
	getTransactionVolume,
	getStatements
};