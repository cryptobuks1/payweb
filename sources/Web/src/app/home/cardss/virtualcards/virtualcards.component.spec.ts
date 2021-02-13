import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualcardsComponent } from './virtualcards.component';

describe('VirtualcardsComponent', () => {
  let component: VirtualcardsComponent;
  let fixture: ComponentFixture<VirtualcardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualcardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
