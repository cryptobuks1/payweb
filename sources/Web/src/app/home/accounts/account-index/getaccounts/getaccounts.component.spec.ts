import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetaccountsComponent } from './getaccounts.component';

describe('GetaccountsComponent', () => {
  let component: GetaccountsComponent;
  let fixture: ComponentFixture<GetaccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetaccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetaccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
