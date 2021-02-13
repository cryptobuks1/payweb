import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMoneyTransferComponent } from './single-money-transfer.component';

describe('SingleMoneyTransferComponent', () => {
  let component: SingleMoneyTransferComponent;
  let fixture: ComponentFixture<SingleMoneyTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleMoneyTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleMoneyTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
