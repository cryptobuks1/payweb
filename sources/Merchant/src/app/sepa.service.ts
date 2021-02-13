import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SepaService {
  userData: any;
  sandbox = `${environment.serviceUrl}service/user/login`;

  constructor(private http: HttpClient) { }

  getOrderDetails(data) {
    return this.http.get(`${environment.serviceUrl}service/sandbox/getOrderDetails/` + data);
  }

  login(formData: any) {
    return this.http.post(`${environment.serviceUrl}service/user/login`, formData);
  }

  // merchantLogin(formData: any) {
  //   return this.http.post(`${environment.serviceUrl}service/user/login`, formData);
  // }

  getCards() {
    return this.http.get(`${environment.serviceUrl}service/v1/card`);
  }
  getAccount() {
    return this.http.get(`${environment.serviceUrl}service/sandbox/v1/account`);
  }

  addCard(data) {
    return this.http.post(`${environment.serviceUrl}service/sandbox/v1/card`, data);
  }
  getAccountByCurrency(data) {
    return this.http.post(`${environment.serviceUrl}service/sandbox/v1/getByCurrency`, data);
  }

  getValidCardDetails(data) {
    return this.http.get(`${environment.serviceUrl}service/v1/validateCard` + '/' + data);
  }
verifyKyc(){
  return this.http.get(`${environment.serviceUrl}service/kyc/verifyKyc`  )
}



  paywithPayvoo(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'barra ' + sessionStorage.getItem('Token'),
      'api_access_key': sessionStorage.getItem('api_access_key'),
      'member_id': sessionStorage.getItem('member_id'),
      'client_auth': sessionStorage.getItem('client_auth'),
    });
    let options = {
      headers: headers,
    }
    return this.http.post(`${environment.serviceUrl}service/sandbox/v1/payWithCard`, data, options);
  }

  accountMatch() {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    var userAccount = this.userData['data']['userInfo']['account_type'];
    if (userAccount > 0 && userAccount == 'sandbox') {
      return true;
    }
    else {
      return false;
    }
  }


  // ===================================================== MERCHANT ==============================================================


  getorderDetails(data) {
    return this.http.get(`${environment.serviceUrl}service/merchant/getOrderDetails/` + data);
  }

  getCustomerCards() {
    return this.http.get(`${environment.serviceUrl}service/v1/card`);
    // http://localhost:5001/service/v1/card
  }


  addCustomerCard(data) {
    return this.http.post(`${environment.serviceUrl}service/sandbox/v1/card`, data);
  }


  getValidCard(data) {
    return this.http.get(`${environment.serviceUrl}service/v1/validateCard` + '/' + data);
  }

  getCustomerAccount() {
    return this.http.get(`${environment.serviceUrl}service/v1/account`);
  }


  payWithPayvoo(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'barra ' + sessionStorage.getItem('Token'),
      'api_access_key': sessionStorage.getItem('api_access_key'),
      'member_id': sessionStorage.getItem('member_id'),
      'client_auth': sessionStorage.getItem('client_auth'),
    });
    let options = {
      headers: headers,
    }
    return this.http.post(`${environment.serviceUrl}service/merchant/v1/payWithCard`, data, options);
  }


  getExchangeRates(data){
  
    return this.http.get(`${environment.serviceUrl}service/v1/currencyExchange/`+`${data.fromCurrency}/`+`${data.toCurrency}/`+`${data.amount}`)
  }

  AddCurrMoney(obj): Observable<any> {
    this.userData = JSON.parse(sessionStorage.getItem('userData'))
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': 'barra ' + this.userData.data.Token,
      'api_access_key': this.userData.data.api_access_key,
      'client_auth': this.userData.data.client_auth,
      'member_id': this.userData.data.member_id,
    });
    let options = {
      headers: headers,
    }
    return this.http.post(`${environment.serviceUrl}service/payment/addMoney`, obj, options);
  }
}