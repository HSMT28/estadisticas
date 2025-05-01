import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadisticsTeamComponent } from './stadistics-team.component';

describe('StadisticsTeamComponent', () => {
  let component: StadisticsTeamComponent;
  let fixture: ComponentFixture<StadisticsTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StadisticsTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StadisticsTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
