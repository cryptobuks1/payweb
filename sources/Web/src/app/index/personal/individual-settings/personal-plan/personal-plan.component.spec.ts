import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPlanComponent } from './personal-plan.component';

describe('PersonalPlanComponent', () => {
  let component: PersonalPlanComponent;
  let fixture: ComponentFixture<PersonalPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
