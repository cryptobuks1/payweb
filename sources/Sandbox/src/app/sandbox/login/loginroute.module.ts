import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SandboxloginComponent } from '../login/sandbox-login/sandbox-login.component';

export const loginRoute: Routes = [
  {path:'sandbox',component:SandboxloginComponent}
  
  ]

@NgModule({
  imports: [RouterModule.forChild(loginRoute)],
  exports:[RouterModule]

})

export class LoginrouteModule { }
