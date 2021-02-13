import { StructureOfBusinessComponent } from './business-settings/structure-of-business/structure-of-business.component';
import { NatureOfBusinessComponent } from './business-settings/nature-of-business/nature-of-business.component';
import { BusinessProfileComponent } from './business-settings/business-profile/business-profile.component';
import { IncorporationComponent } from './business-settings/incorporation/incorporation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalSettingsComponent } from './personal-settings/personal-settings.component';
import { BusinessSettingsComponent } from './business-settings/business-settings.component';
import { PlanComponent } from './plan/plan.component';
import { UsersComponent } from './users/users.component';
import { PersonalProfileComponent } from './personal-settings/personal-profile/personal-profile.component';
import { ChangePasswordComponent } from './personal-settings/change-password/change-password.component';
import { SettingsComponent } from './settings.component';


const routes: Routes = [
  {path:'',component:PersonalSettingsComponent,
  children:[
  {path:'business-profile',component: BusinessSettingsComponent,
  children:[{path:'',loadChildren:'src/app/index/business/settings/business-settings/business-settings.module#BusinessSettingsModule'}] 
 },
 {path:'personal-profile',component: PersonalSettingsComponent, 
 children:[{path:'',loadChildren:'src/app/index/business/settings/personal-settings/personal-settings.module#PersonalSettingsModule'}] 
},
  ]
},
{path:'plan',component:PlanComponent}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }