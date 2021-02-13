import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCounterpartyComponent } from './add-counterparty/add-counterparty.component';
import { PaymentsTabComponent } from './payments-tab/payments-tab.component';
import { SmsComponent } from './sms/sms.component';
import { SingleMoneyTransferComponent } from './single-money-transfer/single-money-transfer.component';
import { AddBulkPaymentsComponent } from './add-bulk-payments/add-bulk-payments.component';
import { BulkMoneyTransferComponent } from './bulk-money-transfer/bulk-money-transfer.component';
import { AuthGuard } from 'src/app/core/gaurds/auth.guard';
import { AccountTypeComponent } from './account-type/account-type.component';
import { RequestPaymentsComponent } from './request-payments/request-payments.component';
import { PasswordComponent } from './password/password.component';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';

export const paymentsRoute: Routes = [
  { path: '', component: AccountTypeComponent, canActivate:[AuthGuard] },
  { path: 'payment-type', component: PaymentsTabComponent, canActivate:[AuthGuard] },
  { path: 'beneficiary', component: BeneficiaryComponent},
  { path: 'add-counterparty', component:AddCounterpartyComponent, canActivate:[AuthGuard] },
  { path: 'sms', component:SmsComponent, canActivate:[AuthGuard] },
  { path: 'money-transfer', component:SingleMoneyTransferComponent, canActivate:[AuthGuard] },
  { path: 'bulk-money-transfer', component:AddBulkPaymentsComponent, canActivate:[AuthGuard] },
  { path: 'bulk_transfer', component:BulkMoneyTransferComponent, canActivate:[AuthGuard] },
  { path: 'request-payment', component:RequestPaymentsComponent, canActivate:[AuthGuard] },
  { path: 'password', component:PasswordComponent, canActivate:[AuthGuard] }
];

 @NgModule({
     imports: [RouterModule.forChild(paymentsRoute)],
     exports:[RouterModule]
   })
export class PaymentsroutingModule { }
