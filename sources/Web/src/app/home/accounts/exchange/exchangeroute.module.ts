import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RatesComponent } from './rates/rates.component';
import { ConvertorComponent } from './convertor/convertor.component';
import { ActionComponent } from './action/action.component';

export const exchangeRoute: Routes = [
  {path:'',component:RatesComponent},
  {path:'rates',component:RatesComponent},
  {path:'convertor',component:ConvertorComponent},
  {path:'action',component:ActionComponent}
]

@NgModule({
  imports: [RouterModule.forChild(exchangeRoute)],
  exports:[RouterModule]

})

export class ExchangerouteModule { }
