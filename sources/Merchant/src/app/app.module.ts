import { ToastrModule } from './../core/toastr-notification/toastr.module';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { InterceptorsService } from './interceptor.service';
import { SepaService } from './sepa.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule,
  ],
  providers: [
    SepaService, { provide: LocationStrategy, useClass: HashLocationStrategy }, {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorsService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
