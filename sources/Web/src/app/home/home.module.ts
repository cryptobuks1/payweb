
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
import { PersonalprofileComponent } from './profile/personal/personalprofile.component';
import { FormsModule } from '@angular/forms';
import { ApplicationComponent } from './business/application/bus-application.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AddMoneyComponent } from './accounts/add-money/add-money.component';
import { CardsComponent } from './accounts/add-money/cards/cards.component';
import { CardsDetailsComponent } from './accounts/add-money/carddetails/cardsdetails.component';
import { AddpaymentsComponent } from './accounts/add-money/add-payments/add-payments.component';
import { AddAccountComponent } from './accounts/account-index/add-account.component';
import { GetaccountsComponent } from './accounts/account-index/getaccounts/getaccounts.component';
import { TransactionsComponent } from './accounts/account-index/transactions/transactions.component';
import { ExchangeComponent } from './accounts/exchange/exchange.component';
import { SandboxDashboardComponent } from './business/sandbox/sandbox-dashboard.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RatesComponent } from './accounts/exchange/rates/rates.component';
import { ConvertorComponent } from './accounts/exchange/convertor/convertor.component';
import { ActionComponent } from './accounts/exchange/action/action.component';
import { NgxMaskModule } from 'ngx-mask';
import { DecimalDirective } from './accounts/exchange/decimal.directive';
import { AuthService } from '../core/shared/auth.service';
import { AuthGuard } from '../core/gaurds/auth.guard';
import { HomeRouterModule } from './home.router.module';
import { UsersComponent } from './profile/users.component';
import { TypesofbusinessComponent } from './business/applications/typesofbusiness/typesofbusiness.component';
import { BusinessaddressComponent } from './business/applications/businessaddress/businessaddress.component';
import { ApplicationsComponent } from './business/applications/applications.component';
import { SinglepaymentsComponent } from './payments/singlepayments/singlepayments.component';
import { BulkpaymentsComponent } from './payments/bulkpayments/bulkpayments.component';
import { PaymentsComponent } from './payments/payments.component';
//import { PersonalsettingsComponent } from './settings/personalsettings/personalsettings.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { AddCounterpartyComponent } from './payments/add-counterparty/add-counterparty.component';
import { PaymentsTabComponent } from './payments/payments-tab/payments-tab.component';
import { SmsComponent } from './payments/sms/sms.component';
import { SingleMoneyTransferComponent } from './payments/single-money-transfer/single-money-transfer.component';
import { BulkMoneyTransferComponent } from './payments/bulk-money-transfer/bulk-money-transfer.component';
import { AddBulkPaymentsComponent } from './payments/add-bulk-payments/add-bulk-payments.component';

import { TwoDigitDecimaNumberDirective } from '././accounts/add-money/add-payments/add-payments.component';
import { SheduledTransactionComponent } from './accounts/account-index/sheduled-transaction/sheduled-transaction.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { UiSwitchModule } from 'ngx-toggle-switch';

import { GrdFilterPipe } from '../search.pipe';

import { FilterPipe } from '../filterPipe.pipe';
import { ISOCurrencySearchPipe } from '../iso-currency-search.pipe';
import { RequestPaymentsComponent } from './payments/request-payments/request-payments.component';
import { FilterPipe2 } from '../filterPipe2.pipe';
import { PasswordComponent } from './payments/password/password.component';

@NgModule({
  declarations: [
    PersonalprofileComponent, UsersComponent, ApplicationComponent, ApplicationsComponent,
    ErrorPageComponent, PaymentsTabComponent, SmsComponent,PasswordComponent, SingleMoneyTransferComponent,
    AddMoneyComponent, CardsDetailsComponent, CardsComponent,  AddAccountComponent, AddCounterpartyComponent,
    GetaccountsComponent, TransactionsComponent, ExchangeComponent, AddpaymentsComponent, PaymentsComponent,
    SinglepaymentsComponent, BulkpaymentsComponent, SandboxDashboardComponent, RatesComponent, ConvertorComponent, ActionComponent,
    DecimalDirective, TypesofbusinessComponent, BusinessaddressComponent,
    // PersonalsettingsComponent,
     SmsComponent, GrdFilterPipe, FilterPipe, FilterPipe2, ISOCurrencySearchPipe,
    SingleMoneyTransferComponent, BulkMoneyTransferComponent, AddBulkPaymentsComponent,
    SingleMoneyTransferComponent, BulkMoneyTransferComponent, AddBulkPaymentsComponent, TwoDigitDecimaNumberDirective,
    SheduledTransactionComponent, RequestPaymentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    HomeRouterModule,
    Ng2SearchPipeModule,
    HighchartsChartModule,
    NgxMaskModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    UiSwitchModule
  ],
  providers: [AuthService, AuthGuard],
})
export class HomeModule {
  constructor(){
  }
}
