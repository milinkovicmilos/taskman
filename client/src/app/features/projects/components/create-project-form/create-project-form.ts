import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Input } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button/button';
import { PROJECT_STORAGE } from '../../interfaces/project-storage';
import { AuthService } from '../../../../shared/services/auth-service';
import { ServerProjectStorage } from '../../services/server-project-storage';
import { LocalProjectStorage } from '../../services/local-project-storage';
import { ProjectData } from '../../interfaces/project-data';

@Component({
  selector: 'app-create-project-form',
  imports: [ReactiveFormsModule, Input, Button],
  templateUrl: './create-project-form.html',
  styleUrl: './create-project-form.css',
  providers: [
    {
      provide: PROJECT_STORAGE,
      useFactory: (() => {
        const authService = inject(AuthService);
        return authService.isLoggedIn ? new ServerProjectStorage() : new LocalProjectStorage();
      }),
    },
  ],
})
export class CreateProjectForm {
  private formBuilder = inject(FormBuilder);
  createProjectForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
  });

  private storage = inject(PROJECT_STORAGE);

  protected submitted: boolean = false;
  protected title = this.createProjectForm.get('title');
  protected description = this.createProjectForm.get('description');

  @Output() created = new EventEmitter<ProjectData>();

  handleSubmit(): void {
    this.submitted = true;
    if (this.createProjectForm.valid) {
      const { title, description } = this.createProjectForm.value as {
        title: string,
        description: string,
      };

      const project: ProjectData = {
        id: crypto.randomUUID(),
        title,
        description
      };

      this.storage.storeProject(project);

      this.createProjectForm.reset();
      this.createProjectForm.markAsUntouched();
      this.submitted = false;

      this.created.emit(project);
    }
  }
}
