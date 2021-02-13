import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SepaService } from './sepa.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(

    private routerNavigate: Router,
    private service:SepaService
  ) { }
  canActivate(): boolean {
    
      if (this.service.accountMatch()) {
         this.routerNavigate.navigate(['card']);
      
        return false;
      }
     return true;
  }
}
