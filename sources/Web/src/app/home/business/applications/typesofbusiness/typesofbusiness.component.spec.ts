import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesofbusinessComponent } from './typesofbusiness.component';

describe('TypesofbusinessComponent', () => {
  let component: TypesofbusinessComponent;
  let fixture: ComponentFixture<TypesofbusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypesofbusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesofbusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
