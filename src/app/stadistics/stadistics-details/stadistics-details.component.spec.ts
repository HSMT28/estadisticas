import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadisticsDetailsComponent } from './stadistics-details.component';

describe('StadisticsDetailsComponent', () => {
  let component: StadisticsDetailsComponent;
  let fixture: ComponentFixture<StadisticsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StadisticsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StadisticsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
