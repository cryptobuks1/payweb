import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  constructor() { }
  emailS = new Subject()
  passwordS = new Subject()
  loggedIn = new BehaviorSubject(false)
}
