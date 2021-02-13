import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VircardsettingsComponent } from './vircardsettings.component';

describe('VircardsettingsComponent', () => {
  let component: VircardsettingsComponent;
  let fixture: ComponentFixture<VircardsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VircardsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VircardsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
