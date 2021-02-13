
/**
* auth gaurd
* This service injects AuthService and Router and has a single method called canActivate 
* @package AuthGuard
* @subpackage app\core\garuds\authgarud
* @author SEPA Cyber Technologies, Sayyad M.
*/
import { AuthService } from "../shared/auth.service";
import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate  {
  constructor(
    private authService: AuthService,
    private routerNavigate: Router
  ) {}

  canActivate(next:ActivatedRouteSnapshot,state:RouterStateSnapshot): boolean {
    if(!this.authService.isAuthenticate()) {
      return false;
    }
    return true;
  }
}

