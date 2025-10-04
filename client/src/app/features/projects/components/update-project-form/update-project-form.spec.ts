import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjectForm } from './update-project-form';

describe('UpdateProjectForm', () => {
  let component: UpdateProjectForm;
  let fixture: ComponentFixture<UpdateProjectForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProjectForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProjectForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
