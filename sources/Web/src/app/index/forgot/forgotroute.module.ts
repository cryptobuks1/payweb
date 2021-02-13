import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessForgotComponent } from './business-forgot/business-forgot.component';
import { PersonalForgotComponent } from './personal-forgot/personal-forgot.component';
import { SandboxForgotComponent } from './sandbox-forgot/sandbox-forgot.component';

export const forgotRoute: Routes = [
  {path:'business',component:BusinessForgotComponent},
  {path:'personal',component:PersonalForgotComponent},
  {path:'personal/forgot/:id',component:PersonalForgotComponent},
  {path:'business/forgot/:id',component:BusinessForgotComponent},
  {path:'sandbox',component:SandboxForgotComponent},
  {path:'sandbox/forgot/:id',component:SandboxForgotComponent},
]

@NgModule({
  imports: [RouterModule.forChild(forgotRoute)],
  exports:[RouterModule]
})

export class ForgotrouteModule { }
