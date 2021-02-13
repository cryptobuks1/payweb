import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkpaymentsComponent } from './bulkpayments.component';

describe('BulkpaymentsComponent', () => {
  let component: BulkpaymentsComponent;
  let fixture: ComponentFixture<BulkpaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkpaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkpaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
