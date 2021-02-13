import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BPhyscardsettingsComponent } from './b-physcardsettings.component';

describe('BPhyscardsettingsComponent', () => {
  let component: BPhyscardsettingsComponent;
  let fixture: ComponentFixture<BPhyscardsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BPhyscardsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BPhyscardsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
