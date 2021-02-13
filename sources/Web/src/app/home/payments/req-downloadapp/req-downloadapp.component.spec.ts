import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqDownloadappComponent } from './req-downloadapp.component';

describe('ReqDownloadappComponent', () => {
  let component: ReqDownloadappComponent;
  let fixture: ComponentFixture<ReqDownloadappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqDownloadappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqDownloadappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
