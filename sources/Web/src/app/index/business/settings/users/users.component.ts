import { NotificationService } from 'src/app/core/toastr-notification/toastr-notification.service';
import { FormBuilder, Validators, ControlContainer, FormGroup, FormControl } from '@angular/forms';
import { HomeService } from './../../../../core/shared/home.service';
import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  name: any;
  email: any;
  permissions: any;
  status: any;
  userdetails: any;
  permissionsForm: any;
  addNewRole: any;
  role_id: any;
  permissionsFormData: any;
  userMail: any;
  term:any;
  fullName: any;
  aclForm: any;
  businessRoles: any[];
  selected_role_title = "No users";
  selected_role: any;
  roleDropDownCollapsed = true;
  newRoleCreated = null;

  constructor(private homeService: HomeService, private formbuilder: FormBuilder, private alert : NotificationService) { }

  ngOnInit() {

    this.permissionsForm = this.formbuilder.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      email: ["", Validators.compose([Validators.required,Validators.pattern("[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}")])],
    });

    this.aclForm = {
      business_management: {
        business_profile_billing: {
          can_view: true,
          can_manage: false
        },
        user_management: {
          can_view: true,
          can_manage: false
        }
      },

      accounts_statements: {
        accounts: {
          can_view: true,
          can_manage: false
        },
        transactions: {
          can_view: true,
          can_manage: false
        }
      },

      operations_with_funds: {
        exchanges: {
          can_view: true,
          can_manage: false
        },
        payments: {
          can_view: true,
          can_manage: false
        },
        counterparties: {
          can_view: true,
          can_manage: false
        }
      },

      cards_employees: {
        physical_cards: {
          can_view: true,
          can_manage: false
        },
        virtual_cards: {
          can_view: true,
          can_manage: false
        }
      }
    };

    this.getRoles();
    this.addNewRole = this.formbuilder.group({
      role_name: ["", Validators.required]
    })
    this.getBusinessUsers();
    $(".search_open").click(function () {
      $(".srch_cnt").toggleClass("active");
    });
  }
  getBusinessUsers() {
    this.homeService.getInvitedBusinessUsers().subscribe(res => {
      this.userdetails = res["data"]["invited_business_users"];
    })
  }
  noSpace(){
    $("input").on("keypress", function(e) {
      if (e.which === 32 && !this.value.length)
          e.preventDefault();
          this.value = this.value.replace(/  +/g, ' ');
  });
  }
  getRoles(selectSpecificRole?) {
    this.homeService.getRoles().subscribe(res => {
      this.businessRoles = res['data']['business_roles'];
      if (selectSpecificRole) {
        this.selected_role = this.businessRoles.find(r => r.role_id == selectSpecificRole);
        this.aclForm = this.selected_role.acl;
      } else {
        this.selected_role = this.businessRoles && this.businessRoles.length > 0 ? this.businessRoles[0] : '';
        this.aclForm = this.selected_role.acl;
      }
      if (this.selected_role) {
        this.selected_role_title = this.selected_role.role_name;
        this.role_id = this.selected_role.role_id;
      }
    })
  }
  selectRole(role: any) {
    this.selected_role_title = role.role_name;
    this.aclForm = role.acl;
    this.roleDropDownCollapsed = true;
  }

  permissionsModal(permissionsFormData) {
    this.permissionsFormData = permissionsFormData;
    this.userMail = this.permissionsFormData['email'];
    this.fullName  = this.permissionsFormData['first_name'] + " " +this.permissionsFormData['last_name'];
    $('#permissions').modal('show');
  }
  createRole() {
    $('#permissions').modal('hide');
    $('#newrolemodal').modal('show');
  }
  addRole(addNewRoledata) {
    this.homeService.createRole(addNewRoledata).subscribe(res => {
      if (res['status'] == 0) {
        if (res['data']['status'] == 0) {
          this.role_id = res['data']['role_id'];
          this.alert.success(`${res['data']['message']}`)
          $('#permissions').modal('show');
          this.roleDropDownCollapsed = true;
          this.getRoles(this.role_id);
        }
        else{
          this.alert.error(res['data']['message']);
          $('#permissions').modal('show');
          this.roleDropDownCollapsed = true;
        }
      }
      else{
        this.alert.error(res['message']);
      }
    })
  }

  mapUserToBusiness(){
    if(this.role_id) {
      this.mapUserToBusinessWithRole();
    } else {
      this.homeService.createRole({role_name: "View only"}).subscribe(res => {
        if (res['status'] == 0) {
          if (res['data']['status'] == 0) {
            this.role_id = res['data']['role_id'];
            this.mapUserToBusinessWithRole();
          }
          else{
            this.alert.error(res['data']['message']);
          }
        }
        else{
          this.alert.error(res['message']);
        }
      })

    }
  }

  mapUserToBusinessWithRole() {
    var request = {
      "role_id": this.role_id,
      "first_name": this.permissionsFormData.first_name,
      "last_name": this.permissionsFormData.last_name,
      "email": this.permissionsFormData.email,
      "acl": this.aclForm
    }
    this.homeService.mapUserToBusiness(request).subscribe(res => {
      if(res["status"] == 0){
      if(res["data"]["status"] == 0){
        this.permissionsForm.reset();
        this.getBusinessUsers();
        $('#successmodal').modal('show')
      }
      else{
        this.alert.error(res['data']['message']);
      }
      }
      else{
        this.alert.error(res['message']);
      }
    })
  }


  clearpermissionsForm(){
    this.permissionsForm.reset();
  }

  clearaddRoleForm(){
    this.addNewRole.reset();
  }

  clearAclForm() {
    this.selected_role_title = "No users";
    for (let child in this.aclForm) {
      if (typeof this.aclForm[child] === "object") {
        for (let grandChild in this.aclForm[child]) {
          if (typeof this.aclForm[child][grandChild] === "object") {
            for (let greatGrandChild in this.aclForm[child][grandChild]) {
              if (typeof this.aclForm[child][grandChild][greatGrandChild] === "object") {

              } else {
                this.aclForm[child][grandChild][greatGrandChild] = false
              }
            }
          } else {
            this.aclForm[child][grandChild] = false;
          }
        }
      } else {
        this.aclForm[child] = false
      }
    }
  }
}
