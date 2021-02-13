import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsDetailsComponent } from './cardsdetails.component';

describe('CardsDetailsComponent', () => {
  let component: CardsDetailsComponent;
  let fixture: ComponentFixture<CardsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
