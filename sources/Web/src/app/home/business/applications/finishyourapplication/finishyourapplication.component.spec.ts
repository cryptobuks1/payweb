import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishyourapplicationComponent } from './finishyourapplication.component';

describe('FinishyourapplicationComponent', () => {
  let component: FinishyourapplicationComponent;
  let fixture: ComponentFixture<FinishyourapplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishyourapplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishyourapplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
