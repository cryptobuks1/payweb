import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EventEmitterService } from '../../accounts/exchange/event-emitter.service';
import { HomeService } from 'src/app/core/shared/home.service';
import { SubSink } from 'subsink';
import { HomeComponent } from '../../home.component';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';

declare var $:any;

@Component({
  selector: 'app-add-bulk-payments',
  templateUrl: './add-bulk-payments.component.html',
  styleUrls: ['./add-bulk-payments.component.scss']
})
export class AddBulkPaymentsComponent implements OnInit {
  CounterPartyList: any = [];
  selected: string;
  balance: any;
  selectedAcc: any;
  copyAcc: any;
  refText: any;
  referenceText: any;
  refText1: any;
  refText2: any;
  Ref: any;
  savedata = [];
  balData = [];
  isPersonal: boolean = false;
  total: any = [];
  totalbal: any = 0;
  counterdata: any = []
  searchText: any;
  userData: any;
  userInfo: any;
  accountType: any;
  editFormList: any;
  check_bal: boolean;
  count: any=[];
  bulkData: any=[];
  csvPayment: any=false;
  totalcsvBal: any;
  sum: any;
  counterpartyObj: any;
  private subs = new SubSink();
  accountData: any;
  accdata: any;


  constructor(public emitter:EventEmitterService,public router: Router, private alert: NotificationService,
    private form: FormBuilder, private loader: HomeComponent, public homeService: HomeService){ }

  ngOnInit() {
    this.getAccounts();
    this.userData = JSON.parse(sessionStorage.getItem('userData'));
  //  this.csvPayment = JSON.parse(sessionStorage.getItem('csv'));
  this.subs.sink = this.homeService.getCsv().subscribe(data => {
    this.csvPayment = data;
    if (this.csvPayment) {
    this.subs.sink = this.homeService.getBulkPayments().subscribe(data => {
      this.bulkData = data.bulkList;
      this.counterdata = data.UserListDetails;
      this.total = data.TotalBalance;
      this.totalcsvBal = 0;
      this.bulkData.forEach(ele => {
        if (ele.balance != '') {
          this.totalcsvBal = this.totalcsvBal + parseFloat(ele.Amount);
        }
      });
      let bulkList = {};
      bulkList['TotalCsvBalance'] = this.totalcsvBal;
      this.homeService.setBulkPaymentsBalance(bulkList);
    //  sessionStorage.setItem('TotalCsvBalance', JSON.stringify(this.totalcsvBal))
    if (this.total) {
      this.totalbal = 0
      this.count = this.CounterPartyList.filter(c => {
        if (c.balance != 0) {
          this.totalbal += parseInt(c.balance)
          return c;
        }
      })
      this.check_bal = true;
    } else {
      this.check_bal = true;
    }
    this.CounterPartyList = this.counterdata.map(ele => {
      if (ele.balance == undefined && ele.referenceText == undefined) {
        ele.balance = '',
          ele.referenceText = ''
      }
      return ele
    })
    })
    } else { 
      this.homeService.getBulkPayments().subscribe(data => {
        
        this.counterdata = data.UserListDetails;
        this.total = data.TotalBalance;
        this.totalcsvBal = 0;
        if (this.total) {
          this.totalbal = 0
          this.count = this.CounterPartyList.filter(c => {
            if (c.balance != 0) {
              this.totalbal += parseInt(c.balance)
              return c;
            }
          })
          this.check_bal = true;
        } else {
          this.check_bal = true;
        }       
    // this.counterdata = JSON.parse(sessionStorage.getItem('UserListDetails'));
      this.accountType = this.userData.account_type
      this.CounterPartyList = this.counterdata.map(ele => {
        if (ele.balance == undefined && ele.referenceText == undefined) {
          ele.balance = '',
            ele.referenceText = ''
        }
        return ele;
      })
      // this.editFormList = JSON.parse(sessionStorage.getItem('bulkPaymentList'));
      // this.total = JSON.parse(sessionStorage.getItem('TotalBalance'))
    
  })
    }
  })
    $(document).ready(function () {
      $(".amount").on("blur", function () {
        $(this).val(parseFloat($(this).val()).toFixed(2));
      })
    });
  //  this.counterdata = JSON.parse(sessionStorage.getItem('UserListDetails'));
    this.accountType = this.userData.account_type
    // this.CounterPartyList = this.counterdata.map(ele => {
    //   if (ele.balance == undefined && ele.referenceText == undefined) {
    //     ele.balance = '',
    //       ele.referenceText = ''
    //   }
    //   return ele
    // })
  //  this.editFormList = JSON.parse(sessionStorage.getItem('bulkList'));
    this.homeService.getBulkPayments().subscribe(data => {
      this.editFormList = data.bulkList;
    })
  //  this.total = JSON.parse(sessionStorage.getItem('TotalBalance'))

  
  }

  getShortName(name: string) {
    return name.charAt(0).toUpperCase()
  }
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0 || event.charCode == 46) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  totalBalance(e) {
    this.totalbal = 0;
    this.CounterPartyList.forEach(ele => {
      if (ele.balance != '') {
        this.totalbal = this.totalbal + parseFloat(ele.balance);
      }
    });
  this.count = this.CounterPartyList.filter(c=>{
   if(c.balance != 0){
    return c;
    }
  })
 // sessionStorage.setItem('TotalBalance', JSON.stringify(this.totalbal))
  }

  copyObject(counterParty) {
    this.copyAcc = this.CounterPartyList.filter((item) => item.counterparty_id == counterParty.counterparty_id);
    let obj = {
      account_no: this.copyAcc[0].account_no,
      counterparty_id: this.copyAcc[0].counterparty_id,
      country_name: this.copyAcc[0].country_name,
      currency: this.copyAcc[0].currency,
      email: this.copyAcc[0].email,
      full_name: this.copyAcc[0].full_name,
      mobile: this.copyAcc[0].mobile,
      referenceText: '',
      balance: ''
    }
    this.CounterPartyList.push(obj)
  }

  confirmRemveObj(obj){
    $('#confirmalert').modal('show')
    this.counterpartyObj=obj

  }

  getAccounts() {
    this.homeService.getAccounts().subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.accdata = res['data']['account'];
          this.accountData = this.accdata.filter((item) => item.status == 1);
        } else if (res['data']['status'] == 1) {
          this.loader.apploader = false;
        }
      } else {
        this.loader.apploader = false;
        this.alert.error(res['message'])
      }
    });
  }


  removeObject(counterParty) {
    const index: number = this.CounterPartyList.indexOf(counterParty);
    if (index !== -1) {
        this.CounterPartyList.splice(index, 1);
    }
    this.count = this.CounterPartyList.filter(c=>{
      if(c.balance != 0){
       return c;
       }
     })
    this.totalbal -=parseInt(counterParty.balance);
    $('#confirmalert').modal('hide');
    if(this.CounterPartyList.length==0){
      if(this.accountType == "personal") {
        this.isPersonal = true;
      this.router.navigate(['/personal/payments_tab']);
      } else {
        this.router.navigate(['/business/payments_tab']);
      }
    }
  }
  continue(counterParty) {
    let bulkDetils = {}; 
    bulkDetils['userDataList'] = this.CounterPartyList;
    bulkDetils['csvDataList'] = this.bulkData;
    bulkDetils['TotalBalance'] = this.totalbal;
    this.homeService.setBulkPaymentsData(bulkDetils);    
//    sessionStorage.setItem('userDataList', JSON.stringify(this.CounterPartyList));
//    sessionStorage.setItem('csvDataList', JSON.stringify(this.bulkData));
    if(this.accountType == "personal") {
    this.router.navigate(['/personal/payments_tab/bulk_transfer']);
    } else {
      this.router.navigate(['/business/payments_tab/bulk_transfer']);
    }
  }
  onSubmit() {
    alert(this.referenceText)
  }
}
