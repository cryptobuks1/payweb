import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhyscardsettingsComponent } from './physcardsettings.component';

describe('PhyscardsettingsComponent', () => {
  let component: PhyscardsettingsComponent;
  let fixture: ComponentFixture<PhyscardsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhyscardsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhyscardsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
