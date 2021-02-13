/**
* http urls
* API list
* @package HttpUrl
* @subpackage app\core\shared\httpurl
* @author SEPA Cyber Technologies, Sayyad M.
*/

import { environment } from '../../../environments/environment';
export class HttpUrl {
  public static Login_PayVoo = `${environment.serviceUrl}service/user/login`;  //login to the application
  public static Logout_PayVoo = `${environment.serviceUrl}service/user/logout`;  //logout to the application
  public static Countries_Details = `${environment.serviceUrl}service/country`;  // get country details
  public static All_Countries_Details = `${environment.serviceUrl}service/globalCountry`;  // get all country details

  public static Sign_Up = `${environment.serviceUrl}service/user/registration`; // singup for personal
  public static Register_Business = `${environment.serviceUrl}service/businessRegistration`;
  public static Ident_Id = `${environment.serviceUrl}service/kyc/identity`; //submit profile for kyc varification
  public static Generate_OTP = `${environment.serviceUrl}service/generateOtp`; // create otp
  public static Verify_OTP = `${environment.serviceUrl}service/verifyOtp`; //otp varification
   public static KYC_Status = `${environment.serviceUrl}service/kyc/status`//get kyc status
  public static Verify_KYC = `${environment.serviceUrl}service/kyc/verifyKyc`//verify kyc
  public static Upload_Csv = `${environment.serviceUrl}service/v1/uploadCsv`;
  public static KYC_Link = `${environment.serviceUrl}service/downloadKycLink`//send kyc link to mobile
  public static Check_Duplicate = `${environment.serviceUrl}service/user/isUserExists`//send kyc link to mobile
  public static check_Rate=`${environment.serviceUrl}service/v1/checkRate`; // create checkrate record
  public static currency_Rate=`${environment.serviceUrl}service/v1/currencyRate`;//currency rate
  public static rateHistory=`${environment.serviceUrl}service/v1/getFixerDetails`;//getFixerDetails
  public static rateMultipleHistory=`${environment.serviceUrl}service/v1/getFixerMultipleCurrDetails`;//getMultipleFixerDetails
  public static Reg_Without_KYB = `${environment.serviceUrl}service/businessRegistrationWithOutKyb`;//business registration own company
  public static Business_Type = `${environment.serviceUrl}service/businessType`; //business type(business)
  public static Bus_Addr_Reg = `${environment.serviceUrl}service/address`; //all types of address save
  public static BusOwnerAddress = `${environment.serviceUrl}service/businessOwnerAddress` //handle businessowner details
  public static business_Addrress = `${environment.serviceUrl}service/businessAddress`; // save business address
  public static getVerifyIdentiesInformation = `${environment.serviceUrl}service/getVerifyIdentiesInformation`;
  public static business_Personal_Addrress = `${environment.serviceUrl}service/businessPersonalProfileAddress`; // save personal address
  public static Bus_Sectors_Types = `${environment.serviceUrl}service/sectorType`;//get business sectors type
  public static Save_Bus_Types = `${environment.serviceUrl}service/businessSectorIndustriesDetails`;//submit business types data
  public static Trnascation_Volume = `${environment.serviceUrl}service/transactionVolume`;//transcation volume
  public static KYB_Status = `${environment.serviceUrl}service/status`;//get dashbaord kyb status
  public static finishActivation = `${environment.serviceUrl}service/activate`;
  public static Insert_KYB = `${environment.serviceUrl}service/statusInsert`;//insert kyb status initially
  public static Update_KYB_Status = `${environment.serviceUrl}service/status`;//update kyb dashboard status
  public static Business_Industries = `${environment.serviceUrl}service/businessIndustries`;//get business industries
  public static Update_Contact = `${environment.serviceUrl}service/businessPersonalProfileContact`;//update contact
  public static Send_Receive_Payment=`${environment.serviceUrl}service/countryTransaction`;//send/receive payments
  public static DirectorsShareHolder_Details=`${environment.serviceUrl}service/businessOwners`;//get direcotrs details
  public static Directors_Details_ByID=`${environment.serviceUrl}service/businessOwnersById`;//get direcotrs details
  public static PersonalDetails=`${environment.serviceUrl}service/businessOwner`;//add personal details
  public static Create_BusinessOwner=`${environment.serviceUrl}service/createBusinessOwner`;//add personal details
  public static Doc_Status = `${environment.serviceUrl}service/uploadstatus`;//status of supporting documenets
  public static Reg_Document = `${environment.serviceUrl}service/upload`; // reg supporting  documentation
  public static Document_Status = `${environment.serviceUrl}service/documentStatus`;
  public static Send_Sandbox_Email = `${environment.serviceUrl}service/v1/sandBoxDetailsEmail`; //send email sandbox
  public static Forgot_Password = `${environment.serviceUrl}service/user/forgotPassword`; //forgot password
  public static Change_password= `${environment.serviceUrl}service/changePassword`; //change password
  public static Reset_Password = `${environment.serviceUrl}service/user/resetPassword`; //reset password
  public static Send_Invitation = `${environment.serviceUrl}service/sendInvitation`; //send invitation link
  public static Business_OwnerDetails = `${environment.serviceUrl}service/businessOwnerDetails`; //business owner details send invitaion link
  public static Cards_Details = `${environment.serviceUrl}service/v1/card`; //get card details
  public static Add_Money = `${environment.serviceUrl}service/payment/addMoney`; //add money
  public static RequestFunds = `${environment.serviceUrl}service/payment/requestFunds`; //requestFunds
  public static RequestFundsNonPayvoo = `${environment.serviceUrl}service/payment/requestFundsNonPayvoo`;
  public static Auto_Currency_Exchange = `${environment.serviceUrl}service/v1/currencyExchange`; //save/update card details
  public static Store_AppIdForKYC = `${environment.serviceUrl}service/user/kycEntry`; //stored applicant id for kyc
  public static Account_Details = `${environment.serviceUrl}service/v1/account`; //get account details
  public static Transcation_Details = `${environment.serviceUrl}service/v1/transfer/all/web`; //get currency with datewise
  public static CancelRequest = `${environment.serviceUrl}service/payment/cancelRequestFunds`;
  public static AcceptRequestFunds = `${environment.serviceUrl}service/payment/acceptRequestFunds`;
  public static DeclineRequestFunds = `${environment.serviceUrl}service/payment/declineRequestFunds`
  public static Status_Currency = `${environment.serviceUrl}service/v1/statusCurrency`; //currency status
  public static transactionDetails = `${environment.serviceUrl}service/v1/transfer/walletToWallet`; //without datewise
  public static Card_Validate=`${environment.serviceUrl}service/v1/validateCard`; // validating the card type
  public static Curreyncy_List =`${environment.serviceUrl}service/v1/currency`; //get currencies list
  public static Filtered_Transcation_Details = `${environment.serviceUrl}service/webTransactionDetails`; //get transaction details based on filter
  public static Selected_Transcation_Details = `${environment.serviceUrl}service/v1/transfer`; //get transaction details based on filter
  public static getStatement = `${environment.serviceUrl}service/getStatement`;
  public static getStatementPdf = `${environment.serviceUrl}service/getStatementPdf`;
  public static priceList_Details = `${environment.serviceUrl}service/v1/pricealert`; //get price alerts list

  public static Business_Settings = `${environment.serviceUrl}service/settings/businessProfile`; //get Business Settings list
  public static StructureOfBusinessList = `${environment.serviceUrl}service/businessOwners/all`; //get Structure Of Business(owners) List
  public static kyc_shareholder = `${environment.serviceUrl}service/kyc/shareholder/status`; //get shareholder status


  public static Search_CouterParty = `${environment.serviceUrl}service/v1/globalsearch/0/`; // CouterParty global search

  public static Add_CouterPaty = `${environment.serviceUrl}service/v1/counterparty`; // add couterParty in single and bulk paymemts

  public static counterParty= `${environment.serviceUrl}service/v1/counterparty`; // get counterparty list
  public static counterPartyCurrencyList= `${environment.serviceUrl}service/v1/counterPartyCurrency`; // get counterparty currency list
  public static singleTransfer = `${environment.serviceUrl}service/transfer/walletPayments`; // single transfer
  public static share_direct_token_data = `${environment.serviceUrl}service/token`; // get shareholder and dirctor data from token
  public static business_conatct_data = `${environment.serviceUrl}service/businessOwnersContact`;
  public static getPersonalProfile = `${environment.serviceUrl}service/businessPersonalProfileContact`; // get contact info
  public static business_conat_shre_dire = `${environment.serviceUrl}service/businessDetailsOfOwner`; // get contact info
  public static business_address_shre_dire = `${environment.serviceUrl}service/addressBusinessOwner`;  // get contact info
  public static shedule_transfer_list = `${environment.serviceUrl}service/scheduleTransfers`; // get shedule transfer list
  public static shedule_transfer_delete = `${environment.serviceUrl}service/deletScheduleTransfer`; // delete shedule transfer list
  public static bulk_payments_sample = `${environment.serviceUrl}service/payment/bulkPaymentTemplate`; // get bulk payments sample template


  public static getPersonalDetails = `${environment.serviceUrl}service/settings/personalProfile` ; //getPersoanlDetails
  public static changePassword = `${environment.serviceUrl}service/settings/changePassword` ; //Change Password


  public static updatePersonalData = `${environment.serviceUrl}service/settings/editPersonalProfile` ;//update Edited Personal Details

  public static changedpin = `${environment.serviceUrl}service/settings/changePasscode` ; //Change Pin

  public static getBusinessPlans = `${environment.serviceUrl}service/settings/plans`; //get business Plans

  public static accountDeactivate = `${environment.serviceUrl}service/setting/accountActivateOrDeactivate`; //get business Plans

  public static businessUsers = `${environment.serviceUrl}service/getBusinessUser`; //get All Business users
  public static invitedBusinessUsers = `${environment.serviceUrl}service/getInvitedBusinessUsers`; // get invited business users
  public static getBusinessRoles = `${environment.serviceUrl}service/businessRole`;
  public static createRole = `${environment.serviceUrl}service/createRole`; // create new role in business Login

  public static mapUserToBusiness = `${environment.serviceUrl}service/mapUserToBusiness`; // mapUserToBusiness role in business Login

  public static getPrivacyNotificationSettings = `${environment.serviceUrl}service/settings/privacyNotify`; // Gets the user's exisiting privacy notification settings
  public static patchPrivacyNotificationSettings = `${environment.serviceUrl}service/settings/privacy`; // Updates the user's exisiting privacy notification settings

  public static getFeatureToggleFlag = `${environment.serviceUrl}features`;
  public static payNonPayvooUser = `${environment.serviceUrl}service/transfer/nonPayvooUser`;

  public static extendUserSession = `${environment.serviceUrl}service/user/extendSession`;


}
