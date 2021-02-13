/**
 * responseHelperModel Model
 * responseHelperModel is used for mapping which response handler will call .
 * @package responseHelperModel
 * @subpackage sources/services/model/responseHelperModel
 * @author SEPA Cyper Technologies, Satyanarayana G.
 */

export class ResponseHelper {
  constructor() {
  }
  buildSuccessResponse(data, message , status) {
    return responseHandler.successHandler(data, message , status)
  }
  buildFailureResponse(errorResponse) {
    return responseHandler.failureHandler(errorResponse)
  }
}


