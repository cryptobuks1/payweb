import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { PayvooLandingComponent } from './payvoo-landing.component';
import { PayvooLoginRouteModule } from './payvoo-landingroute.module';

@NgModule({
  declarations: [PayvooLandingComponent],
  imports: [
    PayvooLoginRouteModule, CommonModule
  ]
})
export class PayvooLandingModule {
  constructor(){
  }
}
