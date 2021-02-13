import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import { LoginComponent } from './login/login.component';
import { IndexComponent } from './index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalLoginComponent } from './personal-login/personal-login.component';


@NgModule({
  declarations: [LoginComponent, IndexComponent, PersonalLoginComponent],
  imports: [
    CommonModule,
    IndexRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class IndexModule { }
