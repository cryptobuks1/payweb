import { NgxMaskModule } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndividualSettingsRoutingModule } from './individual-settings-routing.module';
import { IndividualSettingsComponent } from './individual-settings.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangePinComponent } from './change-pin/change-pin.component';
import { PersonalPlanComponent } from './personal-plan/personal-plan.component';
import { PersonalPrivacyComponent } from './personal-privacy/personal-privacy.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { CloseAccountComponent } from './close-account/close-account.component';
import { GeneralDetailsComponent } from './general-details/general-details.component';
import { ModalModule  } from 'ngx-bootstrap/modal';
import { CookiesPolicyComponent } from './cookies-policy/cookies-policy.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IndividualSettingsRoutingModule,
    FormsModule,ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    ModalModule.forRoot()
  ]
})
export class IndividualSettingsModule { }