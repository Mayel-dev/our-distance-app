import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalCard } from './goal-card';

describe('GoalCard', () => {
  let component: GoalCard;
  let fixture: ComponentFixture<GoalCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
