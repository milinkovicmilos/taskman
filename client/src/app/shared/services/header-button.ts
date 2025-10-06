import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { FormType } from '../enums/form-type';
import { FormState } from './form-state';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderButton {
  text: WritableSignal<string> = signal('');
  formAction: WritableSignal<FormType | null> = signal(null);
  formState = inject(FormState);

  private router: Router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe({
        next: () => {
          this.update('', null);
        }
      });
  }

  update(text: string, formType: FormType | null): void {
    this.text.set(text);
    this.formAction.set(formType);
  }

  clicked() {
    this.formState.changeState(this.formAction());
  }
}
