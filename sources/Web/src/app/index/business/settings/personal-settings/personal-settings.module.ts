import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalSettings, PersonalSettingsRouterModule } from './personal-settings-router.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PersonalSettingsRouterModule
  ]
})
export class PersonalSettingsModule { }
