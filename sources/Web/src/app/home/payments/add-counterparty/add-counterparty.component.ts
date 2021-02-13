import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {  map, filter } from 'rxjs/operators';
import { HomeService } from 'src/app/core/shared/home.service';
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/debounceTime";
import { IndexService } from 'src/app/core/shared/index.service';


@Component({
  selector: 'app-add-counterparty',
  templateUrl: './add-counterparty.component.html',
  styleUrls: ['./add-counterparty.component.scss']
})
export class AddCounterpartyComponent implements OnInit {

  SearchForm: FormGroup
  CounterpartyModal: BsModalRef;
  userDetails: any;
  searchTerm: Subject<string> = new Subject();
  baseUrl: string = `${environment.serviceUrl}service/v1/globalsearch/0/`;
  searchResults: any;
  selectedRow : any={};
  userData: any;
  userInfo: any;
  acc_type: any;
  flagVerify: any;
  isSmsVerified:any;
  emptyCheck:boolean;
  linkCopied:boolean;
  isPersonal: boolean = false;
  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered'
  };
  addCounterParty: { full_name: any; email: any; mobile: any; country: any; applicant_id: any, contact?: any};
  constructor(private fb: FormBuilder, private modalService: BsModalService, private http: HttpClient,
              private homeService: HomeService, private alert: NotificationService, private router:Router,
              private locationStrategy: LocationStrategy, private route: ActivatedRoute, public indexService: IndexService) {

    this.userData = JSON.parse(sessionStorage.getItem('userData'));
    this.userInfo = this.userData;
    this.acc_type = this.userInfo.account_type;
  }

  ngOnInit() {
    this.SearchAddParty();
    this.emptyCheck = true;
    this.preventBackButton();
    this.SearchForm = this.fb.group({
      search_name: ['', [Validators.required]],
      search_contact: ['', [Validators.required, Validators.email]]
    });
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }

  getShortName(name: string) {
    return name.charAt(0).toUpperCase()
  }

  setClickedRow(payUser) {
    this.selectedRow = payUser;
  }

  searchEntries(term): Observable<any> {
    this.selectedRow={}
      return this.http.get(this.baseUrl + term).pipe(map(response => {
        this.searchResults = response['data']['results'];
      })
    );
  }

  _searchEntries(term) {
    this.searchEntries(term).subscribe(response => {

    }, err => {

    })
  }

  SearchAddParty() {
    this.searchTerm.debounceTime(200)
      .distinctUntilChanged().filter((term) => {
        if(term == ""){
          this.emptyCheck = true;
        }
        else this.emptyCheck = false;
        return term.length > 0;
      }).subscribe(searchterm => {
      this._searchEntries(searchterm);
    });
  }

  createCounterParty(Salert: TemplateRef<any>) {
    if (this.isEmpty(this.selectedRow)) {
      this.addCounterParty = {
        full_name: this.selectedRow['full_name'],
        email: this.selectedRow['email'],
        mobile: this.selectedRow['mobile'],
        country: this.selectedRow['country_id'],
        applicant_id: this.selectedRow['applicant_id']
      };
    } else {
      this.getCounterPartyInfoFromSearchForm();
    }
    this.homeService.postCouterparty(this.addCounterParty).subscribe(res => {
      if (res['status'] === 0) {
        if (res['data']['status'] === 0) {
          // this.alert.success(res['data']['message']);
          this.CounterpartyModal = this.modalService.show(Salert, this.config);
        } else if (res['data']['status'] === 1) {
          this.alert.warn(res['data']['message']);
        }
      } else {
        this.alert.error(res['message']);
      }
    });
  }

  getCounterPartyInfoFromSearchForm() {
    this.addCounterParty = {
      full_name: this.SearchForm.controls['search_name'].value,
      email: '',
      mobile: '',
      country: '',
      contact: '',
      applicant_id: ''
    };
    const counterPartyContact: string = this.SearchForm.controls['search_contact'].value;
    this.addCounterParty['contact'] = counterPartyContact;
  }

  isEmpty(obj) {
     if(Object.keys(obj).length === 0){
       return false;
     }
     else{
       return true;
     }
  }

  AddedCounterParty(Salert: TemplateRef<any>) {
    this.CounterpartyModal = this.modalService.show(Salert, this.config);
  }

  copyText(val: string) {
    let selBox = document.createElement('textarea');
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.linkCopied = true;
   // this.alert.success('Copied link');
  }

  backToPayments() {
    this.CounterpartyModal.hide();
    if(this.acc_type === 'personal') {
      this.isPersonal = true;
      this.router.navigateByUrl('/personal/payments');
    } else if(this.acc_type === 'business') {
      this.router.navigateByUrl('/business/payments_tab');
    }
  }

  inviteClose() {
    if(this.acc_type === 'personal') {
      this.router.navigateByUrl('/personal/payments');
    } else if(this.acc_type === 'business'){
      this.router.navigateByUrl('/business/payments_tab');
    }
  }

  isButtonDisabled() {
    if (!this.searchResults) {
      return this.SearchForm.controls['search_contact'].value === '' || this.SearchForm.controls['search_name'].value === '';
    } else {
      return this.SearchForm.controls['search_name'].value === '' || !this.isEmpty(this.selectedRow);
    }
  }
  RestrictCommaSemicolon(e) {
    var theEvent = e || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    var regex = /[^,;]+$/;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) {
            theEvent.preventDefault();
        }
    }
}

}
