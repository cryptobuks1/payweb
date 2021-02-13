import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalcardsComponent } from './physicalcards.component';

describe('PhysicalcardsComponent', () => {
  let component: PhysicalcardsComponent;
  let fixture: ComponentFixture<PhysicalcardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalcardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
