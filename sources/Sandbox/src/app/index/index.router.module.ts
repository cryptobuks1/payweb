/**
* Index routes
* Routing configuration (features module)(lazy laoding) child components in index module
* @package Indexroutes
* @subpackage app\index\Indexroutes
* @author SEPA Cyber Technologies, Sayyad M.
*/

import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index.component';
import { LoginGuard } from '../core/gaurds/login.guard';
import { NgModule } from '@angular/core';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotComponent } from './forgot/forgot.component';




export const Indexroutes: Routes = [
    {path:'',component:IndexComponent,canActivate:[LoginGuard]},
    {path: 'sandbox', loadChildren: 'src/app/index/sandbox/sandbox.module#SandboxModule'

   }
]
@NgModule({
    imports: [RouterModule.forChild(Indexroutes)],
    exports:[RouterModule]

  })
     export class IndexRouterModule { }
