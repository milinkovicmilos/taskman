import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtaskCard } from './subtask-card';

describe('SubtaskCard', () => {
  let component: SubtaskCard;
  let fixture: ComponentFixture<SubtaskCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubtaskCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubtaskCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
