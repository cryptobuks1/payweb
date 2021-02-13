/**
* http interceptor
* Interceptors provide a mechanism to intercept and/or mutate outgoing requests or incoming responses, features like caching and logging.
* @package InterceptorsService
* @subpackage app\core\interceptors\interceptorservice
* @author SEPA Cyber Technologies, Sayyad M.
*/
import { Injectable } from '@angular/core';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor,HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';
import { NotificationService } from '../toastr-notification/toastr-notification.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/loader.service';
import { SessionExtensionService } from '../session-extension.service';


@Injectable()
export class InterceptorsService implements HttpInterceptor {
  userInfo: string;
  profileData: any;
  userData: any;
  apiCount = 0;
  constructor(private alert: NotificationService,
    private routerNavigate: Router,
    public loaderService: LoaderService,
    private sessionExtensionService: SessionExtensionService) {
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.show();
    this.apiCount++;
    req = req.clone({
      headers:  req.headers.set('content-type', 'application/json').set('x-auth-token',sessionStorage.getItem('x-auth-token')),
     // responseType: 'json',
    });
    return next.handle(req)
    .pipe(
      retry(1),
      tap(evt => {
        if (evt instanceof HttpResponse) {
          if (evt
            && evt.body
            && evt.body.message
            && (evt.body.message.toLowerCase().trim() === 'Your token expired, please login again'.toLowerCase().trim())) {
            this.sessionExtensionService.onSessionExpired(true);
          } else {
            this.apiCount--;
            this.apiCount <= 0 ? this.loaderService.hide() : this.loaderService.show();
            if (evt.body.code == 1 && evt.body.status == 2) {
              this.alert.warn(evt.body.message, true);
              this.userData = JSON.parse(sessionStorage.getItem('userData'));
              sessionStorage.clear();
              if (this.userData && this.userData.data.userInfo.account_type == "personal") {
                this.routerNavigate.navigate(["/personal/login"]);
                this.loaderService.hide();
                return false;
              }
              else if (this.userData && this.userData.data.userInfo.account_type == "business") {
                this.routerNavigate.navigate(["/business/login"]);
                this.loaderService.hide();
                return false;
              }
            } else if (evt.body.status === 0 && evt.body.data['status'] === 0) {
              this.loaderService.hide();
            }
          }
        }
    }),

      map((evt: any) => {
        if (evt
          && evt.body
          && evt.body.message
          && (evt.body.message.toLowerCase().trim() === 'Your token expired, please login again'.toLowerCase().trim())) {

          if (evt.body) {
            evt.body.status = 0;
            if (evt.body.data) {
              evt.body.data.status = 1;
            } else {
              evt.body['data'] = {
                status: 1
              };
            }
          } else {
            evt['body'] = {
              status: 0,
              data: {
                status: 1
              }
            };
          }
        }
        return evt;
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if(error.status == 2) {
          this.alert.error(error.message);
          if(this.userData.data.userInfo.account_type === 'personal') {
            this.routerNavigate.navigate(["/personal/login"]);
          } else if (this.userData.data.userInfo.account_type === 'business') {
            this.routerNavigate.navigate(["/business/login"]);
          }

        }
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}Message: ${error.message}`;
        }
        this.alert.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }
}


