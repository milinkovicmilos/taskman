import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroupForm } from './create-group-form';

describe('CreateGroupForm', () => {
  let component: CreateGroupForm;
  let fixture: ComponentFixture<CreateGroupForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGroupForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGroupForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
