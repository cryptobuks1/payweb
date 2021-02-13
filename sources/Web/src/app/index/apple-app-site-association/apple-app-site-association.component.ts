import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apple-app-site-association',
  templateUrl: './apple-app-site-association.component.html',
  styleUrls: []
})
export class AppleAppSiteAssociationComponent implements OnInit {
  obj: { "applinks": { "apps": any[]; "details": { "appID": string; "paths": string[]; }[]; }; };

  constructor() {
     this.obj={
      "applinks": {
          "apps": [],
          "details": [
              {
                  "appID": "QC8N4Z86R5.com.sepamuse.payvoobusiness",
                  "paths": ["*"]
              },
              {
                "appID": "QC8N4Z86R5.com.sepamuse.payvoo",
                "paths": ["*"]
            }
          ]
      }
      
   }
  }

  ngOnInit() {
  }

}
