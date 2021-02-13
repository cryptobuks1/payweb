import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SandboxsignupComponent } from './sandboxsignup.component';

describe('SandboxsignupComponent', () => {
  let component: SandboxsignupComponent;
  let fixture: ComponentFixture<SandboxsignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SandboxsignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SandboxsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
