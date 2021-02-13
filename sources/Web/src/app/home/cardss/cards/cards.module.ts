import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardsRoutingModule } from './cards-routing.module';
import { CardsComponent } from './cards.component';
import { PhyscardsettingsComponent } from './physcardsettings/physcardsettings.component';
import { NewvirtualComponent } from './newvirtual/newvirtual.component';
import { VircardsettingsComponent } from './vircardsettings/vircardsettings.component';



@NgModule({
  declarations: [CardsComponent, PhyscardsettingsComponent, NewvirtualComponent, VircardsettingsComponent],
  imports: [
    CommonModule,
    CardsRoutingModule
  ]
})
export class CardsModule { }
