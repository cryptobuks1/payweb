import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddpaymentsComponent } from './add-payments/add-payments.component';
import { CardsComponent } from './cards/cards.component';
import { CardsDetailsComponent } from './carddetails/cardsdetails.component';

export const addMoneyRoute: Routes = [
  {path:'with-card/:id',component:AddpaymentsComponent},
  {path:'cards',component:CardsComponent},
  {path:'card-details/:id',component:CardsDetailsComponent},
]


@NgModule({
  imports: [RouterModule.forChild(addMoneyRoute)],
  exports:[RouterModule]

})

export class AddMoneyRouteModule { }
