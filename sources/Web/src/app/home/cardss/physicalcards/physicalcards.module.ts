import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhysicalcardsRoutingModule } from './physicalcards-routing.module';
import { PhysicalcardsComponent } from './physicalcards.component';
import { DeliveryaddressComponent } from './deliveryaddress/deliveryaddress.component';


@NgModule({
  declarations: [PhysicalcardsComponent, DeliveryaddressComponent],
  imports: [
    CommonModule,
    PhysicalcardsRoutingModule
  ]
})
export class PhysicalcardsModule { }
