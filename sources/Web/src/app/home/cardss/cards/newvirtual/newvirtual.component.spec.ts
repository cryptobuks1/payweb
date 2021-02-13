import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewvirtualComponent } from './newvirtual.component';

describe('NewvirtualComponent', () => {
  let component: NewvirtualComponent;
  let fixture: ComponentFixture<NewvirtualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewvirtualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewvirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
