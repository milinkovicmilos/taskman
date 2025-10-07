import { Component, inject, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { GroupCard } from '../group-card/group-card';
import { PageNavigation } from '../../../../shared/components/page-navigation/page-navigation';
import { GroupService } from '../../services/group-service';
import { Notifier } from '../../../../shared/services/notifier';
import { GroupData } from '../../interfaces/group-data';
import { FormState } from '../../../../shared/services/form-state';
import { FormType } from '../../../../shared/enums/form-type';
import { HeaderButton } from '../../../../shared/services/header-button';

@Component({
  selector: 'app-group',
  imports: [GroupCard, PageNavigation],
  templateUrl: './group.html',
  styleUrl: './group.css'
})
export class Group implements OnInit {
  private groupService = inject(GroupService);
  private notificationService = inject(Notifier);

  @Output() protected lastPage: WritableSignal<number> = signal(1);

  protected groups: GroupData[] = [];
  protected formStateSerice = inject(FormState);
  protected formTypes = FormType;
  private headerButtonService = inject(HeaderButton);

  ngOnInit() {
    this.headerButtonService.update('New Project', FormType.Create);
    this.groupService.getGroups().subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.groups = response.data;
      }
    })
  }

  onPageChange(number: number) {
    this.groupService.getGroups(number).subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.groups = response.data;
      }
    })
  }
}
