import { Component, Input, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { GroupService } from '../../services/group-service';
import { GroupDetailData } from '../../interfaces/group-detail-data';
import { Modal as ModalService } from '../../../../shared/services/modal';
import { FormState } from '../../../../shared/services/form-state';
import { FormType } from '../../../../shared/enums/form-type';
import { HeaderButton } from '../../../../shared/services/header-button';
import { Button } from '../../../../shared/components/button/button';
import { ProjectCard } from '../../../projects/components/project-card/project-card';
import { PageNavigation } from '../../../../shared/components/page-navigation/page-navigation';

@Component({
  selector: 'app-group-detail',
  imports: [Button, ProjectCard, PageNavigation],
  templateUrl: './group-detail.html',
  styleUrl: './group-detail.css'
})
export class GroupDetail implements OnInit {
  private groupService = inject(GroupService);

  protected readonly modal = inject(ModalService);
  protected formStateService = inject(FormState);
  protected formTypes = FormType;
  private headerButtonService = inject(HeaderButton);


  protected group!: WritableSignal<GroupDetailData>;

  @Input() id!: number | string;

  ngOnInit(): void {
    this.groupService.getGroup(this.id).subscribe({
      next: (response: GroupDetailData) => {
        this.group = signal(response);
      }
    });
  }

  protected showDeleteModal(): void {
    this.modal.generate(`Are you sure you want to delete ${this.group().name} ?`);
  }

  protected toggleUpdateForm(): void {
    this.formStateService.changeState(FormType.Update);
  }
}
