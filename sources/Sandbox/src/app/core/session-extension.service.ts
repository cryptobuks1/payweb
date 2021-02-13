import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

import { HttpUrl } from './shared/httpUrl.component';

@Injectable()
export class SessionExtensionService {

  sessionExpired = new Subject<any>();
  sessionExtensionDecision = new Subject<any>();

  constructor(private http: HttpClient) { }

  onSessionExpired(value) {
    this.sessionExpired.next(value);
  }

  getSessionExpiredNotification() {
    return this.sessionExpired as Observable<any>;
  }

  extendSession() {
    return this.http.post(HttpUrl.extendUserSession, {extend: true}, { headers: {
      'extend_session': 'true'
    }});
  }
}
