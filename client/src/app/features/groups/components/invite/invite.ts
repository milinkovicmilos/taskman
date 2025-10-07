import { Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { Input as InputElement } from '../../../../shared/components/input/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UserData } from '../../../../shared/interfaces/user-data';
import { UserService } from '../../../users/services/user-service';
import { Button } from '../../../../shared/components/button/button';
import { UserDetailData } from '../../../users/interfaces/user-detail-data';
import { MembershipService } from '../../../memberships/services/membership-service';
import { GroupRole } from '../../enums/group-role';
import { Notifier } from '../../../../shared/services/notifier';
import { NotificationType } from '../../../../shared/enums/notification-type';

@Component({
  selector: 'app-invite',
  imports: [ReactiveFormsModule, Button, InputElement],
  templateUrl: './invite.html',
  styleUrl: './invite.css'
})
export class Invite implements OnInit {
  private usersService = inject(UserService);
  private membershipsService = inject(MembershipService);
  private notificationService = inject(Notifier);

  private formBuilder = inject(FormBuilder);
  searchForm = this.formBuilder.group({
    search: ['', Validators.required],
  });

  protected users: WritableSignal<UserDetailData[]> = signal([]);

  @Input() groupId!: number | string;

  ngOnInit(): void {
    this.searchForm.get('search')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe({
      next: (value) => {
        if (value != null && value !== '') {
          this.usersService.getUsers(value).subscribe({
            next: (response) => {
              this.users.set(response.data);
            }
          });
        }
        else {
          this.users.set([]);
        }
      }
    });
  }

  protected inviteUser(userId: number | string): void {
    this.membershipsService.inviteUser(this.groupId,
      { user_id: userId, role_id: GroupRole.Member })
      .subscribe({
        next: (response) => {
          this.notificationService.notify({
            type: NotificationType.Error,
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
