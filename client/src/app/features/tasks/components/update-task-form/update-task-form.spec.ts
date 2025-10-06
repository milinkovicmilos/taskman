import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTaskForm } from './update-task-form';

describe('UpdateTaskForm', () => {
  let component: UpdateTaskForm;
  let fixture: ComponentFixture<UpdateTaskForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTaskForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTaskForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
