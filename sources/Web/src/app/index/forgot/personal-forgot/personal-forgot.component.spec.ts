import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalForgotComponent } from './personal-forgot.component';

describe('PersonalForgotComponent', () => {
  let component: PersonalForgotComponent;
  let fixture: ComponentFixture<PersonalForgotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalForgotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
