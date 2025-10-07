import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MembershipData } from '../../interfaces/membership-data';
import { GroupRole } from '../../../groups/enums/group-role';
import { Button } from '../../../../shared/components/button/button';
import { MembershipService } from '../../services/membership-service';
import { Notifier } from '../../../../shared/services/notifier';
import { NotificationType } from '../../../../shared/enums/notification-type';

@Component({
  selector: 'app-user-membership-card',
  imports: [Button],
  templateUrl: './user-membership-card.html',
  styleUrl: './user-membership-card.css'
})
export class UserMembershipCard {
  private notificationService = inject(Notifier);
  private membershipService = inject(MembershipService);

  protected roles = GroupRole;

  @Input() groupId!: number | string;
  @Input() membership!: MembershipData;

  @Output() deleted: EventEmitter<void> = new EventEmitter();

  protected makeModerator(): void {
    this.membershipService.updateMembership(this.groupId, this.membership.id, {
      role_id: GroupRole.Moderator,
    }).subscribe({
      next: (response) => {
        this.membership.role_id = GroupRole.Moderator;
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

  protected makeMember(): void {
    this.membershipService.updateMembership(this.groupId, this.membership.id, {
      role_id: GroupRole.Member,
    }).subscribe({
      next: (response) => {
        this.membership.role_id = GroupRole.Member;
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

  protected removeMembership(): void {
    this.membershipService.removeMembership(this.groupId, this.membership.id).subscribe({
      next: (response) => {
        this.deleted.emit();
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
    })
  }
}
