import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtpComponent } from './business-login/otp/otp.component';
import { PersonalLoginComponent } from './personal-login/personal-login.component';
import { BusinessLoginComponent } from './business-login/business-login.component';
import { SandboxloginComponent } from './sandbox-login/sandboxlogin.component';

export const loginRoute: Routes = [
  {path:'login',component:PersonalLoginComponent},
  {path:'login/otp',component:OtpComponent},
  {path:'login',component:BusinessLoginComponent},
  {path:'sandbox',component:SandboxloginComponent}
  
  ]

@NgModule({
  imports: [RouterModule.forChild(loginRoute)],
  exports:[RouterModule]

})

export class LoginrouteModule { }
