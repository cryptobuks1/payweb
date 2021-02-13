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
import { TermsofserviceComponent } from './sign-up/business/termsofservice/termsofservice.component';
//import { InvitationLinkComponent } from './invitation-link/invitation-link.component';
import { AppleAppSiteAssociationComponent } from './apple-app-site-association/apple-app-site-association.component';
import { TermsofpolicyComponent } from './termsofpolicy/termsofpolicy.component'
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotComponent } from './forgot/forgot.component';
import { PayvooLandingComponent } from './landing/payvoo-landing.component';
import { PersonalLoginComponent } from './login/personal-login/personal-login.component';
import { BusinessLoginComponent } from './login/business-login/business-login.component';
import { PersonalSignupComponent } from './sign-up/personal/personal-signup.component';
import { BusinessSignupComponent } from './sign-up/business/business-signup.component';




export const Indexroutes: Routes = [
    {path:'',component:IndexComponent,canActivate:[LoginGuard], 
    children:[
      {path: 'personal', loadChildren: 'src/app/index/personal/personal.module#PersonalModule'},
     {path: 'business', loadChildren: 'src/app/index/business/business.module#BusinessModule'},
      {path: 'sandbox', loadChildren: 'src/app/index/sandbox/sandbox.module#SandboxModule'},
      {path:'',component: PayvooLandingComponent,
     children:[{path:'',loadChildren:'src/app/index/landing/payvoo-landing.module#PayvooLandingModule'}]
    },    
    {path:'termsofservice',component:TermsofserviceComponent},
    //{path:'verifyPerDetails',component:InvitationLinkComponent},
    {path:'apple-app-site-association',component:AppleAppSiteAssociationComponent},
    {path:'termsofpolicy',component:TermsofpolicyComponent},


    ]
   }
]
@NgModule({
    imports: [RouterModule.forChild(Indexroutes)],
    exports:[RouterModule]

  })
     export class IndexRouterModule { }
