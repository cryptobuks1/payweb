import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SessionExtensionService } from '../session-extension.service';
import { LoaderService } from '../../loader.service';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-extension',
  templateUrl: './session-extension.component.html',
  styleUrls: ['./session-extension.component.scss']
})
export class SessionExtensionComponent implements OnInit {

  modalRef: BsModalRef;

  config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    animated: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered'
  };

  @ViewChild('template', {static: false}) template: ElementRef;
  @Output() closeSessionExtension = new EventEmitter<any>();

  constructor(private modalService: BsModalService,
    private sessionExtensionService: SessionExtensionService,
    private loaderService: LoaderService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  extendSession() {
    this.sessionExtensionService.extendSession().subscribe((res: any) => {
      sessionStorage.setItem('x-auth-token', res.data['x-auth-token']);
      this.loaderService.hide();
      this.closeSessionExtension.emit();
    });
  }

  logout() {
    if (this.authService.logOutAction()) {
      this.closeSessionExtension.emit();
      this.loaderService.hide();
      this.router.navigate(['']);
    }
  }

}
