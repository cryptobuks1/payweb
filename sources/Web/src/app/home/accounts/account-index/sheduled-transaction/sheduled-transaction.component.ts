import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';

@Component({
  selector: 'app-sheduled-transaction',
  templateUrl: './sheduled-transaction.component.html',
  styleUrls: ['./sheduled-transaction.component.scss']
})
export class SheduledTransactionComponent implements OnInit {
  profileData: any;
  sheduletransList: any=[];

  constructor(public _router: Router, private homeService: HomeService, private alert: NotificationService) {
    this.getAllTransctionList()
  }

  ngOnInit() {
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));

  }


  getAllTransctionList() {
    this.homeService.getSheduleTransfers().subscribe(res => {
      if(res['status']==0){
        if (res['data']['status'] == 0) {
          this.sheduletransList = res['data']['transaction_details'];
        } else if(res['data']['status']==1) {
          this.alert.warn(res['data']['message'])
        }
      } else {
       this.alert.error(res['message']);
      }
    });
  }

  setTime(time) {
    let created_time = time;
    var hour = created_time.split(':')[0];
    var minute = created_time.split(':')[1];
    var date = new Date(); // UTC
    var localHour = hour - date.getTimezoneOffset()/60;
    var localMinute = (localHour%1) * 60;
    localHour = Math.floor(localHour);
    localMinute += parseInt(minute);
    if (localMinute >= 60) {
      localHour += Math.floor(localMinute/60);
      localMinute %= 60;
    }
      localHour %= 24;
    if (localHour < 12 && localHour >= 0) {
      if (localHour == 0) {
        if (localMinute <= 9) {
          return 12 + ':' + '0' + localMinute + ':' + created_time.split(':')[2] + ' AM'
        }
        return 12 + ':' + localMinute + ':' + created_time.split(':')[2] + ' AM'
      }
      if (localHour <= 9 && localMinute <= 9) {
        return '0' + localHour + ':' + '0' + localMinute + ':' + created_time.split(':')[2] + ' AM';
      }
      if (localHour <= 9) {
        return '0' + localHour + ':' + localMinute + ':' + created_time.split(':')[2] + ' AM'
      }
      if (localMinute <= 9) {
        return localHour + ':' + '0' + localMinute + ':' + created_time.split(':')[2] + ' AM'
      }
      return localHour + ':' + localMinute + ':' + created_time.split(':')[2] + ' AM'
    } else {
        let hourCreated = localHour-12
        if(hourCreated==0){
          if(localMinute<9){
            return 12+':' +'0'+localMinute+':'+created_time.split(':')[2] + ' PM'
          }
          return 12+':' +localMinute+':'+created_time.split(':')[2] + ' PM'
        }
        if(localMinute<9){
          return  '0'+hourCreated+':' +'0'+localMinute+':'+created_time.split(':')[2] + ' PM'
        }
        return '0'+hourCreated+':' +localMinute+':'+created_time.split(':')[2] + ' PM'
      }
  }

  setDate(datevalue) {
    //  let date=Date.parse('07-12-2000')
    if(datevalue != undefined) {
      let d=datevalue.split(' ')[0]
      var numbers = d.match(/\d+/g);
      var date = new Date(numbers[0], numbers[1]-1, numbers[2]);
      return date.toLocaleDateString(undefined, {day:'2-digit'}) + ' ' + date.toLocaleDateString(undefined, {month:'short'}) + ' ' + date.toLocaleDateString(undefined, {year:'numeric'})
    }


    }

    roundOff(data) {
      //return data.toFixed(3);
      return Math.round(data * 100) / 100;
    }

    deleteSheduleTran(obj){
      let data={
        "id": obj.id
      }
      this.homeService.deleteSheduleTransfers(data).subscribe(res => {
        if(res['status']==0){
          if (res['data']['status'] == 0) {
            //this.alert.success(res['data']['message']);
            this.getAllTransctionList();
          // this.sheduletransList = res['data']['transaction_details'];
          } else if(res['data']['status']==1) {
            this.alert.warn(res['data']['message'])
          }
        } else {
         this.alert.error(res['message']);
        }
      });
    }


}
