import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalComponent } from './personal.component';
import { PersonalRoutingModule } from './personal.router.module';
import { ChangePinComponent } from './individual-settings/change-pin/change-pin.component';
import { PersonalPlanComponent } from './individual-settings/personal-plan/personal-plan.component';
import { PersonalPrivacyComponent } from './individual-settings/personal-privacy/personal-privacy.component';
import { PrivacyPolicyComponent } from './individual-settings/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './individual-settings/terms-and-conditions/terms-and-conditions.component';
import { CloseAccountComponent } from './individual-settings/close-account/close-account.component';
import { GeneralDetailsComponent } from './individual-settings/general-details/general-details.component';
import { PersonalDetailsComponent } from './individual-settings/personal-details/personal-details.component';
import { ChangePasswordComponent } from './individual-settings/change-password/change-password.component';
import { CookiesPolicyComponent } from './individual-settings/cookies-policy/cookies-policy.component';
import { IndividualSettingsComponent } from './individual-settings/individual-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';



@NgModule({
  declarations: [CookiesPolicyComponent, ChangePasswordComponent, PersonalDetailsComponent, 
    GeneralDetailsComponent, GeneralDetailsComponent, CloseAccountComponent, TermsAndConditionsComponent, 
    PrivacyPolicyComponent, PersonalPrivacyComponent, PersonalPlanComponent, ChangePinComponent,
    IndividualSettingsComponent],
  imports: [
    PersonalRoutingModule,
    NgxMaskModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PersonalModule { }
