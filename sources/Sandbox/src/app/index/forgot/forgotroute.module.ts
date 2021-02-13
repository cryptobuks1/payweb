import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SandboxForgotComponent } from './sandbox-forgot/sandbox-forgot.component';

export const forgotRoute: Routes = [
  {path:'forgot',component:SandboxForgotComponent},
  {path:'sandbox/forgot/:id',component:SandboxForgotComponent},
]

@NgModule({
  imports: [RouterModule.forChild(forgotRoute)],
  exports:[RouterModule]
})

export class ForgotrouteModule { }
