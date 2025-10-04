import { Component, EventEmitter, Input, Output, WritableSignal } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-page-navigation',
  imports: [Button],
  templateUrl: './page-navigation.html',
  styleUrl: './page-navigation.css'
})
export class PageNavigation {
  @Input() lastPage!: WritableSignal<number>;

  protected pageNumber: number = 1;

  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();

  nextPage(): void {
    if (this.pageNumber === this.lastPage()) {
      return;
    }

    this.pageChanged.emit(++this.pageNumber);
  }

  previousPage(): void {
    if (this.pageNumber === 1) {
      return;
    }

    this.pageChanged.emit(--this.pageNumber);
  }
}
