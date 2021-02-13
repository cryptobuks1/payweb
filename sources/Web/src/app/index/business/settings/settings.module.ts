import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { PersonalSettingsComponent } from './personal-settings/personal-settings.component';
import { PlanComponent } from './plan/plan.component';
import { UsersComponent } from './users/users.component';
import {FormsModule,ReactiveFormsModule } from'@angular/forms';
import { IncorporationComponent } from './business-settings/incorporation/incorporation.component';
import { BusinessProfileComponent } from './business-settings/business-profile/business-profile.component';
import { NatureOfBusinessComponent } from './business-settings/nature-of-business/nature-of-business.component';
import { StructureOfBusinessComponent } from './business-settings/structure-of-business/structure-of-business.component';
import { PersonalProfileComponent } from './personal-settings/personal-profile/personal-profile.component';
import { ChangePasswordComponent } from './personal-settings/change-password/change-password.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { GeneralComponent } from './general/general.component';
import { ApiComponent } from './api/api.component';
import { ChangeLanguageComponent } from './change-language/change-language.component';
import { BusinessAboutUsComponent } from '../../../home/business-about-us/business-about-us.component';
import { BusinessSettingsSecurityComponent } from '../../../home/business-settings-security/business-settings-security.component';

@NgModule({
  declarations: [SettingsComponent, PersonalSettingsComponent, PlanComponent, UsersComponent, IncorporationComponent, BusinessProfileComponent, NatureOfBusinessComponent, 
    StructureOfBusinessComponent, PersonalProfileComponent, ChangePasswordComponent, GeneralComponent, ApiComponent, ChangeLanguageComponent, BusinessAboutUsComponent, BusinessSettingsSecurityComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule
  ]
})
export class SettingsModule { }
