import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-page-navigation',
  imports: [Button],
  templateUrl: './page-navigation.html',
  styleUrl: './page-navigation.css'
})
export class PageNavigation {
  @Input() lastPage: WritableSignal<number> = signal(1);

  @Input() pageNumber: WritableSignal<number> = signal(1);

  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>();

  nextPage(): void {
    if (this.pageNumber() === this.lastPage()) {
      return;
    }

    const newPage = this.pageNumber() + 1;
    this.pageNumber.set(newPage);
    this.pageChanged.emit(this.pageNumber());
  }

  previousPage(): void {
    if (this.pageNumber() === 1) {
      return;
    }

    const newPage = this.pageNumber() - 1;
    this.pageNumber.set(newPage);
    this.pageChanged.emit(this.pageNumber());
  }
}
