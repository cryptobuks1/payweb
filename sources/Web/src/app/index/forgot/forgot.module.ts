import { NgModule } from '@angular/core';
import { ForgotComponent } from './forgot.component';
import { ForgotrouteModule } from './forgotroute.module';

@NgModule({
  declarations: [ForgotComponent],
  imports: [
    ForgotrouteModule
  ]
})
export class ForgotModule { 
  constructor(){
  }
}
