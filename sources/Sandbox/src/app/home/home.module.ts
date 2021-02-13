
/**
* HomeModule
* its manages the dependencies in home module
* @package HomeModule
* @subpackage app\home\HomeModule
* @author SEPA Cyber Technologies, Sayyad M.
*/
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as _ from "lodash";
import { FormsModule } from '@angular/forms';;
import { AuthService } from '../core/shared/auth.service';
import { AuthGuard } from '../core/gaurds/auth.guard';
import { HomeRouterModule } from './home.router.module';
//import { PersonalsettingsComponent } from './settings/personalsettings/personalsettings.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PaymentsGuard } from '../core/gaurds/payments.guard';
import { SandboxDashboardComponent } from './dashboard/sandbox-dashboard.component';

@NgModule({
  declarations: [ SandboxDashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRouterModule,
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
  ],
  providers: [AuthService, AuthGuard, PaymentsGuard],
})
export class HomeModule {
  constructor(){
  }
}
