import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPrivacyComponent } from './personal-privacy.component';

describe('PersonalPrivacyComponent', () => {
  let component: PersonalPrivacyComponent;
  let fixture: ComponentFixture<PersonalPrivacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalPrivacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
