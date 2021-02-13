import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SandboxLoginComponent } from './sandbox-login.component';

describe('SandboxLoginComponent', () => {
  let component: SandboxLoginComponent;
  let fixture: ComponentFixture<SandboxLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SandboxLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SandboxLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
