import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantComponent } from './merchant.component';
import { CardComponent } from './card/card.component';
import { AddCardComponent } from './add-card/add-card.component';
import { ShoppingCartComponent } from './shoppingCart/shopping-cart/shopping-cart.component';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { ConfirmPayComponent } from './confirm-payment/confirm-pay/confirm-pay.component';
import { SignupComponent } from './signup/signup/signup.component';
import { ShippingBackComponent } from './shipping-back/shipping-back/shipping-back.component';
import { PaymentSuccessfulComponent } from './payment-successful/payment-successful/payment-successful.component';


const routes: Routes = [
  {path:'',component:MerchantComponent},
  {path:'merchant-card',component:CardComponent},
  {path:'add-card',component:AddCardComponent},
  {path: 'shopping-cart', component:ShoppingCartComponent},
  {path: 'login', component:LoginPageComponent},
  {path: 'confirm-pay', component:ConfirmPayComponent},
  {path: 'signUp', component:SignupComponent},
  {path: 'shipping-back', component:ShippingBackComponent},
  {path: 'payment-success', component:PaymentSuccessfulComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
