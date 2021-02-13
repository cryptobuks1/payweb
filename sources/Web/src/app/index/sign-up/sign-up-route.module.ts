import { NgModule } from '@angular/core';
import { PersonalSignupComponent } from './personal/personal-signup.component';
import { BusinessSignupComponent } from './business/business-signup.component';
import { BusinessRegisterComponent } from './business/business-register/business-register.component';
import { BusinessRegisterFormComponent } from './business/business-register-form/business-register-form.component';
import { SandboxsignupComponent } from './sandbox/sandboxsignup.component';
import { Routes, RouterModule } from '@angular/router';

export const singupRoute: Routes = [
  {path:'personal',component:PersonalSignupComponent},
  {path:'business',component:BusinessSignupComponent},
  {path:'signup/register',component:BusinessRegisterComponent},
  {path:'signup/reg-form',component:BusinessRegisterFormComponent},
  {path:'sandbox',component:SandboxsignupComponent}
]

@NgModule({
  imports: [RouterModule.forChild(singupRoute)],
  exports:[RouterModule]

})
export class SignUpRouteModule { }
