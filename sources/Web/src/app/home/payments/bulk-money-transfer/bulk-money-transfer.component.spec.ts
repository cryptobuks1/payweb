import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkMoneyTransferComponent } from './bulk-money-transfer.component';

describe('BulkMoneyTransferComponent', () => {
  let component: BulkMoneyTransferComponent;
  let fixture: ComponentFixture<BulkMoneyTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkMoneyTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkMoneyTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
