import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalSignupComponent } from './personal-signup.component';

describe('PersonalSignupComponent', () => {
  let component: PersonalSignupComponent;
  let fixture: ComponentFixture<PersonalSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
