import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessForgotComponent } from './business-forgot.component';

describe('BusinessForgotComponent', () => {
  let component: BusinessForgotComponent;
  let fixture: ComponentFixture<BusinessForgotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessForgotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
