import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportingdocumentsComponent } from './supportingdocuments.component';

describe('SupportingdocumentsComponent', () => {
  let component: SupportingdocumentsComponent;
  let fixture: ComponentFixture<SupportingdocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportingdocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportingdocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
