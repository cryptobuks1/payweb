import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SandboxForgotComponent } from './sandbox-forgot.component';

describe('SandboxForgotComponent', () => {
  let component: SandboxForgotComponent;
  let fixture: ComponentFixture<SandboxForgotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SandboxForgotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SandboxForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
