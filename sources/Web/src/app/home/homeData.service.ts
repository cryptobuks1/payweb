import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeDataService {

  private kybStatusSubject = new Subject<any>();
  private accountTypeSubject = new Subject<any>();
  private kybDone = new Subject<any>();
  private isRequestPayment = new BehaviorSubject<boolean>(false);
  setmobile = new BehaviorSubject('');

  public sendKYBStatus(count) {
    this.kybStatusSubject.next(count);
  }

  public receiveKYBStatus() {
    return this.kybStatusSubject as Observable<any>;
  }

  setMobile(value: any) {
    this.setmobile.next(value);
  }

  getMobile() {
    return this.setmobile as Observable<any>;
  }

  public isKYBDone(count) {
    this.kybDone.next(count);
  }

  public getisKYBDone() {
    return this.kybDone as Observable<any>;
  }

  public emitAccountType(accountType) {
    this.accountTypeSubject.next(accountType);
  }

  public receiveAccountType() {
    return this.accountTypeSubject as Observable<any>;
  }

  public setIsRequestPayment(value) {
    this.isRequestPayment.next(value);
  }

  public getIsRequestPayment() {
    return this.isRequestPayment as Observable<boolean>;
  }

  constructor() { }
}
