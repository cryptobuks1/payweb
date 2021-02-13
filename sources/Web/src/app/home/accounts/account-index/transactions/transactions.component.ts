import { Component,ViewChild, ElementRef  } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import * as html2pdf from 'html2pdf.js';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { HttpUrl } from 'src/app/core/shared/httpUrl.component';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {
  transList: any;
  profileData: any;
  amount: any;
  processingFees:number;
  transaction_operation: any;
  transDate: any;
  opositeOwner: any;
  currencyData: any;
  currencyType: any;
  selCurType: any;
  selAccNo: any;
  selCurId: any = 0;
  lastMonth:any;
  sixMonth:any;
  setYear:any;
  transForm:any;
  filePath: any;
  selectedCurrency: any;
  transaction_id: any;
  search_currencies:any;
  public selectpdf:boolean;
  public selectexcel:boolean;
  from_date:any=this.addMonths(1);
  toggle : boolean = false;
  eye=false;
  slasheye=true;
  apploader: boolean = false;
  type="password";

  @ViewChild('content',null) content: ElementRef;

  filterDate = [{
      "months": "This Month",
      "date": this.addMonths(1)
    },
    {
      "months": "Last Month",
      "date": this.addMonths(1)
    },{
      "months": "Last 6 Months",
      "date": this.addMonths(6)
    },{
      "months": "Last  Year",
      "date": this.addMonths(12)
    }];
  transaction_type: any;
  currency_type: any;
  created_time: any;
  utc: any;
  string: any;
  currentDate:any;
  cancelMessage: any;
  phoneNo: any;
  detailsList: any;
  passwordForm: any;
  counterpartyEmail: any;
  transaction_number: any;
  selectedMyAcc: any;
  selectedAmount: any;
  bankBalance: any;
  accountData: any;
  bankCurrency: any;
  totalAmount: any;
  kycStatus: string;
  userData: any;
  user_id: string;
  kycIframe:boolean=false;
  url: any = "";
  urlSafe: SafeResourceUrl;
  identId: any;
  disableTransaction: boolean = false;
  MobidentId: any;
  gplay:boolean;
  ios:boolean;
  sendForm: any;
  viaTransfer: any;
  description: any;
  password: string;
  insufficient: boolean;
  message: any;

  constructor(public _router: Router, public sanitizer: DomSanitizer, private homeService: HomeService,private fb: FormBuilder,
    private http: HttpClient,
     private alert: NotificationService) {
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));
    this.getFilteredTransctionList()
    this.getCurrencyList();
    
  }
  ngOnInit() {
    this.getDate();
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required,Validators.minLength(7),Validators.maxLength(15)]]
    });
    this.sendForm = this.fb.group({
      selectedCurrency: ['', [Validators.required,Validators.minLength(7),Validators.maxLength(15)]]
    });
    this.profileData = JSON.parse(sessionStorage.getItem('userData'));
    this.homeService.getPersonalDetails().subscribe(res => {
      if (res['status'] == 0) {
        this.detailsList = res['data'];
      }
      else {
        this.alert.error(res['message'])
      }
    })
    this.getFilteredTransctionList();
  }
  getDate(){
    var todaydate = new Date();
    var day = todaydate.getDate();
    var month = todaydate.getMonth() + 1;
    var year = todaydate.getFullYear();
    var datestring = month + "/" + day + "/" + year;
    this.currentDate = datestring;
   } 
  clickEvent(event){
    this.toggle = !this.toggle;       
 }
  roundOff(data) {
    //return data.toFixed(3);
    return Math.round(data * 100) / 100;
  }

  getCurrencyList(){
    this.homeService.getCurrency().subscribe(res => {
      if(res['status']==0){
      if(res['data']['status']==0){
        this.currencyType = res['data']['account'];
        this.changeAcc({
          target: {
            value: this.currencyType[0].currency
          }
        });
      } else if(res['data']['status']==1){
        this.alert.error(res['data']['message']);
      } } else {
        this.alert.error(res['message'])
      }
    })
  }
  changeAcc(e) {
    this.selectedMyAcc = e.target.value;
    this.selectedAmount = this.currencyType.filter((item) => item.currency === this.selectedMyAcc);
    this.bankBalance = this.selectedAmount[0].balance;
    this.bankCurrency = this.selectedAmount[0].currency;
    this.totalAmount = this.bankBalance;
    this.checkbalance();
  }
  getAllTransctionList() {
    this.homeService.getAllTransctionList().subscribe(res => {
      if(res['status']==0){
        if (res['data']['status'] == 0) {
          this.transList = res['data']['transaction_details'];
        } else if(res['data']['status']==1) {
          this.alert.warn(res['data']['message'])
        }
      } else {
       this.alert.error(res['message']);
      }
    });
  }

  getSelectedTransctionList() {
    if(this.selCurId == 0) {
      this.getFilteredTransctionList();
    } else {
    this.homeService.getSelectedTransctionList(this.selCurId, 'web').subscribe(res => {
      if(res['status']==0){
        if (res['data']['status'] == 0) {
          this.transList = res['data']['transaction_details'];
        } else if(res['data']['status']==1) {
          this.alert.warn(res['data']['message'])
        }
      } else {
       this.alert.error(res['message']);
      }
    });
  }
  }

  cancelRequest(id) {
    let obj = {'transaction_id': id, 
    'counterpartyEmail': this.counterpartyEmail,
    'requestedAmount': this.amount,
    'requestedCurrency': this.currency_type,
    'transaction_number': this.transaction_number,
    'counterparty': this.opositeOwner}
   
    this.homeService.cancelRequest(obj).subscribe(res => {
      if(res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.disableTransaction = true ;
          $("#cancelMessage").modal("show")
          this.cancelMessage = res['data']['message'];
          this.getAllTransctionList();  
          this.getFilteredTransctionList();      
        }
      }
    })
  }

  getFilteredTransctionList() {
    let obj = {
      "from_date": this.from_date,
      "currency_type": this.selCurId == 0 ? null : this.selCurId
    }
    this.homeService.getFilteredTransctionList(obj).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          let finalobj: any = [];
          let listdat: any = []
          // dataarray.forEach(ele=>{
          //   ele.data.forEach(el=>{
          //     listdat.push(el)
          //     let d=el.created_on.split('-')
          //     finalobj.push(new Date(d[2]+'-'+d[1]+'-'+d[0]+'-'+ el.created_on_with_time).getTime())
          //   })
          // })
          // finalobj.forEach(ele=>{
          // })
          this.transList = res['data']['transaction_details'];
        }
      } else {
        this.alert.error(res['message']);
      }
    });
  }

  getCurrentTransDetails(item) {
    this.transaction_id = item.transaction_id
    console.log(this.transaction_id)
    this.transaction_type=item.transaction_type
    this.transaction_number = item.transaction_number
    this.transDate = item.created_on;
    this.amount = item.amount;
    this.description = item.description;
    this.opositeOwner = item.counterparty;
    this.currency_type=item.currency_type;  
    this.created_time=item.created_on_with_time;
    this.processingFees = this.amount * 0;
    this.transaction_operation = item.transaction_operation;
    this.phoneNo = item.counterparty_mobile;
    this.counterpartyEmail = item.counterparty_email;
  }

  setTime(time) {
    let created_time = time;
    var hour = created_time.split(':')[0];
    var minute = created_time.split(':')[1];
    var date = new Date();
    var offset= -date.getTimezoneOffset();
    let offsetHour = parseInt((offset>=0? "+" : "-")+(offset/60));
    var localHour = parseInt(hour) + offsetHour;
    var localMinute = offset%60
    localHour = Math.floor(localHour);
    localMinute += parseInt(minute);
    if (localMinute >= 60) {
      localHour += Math.floor(localMinute / 60);
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
      let hourCreated = localHour - 12
      if (hourCreated == 0) {
        if (localMinute < 9) {
          return 12 + ':' + '0' + localMinute + ':' + created_time.split(':')[2] + ' PM'
        }
        return 12 + ':' + localMinute + ':' + created_time.split(':')[2] + ' PM'
      }
      if (localMinute < 9) {
        return '0' + hourCreated + ':' + '0' + localMinute + ':' + created_time.split(':')[2] + ' PM'
      }
      return '0' + hourCreated + ':' + localMinute + ':' + created_time.split(':')[2] + ' PM'
    }
  }

  makeExcel() {

    let obj = {
      "transaction_id": this.transaction_id,
      "from_date": this.from_date,
      "currency_type": this.selCurId == 0 ? null : this.selCurId
    }
      this.homeService.getStatement(obj).subscribe(res => {
         const blob = new Blob([res], {type: 'application/vnd.ms.excel'});
         const file = new File([blob], 'Statement' + '.xlsx', {type: 'application/vnd.ms.excel'});
         saveAs(file);
      })
  }

  makePdf() {
    // var element = document.getElementById('content');
    // var opt = {
    //   margin:       1,
    //   filename:     'statement.pdf',
    //   image:        { type: 'pdf', quality: 0.98 },
    //   html2canvas:  { scale: 2 },
    //   jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    // };
    // html2pdf(element, opt);
    let obj = {
      "type" : "web",
      "transaction_id": this.transaction_id
    }
    this.homeService.getStatementPdf(obj).subscribe(res => {
           const blob = new Blob([res], {type: 'application/pdf'});
           const file = new File([blob], 'Statement' + '.pdf', {type: 'application/pdf'});
           saveAs(file);
        })
  }
  
  public onSelectPdf(value:boolean){
  this.selectpdf= value;
  console.log(this.selectpdf)
   }
   public onSelectExcel(value:boolean){
    this.selectexcel= value;
     }
  getStatement(){
     if(this.selectpdf){
           this.makealldataPdf()
     }
     else if(this.selectexcel){
           this.makealldataExcel()
     }
    this.selectpdf = false;
    this.selectexcel = false;
    $('#myModalall').modal('hide');
  }
  makealldataExcel() {
    // var element = document.getElementById('contentall');
    // $('.modal-scroll').css({'height':'auto'});
    // var opt = {
    //     margin:       1,
    //     filename:     'statement.pdf',
    //     image:        { type: 'pdf', quality: 0.98 },
    //     html2canvas:  { scale: 2 },
    //     jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait', }
    //   };
    //   html2pdf(element, opt);
    let obj = {
      "from_date": this.from_date,
      "currency_type": this.selCurId == 0 ? null : this.selCurId
    }
      this.homeService.getStatement(obj).subscribe(res => {       

    //     const blob = new Blob([res.filename], {type: 'application/pdf'})
    //     const link = document.createElement('a')
    //     link.href = window.URL.createObjectURL(blob)
    //     link.download = `statement.pdf`
    //     link.click()    
         const blob = new Blob([res], {type: 'application/vnd.ms.excel'});
         const file = new File([blob], 'Statement' + '.xlsx', {type: 'application/vnd.ms.excel'});
         saveAs(file);
      })
  }

  makealldataPdf() {
    let obj = {
      "type" : "web"
    }
    this.homeService.getStatementPdf(obj).subscribe(res => {       

      //     const blob = new Blob([res.filename], {type: 'application/pdf'})
      //     const link = document.createElement('a')
      //     link.href = window.URL.createObjectURL(blob)
      //     link.download = `statement.pdf`
      //     link.click()    
           const blob = new Blob([res], {type: 'application/pdf'});
           const file = new File([blob], 'Statement' + '.pdf', {type: 'application/pdf'});
           saveAs(file);
        })
  }

//   extractDateToString(dateData) {
//     return format(new Date(dateData.year + '-' + dateData.month + '-' + dateData.day), 'yyyy-MM-dd');
// }

  getallCurrentTransDetails(){
    $('.modal-scroll').css({'height':'57vh'})
  }
  youOwe() {
    if(this.disableTransaction || this.description == 'Cancelled' || this.description == 'Declined') {
      return;
    } else {
    $("#sendDecline").modal("show")
    }
    this.insufficient = false;
  }
  owesYou() {
    if(this.disableTransaction || this.description == 'Cancelled' || this.description == 'Declined') {
      return;
    } else {
    $("#cancelReq").modal("show")
    }
  }


  setDate(datevalue) {
  //  let date=Date.parse('07-12-2000')
  if(datevalue != undefined) {
    var numbers = datevalue.match(/\d+/g);
    var date = new Date(numbers[2], numbers[1]-1, numbers[0]);
    return date.toLocaleDateString(undefined, {day:'2-digit'}) + ' ' + date.toLocaleDateString(undefined, {month:'short'}) + ' ' + date.toLocaleDateString(undefined, {year:'numeric'})
  }
  }

  addMonths(months) {
    let perday=86400000 ;
    let dif=Date.now()-months*30*perday;
    let present= new Date(dif);
    return present.getFullYear()+'-'+ (present.getMonth()+1 )+ '-'+present.getDate();
  }


  onDecline(id) {
   
    $("#decline").modal("hide")
    let obj = {'transaction_id': id, 
    'counterpartyEmail': this.counterpartyEmail,
    'requestedAmount': this.amount,
    'requestedCurrency': this.currency_type,
    'transaction_number': this.transaction_number,
    'counterparty': this.opositeOwner}
   
    this.homeService.declineRequest(obj).subscribe(res => {
      if(res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.disableTransaction = true ;
          $("#confirmDecline").modal("show")      
          this.cancelMessage = res['data']['message'];
          this.getAllTransctionList();   
          this.getFilteredTransctionList();     
        }
      }
    })
  }
  onSend() {
    $("#sendDecline").modal("hide");
    this.apploader = true;
    this.homeService.getKYCStatus('').subscribe(res => {
      if(res.code == 1 && res.status == 2) {
        return;
      }
      this.apploader = false;
      this.kycStatus = res['data'] ? res['data']['kyc_status'] : 'NOT_INITIATED';

      if (this.kycStatus && (this.kycStatus.includes('SUCCESS'))) {
        $('#passwrd').modal('show');
         if(res['status'] == 2) {
          this.alert.error(res['message']);
        }
      }
      else if(this.kycStatus=='FRAUD_SUSPICION' || this.kycStatus == 'PENDING' || this.kycStatus == 'CHECK_PENDING') {
        this.alert.warn(res.data.message);
      }
      else {
       $('#kycwarnhome').modal('show');
        this.apploader = false;
      }
    });
  }
  gotoProfilePage(){
    if(this.userData.account_type == 'business'){

     $("#kycwarnhome").modal('hide');
     $("#myModal").modal('show');

    } else if(this.userData.account_type == 'personal'){
       $("#myModal").modal('show');
    }

  }
  webCamera(){
    this.SubmitForKYC();
  }
  SubmitForKYC() {

    this.apploader=true;
    this.user_id = sessionStorage.getItem('email');
    this.userData = JSON.parse(sessionStorage.getItem('userData'))
    if(sessionStorage.getItem('isCamera')=='no'){
      this.apploader=false;
       this.alert.info("No camera available or Broswer support")
    }
    if(sessionStorage.getItem('isCamera')=='yes'){
      let obj={
        "account_type": this.userData.account_type
      }
    this.homeService.SubmitForKYC(obj).subscribe(res => {
      if(res['status']==0){
      if (res['data']['status'] == 0) {
        this.apploader=false;
        this.kycIframe=true;
        this.identId =res['data']['id'];        
         $("#myModal").modal('hide');
        $("#kycpopup").modal('show');
        this.url=`https://kyc.payvoo.com/app/${res['data']['sepaKycEnvironment']}/identifications/`+this.identId+'/identification/auto-ident'
        // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
        this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        window.addEventListener('message', data => {
          $("#kycpopup").modal('hide');
          if(this.profileData.account_type=='personal'){
            this._router.navigate(['/personal/accounts/getaccount']);
          }
          else{
            this._router.navigate(['business/exchange/action']);
          }
          console.log(data)
        })
      }
       else if(res['data']['status']==1) {
          this.apploader=false;
          this.kycIframe=true;
          this.identId =res['data']['id'];
          $("#kycpopup").modal('show');
          this.url=`https://kyc.payvoo.com/app/${res['data']['sepaKycEnvironment']}/identifications/`+this.identId+'/identification/auto-ident'
          // this.url='https://go.idnow.de/app/sepacyberauto/identifications/'+this.identId+'/identification/auto-ident'
          this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }
    }
    else{
      this.alert.error(res['message']);
      this.apploader=false;
    }
    })
  }
  }
  KYClinkToMobile(mobilePlatform) {
    this.apploader=true;
    let obj={
      "account_type": this.userData.account_type
    }
    this.homeService.SubmitForKYC(obj).subscribe(res=>{
      if(res['status']==0){
        this.identId =res['data']['id'];
        if (res['data']['status'] == 0) {
          this.MobidentId =res['data']['id'];
          this.linkToMobile(mobilePlatform);
          this.apploader=false;
        } else if(res['data']['status']==1){
          this.linkToMobile(mobilePlatform);
          this.apploader=false;
        }
      } else {
        this.alert.error(res['message']);
        this.apploader=false;
      }
    });
  }

  linkToMobile(mobilePlatform){
    this.apploader=true;
     this.homeService.KYClinkToMobile(this.mobile,this.email, mobilePlatform, this.MobidentId).subscribe(res => {
      if(res['status']==0){
       if(res['data']['status']==0){
         //this.alert.success(res['data']['message']);
         this.apploader=false;
       }
      } else {
        this.alert.error(res['message']);
        this.apploader=false;
      }
    });
   }
  email(mobile: (mobile: any, email: any, mobilePlatform: any, MobidentId: any) => void, email: any, mobilePlatform: any, MobidentId: any) {
    throw new Error('Method not implemented.');
  }
  mobile(mobile: any, email: any, mobilePlatform: any, MobidentId: any) {
    throw new Error('Method not implemented.');
  }
  onConfirm() {
    $("#decline").modal("hide")
  }
  closeSendDecline(){
    $('#sendDecline').modal('hide')
  }
  onContinue(password, id) {
      let obj = {};
      obj['userId'] = this.detailsList.user_id;
      obj['password'] = password;
      obj['account_type'] = this.profileData.account_type;
      this.http.post(HttpUrl.Login_PayVoo, obj).subscribe(res => {
        if (res['status'] == 0) {
          if (res['data']['status'] == 0 ) {
            let req = {'transaction_id': id, 
            'counterpartyEmail': this.counterpartyEmail,
            'requestedAmount': this.amount,
            'requestedCurrency': this.currency_type,
            'selectedFromCurreny': this.sendForm.get('selectedCurrency').value,
            'transaction_number': this.transaction_number,
            'counterparty': this.opositeOwner}
            this.homeService.acceptRequest(req).subscribe(res => {
              if(res['status'] == 0) {
                this.viaTransfer = res['data']['data'];
                if (res['data']['status'] == 0) {
                  this.disableTransaction = true ;
                  this.message = res['data']['message'];
                  $("#passwrd").modal("hide");
                  $("#success").modal("show");
                  this.getAllTransctionList(); 
                  this.getFilteredTransctionList();
                }
              }
            })
          }
          else{
            this.alert.error('The entered password is incorrect');
            this.password = ""
          }
        }
     })
   
  }
  checkbalance() {
    if((this.amount) < this.bankBalance) {
      this.insufficient = false;
    }else {
      this.insufficient = true;
    }
  } 

  eyeHide() {
    if(this.eye == false && this.slasheye == true) {
      this.eye=true;
      this.slasheye=false;
      this.type="text";
    }
    else if(this.eye == true && this.slasheye == false) {
      this.eye=false;
      this.slasheye=true;
      this.type="password";
    }
  }
}

