import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayvooLandingComponent } from './payvoo-landing.component';

export const payvooLoginRoute: Routes = [ 
  {path:'',component:PayvooLandingComponent},
  ]

@NgModule({
  imports: [RouterModule.forChild(payvooLoginRoute)],
  exports:[RouterModule]

})

export class PayvooLoginRouteModule { }
