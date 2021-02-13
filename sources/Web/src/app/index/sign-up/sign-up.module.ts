import { NgModule } from '@angular/core';
import { SignUpComponent } from './sign-up.component';
import { SignUpRouteModule } from './sign-up-route.module';
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [SignUpComponent],
  imports: [
    SignUpRouteModule, CommonModule
  ]
})
export class SignUpModule { 
  constructor(){
  }
}
