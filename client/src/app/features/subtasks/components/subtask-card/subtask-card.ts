import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubtaskData } from '../../interfaces/subtask-data';
import { InputCheckbox } from '../../../../shared/components/input-checkbox/input-checkbox';
import { SUBTASK_STORAGE } from '../../interfaces/subtask-storage';
import { AuthService } from '../../../../shared/services/auth-service';
import { ServerSubtaskStorage } from '../../services/server-subtask-storage';
import { LocalSubtaskStorage } from '../../services/local-subtask-storage';
import { Notifier } from '../../../../shared/services/notifier';
import { NotificationType } from '../../../../shared/enums/notification-type';
import { MessageResponse } from '../../../../shared/interfaces/message-response';

@Component({
  selector: 'app-subtask-card',
  imports: [InputCheckbox],
  templateUrl: './subtask-card.html',
  styleUrl: './subtask-card.css',
  providers: [
    {
      provide: SUBTASK_STORAGE,
      useFactory: (() => {
        const authService = inject(AuthService);
        return authService.isLoggedIn() ? new ServerSubtaskStorage() : new LocalSubtaskStorage();
      }),
    },
  ]
})
export class SubtaskCard {
  private storage = inject(SUBTASK_STORAGE);
  private notificationService = inject(Notifier);

  @Input() projectId!: number | string;
  @Input() taskId!: number | string;

  @Input() subtask!: SubtaskData;

  protected onCheckboxChange(value: boolean): void {
    if (value) {
      this.storage.markSubtaskComplete(this.projectId, this.taskId, this.subtask.id).subscribe({
        next: (response: MessageResponse) => {
          this.notificationService.notify({
            type: NotificationType.Info,
            message: response.message,
          });
        },
        error: (response) => {
          this.notificationService.notify({
            type: NotificationType.Error,
            message: response.error.message,
          });
        }
      });
    }
    else {
      this.storage.markSubtaskIncomplete(this.projectId, this.taskId, this.subtask.id).subscribe({
        next: (response: MessageResponse) => {
          this.notificationService.notify({
            type: NotificationType.Info,
            message: response.message,
          });
        },
        error: (response) => {
          this.notificationService.notify({
            type: NotificationType.Error,
            message: response.error.message,
          });
        }
      });
    }
  }
}
