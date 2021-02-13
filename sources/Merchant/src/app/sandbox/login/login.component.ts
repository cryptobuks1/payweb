import { NotificationService } from 'src/core/toastr-notification/toastr-notification.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SepaService } from 'src/app/sepa.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  id: any;
  details: any;
  mail: void;
  pwd: void;
  userForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private sandboxService: SepaService,private alert:NotificationService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id']
      this.getOrderDetails(this.id);

    })


    this.userForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required]
    })


  }


  getOrderDetails(data) {
    this.sandboxService.getOrderDetails(data).subscribe(res => {
      this.details = res['data']['result'];
      sessionStorage.setItem('orderDetails', JSON.stringify(this.details));
      let item = sessionStorage.getItem('orderDetails')
    })
  }

  email(data) {
    this.mail = data;
  }

  password(data) {
    this.pwd = data;
  }

  login() {
    var req = {
      userId: this.mail,
      password: this.pwd
    }
  }


  loginForm(data) {

    this.sandboxService.login(data).subscribe(res => {
      if (res['data']['status'] == 1) {
        sessionStorage.setItem('x-auth-token', res['data']['x-auth-token']);
        sessionStorage.setItem("userData", JSON.stringify(res));
        this.router.navigate(['card']);
      }
      else {
        this.alert.error('user not found')
        alert('user not found');
      }
    })

  }
}
