import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessSettings, BusinessSettingsRouterModule } from './business-settings-router.module';
import { BusinessSettingsComponent } from './business-settings.component';


@NgModule({
  declarations: [BusinessSettingsComponent],
  imports: [
    CommonModule,
    BusinessSettingsRouterModule
  ]
})
export class BusinessSettingsModule { }
