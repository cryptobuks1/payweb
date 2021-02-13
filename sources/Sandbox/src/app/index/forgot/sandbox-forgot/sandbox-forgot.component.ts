import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder,Validators,FormGroup,FormControl} from '@angular/forms';
import { IndexService } from "../../../core/shared/index.service";
import { ActivatedRoute,Router } from '@angular/router';
import { NotificationService } from 'app/core/toastr-notification/toastr-notification.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-sandbox-forgot',
  templateUrl: './sandbox-forgot.component.html',
  styleUrls: ['./sandbox-forgot.component.scss']
})
export class SandboxForgotComponent implements OnInit,OnDestroy {
  private subs=new SubSink();
  sandboxforgot:boolean = true;
  sandboxreset:boolean=false;
  confirm:boolean=false;
  forgotForm:FormGroup;
  resetpwd:FormGroup;
  showMyContainer;
  email_id:any;
  email:any;
  match:boolean=false;
  passwordcompleteFeildSet:boolean=false;
  createPassword:any;
  repeatPassword:any;
  checkPassword:boolean=false;

  constructor(private fb:FormBuilder,private indexService: IndexService,private alert:NotificationService,private route:ActivatedRoute,private routerNavigate:Router) {
    this.email_id=this.route.snapshot.paramMap.get("id");
    this.showreset();
   }


  forgotAction(){
    let request={};
    request['account_type']="sandbox",
    request['email']=this.forgotForm.get('email').value;
    this.subs.sink=this.indexService.forgotPassword(request).subscribe(response => {
    if(response.data.status==0){
      this.alert.success(`Email sent to ${request['email']}, please re-set new password`);
      this.email='';
    }
    if(response.data.status==1){
       this.alert.error(response.data.message);
    }
    });
  }

  showreset()
  {
    if(this.email_id)
    {
      this.sandboxforgot=false;
      this.sandboxreset=true;
    }
  }

  chcekpwd(){
    let obj={};
    obj['account_type']="sandbox",
    obj['id']=this.email_id;
    obj['password']=this.resetpwd.get('newpassword').value;
    if(this.resetpwd.get('newpassword').value===this.resetpwd.get('confirmpassword').value){
        this.match=false;
        this.subs.sink=this.indexService.checkPassword(obj).subscribe(response => {
        if(response.data.status==1)
        {
          this.alert.error(response['data']['message']);
        }
        if(response.data.status==0)
        {
           this.sandboxreset=false;
           this.confirm=true;
           
        }
        });
    }
    else
    {
        this.match=true;
    }

  }

  ngOnInit() {

    this.forgotForm = this.fb.group({
      email: new FormControl('', Validators.compose([Validators.required,Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')])),
    });

    this.resetpwd = this.fb.group({
      newpassword: new FormControl('', Validators.compose([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[-!$%^&*()_+|~=^`{}[:;<>?,.@#\ ]).{8,}')])),
      confirmpassword: new FormControl('', Validators.compose([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[-!$%^&*()_+|~=^`{}[:;<>?,.@#\ ]).{8,}')])),
    });

    this.subs.sink=this.resetpwd.get('newpassword').valueChanges.subscribe((value) => {
      this.createPassword=value;
    });
    this.subs.sink=this.resetpwd.get('confirmpassword').valueChanges.subscribe((value)=>{
      this.repeatPassword=value;
      if(this.createPassword===this.repeatPassword){
       this.checkPassword=false;
      }
      else{
       this.checkPassword=true;
      }
    });



  }


  chooselogin()
  {
    this.routerNavigate.navigate(['login']);
  }
  ngOnDestroy(){
    this.subs.unsubscribe();
  }




}
