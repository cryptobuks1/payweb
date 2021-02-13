import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from '../core/gaurds/login.guard';
import { PayvooComponent } from './personal-landing/payvoo.component';
import { PayvooBusinessComponent } from './business-landing/payvoo-business.component';

export const landingRoute: Routes = [
  {path:'',component:PayvooComponent,canActivate:[LoginGuard]},
  {path:'payvoo-personal',component:PayvooComponent,canActivate:[LoginGuard]},
  {path:'payvoo-business',component:PayvooBusinessComponent,canActivate:[LoginGuard]}
]

@NgModule({
  imports: [
    RouterModule.forChild(landingRoute)],
    exports:[RouterModule]
})
export class LandingrouteModule { }
