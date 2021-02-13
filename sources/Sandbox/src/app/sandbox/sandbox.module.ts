import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SandboxRoutingModule } from './sandbox.router.module';
import { SandboxComponent } from './sandbox.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'ngx-bootstrap/accordion';



@NgModule({
  declarations: [SandboxComponent],
  imports: [
    SandboxRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AccordionModule.forRoot(),
    CommonModule,
  
  ]
})
export class SandboxModule { }
