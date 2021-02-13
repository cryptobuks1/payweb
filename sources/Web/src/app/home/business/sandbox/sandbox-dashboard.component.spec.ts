import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SandboxDashboardComponent } from './sandbox-dashboard.component';

describe('SandboxDashboardComponent', () => {
  let component: SandboxDashboardComponent;
  let fixture: ComponentFixture<SandboxDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SandboxDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SandboxDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
