import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SandboxsignupComponent } from './sandbox/sandboxsignup/sandboxsignup.component';

export const singupRoute: Routes = [
  {path:'sandbox',component:SandboxsignupComponent}
]

@NgModule({
  imports: [RouterModule.forChild(singupRoute)],
  exports:[RouterModule]

})
export class SignUpRouteModule { }
