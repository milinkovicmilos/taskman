import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Input } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-create-project-form',
  imports: [ReactiveFormsModule, Input, Button],
  templateUrl: './create-project-form.html',
  styleUrl: './create-project-form.css'
})
export class CreateProjectForm {
  private formBuilder = inject(FormBuilder);
  createProjectForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
  });

  protected submitted: boolean = false;
  protected title = this.createProjectForm.get('title');
  protected description = this.createProjectForm.get('description');

  handleSubmit(): void {
    this.submitted = true;
  }
}
