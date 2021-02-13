/**
 * responseHandlerModel Model
 * responseHandlerModel is used for constructing success or failure response.
 * @package responseHandlerModel
 * @subpackage sources/services/model/responseHandlerModel
 * @author SEPA Cyper Technologies, Satyanarayana G.
 */

export class ResponseHandler {
  constructor() {
    this.DEFAULT_STATUS_CODE;
    this.STATUS_CODE = 0;
    this.SUCCESS_STATUS = 'Success';
    this.FAILURE_STATUS_CODE = 1;
    this.API_FAILURE = 2;
  }
  successHandler(data, message, otherStatus) {
    if (data && data.message && data.message.message && data.message.status == this.STATUS_CODE) {
     return this.failureHandler(data.message);
    }
    else {
      let successResponse = {};
      successResponse.status = this.STATUS_CODE;
      this.DEFAULT_STATUS_CODE = (otherStatus == successResponse.status && typeof otherStatus == 'number') ? successResponse.status : otherStatus;
      if (data == null) {
        successResponse.status = this.FAILURE_STATUS_CODE;
        successResponse.code = this.FAILURE_STATUS_CODE;
      } else {
        successResponse.message = this.SUCCESS_STATUS;
        successResponse.code = this.DEFAULT_STATUS_CODE;
        if (otherStatus > 0) {
          data.status = otherStatus;
          data.message = message;
        }
        if (otherStatus == 0) {
          data.status = otherStatus;
          data.message = message;
        }
      }
      successResponse.data = data;
      return successResponse;
    }
  }
  failureHandler(messageData) {
    let failureResponse = {};
    failureResponse.code = this.FAILURE_STATUS_CODE;
    if(messageData.status == this.STATUS_CODE){
      failureResponse.status = this.API_FAILURE;
      failureResponse.message = messageData.message;
    }else{
      failureResponse.status = this.FAILURE_STATUS_CODE;
      failureResponse.message = (messageData instanceof Error) ? messageData.message : messageData;
    }
    failureResponse.data = {};
    return failureResponse;
  }
}