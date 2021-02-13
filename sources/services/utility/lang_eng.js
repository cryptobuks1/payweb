/**
 * lang_eng config
 * This is a config file, where english message responses are stored.
 * @package lang_eng
 * @subpackage sources/services/utility/lang_eng
 * @author SEPA Cyber Technologies, Sekhara Suman Sahu
 */

export const langEngConfig = {
  message: {
    signUp: {
      success: "Registratiton successfully",
      fail: "Registratiton failed",
      address_update: "Status updated successfully.",
      data_update: "Data updated successfully",
      signUpError: "Something went wrong",
      contactError: "Something went wrong",
      applicant_notFound: "Applicant not found"

    },
    indexCountry: {
      error: "You have an database error in fetch country detail.",
      operationError: "Database operation error ",
      inputError: "Wrong request parameter passed or Country does not exist.",
      connError: "Error in DB connection",
      countryError: "You have an database error in fetch country detail.",
      checkRequest: "Wrong request parameter passed.",
      checkValue: "Null data passed from front end.",
      emailExist: "Email already exist",
      mobileExist: "Mobile already exist",
      emailAndMobileExist: "Email and mobile already exist",
      fetchfail: "Fail to fetch countries currency status",
      countrySucc: 'Global country list fetched successfully.',
      countryFail: 'Error occured while fetching global country list.'
    },
    indexCurrency: {
      error: "You have an database error in fetch currency detail.",
      success: "Successfully fetched currency list",
      inputError: "Wrong request parameter passed or currencies does not exist.",
      fetchfail: "Fail to fetch currencies",
      nodata: "No currencies found"
    },
    mail: {
      subject: "Welcome to eWallet",
      from: "sekharasahu@gmail.com",
      email_failure: "Email sending failure",
    },
    password: {
      succ: `New Password Updated successfully`,
      passchange_succ: `Password changed successfully`,
      valid_pass: `Please enter valid old password`,
      valid_new_pass: `Please enter valid  password`,
    },
    industries: {
      success: "Industries fetched successfully.",
      error: "Error while fetching restricted business list.",
      industriesEmpty: "No Industries Found",
      checklistSuccess: "Business industries checklist posted successfully",
      operationError: `Business industries checklist insertion fail`,
      operationFailure: `Business industries checklist batchInsertion fail`,
      operationConnectionFail: `Business industries checklist connection failure`,
      selectedListSuccess: `Selected business industries list fetched successfully.`,
      checklistSectorSuccess: `Business sector and selected industries detail inserted successfully.`,
      restrictedBusinessSuccess: `<p>eWallet business account currently isn't available for the following types of business:</p> </br>
<ul style = "display: inline-block;
text-align:left;">

	<li>
  Armaments, nuclear, weapons or defence manufacturers</li>
  <li>Adult entertainment or the sale or advertising of sexual services</li>
  <li>Art dealers and auction houses</li>
  <li>Industrial chemical or legal high companies</li>
  <li>Client money processing firms</li>
  <li>Cryptocurrency processing firms</li>
  <li>FX speculators</li>
  <li>Gambling firms or video game arcades</li>
  <li>Nonprofit, political and religious organisations</li>
  <li>Precious metals and stones firms, including jewellers</li>
  <li>Sale of used cars/heavy industry vehicles</li> </ul>


<p>You cannot hold, exchange, transfer or manage client funds in a eWallet business account. Client funds essentially just means money that belongs to your customers. For example, an investment firm’s “Client funds” is their customers money which they invest on their behalf. You would not be able to hold or manage this money in a eWallet business account.

Please, contact Support for more information.</p>`
      //restrictedBusinessSuccess: `This industry is treated with special attention. Our support team will additionally contact you to advise what would be the next steps for opening an account.`

    },
    businessdetails: {
      success: "Company Registered successfully.",
      fail: "Company Registration failed.",
      dberror: "Error in connection",
      fetchsuccess: "Business Sector detail fetched for business",
      fetcherror: "Data not found based upon the business ",
      withoutKYB: "Registered without KYB",
      businessId_notFound: "Business not found",
      businessInvalid: "Company does not exist. Please contact eWallet Administrator"
    },
    business_type: {
      error: "Error in type of business data fetching.",
      query_error: "No data found.",
      conn_error: "Error in database connection.",
      insert_error: "Errror in data inserting",
      success: "Type od business list fetched successfully"
    },
    sector_list: {
      success: "Business sector list fetched successfully",
      error: "Error while fetching business sector list"
    },
    kyb_status: {
      success: "Status inserted successfully.",
      error: "Error in status insertion.",
      status_error: "Error occurred while status updation. Please check business exists or column name is correct",
      isert_status: "Status does not exist for respective business. Please call the /service/post/statusInsert API first."
    },
    country: {
      status_suc: "Currency data fectched",
      status_fail: "Error while fetching.",
      success: "GetCountriesList fetched successfully",
      nocountry: "There is no countries by name",
      successbyname: "Get countries by name fetched successfully",
      fail: "Fail to fetch countries by name",
      invalidinput: "Invalid input details for get countries by name"

    },
    loginMessage: {
      emailNotFound: "Please, enter a valid email",
      passwordInvalid: "Please, enter a valid password",
      connectionError: "Connection error ",
      mpinNotFound: "Unable to login due to mpin does not exist",
      emailSuccess: "Please Verify , SandBox details sent successfully to ",
      emailFail: "Email sending Fail",
      noDataError: "Invalid Input Data",
      errorMessage: "No data found with this email",
      invalidAccountType: "Invalid account type"

    },
    userDetailsMessage: {
      success: "User data found",
      fail: "Data not found",
      inValidEmail: "Username not valid",
      kycDoneAlready : "You are already done with your KYC process.",
      linkExpire : "Your Link Expire"
    },
    upload: {
      fail: `Failed to upload`,
      success: `File uploded`,
      invalid: `Invalid data`,
    },
    getFail: {
      fail: `Please, provide a valid card number`,
      success: `Data found`
    },
    transaction: {
      operationError: `Transaction countries insertion fail`,
      operationSuccess: `Transaction countries inserted successfully`,
      operationFailure: `Transaction countries batchInsertion fail`,
      operationConnectionFail: `Transaction connection failure`,
      dataEmpty: `Please provide valid business transaction details`,
      businessId_error: `Business not found`


    },

    transactionVolume: {
      success: `Data stored successfully`,
      fail: `Data failed to store`,
      error: `Connection Error`,
      fetchsuccess: "Transaction volume fetched",
      fetcheerror: "No transaction volume found based upon the businessId. ",
      country_transaction_success: "Transaction country detail fethced successfully",
      country_transaction_failed: "Transaction country detail fetching failed.",
      businessId_error: `Business not found`

    },

    payment: {
      failure: `Payment details insertion fail`,
      success: `Payment details insert successfully`,
      noDataError: `No data found with selected user `,
      noAccount:`No account found for selected User`,
      successPayment : `Payment successfully done`,
      card_fail: "Something went wrong, fetching user card details",
      cvv_fail: "Invalid cvv",
      invalid_kyc: "KYC is not completed",
      amount_range: "Please, do a minimum top up of ",
      apiError: `Failure for api response `,
      inputError: `Payment User invalid `,
      authError: `You are unauthorized`,
      headerError: `Please provide authorization header`,
      wallet_balance_success: `Wallet balance fetched successfuly`,
      wallet_balance_error: `Error while fetching  Wallet balance`,
      wallet_applicant_id_error: `Applicant not found`,
      exchange_success: "Exchange rate set successfully",
      exchange_error: "Error while seting exchange.",
      alert_success: "Alert rate set successfully",
      alert_error: "Error while set the alert rate",
      get_alert_success: "Price alert details fetched successfully",
      get_alert_fail: "No data found",
      update_alert_success: "Successfully updated",
      update_alert_fail: "Failed while update the record",
      delete_alert_success: "Deleted successfully",
      delete_alert_fail: "Failed while delete the record",
      get_success: "Currency exchange details fetched succesfully",
      get_fail: "Record doesn't exist with userId",
      get_id: "Error while fetching currency exchange details",
      delete_success: "Currency exchange details deleted sucesfully",
      delete_fail: "Record not found ",
      delete_id: "Something went wrong",
      update_success: "Record updated successfully",
      update_fail: "Record not updated ",
      update_data: "Please enter valid data",
      card_cvv_invalid: "Please enter valid cvv",
      acc_upd_succ: 'Account Updated Successfully',
      card_success: "Card data inserted successfuly",
      err: "Error occured while inserting.",
      cardDeactiveSuccess: "Card deactivated successfuly",
      cardActiveSuccess: "Card activated successfuly",
      cardFailure: "Error while deactivating the card.",
      getcardSuccess: "Card detail fetched sucesfuly",
      getcardError: "No card found against the applican id",
      noCardFound: "No card details found against the applicant",
      trans_success: "Money transferred successfully.",
      trans_cancelled: "The request has been cancelled",
      trans_amount: "Requested amount has already been sent",
      trans_declined_already: "The request has already been declined",
      trans_declined: "The request has been declined",
      trans_failed: "Amount addition failed",
      insufficient_balance: "Insufficient balance",
      account_deactive: "Account is deactive",
      enough_balance: "Enough balance",
      amount_deduction_success: "Amount deducted successfuly",
      amount_deduction_fail: "Amount deduction failed",
      amount_addition_success: "Amount added succesfuly",
      amount_addition_failed: "Amount addition failed",
      transaction_detail_fetch_success: "Transaction details fetched successfuly",
      transaction_detail_fetch_error: "Account OR Transaction not found",
      receiver_applicantid_success: "Receivers applicant fetched successfuly",
      receiver_applicantid_error: "Error while fetching receivers applicant",
      fullname_success: "Full name fetched successfuly",
      fullname_error: "Error while fetching Full name",
      trans_record_succ: "Transaction created successfuly",
      trans_record_fail: "Error while creating transaction record.",
      check_rate_succ: "Record created successfuly",
      check_rates_fail: "Record creation failed",
      check_rates_fail1: "The selected currency already exist",
      check_rates_fail2: "Please send valid data",
      check_rate_del_succ: "Record deleted successfuly",
      check_rate_del_fail: "Record not found ",
      duplicate_card_succ: "Card already added for this user",
      duplicate_card_fail: "Card not found",
      duplicate_card_query_err: "Error while fetching duplicate query error",
      invalidInput: "Invalid input data for add money to walet",
      transactionFailInsert: "Something went wrong , While inserting transation details",
      updateAccountFail: "Something went wrong , While updating account details",
      failurePayment: "Not a successfull transaction",
      paymentInsertFail: "Something went wrong , While inserting payments details",
      errorPayment: "Something went wrong ,Payment Failure",
      internalError: "Something went wrong , service side",
      currencyConverterError: "Something went wrong , Fail while currency convert",
      modelsuccess: 'Payment successfully done',
      modelfail: 'Payment failure',
      accounterror: `Error while updating account details`,
      accounterror2: `Error while inserting account details`,
      walleterror: `Fail to add walet amount`,
      exchangeSuccessMsg: 'Successfully exchanged',
      exchangeFailMsg: 'Unable to exchange',
      noAccountForCurrency: 'No account for this currency',
      noTransactions:'No Transactions Found',
      transactionSuccess:'Transaction Logs Fetched Successfully',
      requestFundsEmailSent: 'The counterparty has been notified of funds requested',
      requestFundsEmailNotSent: 'Could not send email',
      accountDoesNotExist: 'Account does not exist'
    },

    otp: {

      sendEmailError: "Problem While Sending otp through Email ",
      sendMobileError: "Problem While Sending otp through mobile ",
      checkValidMobile: "Please enter a correct mobile number ",
      checkEmailMobile: "Please enter email or mobile number",
      emailOtpSent: "Email Sent With Verification OTP",
      mobileOtpSent: "Message Sent With Verification OTP",
      otpsent: "OTP Sent , Please Varify",
      otpFailed: "Otp generation fail",
      otpVerified: "OTP already verified  ",
      otpExpire: "Your OTP Expired , Please request for new OTP",
      updateOtpFail: "Fail to update Otp_Status",
      otpVerifiedTrue: "OTP Successfully Verified",
      otpVerifiedFalse: "OTP Verification Fail",
      checkInput: "Please, enter a correct 6-digit code",
      checkOtp: "Please check your Otp, and Try again",
      mobile_exit: "Mobile number is already registered",
      email_exit: "Email is already registered"
    },

    mockingConfig: {
      success: "Sandbox user fetched successfully",
      fail: "Fail to retrive Sandbox user",
      paymentDataSuccess: "Payment details fetched successfully",
      paymentDataFail: "Payment details not found",
      paymentDataError: "Error while fetching payment details"
    },

    kycEntry: {

      success: "Successfully stored",
      fail: "Failed to store",
      failcase: "No data found",
      modelsuccess: 'Successfully fetched user details',
      error: 'Error while getting user details'

    },

    kyc: {
      pending: 'Please wait we are verifying your profile.',
      successStatus: 'KYC status is Success',
      cancel: 'Your KYC is canceled. Contact admin support team',
      failedStatus: 'KYC status is failed',
      operationError: `Update kyc failure `,
      serverResponseError: `No data response from muse PV-600`,
      noDataError: `No data found with selected user `,
      apiError: `Failure for api response `,
      inputError: `User invalid `,
      authError: `You are unauthorized`,
      headerError: `Please provide authorization header`,
      internalError: `Somthing went wrong while getting response`,
      internalKYCError: `IdentId is undefined`,
      dashboardError: `Dashboard Failure , while update status`,
      emptyResponse: `Data response empty`,
      statusMessage: `Status successfuly return`,
      invalidInput: `Input details validation failure`,
      successKyc: `Successfully return kyc details`,
      updateSuccess: `Identity process status response updated`,
      updateFail: `Identity process status response updation failure`,
      businessTypeFail: `Business type process status response updation failure`,
      shareHoldersSuccess: `Return shareholders details successfully`,
      shareHoldersFail: `No shareholder found here, please add at least on shareholder`,
      invalid_kyc: 'KYC is not completed',
      card_fail : `Your KYC verification failed. Please, contact eWallet support team`,
      emailSent: `kyc status email sent successfully`,
      abort: `User abort while waiting`,
      dbError: `Something went wrong PV-800`
    },

    ident: {
      success: `IdentId already exit `,
      successIdent: `Identity response successfull`,
      failure: `IdentId not exit `,
      error: `Failure for api response `,
      authError: `You are unauthorized`,
      sanctionError: `Your KYC not procced, Due to Sanction detected`,
      kycError: `Your KYC not procced, Due to identity token expire please request again`,
      noDataError: `No data found with selected user `,
      headerError: `Please provide authorization header`,
      internalError: `Something went wrong while getting response`,
      operationError: `Update kyc failure `,
      internalErrorUpdate: `Something went wrong , While updating kyc details`,
      invalidInput: `Input details validation failure`,
      kycInProcess: `You already submitted kyc proccess`,
      userNotFound: `Applicant not found`
    },

    email: {
      success: ``,
      failure: `Problem while sending OTP through email `,
      successMessage: `Hi, your verification process has been SUCCESSFUL. Congratulations! Welcome to eWallet.`,
      failedMessage: `Hi, unfortunately your verification process was UNSUCCESSFUL. Please try again or contact our customer support team over live-chat`,
      notfound: `Hi, unfortunately your verification COULD NOT BE COMPLETED. Please try again or contact our customer support team over live-chat`,
      fraudSuspicion: `Hi, your verification process has been UNSUCCESSFUL due to documentation errors. Please contact our customer support team over live-chat, we will help`,
      pending: `Hi, your verification process is pending. Please give us a little while to complete the process`
    },

    mobile: {
      success: `Status send to mobile number `,
      failure: `Problem while sending OTP through mobile `
    },
    notification: {
      success: `Status success while send email and mobile `,
      failure: `Status fail while send email and mobile `,
      internalError: `Fail to send notification`
    },
    currency: {
      success: `Data found`,
      fail: `No data found`,
      success1: `Record deleted successfully`,
      fail1: `Record not found`,
      fail2: `Please send valid data`,
      fail3: `No data found,Please add currency`,
      fail4: `Please add another currency`,
      fail5: `Currency already selected`,
      fail6: `From currency and to currency can not be same`,
      fail7: `Same exchange record exists`,
      fail8: `Same alert rate record exists`
    },

    update: {
      success: `Updated successfully`,
      fail: `Unable to update`,
      error: `Record is not existed.unable to update`,
      info: `Please send valid data`

    },

    insert: {
      success: `Currency account created successfully.`,
      alredy_exist: 'Currency account already exist for the user.',
      fail: `Unable to insert`,
      error: `Record is already existed.unable to insert`,
      peer_contact: " Record Updated",
      applicant_id_not_found: "application Id not found",
      error1: `Please send valid data`,
      error2: `Please,Enter contact details first`,
      error3: `Something went wrong`
    },
    get: {
      success: `Address Details found`,
      fail: `Data not found`,
      error: `Please give valid id`,
    },
    error: {
      error: `Connected Error`,
      invalid_user: `The user access has been revoked`,
      ErrorHandler: "Something Went Wrong",
      Exception:`Something went Wrong Please Try again after Sometime`,
      insertError: "error while insert the data",
      getError: "error while getting data",
      updateError: "error while updating the data",
      noRecordFound: "No records found",
      contactError: "contactId doesn't exist for given businessId"
    },

    businessOwner: {
      ErrorHandler: "Something went wrong",
      success: "Registered successfully.",
      contactEmpty: "No results found with selected user",
      fail: "BusinessOwner Registration failed.",
      dberror: "Error in connection",
      getDirectorError: "Unable to get director details ",
      recordNotFound: "no record found ",
      connectionError: 'Connection Error',
      getshareHolderError: "Unable to get shareholder details ",
      directorAdded: "Director added ",
      shareholdercumdirector: "Director also made shareholder",
      businessOwner: "Business owner  added ",
      updateError: "Business owner not found for update status",
      company_not_found: `Company not found `,
      country_notfound: `Please provide the country `,
      company_already_exist: `Company already registered with applicant (token).  `,
      deleteError: "Unable to delete",
      deleteSuccessfully: "Document deleted successfully",
      shareholderAdded: "Shareholder added",
      deleted: "Deleted successfully",
      emailExists: "An account with that email already exists",
      inputPercentageError: "Shareholder percentage must be in integer ",
      percentageError: `Maximum percentage exceeded to add `,
      errorShareholderRange: "Percentage of shareholder could not greater than 100",
      errorPercentage: "Sum Of percenatge of shareholder or owner could not greater than 100",
      successPercentage: "Sum of the percentage is lessthan or equal to  100",
      already_added: 'Business email already used for another shareholder/director',
      directorEmail: 'Business email already used for another shareholder/director',
      business_reg_error: "Error while registering business without kyb.",
      StakeholderSuccess: 'Stakeholders details fetched successfully',
      StakeholderFail: 'Stakeholders details not found',
      updatebusinessOwnerStatusSuccess: 'Status updated',
      registeredBusiness: 'Already registered business',
      ownerSuccess: 'Updated successfully',
      businessFail: 'There is no business found',
      kybidFail: 'Failure fetching kyb business',
      alertmsg:'Please add business owner',
      emailExist:'E-mail already exist',
      directorTryingToBeShareholderWithDiffName: 'A director registered with the same email id is trying to be a shareholder with a different name. Please put in the right details'
    },
    businessOwnerList: {
      success: "Fetched business owners",
      fail: "Fail to fetch business owners.",
      success1: "Business owners empty."
    },
    moneyTransfer: {
      req_objerr: 'Error in request object. Please check the keys in request object.',
      no_account_found: 'Recipient curreny wallet not found. Please make sure recipient is a eWallet user and has required currency account.',
      exchangeError: 'Error occured while getting exchange rates from MUSE platform'
    },
    businessOwnerContact: {
      success: "Business owner contact success",
      kyb_status: "KYB status fetched successfully",
      fail: "Fail to fetch business owner contact.",
      success1: "Business owner contact not exist.",
      ownerFail: "No Business owner exist.",
      ownerAddressFail: "No Business owner address exist.",
      businessId_not_found: "Business id not found"
    },
    businessApplicant: {
      fail: "Error While insert businessApplicant ."

    },
    businessContact: {
      fail: "Error While insert businessContact .",
      selectFail: "Error While selecting businessContact ."
    },
    address_type: {
      success: "Address_type fetched successfully.",
      businessAddressSuccess: "Address inserted successfully",
      businessAddressFail: "Fail to insert address",
      businessAddress: "Address mismatch , please provide valid details"
    },

    accountStatus: {
      success1: `Currency account Activated`,
      success2: `Currency account Dectivated`,
      getAccount: `Account details fetched successfully`,
      fail: `Unable to fetch account`,
      error: `Error `,
      account_notfound: " Currency accounts not found for the user.",
      defultAccError: 'You cannot deactivate default currency account.'
    },
    logger: {
      updateSuccess: 'Logger values updated successfully',
      updateFail: 'Logger values updation fail',
      internalError: 'Something went wrong while getting response',
      invalidInput: `Input details validation failure`,
    },
    token: {
      tokenExpired: "Your token expired, please login again",
      invalid: "Please provide valid token"
    },
    setting: {
      no_personal_data: 'No user data found. Please check the auth token',
      data_found: 'Personal data found',
      businessNotFound: 'No registered business found for the user.',
      businessProfileNotFound : 'No business profile found for the user.',
      businessAddressNotFound : 'No business address found for the user.',
      businessStructNotFound : 'No business structure found for the user.',
      businessProfileSucc: 'Business profile details fetched successfully.',
      passSucc: `Password updated successfully`,
      passMismatch: `Given password is a missmatch`,
      privacySuccess: ` privacy notifcations updated successfully`,
      privacyFail: ` privacy notifications not changed`,
      getPrivacySuccess: `successfully fetched privacy notifications`,
      getPrivacyFail: `failed to fecth privacy notifications`,
      deactiveStatus: `Your account  is Deactivated`,
      activeStatus: `Your account  is activated`,
      accountFail: `Failed to deactivate`,
      update_personalSetting: `Personal profile updated successfully`,
      update_personalSettingFail: `Personal profile not updated`,
      account_notfound: " Currency accounts not found for the user.",
      defultAccError : 'Can not delete default currency account Euro (EUR).',
      updatePin_success:'PIN has been updated successfully',
      updatePin_fail:'passcode pin not changed',
      pinMismatch:'entered old_passcode is invalid',
      plan_success:'successfully fetched user plans',
      plan_fail:'failed to  fetch user plans',
      newPlan_success:'user plans inserted successfully',
      newPlan_fail:'failed to insert user plans',
      newPlan_fail1:'count',
      description: 'Your plan includes allowances and features'
    },
    contact: {
      contactSuccess: "Contact inserted successfully",
      contactFail: "Fail to insert contact",
      getContactSuccess: " Contact details found",
    },
    countrparty: {
      getSuccess: `Successfully get the results`,
      getFail: `No data found`,
      success: `Successfully created`,
      success1: `successfully deleted`,
      moneySent: 'Money sent. User will recieve money, once he registers and finishes KYC on eWallet.',
      fail: `failed to create a counterParty`,
      fail1: `Invalid data`,
      fail2: `CounterParty already exist in your wallet`,
      fail3: `failed to delete`,
      fail4: `Email/Mobile already exists as a eWallet-user. Please enter valid name`,
      info: `No data found`,
      counterPartyFailInfo: `No data found with counterParty`,
      getaccountsFailInfo: `No accounts found`,
      bulkPaymentTotal: `Bulk payments total converted succcessfully`
    },
    bulkTransfer: {
      invalidTransArray: "Invalid bulk transfer array. Please chek the array_of_transaction key.",
      bulkTransferSucc: "The bulk transfer request has been successfully completed.",
      countryPartyNotAdded : `Please add the receipient user as your countryparty before making a payment.`,
      transHisError : `Error occured while creating a transaction history record.`,
      nonPayvooTransaction: `Bulk transfer failed`,
      lowBal: `Insufficient balance.`,
      resetPush: `Successfully reset`
    },
    sandbox:{
      nodataFound :`No Data Found matching the given memberID and ApiKey`,
      no_account_found:`Selected Account Not Found`,
      sandbox_authentication_success : `Successfully Authenticated`,
      error:`Something went wrong while saving details`,
      nodetailsfound:`Error while fetching user details`,
      detailsfetchedsuccess:`Order Details Fetched Successfully`,
      countryPartyNotAdded: `Please add the receipient user as your countryparty before making a payment.`,
      transHisError: `Error occured while creating a transaction history record.`,
      lowBal: `Insufficient balance.`
    },
    schedulrTrans: {
      scheduleTransSucc: `PAYMENT SCHEDULED. {0} PAYMENTS FOR A TOTAL OF {1} {2} SCHEDULED FOR {3}`,
      pastDateError: `Invalid scheduled transfer date. Only future date allowed.`,
      succTrans: `eWallet informs you that on {0}, {1} made a transfer of {2} {3} to your eWallet{4} account.
      \n\nTransaction reasons: {5}`,
      insuffiBal: `eWallet would like to remind you that you have a scheduled payment with the following details : {0} {1}, {2}. At the moment there are no sufficient funds in your {3} account. Please, top-up money to complete the payment on the scheduled time."`,
      deletSucc : `Schedule transfer record deleted successfully.`,
      deleteError : `Error occured while delering schedule transfer record.`
    },
    business_settings: {
      getBusinessRole: `Defined business role fetched successfully`,
      getInvitedBusinessRoles: `Invited business roles fetched successfully`,
      noInvitedUsers: `No users are invited yet.`,
      getRoleErr: `No role found for the business.`,
      noBusinessId: `No registered business found for the user.`,
      roleExist: `Desired role is already defined for the business.`,
      roleCreateSucc: `Business role added successfully.`,
      roleCreateErr: `Error occured while creating business role.`,
      roleUpdate: `Role updated successfully.`,
      roleUpdateError: `Error occured while updating role.`,
      roleDeleteErr: `Error occured while deleting role. Please make sure you are passing the correct role_id.`,
      roleDeletSucc: `Role deleted successfully.`,
      roleMapSucc: `User added to business successfully.`,
      rolemapErr: `Error occured while mapping the user to the business. Make sure business has the corresponding role.`,
      emailAlready: `Email already added to the business`,
      emailText: `Your are invited to eWallet. Please register to eWallet by using this e-mail id.`,
      mappedUserSucc: `Business users fetched successfully.`,
      errormapUser: `Error occured while fetching business users.`,
      noMappedUserFound: `No user found`,
      aclAddError:'Error occured while adding ACL'
    }
  }
}
