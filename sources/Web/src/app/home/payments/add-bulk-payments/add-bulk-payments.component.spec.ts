import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBulkPaymentsComponent } from './add-bulk-payments.component';

describe('AddBulkPaymentsComponent', () => {
  let component: AddBulkPaymentsComponent;
  let fixture: ComponentFixture<AddBulkPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBulkPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBulkPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
