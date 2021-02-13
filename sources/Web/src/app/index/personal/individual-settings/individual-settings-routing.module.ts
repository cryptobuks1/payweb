import { CloseAccountComponent } from './close-account/close-account.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { PersonalPrivacyComponent } from './personal-privacy/personal-privacy.component';
import { PersonalPlanComponent } from './personal-plan/personal-plan.component';
import { ChangePinComponent } from './change-pin/change-pin.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndividualSettingsComponent } from './individual-settings.component';
import { GeneralDetailsComponent } from './general-details/general-details.component';


const routes: Routes = [
  {path:'general-details',component: GeneralDetailsComponent},
  {path:'personal-details',component: PersonalDetailsComponent},
  {path:'change-password',component: ChangePasswordComponent},
  {path:'change-pin',component: ChangePinComponent},
  {path:'personal-plan',component: PersonalPlanComponent},
  {path:'personal-privacy',component: PersonalPrivacyComponent},
  {path:'privacy-policy',component: PrivacyPolicyComponent},
  {path:'terms-conditions',component: TermsAndConditionsComponent},
  {path:'close-account',component: CloseAccountComponent},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndividualSettingsRoutingModule { }
