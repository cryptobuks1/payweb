import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/core/shared/home.service';

@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.component.html',
  styleUrls: ['./change-language.component.scss']
})
export class ChangeLanguageComponent implements OnInit {
  createAccount;
  showStyle:boolean=false;
  currencyData: any;
  alert: any;
  country_id_currency: any;
  country_name: any;
  obj: { "applicantId": any; "currency": any; "status": boolean; "role": number; "balance": number; };
  profileData: any;
  countryData=[{"country_id":23,"country_name": "Danish","country_flag_img_path": "assets/images/country_flag_img_path/denmark_640.png"},
{"country_id":1, "country_name": "Estonian","country_flag_img_path": "assets/images/country_flag_img_path/estonia_640.png"},
{"country_id":2,"country_name": "Bulgarian","country_flag_img_path": "assets/images/country_flag_img_path/bulgaria_640.png"},
{"country_id":3,"country_name": "Greek","country_flag_img_path": "assets/images/country_flag_img_path/greece_640.png"},
{"country_id":4,"country_name": "Finnish","country_flag_img_path": "assets/images/country_flag_img_path/finland_640.png"},
{"country_id":5,"country_name": "Irish/Gaelic","country_flag_img_path": "assets/images/country_flag_img_path/ireland_640.png"},
{"country_id":6,"country_name": "Croatian","country_flag_img_path": "assets/images/country_flag_img_path/croatia_640.png"},
{"country_id":7,"country_name": "Maltese","country_flag_img_path": "assets/images/country_flag_img_path/malta_640.png"},
{"country_id":8,"country_name": "Dutch","country_flag_img_path": "assets/images/country_flag_img_path/netherlands_640.png"},
{"country_id":9,"country_name": "Polish","country_flag_img_path": "assets/images/country_flag_img_path/poland_640.png"},
{"country_id":10,"country_name": "Portuguese","country_flag_img_path": "assets/images/country_flag_img_path/portugal_640.png"},
{"country_id":11,"country_name": "Romanian","country_flag_img_path": "assets/images/country_flag_img_path/romania_640.png"},
{"country_id":12,"country_name": "Swedish","country_flag_img_path": "assets/images/country_flag_img_path/sweden_640.png"},
{"country_id":13,"country_name": "Slovak","country_flag_img_path": "assets/images/country_flag_img_path/slovakia_640.png"},
{"country_id":14,"country_name": "Slovenian","country_flag_img_path": "assets/images/country_flag_img_path/slovenia_640.png"},
{"country_id":15,"country_name": "Latvian","country_flag_img_path": "assets/images/country_flag_img_path/latvia_640.png"},
{"country_id":16,"country_name": "Lithuanian","country_flag_img_path": "assets/images/country_flag_img_path/lithuania_640.png"},
{"country_id":17,"country_name": "Czech","country_flag_img_path": "assets/images/country_flag_img_path/czech_republic_640.png"},
{"country_id":18,"country_name": "Hungarian","country_flag_img_path": "assets/images/country_flag_img_path/hungary_640.png"},
{"country_id":19,"country_name": "German","country_flag_img_path": "assets/images/country_flag_img_path/germany_640.png"},
{"country_id":20,"country_name": "French","country_flag_img_path": "assets/images/country_flag_img_path/france_640.png"},
{"country_id":21,"country_name": "Italian","country_flag_img_path": "assets/images/country_flag_img_path/italy_640.png"},
{"country_id":22,"country_name": "Spanish","country_flag_img_path": "assets/images/country_flag_img_path/spain_640.png"},
{"country_id":24,"country_name": "English","country_flag_img_path": "assets/images/country_flag_img_path/united_kingdom_640.png"}
]
  selectedItem: any;
  country_flag_img_path: any;
 
   constructor(private homeService:HomeService) {
    // this.homeService.getAccountsCurrency().subscribe(res => {
    //   if (res['status'] == 0) {
    //     if (res['data']['status'] == 0) {
    //       this.currencyData = res['data']['currency'];
    //     } else if (res['data']['status'] == 1) {
    //       this.alert.error(res['data']['message']);
    //     }
    //   } else if (res['status'] == 1) {
    //     this.alert.error(res['message']);
    //   }
    // });
  }
  statusCurrency(){
    
  }
  
  save_outage_item(abc) {
    this.selectedItem = abc;
    this.showStyle = true;
    this.country_name = abc.country_name;
    this.country_flag_img_path=abc.country_flag_img_path;
       
  }
  getStyle() {
    if (this.showStyle) {
        return "";
    }    
}
   ngOnInit(): void {}
   deSelectLanguage() {
    this.selectedItem = undefined;
  }
  changeLang(){
    
  }
}
