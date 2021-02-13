

/**
* HomeModule
* routing of the home components based on the account types.
* @package HomeRoutes
* @subpackage app\home\HomeRoutes
* @author SEPA Cyber Technologies, Sayyad M.
*/
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/gaurds/auth.guard';
import { ErrorPageComponent } from './error-page/error-page.component';
import { SandboxDashboardComponent } from './business/sandbox/sandbox-dashboard.component';
import { NgModule } from '@angular/core';
import { AddAccountComponent } from './accounts/account-index/add-account.component';
import { ApplicationComponent } from './business/application/bus-application.component';
import { AddMoneyComponent } from './accounts/add-money/add-money.component';
import { ExchangeComponent } from './accounts/exchange/exchange.component';
import { UsersComponent } from './profile/users.component';
import { ApplicationsComponent } from './business/applications/applications.component';
import { PaymentsComponent } from './payments/payments.component';

import { IndividualSettingsComponent } from '../index/personal/individual-settings/individual-settings.component';
import { CardsComponent } from './cardss/cards/cards.component';
import { PhysicalcardsComponent } from './cardss/physicalcards/physicalcards.component';
import { VirtualcardsComponent } from './cardss/virtualcards/virtualcards.component';
import { SettingsComponent } from '../index/business/settings/settings.component';
import { LoginGuard } from '../core/gaurds/login.guard';
import { BCardsComponent } from './cardss/b-cards/b-cards.component';


export const HomeRoutes: Routes = [
    {path:'',component:HomeComponent,
    children:[
    {path:'accounts',component:AddAccountComponent,canActivate:[AuthGuard],data:{userAccount:['personal']},
    children:[
      {path:'',loadChildren:'src/app/home/accounts/account-index/account-index.module#AccountIndexModule'}]
     },
    {path:'add-money',component:AddMoneyComponent,canActivate:[AuthGuard],data:{userAccount:['personal']},
    children:[
      {path:'',loadChildren:'src/app/home/accounts/add-money/add-money.module#AddMoneyModule'}]
      },

    {path:'exchange',component:ExchangeComponent,canActivate:[AuthGuard],data:{userAccount:['personal']},
    children:[ {path:'',loadChildren:'src/app/home/accounts/exchange/exchange.module#ExchangeModule'}]
     },

     {path:'profile',component:UsersComponent,canActivate:[AuthGuard],data:{userAccount:['personal']},
    children:[
      {path:'',loadChildren:'src/app/home/profile/users.module#UsersModule'}]
     },
     {path:'individual-settings', component:IndividualSettingsComponent,canActivate:[AuthGuard],data:{userAccount:['personal']},
     children:[
     {path:'',loadChildren:'src/app/index/personal/individual-settings/individual-settings.module#IndividualSettingsModule'}]
      },




     {path:'application',component:ApplicationsComponent,canActivate:[AuthGuard],data:{userAccount:['business']},
     children:[
       {path:'',loadChildren:'src/app/home/business/applications/applications.module#ApplicationsModule'}]
     },
     {path:'accounts',component:AddAccountComponent,canActivate:[AuthGuard],data:{userAccount:['business']},
     children:[
       {path:'',loadChildren:'src/app/home/accounts/account-index/account-index.module#AccountIndexModule'}]
      },
      {path:'add-money',component:AddMoneyComponent,canActivate:[AuthGuard],data:{userAccount:['business']},
      children:[
        {path:'',loadChildren:'src/app/home/accounts/add-money/add-money.module#AddMoneyModule'}]
      },
      {path:'exchange',component:ExchangeComponent,canActivate:[AuthGuard],data:{userAccount:['business']},
      children:[ {path:'',loadChildren:'src/app/home/accounts/exchange/exchange.module#ExchangeModule'}]
       },
       {path:'payments',component:PaymentsComponent,canActivate:[AuthGuard],data:{userAccount:['business']},
      children:[
      {path:'',loadChildren:'src/app/home/payments/payments.module#PaymentsModule'}]
       },

       {path:'settings',component:SettingsComponent,canActivate:[AuthGuard],data:{userAccount:['business']},
       children:[
       {path:'',loadChildren:'src/app/index/business/settings/settings.module#SettingsModule'}]
        },


        {path:'cards',component:CardsComponent,canActivate:[AuthGuard],data:{userAccount:['Personal']},
        children:[
          {path:'',loadChildren:'src/app/home/cardss/cards/cards.module#CardsModule'}]
         },
         {path:'bcards',component:BCardsComponent,canActivate:[AuthGuard],data:{userAccount:['business']},
        children:[
          {path:'',loadChildren:'src/app/home/cardss/b-cards/b-cards.module#BCardsModule'}]
         },
         {path:'cards/physicalcards',component:PhysicalcardsComponent,canActivate:[AuthGuard],data:{userAccount:['Personal']},
        children:[
          {path:'',loadChildren:'src/app/home/cardss/physicalcards/physicalcards.module#PhysicalcardsModule'}]
         },

         {path:'cards/virtualcards',component:VirtualcardsComponent,canActivate:[AuthGuard],data:{userAccount:['Personal']},
         children:[
           {path:'',loadChildren:'src/app/home/cardss/virtualcards/virtualcards.module#VirtualcardsModule'}]
          },















    {path:'business-application',component:ApplicationComponent,canActivate:[AuthGuard],data:{userAccount:['Business']}},
       {path:'payments_tab',component:PaymentsComponent,canActivate:[AuthGuard],data:{userAccount:['business']},
      children:[
      {path:'',loadChildren:'src/app/home/payments/payments.module#PaymentsModule'}]
       },

    {path:'business-application',component:ApplicationComponent,canActivate:[AuthGuard],data:{userAccount:['business']}},
    {path:'dashboard',component:SandboxDashboardComponent,canActivate:[AuthGuard],data:{userAccount:['sandbox']}},
    {path:'error-page',component:ErrorPageComponent}

    ]
   }]

@NgModule({
  imports: [RouterModule.forChild(HomeRoutes)],
  exports:[RouterModule]

})
   export class HomeRouterModule { }
