import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BusinessProfileComponent } from './business-profile/business-profile.component';
import { IncorporationComponent } from './incorporation/incorporation.component';
import { NatureOfBusinessComponent } from './nature-of-business/nature-of-business.component';
import { StructureOfBusinessComponent } from './structure-of-business/structure-of-business.component';


export const BusinessSettings: Routes = [
  {path:'',component: BusinessProfileComponent},
  {path:'incorporation',component: IncorporationComponent},
  {path:'nature-business',component: NatureOfBusinessComponent},
  {path:'structure-business',component: StructureOfBusinessComponent}
]
@NgModule({
  imports: [RouterModule.forChild(BusinessSettings)],
  exports:[RouterModule]
})
export class BusinessSettingsRouterModule { }
