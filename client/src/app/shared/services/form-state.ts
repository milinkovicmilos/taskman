import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { FormType } from '../enums/form-type';

@Injectable({
  providedIn: 'root'
})
export class FormState {
  visible: WritableSignal<FormType | null> = signal(null);
  private router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe({
        next: () => {
          this.visible.set(null);
        }
      });
  }

  changeState(state: FormType | null): void {
    if (this.visible() === state) {
      this.visible.set(null);
      return;
    }
    this.visible.set(state);
  }
}
