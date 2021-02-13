import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './toastr-notification.component';
import { NotificationService } from './toastr-notification.service';



@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule
  ],
  exports: [    
    NotificationComponent    
   ],
  providers:[NotificationService],
})
export class ToastrModule { }
