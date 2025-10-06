import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SUBTASK_STORAGE } from '../../interfaces/subtask-storage';
import { AuthService } from '../../../../shared/services/auth-service';
import { ServerSubtaskStorage } from '../../services/server-subtask-storage';
import { LocalSubtaskStorage } from '../../services/local-subtask-storage';
import { Input as InputElement } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormState } from '../../../../shared/services/form-state';
import { Notifier } from '../../../../shared/services/notifier';
import { SubtaskData } from '../../interfaces/subtask-data';
import { FormType } from '../../../../shared/enums/form-type';
import { CreateSubtaskData } from '../../interfaces/create-subtask-data';
import { NotificationType } from '../../../../shared/enums/notification-type';
import { CreatedSubtaskResponse } from '../../interfaces/created-subtask-response';

@Component({
  selector: 'app-create-subtask-form',
  imports: [ReactiveFormsModule, InputElement, Button],
  templateUrl: './create-subtask-form.html',
  styleUrl: './create-subtask-form.css',
  providers: [
    {
      provide: SUBTASK_STORAGE,
      useFactory: (() => {
        const authService = inject(AuthService);
        return authService.isLoggedIn() ? new ServerSubtaskStorage() : new LocalSubtaskStorage();
      }),
    },
  ],
})
export class CreateSubtaskForm {
  private formBuilder = inject(FormBuilder);
  createSubtaskForm = this.formBuilder.group({
    text: ['', Validators.required],
  });

  private storage = inject(SUBTASK_STORAGE);

  protected isSubmitted: boolean = false;
  protected text = this.createSubtaskForm.get('title');

  private notificationService = inject(Notifier);
  private formState = inject(FormState);

  protected dueDateMin = (new Date()).toISOString().split('T')[0];

  @Input() projectId!: number | string;
  @Input() taskId!: number | string;
  @Output() submitted = new EventEmitter<SubtaskData>();

  protected cancelForm(): void {
    this.formState.changeState(FormType.Create);
  }

  handleSubmit(): void {
    this.isSubmitted = true;
    if (this.createSubtaskForm.valid) {
      const { text } = this.createSubtaskForm.value as {
        text: string,
      };

      const subtask: CreateSubtaskData = {
        text,
      };

      this.storage.storeSubtask(this.projectId, this.taskId, subtask).subscribe({
        next: (response: CreatedSubtaskResponse) => {
          this.createSubtaskForm.reset();
          this.createSubtaskForm.markAsUntouched();
          this.isSubmitted = false;

          this.notificationService.notify({
            type: NotificationType.Info,
            message: response.message,
          });

          const taskData: SubtaskData = {
            id: response.data.id,
            text,
            completed: false,
            completed_at: null,
          };
          this.submitted.emit(taskData);
        },
        error: (response) => {
        }
      });
    }
  }
}
