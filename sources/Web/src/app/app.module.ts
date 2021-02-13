import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { HomeComponent } from './home/home.component';
import { NoPageComponent } from './no-page/no-page.component';
import { ToastrModule } from './core/toastr-notification/toastr.module';
import { AppRouterModule } from './app.router.module';
import { HttpclientService } from './core/shared/httpclient.service';
import { InterceptorsService } from './core/interceptors/interceptors.service';
import { LocationStrategy, HashLocationStrategy, DatePipe, PathLocationStrategy } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SendLinkComponent } from './sendlink/sendlink.component';
import { InvitationLinkComponent } from './invitation-link/invitation-link.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderService } from './loader.service';
import { NonPayvooPaymentComponent } from './home/payments/non-payvoo-payment/non-payvoo-payment.component';
import { SessionExtensionComponent } from './core/session-extension/session-extension.component';
import { SessionExtensionService } from './core/session-extension.service';
import { DownloadappComponent } from './home/payments/downloadapp/downloadapp.component';
import { ReqNonPayvooPaymentComponent } from './home/payments/req-non-payvoo-payment/req-non-payvoo-payment.component';
import { ReqDownloadappComponent } from './home/payments/req-downloadapp/req-downloadapp.component';

@NgModule({
  declarations: [
    AppComponent,    
    IndexComponent,  
    HomeComponent,
    NoPageComponent,
    SendLinkComponent,
    InvitationLinkComponent,
    NonPayvooPaymentComponent,
    SessionExtensionComponent,
    DownloadappComponent,
    ReqNonPayvooPaymentComponent,
    ReqDownloadappComponent
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    BrowserAnimationsModule,
    ToastrModule,
    HttpClientModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    MatBadgeModule,
    MatProgressBarModule,
    FormsModule
  ],
  providers: [
    HttpclientService,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorsService,
      multi: true
    },
    DatePipe,
    LoaderService,
    SessionExtensionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){
  }
 }
