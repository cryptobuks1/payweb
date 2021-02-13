import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SandboxloginComponent } from './sandboxlogin.component';

describe('SandboxloginComponent', () => {
  let component: SandboxloginComponent;
  let fixture: ComponentFixture<SandboxloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SandboxloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SandboxloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
