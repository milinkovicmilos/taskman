import { Component, Input, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { GroupService } from '../../services/group-service';
import { GroupDetailData } from '../../interfaces/group-detail-data';
import { Modal } from '../../../../shared/components/modal/modal';
import { Modal as ModalService } from '../../../../shared/services/modal';
import { FormState } from '../../../../shared/services/form-state';
import { FormType } from '../../../../shared/enums/form-type';
import { HeaderButton } from '../../../../shared/services/header-button';
import { Button } from '../../../../shared/components/button/button';
import { ProjectCard } from '../../../projects/components/project-card/project-card';
import { PageNavigation } from '../../../../shared/components/page-navigation/page-navigation';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Notifier } from '../../../../shared/services/notifier';
import { NotificationType } from '../../../../shared/enums/notification-type';
import { ProjectData } from '../../../projects/interfaces/project-data';
import { ServerProjectStorage } from '../../../projects/services/server-project-storage';
import { CreateProjectForm } from '../../../projects/components/create-project-form/create-project-form';

@Component({
  selector: 'app-group-detail',
  imports: [Modal, Button, ProjectCard, PageNavigation, CreateProjectForm, RouterOutlet],
  templateUrl: './group-detail.html',
  styleUrl: './group-detail.css'
})
export class GroupDetail implements OnInit {
  private groupService = inject(GroupService);
  private projectStorage = inject(ServerProjectStorage);

  protected readonly modal = inject(ModalService);
  protected formStateService = inject(FormState);
  protected formTypes = FormType;
  private headerButtonService = inject(HeaderButton);

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(Notifier);


  protected projects: ProjectData[] = [];
  protected group!: WritableSignal<GroupDetailData>;

  @Input() groupId!: number | string;

  protected lastPage: WritableSignal<number> = signal(1);

  ngOnInit(): void {

    this.groupService.getGroup(this.groupId).subscribe({
      next: (response: GroupDetailData) => {
        this.group = signal(response);

        if (response.can_create_projects) {
          this.headerButtonService.update('New Project', FormType.Create);
        }
      }
    });

    this.projectStorage.getGroupProjects(this.groupId).subscribe({
      next: (response) => {
        this.projects = response.data;
        this.lastPage.set(response.last_page);
      }
    });
  }

  protected showDeleteModal(): void {
    this.modal.generate(`Are you sure you want to delete ${this.group().name} ?`);
  }

  protected goToInviteToGroup(): void {
    this.router.navigate(['invite'], { relativeTo: this.route })
  }

  protected goToManage(): void {
    this.router.navigate(['manage'], { relativeTo: this.route })
  }

  protected onProjectCreated(): void {
    this.projectStorage.getGroupProjects(this.groupId).subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.projects = response.data;
      }
    })
  }

  protected onGroupDelete(): void {
    this.groupService.deleteGroup(this.groupId).subscribe({
      next: () => {
        this.notificationService.notify({
          type: NotificationType.Info,
          message: `Successfully deleted ${this.group().name}`
        });
        this.router.navigate(['groups']);
      }
    });
  }

  onPageChange(number: number) {
    this.projectStorage.getGroupProjects(this.groupId, number).subscribe({
      next: (response) => {
        this.lastPage.set(response.last_page);
        this.projects = response.data;
      }
    })
  }
}
