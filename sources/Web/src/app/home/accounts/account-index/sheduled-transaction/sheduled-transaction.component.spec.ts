import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheduledTransactionComponent } from './sheduled-transaction.component';

describe('SheduledTransactionComponent', () => {
  let component: SheduledTransactionComponent;
  let fixture: ComponentFixture<SheduledTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheduledTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheduledTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
