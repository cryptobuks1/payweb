
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BCardsRoutingModule } from './b-cards.routing.module';
import { BNewvirtualComponent } from './b-newvirtual/b-newvirtual.component';
import { BPhyscardsettingsComponent } from './b-physcardsettings/b-physcardsettings.component';
import { BVircardsettingsComponent } from './b-vircardsettings/b-vircardsettings.component';
import { BCardsComponent } from './b-cards.component';
import { EmployeesComponent } from './employees/employees.component';



@NgModule({
  declarations: [BCardsComponent, BPhyscardsettingsComponent, BNewvirtualComponent, BVircardsettingsComponent, EmployeesComponent],
  imports: [
    CommonModule,
    BCardsRoutingModule
  ]
})
export class BCardsModule { }