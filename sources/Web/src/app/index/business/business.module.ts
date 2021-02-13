import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessRoutingModule } from './business.router.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    BusinessRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class BusinessModule { }
