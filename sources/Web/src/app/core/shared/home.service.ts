/**
* home service
* Allow you to define code that's accessible and reusable throughout multiple components.
* @package HomeService
* @subpackage app\core\shared\homeservice
* @author SEPA Cyber Technologies, Sayyad M.
*/
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { HttpclientService } from './httpclient.service'
import { HttpUrl } from './httpUrl.component'
import { HttpClient, HttpHeaders } from '@angular/common/http';




@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private userDataUpdateInApp =  new BehaviorSubject([]);
  senderDetails = new BehaviorSubject([]);
  private isKybCompleted = new BehaviorSubject(false);
  private userData;
  userDetails = new ReplaySubject(8);
  userEmail = new BehaviorSubject([]);
  transaction = new BehaviorSubject([]);
  bulkPayments = new BehaviorSubject([]);
  paymentRequest = new BehaviorSubject([]);
  bulkPaymentsB = new BehaviorSubject([]);
  bulkData = new BehaviorSubject([]);
  setcsv = new BehaviorSubject(false);
  private headers;
  private options;

  setIsKybCompleted(value: boolean) {
    this.isKybCompleted.next(value);
  }

  getIsKybCompleted() {
    return this.isKybCompleted as Observable<boolean>;
  }

  
  setBulkPaymentsData(value: any) {
    this.bulkData.next(value);
  }

  getBulkPaymentsData() {
    return this.bulkData as Observable<any>;
  }

  setPaymentRequest(value: any) {
    this.paymentRequest.next(value);
  }

 

  getPaymentRequest() {
    return this.paymentRequest as Observable<any>;
  }

  setBulkPayments(value: any) {
    this.bulkPayments.next(value);
  }

  getBulkPayments() {
    return this.bulkPayments as Observable<any>;
  }

  setBulkPaymentsBalance(value: any) {
    this.bulkPaymentsB.next(value);
  }

  getBulkPaymentsBalance() {
    return this.bulkPaymentsB as Observable<any>;
  }

  setUserDetails(value: any) {
    this.userDetails.next(value);
  }

  getUserDetails() {
    return this.userDetails as Observable<any>;
  }

  broadcastNewUserData(data) {
    this.userDataUpdateInApp.next(data);
  }

  getSenderDetails() {
    return this.senderDetails as Observable<any>;
  }

  setSenderDetails(value: any) {
    this.senderDetails.next(value);
  }

  setCsv(value: any) {
    this.setcsv.next(value);
  }

  getCsv() {
    return this.setcsv as Observable<any>;
  }

  setEmail(value: any) {
    this.userEmail.next(value);
  }

  getEmail() {
    return this.userEmail as Observable<any>;
  }

  recieveUpdatedUserData() {
    return this.userDataUpdateInApp as Observable<any>;
  }

  constructor(private dataClient: HttpclientService, private http: HttpClient) {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    if (this.userData) {
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json'       
      });
      this.options = {
        headers: this.headers,
      };
    }
  }

  SubmitForKYC(obj): Observable<any> {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers
    }
    return this.http.post(HttpUrl.Ident_Id,obj,options);
  }

  Bus_SubmitForKYC(applicantId): Observable<any> {
    this.userData = JSON.parse(sessionStorage.getItem('userData'))
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers,
    }
    var obj = { applicant_id: applicantId };
    return this.http.post(HttpUrl.Ident_Id, obj, options);
  }




  IdentId(obj): Observable<any> {
    this.userData = JSON.parse(sessionStorage.getItem('userData'))
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'     
    });
    let options = {
      headers: headers,
    }

    return this.http.post(HttpUrl.Ident_Id, obj, options);
  }

  Bus_SubmitForKYCInvitaion(appId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers,
    }
    var obj = { applicant_id: appId };
    return this.http.post(HttpUrl.Ident_Id, obj, options);
  }
  getKYCStatus( obj): Observable<any> {

    this.userData = JSON.parse(sessionStorage.getItem('userData'))
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers,
    }
   return this.http.post(HttpUrl.KYC_Status,obj,options);
  }

  KYClinkToMobile(mobile, email, mobilePlatform, identId): Observable<any> {
    return this.dataClient.get(HttpUrl.KYC_Link + '/' + mobile + '/' + email + '/' + mobilePlatform + '/' + identId);
  }

  //business

  submitBusinessAddr(formData) {
    return this.dataClient.post(HttpUrl.business_Addrress, formData);
  }
  submitAddr(formData) {
    return this.dataClient.post(HttpUrl.business_Personal_Addrress, formData);
  }
  updateAddress(formData) {
    return this.dataClient.put(HttpUrl.Bus_Addr_Reg, formData);
  }

  submitAddress(formData) {
    return this.dataClient.post(HttpUrl.Bus_Addr_Reg, formData);
  }

  submitBusinessAddress(formData) {
    return this.dataClient.post(HttpUrl.BusOwnerAddress, formData);
  }

  updateBusinessAddress(formData) {
    return this.dataClient.put(HttpUrl.BusOwnerAddress, formData);
  }

  getBusSectorTypes() {
    return this.dataClient.get(HttpUrl.Bus_Sectors_Types);
  }
  submitBusTypes(formData) {
    return this.dataClient.post(HttpUrl.Save_Bus_Types, formData);
  }
  transcationVolume(formData) {
    return this.dataClient.post(HttpUrl.Trnascation_Volume, formData);
  }

  insertKYB() {
    return this.http.post(HttpUrl.Insert_KYB, '');
  }
  getKYBStatus() {
    return this.dataClient.get(HttpUrl.KYB_Status);
  }
  getKYBshareholderStatus(id) {
    return this.dataClient.get(HttpUrl.kyc_shareholder+'/'+id);
  }

  getDirectorsById(id) {
    return this.dataClient.get(HttpUrl.Directors_Details_ByID + '/' + id)
  }


  getUpdatedStatus(obj) {
    return this.dataClient.patch(HttpUrl.Update_KYB_Status, obj);
  }
  getBusinessIndustries() {
    return this.dataClient.get(HttpUrl.Business_Industries);
  }
  receivesendFromCountry(obj) {
    return this.dataClient.post(HttpUrl.Send_Receive_Payment, obj);

  }
  getDirectors(type) {
    return this.dataClient.get(HttpUrl.DirectorsShareHolder_Details + '/' + type)
  }
  finishActivation() {
    return this.dataClient.get(HttpUrl.finishActivation);
  }
  getShareHolders(bus_id, type) {
    return this.dataClient.get(HttpUrl.DirectorsShareHolder_Details + '/' + bus_id + '/' + type)
  }
  getAllList(type) {
    return this.dataClient.get(HttpUrl.DirectorsShareHolder_Details + '/' + type)
  }
  addDirShrHolder(obj) {
    return this.dataClient.post(HttpUrl.DirectorsShareHolder_Details, obj);
  }

  updateDirShrHolder(obj) {
    return this.dataClient.put(HttpUrl.DirectorsShareHolder_Details + '/' +obj.id, obj.list[0]);
  }

  submitPersonalDetails(obj) {
    return this.dataClient.post(HttpUrl.PersonalDetails, obj);
  }

  createBusinessOwner(obj) {
    return this.dataClient.post(HttpUrl.Create_BusinessOwner, obj);
  }

  updateContact(obj) {
    return this.dataClient.post(HttpUrl.Update_Contact, obj);
  }

  IsVerifiedDirOwnr(obj) {
    return this.dataClient.patch(HttpUrl.DirectorsShareHolder_Details, obj);
  }
  deleteOwner(id, type) {
    return this.dataClient.delete(HttpUrl.DirectorsShareHolder_Details + '/' + id + '/' + type);
  }
  sendRegisterdAddressDocument(obj) {
    return this.dataClient.post(HttpUrl.Reg_Document, obj); //supporting documentation
  }
  getRegisterdAddressDocument() {
    return this.dataClient.get(HttpUrl.Doc_Status); //supporting documentation get by id
  }
  getRegisterdDetails() {
    return this.dataClient.get(HttpUrl.business_Addrress); //get registered details
  }

  getVerifyIdentiesInformation() {
  return this.dataClient.get(HttpUrl.getVerifyIdentiesInformation); //get registered details
}

  getPersonalAddressDetails() {
    return this.dataClient.get(HttpUrl.business_Personal_Addrress); //get registered details
  }

  getDocumentsStatus(id) {
    return this.dataClient.get(HttpUrl.Document_Status + '/' + id);
  }

  getshreDirectorcontact(obj) {
    return this.dataClient.post(HttpUrl.business_conat_shre_dire, obj); //get shareholder dirctor contact data
  }
getshreDirectorAdress(obj) {
    return this.dataClient.post(HttpUrl.business_address_shre_dire, obj); //get shareholder dirctor adddress data
  }
  getDocStatus() {
    return this.dataClient.get(HttpUrl.Doc_Status); //get registered details
  }
  sendInvitationLink(obj) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers,
    }

    return this.http.post(HttpUrl.Send_Invitation,obj,options); //send invitation link
  }
  submitCard(obj) {
    return this.dataClient.post(HttpUrl.Cards_Details, obj); //save card details
  }
  getCardDetails() {
    return this.dataClient.get(HttpUrl.Cards_Details); //get card details
  }
  deleteCard(obj) {
    return this.dataClient.patch(HttpUrl.Cards_Details, obj); //update card details
  }
  CreateAccount(data) {
    return this.http.post(HttpUrl.Account_Details, data);
  }

  getAccount(data) {
    return this.http.get(HttpUrl.Account_Details + '/' + data);
  }

  // Exchange api's start @sirisha
 getcurrency(targetCurrency,fromCurrency,fromAmount){
  return this.http.get(HttpUrl.Auto_Currency_Exchange+'/'+targetCurrency+'/'+fromCurrency+'/'+fromAmount);
  // return this.http.get(`${environment.serviceUrl}`+"/service/v1/currencyExchange/"+targetCurrency+'/'+fromCurrency+'/'+fromAmount);
}
getAccountById(){
  return this.http.get(HttpUrl.Account_Details);
}
createTransactionByCurrency(obj){
  return this.http.post(HttpUrl.transactionDetails,obj);
}
createCurrencyConvertor(obj){
  return this.http.post(HttpUrl.currency_Rate,obj);
}

getRateTimeSeries(from,to): Observable<any>{
  return this.http.get(HttpUrl.rateHistory+'/'+from+'/'+to);
}

getMultipleRateTimeSeries(from,toArray): Observable<any>{
  return this.http.get(HttpUrl.rateMultipleHistory+'/'+from+'/'+toArray);
}

createSetAlertPrice(obj){
  //  return this.http.post(HttpUrl.Auto_Currency_Exchange,obj);
  return this.http.post(HttpUrl.priceList_Details,obj);
}
getCountryDetails(): Observable<any> {
  return this.dataClient.get<any>(HttpUrl.Countries_Details);
}
getPersonalInfo(){
  return this.dataClient.get<any>(HttpUrl.getPersonalProfile);
}
getAllCountryDetails(): Observable<any> {
  return this.dataClient.get<any>(HttpUrl.All_Countries_Details);
}

getCurrencyList(): Observable<any> {
  return this.dataClient.get<any>(HttpUrl.Curreyncy_List);
}
CreateCurrencycheckRate(obj){
  return this.http.post(HttpUrl.check_Rate,obj);
}
transactionById(applicant_id){
  return this.http.get(HttpUrl.transactionDetails+'/' +applicant_id+'/'+ 'all');
}
currenceExchangedByConvertor(obj){
  return this.http.post(HttpUrl.currency_Rate,obj);
}
deleteCurrencyRate(id){
  return this.http.delete(HttpUrl.currency_Rate+'/'+id);
}
// Exchange api's end @sirisha
getCurrency(){
  return this.dataClient.get(HttpUrl.Account_Details);
}

 currentRate(fCurrency,tCurrency,id)
 {
 return this.dataClient.get(HttpUrl.Auto_Currency_Exchange+'/'+fCurrency+'/'+tCurrency+'/'+id)
 }

   AddCurrMoney(obj): Observable<any> {
    this.userData = JSON.parse(sessionStorage.getItem('userData'))
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers,
    }
    return this.http.post(HttpUrl.Add_Money, obj, options);
  }

  sendEmail(email): Observable<any> {
    return this.http.post(HttpUrl.Send_Sandbox_Email, email);
  }

  storeAppIdforKYC(obj): Observable<any> {
    return this.dataClient.post(HttpUrl.Store_AppIdForKYC, obj); //ident id entry for kyc
  }
  autoCurrencyExhan(obj) {
    return this.dataClient.post(HttpUrl.Auto_Currency_Exchange, obj); //update card details
  }
  getAutoCurrencyData() {
    //return this.http.get(HttpUrl.Auto_Currency_Exchange);
    return this.http.get(HttpUrl.priceList_Details);
  }

  getAutoExchangeCurrencyData() {
    return this.http.get(HttpUrl.Auto_Currency_Exchange);

  }

  getAccounts(): Observable<any> {
    return this.dataClient.get<any>(HttpUrl.Account_Details);
  }
  getAllTransctionList(): Observable<any> {
    return this.dataClient.get<any>(HttpUrl.Transcation_Details);
  }
  getFilteredTransctionList(obj): Observable<any> {
    return this.dataClient.post<any>(HttpUrl.Filtered_Transcation_Details, obj);
  }

  getSelectedTransctionList(currency_type, device_type): Observable<any> {
    return this.dataClient.get<any>(HttpUrl.Selected_Transcation_Details + '/' + currency_type + '/' + device_type);
  }

  cancelRequest(obj): Observable<any> {
    return this.dataClient.patch<any>(HttpUrl.CancelRequest, obj);
  }

  acceptRequest(obj): Observable<any> {
    return this.dataClient.patch<any>(HttpUrl.AcceptRequestFunds, obj);
  }

  declineRequest(obj): Observable<any> {
    return this.dataClient.patch<any>(HttpUrl.DeclineRequestFunds, obj);
  }

  statusCurrency(): Observable<any> {
    return this.dataClient.get<any>(HttpUrl.Status_Currency);
  }
  getStatement(obj): Observable<any> {
    const httpOptions: Object = {
      responseType: 'blob'
    };
    return this.http.post<any>(HttpUrl.getStatement,obj, httpOptions);
  }

  getStatementPdf(obj): Observable<any> {
    const httpOptions: Object = {
      responseType: 'blob'
    };
    return this.http.post<any>(HttpUrl.getStatementPdf,obj, httpOptions);
  }
  createAccount(obj): Observable<any> {
    return this.dataClient.post(HttpUrl.Account_Details, obj); //ident id entry for kyc
  }
  ActiveDeactiveacocunt(obj) {
    return this.dataClient.patch(HttpUrl.Account_Details, obj);
  }

  industryStatus() {
    return this.dataClient.get(HttpUrl.KYB_Status, ''); //industry status
  }
  getAccountsCurrency() {
    return this.dataClient.get(HttpUrl.Curreyncy_List); //account currency
  }
  getValidCardDetails(cardNumber) {
    return this.dataClient.get(HttpUrl.Card_Validate + '/' + cardNumber); //card validation
  }
  deleteAutoExchangeRecord(id) {
    return this.dataClient.delete(HttpUrl.Auto_Currency_Exchange + '/' + id);

  }
  deletepriceAlertRecord(id) {
    return this.dataClient.delete(HttpUrl.priceList_Details + '/' + id);

  }

  postCouterparty(obj):Observable<any> {  // Add counterparty in single and bulk
    return this.dataClient.post(HttpUrl.Add_CouterPaty, obj);
  }

  verifyStatus(): Observable<any> {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'      
    });
    let options = {
      headers: headers,
    }
    return this.http.get(HttpUrl.Verify_KYC, options);
  }

  // get BUSINESS Business Settings

  getBusinessSettings() {
    return this.dataClient.get(HttpUrl.Business_Settings);
  }
  getStructureOfBusinessData() {
    return this.dataClient.get(HttpUrl.StructureOfBusinessList);
  }
  getBusinessUsers(){
    return this.dataClient.get(HttpUrl.businessUsers);
  }
  getInvitedBusinessUsers() {
    return this.dataClient.get(HttpUrl.invitedBusinessUsers);
  }

  //get Business PersonalDetails
  getPersonalDetails() {
    return this.dataClient.get(HttpUrl.getPersonalDetails); //get personal details
  }
  //Change Password
  changePassword(changePasswordObj: object) {
    return this.http.post(HttpUrl.changePassword, changePasswordObj); //change Password
  }
  data: boolean = true;
  settingSideNav(data) {
    this.data = data;
  }

  //Business Login Plans
  getPlans(){
    return this.http.get(HttpUrl.getBusinessPlans); //get Business plan details
  }
  closeAccount(data){
    return this.http.patch(HttpUrl.accountDeactivate,data);
  }
  getRoles() {
    return this.http.get(HttpUrl.getBusinessRoles);
  }
  createRole(data){
    return this.http.post(HttpUrl.createRole,data);
  }
  mapUserToBusiness(data){
    return this.http.post(HttpUrl.mapUserToBusiness,data);
  }
  //individual login Personal Details

  //update Edited Details
  updatePersonalDetails(updatedata : object){
    return this.http.patch(HttpUrl.updatePersonalData, updatedata);
  }
  changePin(changedpin : object){
    return this.http.patch(HttpUrl.changedpin, changedpin);
  }

  getCounterParty(){
    return this.http.get(HttpUrl.counterParty, this.options);
  }
  getCounterPartyCurrencyList(id) {
    return this.http.get(HttpUrl.counterPartyCurrencyList+'/'+id, this.options)
  }
  singleTransfer(obj) {
    return this.http.post(HttpUrl.singleTransfer,obj)
  }
  getSheduleTransfers() {
    return this.http.get(HttpUrl.shedule_transfer_list);
  }
  deleteSheduleTransfers(obj) {
    return this.http.post(HttpUrl.shedule_transfer_delete,obj)
  }
  getPrivacyNotificationSettings() {
    return this.http.get(HttpUrl.getPrivacyNotificationSettings);
  }
  updatePrivacyNotificationSettings(settings) {
    return this.http.patch(HttpUrl.patchPrivacyNotificationSettings, settings);
  }

  requestFunds(details) {
    return this.http.post(HttpUrl.RequestFunds, details);
  }

  requestFundsNonPayvooUser(details) {
    return this.http.post(HttpUrl.RequestFundsNonPayvoo, details);
  }

  getBulkPaymentsSampleTemplate(): Observable<any> {
    const httpOptions: Object = {
      responseType: 'blob'
    };
    return this.http.post<any>(HttpUrl.bulk_payments_sample, {}, httpOptions);
  }

  sendMoneyToNonPayvooUser(details) {
    return this.http.post(HttpUrl.payNonPayvooUser, details);
  }

  getNonPayvooPaymentDetails(unique_payment_id) {
    return this.http.get(`${HttpUrl.payNonPayvooUser}/${unique_payment_id}`);
  }
}
