import { Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { PageNavigation } from '../../../../shared/components/page-navigation/page-navigation';
import { UserMembershipCard } from '../user-membership-card/user-membership-card';
import { MembershipData } from '../../interfaces/membership-data';
import { Notifier } from '../../../../shared/services/notifier';
import { MembershipService } from '../../services/membership-service';
import { FormType } from '../../../../shared/enums/form-type';
import { HeaderButton } from '../../../../shared/services/header-button';
import { FormState } from '../../../../shared/services/form-state';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-manage',
  imports: [PageNavigation, UserMembershipCard, Button],
  templateUrl: './manage.html',
  styleUrl: './manage.css'
})
export class Manage implements OnInit {
  protected memberships: WritableSignal<MembershipData[]> = signal([]);

  private membershipsService = inject(MembershipService);
  private notificationService = inject(Notifier);

  protected lastPage: WritableSignal<number> = signal(1);

  protected formStateSerice = inject(FormState);
  protected formTypes = FormType;
  private headerButtonService = inject(HeaderButton);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  groupId: number | string = this.route.parent?.snapshot.paramMap.get('groupId')!;

  ngOnInit(): void {
    this.membershipsService.getUsers(this.groupId).subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.memberships.set(response.data);
      }
    })
  }

  protected onClose(): void {
    const url = this.router.url.split('/manage')[0];
    this.router.navigate([url]);
  }

  protected onMembershipDelete(): void {
    this.membershipsService.getUsers(this.groupId).subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.memberships.set(response.data);
      }
    })
  }

  protected onPageChange(number: number): void {
    this.membershipsService.getUsers(number).subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.memberships.set(response.data);
      }
    })
  }
}
