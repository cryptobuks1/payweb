import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglepaymentsComponent } from './singlepayments.component';

describe('SinglepaymentsComponent', () => {
  let component: SinglepaymentsComponent;
  let fixture: ComponentFixture<SinglepaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglepaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglepaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
