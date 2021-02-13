/**
* Index Module
* its manages the depedancies in entire index module
* @package IndexModule
* @subpackage app\index\IndexModule
* @author SEPA Cyber Technologies, Sayyad M.
*/
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//import { InvitationLinkComponent } from './invitation-link/invitation-link.component';
import { SandboxForgotComponent } from './forgot/sandbox-forgot/sandbox-forgot.component';
import { AuthService } from '../core/shared/auth.service';
import { AuthGuard } from '../core/gaurds/auth.guard';
import { HttpclientService } from '../core/shared/httpclient.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorsService } from '../core/interceptors/interceptors.service';
import { IndexRouterModule } from './index.router.module';
import { SandboxloginComponent } from 'app/sandbox/login/sandbox-login/sandbox-login.component';
import { SandboxsignupComponent } from './sign-up/sandbox/sandboxsignup/sandboxsignup.component';
import { SandboxComponent } from 'app/sandbox/sandbox.component';
import { LoginModule } from 'app/sandbox/login/login.module';
import { ForgotModule } from './forgot/forgot.module';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [SandboxloginComponent,SandboxsignupComponent, 
    SandboxForgotComponent, SandboxComponent],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    IndexRouterModule,
    LoginModule, ForgotModule
  ],
  providers: [AuthService,AuthGuard],
})
export class IndexModule {
  constructor(){
  }
 }
