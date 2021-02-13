import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ToastrModule } from './core/toastr-notification/toastr.module';
import { AppRouterModule } from './app.router.module';
import { HttpclientService } from './core/shared/httpclient.service';
import { InterceptorsService } from './core/interceptors/interceptors.service';
import { LocationStrategy, HashLocationStrategy, DatePipe, PathLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderService } from './loader.service';
import { SessionExtensionComponent } from './core/session-extension/session-extension.component';
import { SessionExtensionService } from './core/session-extension.service';
import { IndexComponent } from './index/index.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,    
    IndexComponent,
    SessionExtensionComponent, HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRouterModule,
    BrowserAnimationsModule,
    ToastrModule,
    HttpClientModule,
    ReactiveFormsModule,
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
