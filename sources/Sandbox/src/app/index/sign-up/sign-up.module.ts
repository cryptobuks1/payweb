import { NgModule } from '@angular/core';
import { SignUpComponent } from './sign-up.component';
import { SignUpRouteModule } from './sign-up-router.module';
import { CommonModule } from "@angular/common";
import { SandboxsignupComponent } from './sandbox/sandboxsignup/sandboxsignup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchPipe } from './search.pipe';

@NgModule({
  declarations: [SignUpComponent, SandboxsignupComponent, SearchPipe],
  imports: [
    SignUpRouteModule, CommonModule, FormsModule, ReactiveFormsModule
  ]
})
export class SignUpModule { 
  constructor(){
  }
}