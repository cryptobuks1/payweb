import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLoginComponent } from './personal-login.component';

describe('LoginComponent', () => {
  let component: PersonalLoginComponent;
  let fixture: ComponentFixture<PersonalLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
