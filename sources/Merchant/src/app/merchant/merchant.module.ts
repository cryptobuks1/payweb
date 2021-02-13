import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantComponent } from './merchant.component';
import { CardComponent } from './card/card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddCardComponent } from './add-card/add-card.component';
import {NgxMaskModule} from 'ngx-mask';
import { LoginPageComponent } from './login/login-page/login-page.component';
import { ShoppingCartComponent } from './shoppingCart/shopping-cart/shopping-cart.component';
import { ConfirmPayComponent } from './confirm-payment/confirm-pay/confirm-pay.component';
import { SignupComponent } from './signup/signup/signup.component';
import { ShippingBackComponent } from './shipping-back/shipping-back/shipping-back.component';
import { PaymentSuccessfulComponent } from './payment-successful/payment-successful/payment-successful.component';


@NgModule({
  declarations: [MerchantComponent, CardComponent, AddCardComponent, LoginPageComponent, ShoppingCartComponent, ConfirmPayComponent, SignupComponent, ShippingBackComponent, PaymentSuccessfulComponent],
  imports: [
    CommonModule,
    MerchantRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot()
  ]
})
export class MerchantModule {
  constructor() {                                
  }
}