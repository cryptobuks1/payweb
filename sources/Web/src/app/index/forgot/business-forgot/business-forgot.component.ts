import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder,Validators,FormGroup,FormControl, AbstractControl} from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IndexService } from "../../../core/shared/index.service";
import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-business-forgot',
  templateUrl: './business-forgot.component.html',
  styleUrls: ['./business-forgot.component.scss']
})
export class BusinessForgotComponent implements OnInit,OnDestroy {

private subs=new SubSink()

  forgotPassword:FormGroup;
  business_mail:boolean=true;
  reset_mail:boolean;
  error:boolean=false;
  profileData:any;
  applicant_id:any;
  email_id:any;
  match:boolean=false;
  passwordcompleteFeildSet:boolean=false;
  createPassword: any;
  repeatPassword:any;
  checkPassword:boolean=false;


  constructor(private fb:FormBuilder,private indexService: IndexService,private alert:NotificationService,private route:ActivatedRoute,private routerNavigate:Router) {
    this.email_id=this.route.snapshot.paramMap.get("id");
    this.showreset();
  }



  ngOnInit() {

    this.forgotPassword = this.fb.group({
      email: new FormControl('', Validators.compose([Validators.required,Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')])),
      oldpwd: new FormControl('', [Validators.required, this.ValidatePassword]),
      newpwd: new FormControl('', [Validators.required, this.ValidatePassword])
    });

    this.subs.sink=this.forgotPassword.get('oldpwd').valueChanges.subscribe((value) => {
      this.createPassword=value;
    });
    this.subs.sink=this.forgotPassword.get('newpwd').valueChanges.subscribe((value)=>{
      this.repeatPassword=value;
      if(this.createPassword===this.repeatPassword){
       this.checkPassword=false;
      }
      else{
       this.checkPassword=true;
      }
    });

  }

  ValidatePassword(control: AbstractControl) { // Added for checking

    let passwordvalue = control.value;
    if (passwordvalue == null) return null;
    var alphaCheck = new Array();
    alphaCheck.push("[A-Z]"); //Uppercase Alphabet.
    alphaCheck.push("[a-z]"); //Lowercase Alphabet.

    var numCheck = new Array();
    numCheck.push("[0-9]"); //Digit.
    //  numCheck.push("[!@#$%^&*]"); //Special Character.
    //  regex.push("[a-zA-Z0-9!@#$%^&*]{8,12}") // 8 to 12 Characters Password.

    var special = new Array();
    special.push("[-!$%^&*()_+|~=`{}[:;<>?,.@#\]");

    var alphaPassed = 0;
    var numPassed = 0;
    var specialCharacter = 0;

    for (var i = 0; i < alphaCheck.length; i++) {
      if (new RegExp(alphaCheck[i]).test(passwordvalue)) {
        alphaPassed++;
      } else { }
    }

    for (var i = 0; i < numCheck.length; i++) {
      if (new RegExp(numCheck[i]).test(passwordvalue)) {
        numPassed++;
      } else { }
    }

    for (var i = 0; i < special.length; i++) {
      if (new RegExp(special[i]).test(passwordvalue)) {
        specialCharacter++;
      } else { }
    }

    let minLength = false;
    let invalidPasswordAlpha = false;
    let invalidPasswordNumbers = false;
    let specialChara = false;

    if (passwordvalue.length >= 8) {
      minLength = true;
    }

    if (alphaPassed == alphaCheck.length) {
      invalidPasswordAlpha = true;
    }

    if (numPassed == numCheck.length) {
      invalidPasswordNumbers = true;
    }

    if (specialCharacter == special.length) {
      specialChara = true;
    }

    return {
      minLength: minLength,
      invalidPasswordAlpha: invalidPasswordAlpha,
      invalidPasswordNumbers: invalidPasswordNumbers,
      specialChara: specialChara
    };

  }

  checkdata() {
    let request={};
    request['account_type']="business",
    request['email']=this.forgotPassword.get('email').value;
    this.subs.sink=this.indexService.forgotPassword(request).subscribe(res => {
      if(res['status'] == 0){
        if(res['data']['status']==1){
          this.alert.error(res['data']['message']);
        }
      }
      if(res['status'] == 0){
        if(res['data']['status'] == 0){
          this.alert.success(res['data']['message']);
          setTimeout(() => {
            this.routerNavigate.navigate(['/business/login']);
            this.alert.success(res['data']['message']);
          }, 600);
        }
      }
    });

  }

  showreset(){
    if(this.email_id){
      this.business_mail=false;
      this.reset_mail=true;
    }
  }

  chcekpwd() {
    let obj={};
    obj['account_type']="business",
    obj['id']=this.email_id;
    obj['password']=this.forgotPassword.get('newpwd').value;
    if(this.forgotPassword.get('oldpwd').value===this.forgotPassword.get('newpwd').value){
        this.match=false;
        this.subs.sink=this.indexService.checkPassword(obj).subscribe(response => {
        if(response.data.status==1){
             this.alert.error(response['data']['message']);
        } if(response.data.status==0){
           this.reset_mail=false;
           this.passwordcompleteFeildSet=true;
        }
        });
    }
    else{
        this.match=true;
    }

  }


  // chcekpwd(){
  //   let obj={};
  //   obj['account_type']="business",
  //   obj['id']=this.email_id;
  //   obj['password']=this.forgotPassword.get('newpwd').value;
  //   if(this.forgotPassword.get('oldpwd').value===this.forgotPassword.get('newpwd').value){
  //       this.match=false;
  //       this.subs.sink=this.indexService.checkPassword(obj).subscribe(response => {
  //       if(response.status==1){
  //           this.alert.error(response['message']);
  //       }
  //       if(response.status==0) {
  //          this.reset_mail=false;
  //          this.passwordcompleteFeildSet=true;
  //       }
  //       });
  //   }
  //   else{
  //       this.match=true;
  //   }
  //   this.forgotPassword.reset();
  // }



  chooselogin(){
    this.routerNavigate.navigate(['business/login']);
  }

  ngOnDestroy(){
  this.subs.unsubscribe();
  }

  }



