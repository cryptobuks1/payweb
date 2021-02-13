import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { LoginrouteModule } from './loginroute.module';
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    LoginrouteModule, CommonModule
  ]
})
export class LoginModule {
  constructor(){
  }
}
