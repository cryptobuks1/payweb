/**
* login gaurd
* Login Guard features are designed to protect login and authentication system against login attacks.
* @package LoginGuard
* @subpackage app\core\garuds\logingaurd
* @author SEPA Cyber Technologies, Sayyad M.
*/
import { AuthService } from '../shared/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate,Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private routerNavigate: Router
  ) { }
  canActivate(): boolean {

    if (JSON.parse(localStorage.getItem('redirect')) != true) {     

      if (this.authService.isAuthenticate() && this.authService.accountMatch(['personal'])) {
       //  this.routerNavigate.navigate(['/personal/accounts/getaccount']);
        return true;
      }

      if (this.authService.isAuthenticate() && this.authService.accountMatch(['business']) && !this.authService.veriFyloginOtp()) {
        //  this.routerNavigate.navigate(['home/business-application']);
        this.routerNavigate.navigate(['business/application']);
        return false;
      }
      
      if (this.authService.isAuthenticate() && this.authService.accountMatch(['sandbox'])) {
        this.routerNavigate.navigate(['sandbox']);
        return false;
      }
      
      if (this.authService.isAuthenticate() && this.authService.accountMatch(['notAccount'])) {
        return true;
      }

    } else {
    setTimeout(function () { localStorage.removeItem('redirect') }, 300);
    }
    return true;
  }
}
