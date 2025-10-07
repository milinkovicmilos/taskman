import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Input as InputElement } from '../../../../shared/components/input/input';
import { Button } from '../../../../shared/components/button/button';
import { GroupService } from '../../services/group-service';
import { Notifier } from '../../../../shared/services/notifier';
import { FormState } from '../../../../shared/services/form-state';
import { GroupData } from '../../interfaces/group-data';
import { FormType } from '../../../../shared/enums/form-type';
import { CreateGroupData } from '../../interfaces/create-group-data';
import { CreatedGroupResponse } from '../../interfaces/created-group-response';
import { NotificationType } from '../../../../shared/enums/notification-type';

@Component({
  selector: 'app-create-group-form',
  imports: [ReactiveFormsModule, InputElement, Button],
  templateUrl: './create-group-form.html',
  styleUrl: './create-group-form.css'
})
export class CreateGroupForm {
  private formBuilder = inject(FormBuilder);
  createGroupForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  private groupService = inject(GroupService);

  protected isSubmitted: boolean = false;
  protected name = this.createGroupForm.get('name');

  private notificationService = inject(Notifier);
  private formState = inject(FormState);

  @Output() submitted = new EventEmitter<GroupData>();

  protected cancelForm(): void {
    this.formState.changeState(FormType.Create);
  }

  handleSubmit(): void {
    this.isSubmitted = true;
    if (this.createGroupForm.valid) {
      const { name } = this.createGroupForm.value as {
        name: string;
      };

      const group: CreateGroupData = {
        name,
      };

      this.groupService.createGroup(group).subscribe({
        next: (response: CreatedGroupResponse) => {
          this.createGroupForm.reset();
          this.createGroupForm.markAsUntouched();
          this.isSubmitted = false;

          const groupData: GroupData = {
            id: response.data.id,
            name,
          };
          this.submitted.emit(groupData);
        },
        error: (response) => {
          this.notificationService.notify({
            type: NotificationType.Error,
            message: response.error.message
          })
        }
      });
    }
  }
}
