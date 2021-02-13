import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingBackComponent } from './shipping-back.component';

describe('ShippingBackComponent', () => {
  let component: ShippingBackComponent;
  let fixture: ComponentFixture<ShippingBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
