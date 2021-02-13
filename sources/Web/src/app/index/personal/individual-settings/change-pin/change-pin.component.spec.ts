import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePinComponent } from './change-pin.component';

describe('ChangePinComponent', () => {
  let component: ChangePinComponent;
  let fixture: ComponentFixture<ChangePinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
