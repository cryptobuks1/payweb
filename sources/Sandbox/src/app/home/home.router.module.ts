

/**
* HomeModule
* routing of the home components based on the account types.
* @package HomeRoutes
* @subpackage app\home\HomeRoutes
* @author SEPA Cyber Technologies, Sayyad M.
*/
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/gaurds/auth.guard';
import { NgModule } from '@angular/core';
import { PaymentsGuard } from '../core/gaurds/payments.guard';
import { SandboxDashboardComponent } from './dashboard/sandbox-dashboard.component';


export const HomeRoutes: Routes = [
    {path:'',component:HomeComponent,
    children:[
      {path:'',component:SandboxDashboardComponent,canActivate:[AuthGuard],data:{userAccount:['sandbox']}},
    ]
   }]

@NgModule({
  imports: [RouterModule.forChild(HomeRoutes)],
  exports:[RouterModule]

})
   export class HomeRouterModule { }
