import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { noop } from 'rxjs';

import { HomeService } from '../../../../core/shared/home.service';

@Component({
  selector: 'app-personal-privacy',
  templateUrl: './personal-privacy.component.html',
  styleUrls: ['./personal-privacy.component.scss']
})
export class PersonalPrivacyComponent implements OnInit, OnDestroy {
  doEmailNotify: boolean = false;
  doPushNotify: boolean = false;
  isVisible: boolean = false;
  subs: SubSink = new SubSink();

  constructor(private homeService: HomeService) {}

  removeCheckBox() {
    this.doEmailNotify = true;
    this.doPushNotify = true;
    this.isVisible = true;
    this.updatePrivacyNotificationSettings();
  }

  ngOnInit() {
    this.subs.sink = this.homeService.getPrivacyNotificationSettings().subscribe((res: any) => {
      this.doEmailNotify = res.data.doEmailNotify == 1 ? true: false;
      this.doPushNotify = res.data.doPushNotify == 1 ? true: false;
      this.isVisible = res.data.isVisible == 1 ? true: false;
    });
  }

  updatePrivacyNotificationSettings() {
    this.subs.sink = this.homeService.updatePrivacyNotificationSettings({
      doEmailNotify: this.doEmailNotify == true ? 1 : 0,
      doPushNotify: this.doPushNotify == true ? 1 : 0,
      isVisible: this.isVisible == true ? 1 : 0
    }).subscribe(() => noop);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
