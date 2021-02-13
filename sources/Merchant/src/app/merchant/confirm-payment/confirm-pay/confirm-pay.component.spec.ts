import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPayComponent } from './confirm-pay.component';

describe('ConfirmPayComponent', () => {
  let component: ConfirmPayComponent;
  let fixture: ComponentFixture<ConfirmPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
