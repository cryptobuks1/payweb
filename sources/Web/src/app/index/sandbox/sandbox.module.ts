

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SandboxRoutingModule } from './sandbox.router.module';



@NgModule({
  declarations: [],
  imports: [
    SandboxRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class SandboxModule { }
