import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BNewvirtualComponent } from './b-newvirtual.component';

describe('BNewvirtualComponent', () => {
  let component: BNewvirtualComponent;
  let fixture: ComponentFixture<BNewvirtualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BNewvirtualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BNewvirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
