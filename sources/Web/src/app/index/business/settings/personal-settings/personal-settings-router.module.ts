import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PersonalProfileComponent } from './personal-profile/personal-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeLanguageComponent } from '../change-language/change-language.component';

export const PersonalSettings: Routes = [
  
  {path:'personal-profile-settings',component: PersonalProfileComponent},
  {path:'change-password',component: ChangePasswordComponent},
  {path:'change-language', component:ChangeLanguageComponent},

]


@NgModule({
  imports: [RouterModule.forChild(PersonalSettings)],
  exports:[RouterModule]

})
export class PersonalSettingsRouterModule { }
