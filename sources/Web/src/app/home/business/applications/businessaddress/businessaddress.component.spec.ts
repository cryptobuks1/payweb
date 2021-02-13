import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessaddressComponent } from './businessaddress.component';

describe('BusinessaddressComponent', () => {
  let component: BusinessaddressComponent;
  let fixture: ComponentFixture<BusinessaddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessaddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
