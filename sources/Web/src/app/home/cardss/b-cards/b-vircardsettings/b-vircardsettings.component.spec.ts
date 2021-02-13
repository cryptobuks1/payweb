import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BVircardsettingsComponent } from './b-vircardsettings.component';

describe('BVircardsettingsComponent', () => {
  let component: BVircardsettingsComponent;
  let fixture: ComponentFixture<BVircardsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BVircardsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BVircardsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
