import { NgModule } from '@angular/core';
import { LandingrouteModule } from './landingroute.module';
import { PayvooBusinessComponent } from './business-landing/payvoo-business.component';
import { PayvooComponent } from './personal-landing/payvoo.component';

@NgModule({
  declarations: [PayvooComponent,PayvooBusinessComponent],
  imports: [
    LandingrouteModule
  ]
})
export class LandingModule {
  constructor(){
  }
 }
