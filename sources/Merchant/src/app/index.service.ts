/**
* Index Service
* Allow you to define code that's accessible and reusable throughout multiple components.
* @package IndexService
* @subpackage app\core\shared\indexservice
* @author SEPA Cyber Technologies, Sayyad M.
*/

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Notification, NotificationType } from './toastr-notification.model';  

import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class IndexService {
  public subject = new Subject<Notification>();  
  public keepAfterRouteChange = true;

  constructor(private http: HttpClient) { }

  registration(signUpData): Observable<any> {
    return this.http.post(`${environment.serviceUrl}service/user/registration`, signUpData);
  }

  error(message: string, keepAfterRouteChange = false) { 
    this.showNotification(NotificationType.Error, message, keepAfterRouteChange);  
}  
showNotification(type: NotificationType, message: string, keepAfterRouteChange = false) {  
  this.keepAfterRouteChange = keepAfterRouteChange;  
  this.subject.next(<Notification>{ type: type, message: message });  
} 

getCountryDetails(): Observable<any> {
  return this.http.get<any>(`${environment.serviceUrl}service/country`);
}

}