import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from './loader.service';
import { SessionExtensionService } from './core/session-extension.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  isLoading: Subject<boolean> = this.loaderService.isLoading;
  sessionExpired;
  showSessionExtension = false;
  incrivelAuth;
  constructor(private loaderService: LoaderService, private sessionExtensionService: SessionExtensionService) {}

  ngOnInit() {
    this.sessionExtensionService.getSessionExpiredNotification().subscribe(() => {
      this.showSessionExtension = true;
    });
  }

  onCloseSessionExtension() {
    this.showSessionExtension = false;
  }

}
