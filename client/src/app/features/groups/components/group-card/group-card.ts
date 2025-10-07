import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GroupData } from '../../interfaces/group-data';

@Component({
  selector: 'app-group-card',
  imports: [],
  templateUrl: './group-card.html',
  styleUrl: './group-card.css'
})
export class GroupCard {
  private router = inject(Router);

  @Input() group!: GroupData;

  protected onClick(): void {
    this.router.navigate(['groups', this.group.id]);
  }
}
