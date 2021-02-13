import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { LoginrouteModule } from './loginroute.module';
import { CommonModule } from "@angular/common";
import { SandboxloginComponent } from './sandbox-login/sandbox-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [LoginComponent, SandboxloginComponent],
    imports: [
      LoginrouteModule, CommonModule, FormsModule, ReactiveFormsModule
    ]
})
export class LoginModule {
  constructor(){
  }
}