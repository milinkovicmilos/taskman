import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubtaskForm } from './create-subtask-form';

describe('CreateSubtaskForm', () => {
  let component: CreateSubtaskForm;
  let fixture: ComponentFixture<CreateSubtaskForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSubtaskForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSubtaskForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
