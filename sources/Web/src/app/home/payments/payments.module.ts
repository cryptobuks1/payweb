import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common'; 
import { AccountTypeComponent } from './account-type/account-type.component';
import { PaymentsroutingModule } from './paymentsrouting.module';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';

@NgModule({
  declarations: [
  AccountTypeComponent,
  BeneficiaryComponent],
  imports: [
    PaymentsroutingModule,
    CommonModule,
    FormsModule,
    MatCardModule
  ]
})
export class PaymentsModule {
  constructor(){
  }
}

