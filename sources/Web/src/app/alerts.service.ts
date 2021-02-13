import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private alertsSubject = new Subject<any>();

  public broadcastAlertCount(count) {
    this.alertsSubject.next(count);
  }

  public recieveAlertCount() {
    return this.alertsSubject as Observable<any>;
  }

  constructor() { }
}
