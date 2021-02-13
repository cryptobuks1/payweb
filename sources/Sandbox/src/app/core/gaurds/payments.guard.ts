import { AuthService } from '../shared/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpUrl } from '../shared/httpUrl.component';

@Injectable({
  providedIn: 'root'
})
export class PaymentsGuard implements CanActivate {

  constructor(private http: HttpClient) { }


  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return JSON.parse(sessionStorage.getItem('PAYMENTS_FEATURE')).isFeatureOn;
  }

}
