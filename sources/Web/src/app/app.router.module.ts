import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NoPageComponent } from './no-page/no-page.component';
import { SendLinkComponent } from './sendlink/sendlink.component';
import { InvitationLinkComponent } from './invitation-link/invitation-link.component';
import { NonPayvooPaymentComponent } from './home/payments/non-payvoo-payment/non-payvoo-payment.component';
import { DownloadappComponent } from './home/payments/downloadapp/downloadapp.component';
import { ReqNonPayvooPaymentComponent } from './home/payments/req-non-payvoo-payment/req-non-payvoo-payment.component';
import { ReqDownloadappComponent } from './home/payments/req-downloadapp/req-downloadapp.component';
export const routes: Routes = [
  {path: '', loadChildren: 'src/app/index/index.module#IndexModule'},
  {path: 'launch', component: SendLinkComponent},
  {path: 'payvoo', component: SendLinkComponent},
  {path: 'verifyPerDetails', component: InvitationLinkComponent},
  {path: 'personal/pay/:unique_payment_id', component: NonPayvooPaymentComponent},
  {path: 'business/pay/:unique_payment_id', component: NonPayvooPaymentComponent},
  {path: 'personal/request/:unique_payment_id', component: ReqNonPayvooPaymentComponent},
  {path: 'business/request/:unique_payment_id', component: ReqNonPayvooPaymentComponent},
  {path: 'personal/downloadapp', component: DownloadappComponent},
  {path: 'business/downloadapp', component: DownloadappComponent},
  {path: 'personal/req-downloadapp', component: ReqDownloadappComponent},
  {path: 'business/req-downloadapp', component: ReqDownloadappComponent},
  {path: '**', component: NoPageComponent},

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports:[RouterModule],

})
   export class AppRouterModule { }
