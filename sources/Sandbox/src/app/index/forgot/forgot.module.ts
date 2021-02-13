import { NgModule } from '@angular/core';
import { ForgotComponent } from './forgot.component';
import { SandboxForgotComponent } from './sandbox-forgot/sandbox-forgot.component';
import { ForgotrouteModule } from './forgotroute.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [ForgotComponent, SandboxForgotComponent],
    imports: [
      ForgotrouteModule,FormsModule, ReactiveFormsModule, CommonModule
    ]
})
export class ForgotModule { 
  constructor(){
  }
}
