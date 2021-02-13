import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SandboxRoutingModule } from './sandbox-routing.module';
import { SandboxComponent } from './sandbox.component';
import { CardComponent } from './card/card.component';
import { AddCardComponent } from './add-card/add-card.component';
import { LoginComponent } from './login/login.component';
import  {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask'

@NgModule({
  declarations: [SandboxComponent, CardComponent, AddCardComponent, LoginComponent],
  imports: [
    CommonModule,
    SandboxRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot()
  ]
})
export class SandboxModule { }
