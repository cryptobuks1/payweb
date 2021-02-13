import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VirtualcardsRoutingModule } from './virtualcards-routing.module';
import { VirtualcardsComponent } from './virtualcards.component';


@NgModule({
  declarations: [VirtualcardsComponent],
  imports: [
    CommonModule,
    VirtualcardsRoutingModule
  ]
})
export class VirtualcardsModule { }
