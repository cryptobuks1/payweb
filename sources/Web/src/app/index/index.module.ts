/**
* Index Module
* its manages the depedancies in entire index module
* @package IndexModule
* @subpackage app\index\IndexModule
* @author SEPA Cyber Technologies, Sayyad M.
*/
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BusinessSignupComponent } from './sign-up/business/business-signup.component';
import { PersonalSignupComponent } from './sign-up/personal/personal-signup.component';
import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PersonalLoginComponent } from './login/personal-login/personal-login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BusinessLoginComponent } from './login/business-login/business-login.component';
import { BusinessRegisterComponent } from './sign-up/business/business-register/business-register.component';
import { BusinessRegisterFormComponent } from './sign-up/business/business-register-form/business-register-form.component';
import { BusinessForgotComponent } from './forgot/business-forgot/business-forgot.component';
import { PersonalForgotComponent } from './forgot/personal-forgot/personal-forgot.component';
import { OtpComponent } from './login/business-login/otp/otp.component';
import { TermsofserviceComponent } from './sign-up/business/termsofservice/termsofservice.component';
//import { InvitationLinkComponent } from './invitation-link/invitation-link.component';
import { AppleAppSiteAssociationComponent } from './apple-app-site-association/apple-app-site-association.component';
import { SandboxsignupComponent } from './sign-up/sandbox/sandboxsignup.component';
import { SandboxloginComponent } from  './login/sandbox-login/sandboxlogin.component';
import { SandboxForgotComponent } from './forgot/sandbox-forgot/sandbox-forgot.component';
import {NgxMaskModule} from 'ngx-mask';
import { TermsofpolicyComponent } from './termsofpolicy/termsofpolicy.component'
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AuthService } from '../core/shared/auth.service';
import { AuthGuard } from '../core/gaurds/auth.guard';
import { HttpclientService } from '../core/shared/httpclient.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorsService } from '../core/interceptors/interceptors.service';
import { IndexRouterModule } from './index.router.module';
import { LoginModule } from './login/login.module';
import { PersonalComponent } from './personal/personal.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { BusinessComponent } from './business/business.component';



@NgModule({
  declarations: [PersonalLoginComponent,PersonalSignupComponent,BusinessSignupComponent, 
    BusinessLoginComponent, BusinessRegisterComponent, BusinessRegisterFormComponent, 
    BusinessForgotComponent, PersonalForgotComponent, OtpComponent, TermsofserviceComponent, 
    AppleAppSiteAssociationComponent,SandboxloginComponent,SandboxsignupComponent, 
    SandboxForgotComponent, TermsofpolicyComponent, BusinessComponent, 
    PersonalComponent, SandboxComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IndexRouterModule,
    NgxMaskModule.forRoot(),
    NgxExtendedPdfViewerModule,
    LoginModule
  ],
  providers: [AuthService,AuthGuard],
})
export class IndexModule {
  constructor(){
  }
 }
