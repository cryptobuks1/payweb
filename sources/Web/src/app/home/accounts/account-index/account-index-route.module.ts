import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetaccountsComponent } from './getaccounts/getaccounts.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { SheduledTransactionComponent } from './sheduled-transaction/sheduled-transaction.component';

export const accountRoute: Routes = [
  {path:'',component:GetaccountsComponent},
  {path:'getaccount',component:GetaccountsComponent},
  {path:'transactions',component:TransactionsComponent}, 
  {path:'scheduled-transactions',component:SheduledTransactionComponent}, 
]


@NgModule({
  imports: [RouterModule.forChild(accountRoute)],
  exports:[RouterModule]

})
export class AccountIndexRouteModule { }
