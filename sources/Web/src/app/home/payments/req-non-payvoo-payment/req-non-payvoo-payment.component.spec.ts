import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqNonPayvooPaymentComponent } from './req-non-payvoo-payment.component';

describe('ReqNonPayvooPaymentComponent', () => {
  let component: ReqNonPayvooPaymentComponent;
  let fixture: ComponentFixture<ReqNonPayvooPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqNonPayvooPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqNonPayvooPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
