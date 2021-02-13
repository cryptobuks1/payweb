import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessownerdetailsComponent } from './businessownerdetails.component';

describe('BusinessownerdetailsComponent', () => {
  let component: BusinessownerdetailsComponent;
  let fixture: ComponentFixture<BusinessownerdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessownerdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessownerdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
