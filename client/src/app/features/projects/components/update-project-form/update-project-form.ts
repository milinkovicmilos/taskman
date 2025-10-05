import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, WritableSignal, inject } from '@angular/core';
import { Input as InputElement } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button/button';
import { PROJECT_STORAGE } from '../../interfaces/project-storage';
import { AuthService } from '../../../../shared/services/auth-service';
import { ServerProjectStorage } from '../../services/server-project-storage';
import { LocalProjectStorage } from '../../services/local-project-storage';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Notifier } from '../../../../shared/services/notifier';
import { ProjectData } from '../../interfaces/project-data';
import { CreateProjectData } from '../../interfaces/create-project-data';
import { NotificationType } from '../../../../shared/enums/notification-type';
import { UpdateProjectData } from '../../interfaces/update-project-data';
import { FormState } from '../../../../shared/services/form-state';
import { FormType } from '../../../../shared/enums/form-type';

@Component({
  selector: 'app-update-project-form',
  imports: [ReactiveFormsModule, InputElement, Button],
  templateUrl: './update-project-form.html',
  styleUrl: './update-project-form.css',
  providers: [
    {
      provide: PROJECT_STORAGE,
      useFactory: (() => {
        const authService = inject(AuthService);
        return authService.isLoggedIn() ? new ServerProjectStorage() : new LocalProjectStorage();
      }),
    },
  ],
})
export class UpdateProjectForm implements OnChanges {
  @Input() project!: WritableSignal<ProjectData>;

  private formBuilder = inject(FormBuilder);
  updateProjectForm!: FormGroup;

  private storage = inject(PROJECT_STORAGE);

  protected isSubmitted: boolean = false;
  protected name!: any;
  protected description!: any;

  private notificationService = inject(Notifier);
  private formState = inject(FormState);

  @Output() submitted = new EventEmitter<ProjectData>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && this.project != null) {
      this.updateProjectForm = this.formBuilder.group({
        name: [this.project().name, Validators.required],
        description: [this.project().description, Validators.required],
      });
      this.name = this.updateProjectForm.get('name');
      this.description = this.updateProjectForm.get('description');
    }
  }

  protected cancelForm(): void {
    this.formState.changeState(FormType.Update);
  }

  handleSubmit(): void {
    this.isSubmitted = true;
    if (this.updateProjectForm.valid) {
      const { name, description } = this.updateProjectForm.value as {
        name: string,
        description: string,
      };

      const project: UpdateProjectData = {
        name,
        description
      };

      this.storage.updateProject(this.project().id, project).subscribe({
        next: () => {
          this.updateProjectForm.reset();
          this.updateProjectForm.markAsUntouched();
          this.isSubmitted = false;

          const project: ProjectData = {
            id: this.project().id,
            name,
            description,
          };
          this.submitted.emit(project);
        },
        error: (error) => {
          if (error.status === 422) {
            if (error.error.errors.hasOwnProperty('name')) {
              this.notificationService.notify({
                message: 'You already have a project with that name.',
                type: NotificationType.Error,
              });
            }
          }
        }
      });
    }
  }
}
